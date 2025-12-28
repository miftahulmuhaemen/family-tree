export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    const origin = request.headers.get('Origin');
    const allowedDomain = env.ALLOWED_DOMAIN;
    const environment = env.ENVIRONMENT;
    
    let isAllowed = false;

    if (origin) {
      if (allowedDomain) {
        // Create regex dynamically: ^https://(?:.+\.)?escaped_domain$
        const escapedDomain = allowedDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const allowedOriginRegex = new RegExp(`^https://(?:.+\\.)?${escapedDomain}$`);
        if (allowedOriginRegex.test(origin)) {
          isAllowed = true;
        }
      }

      // Only allow localhost if explicitly in development environment
      if (!isAllowed && environment === 'development' && 
          (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
        isAllowed = true;
      }
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Edit-Token',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // GET /:id -> Retrieve config
    if (request.method === 'GET') {
      const id = url.pathname.slice(1); // Remove leading slash
      if (!id) return new Response('Missing ID', { status: 400, headers: corsHeaders });

      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const msgBuffer = new TextEncoder().encode(ip);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const clientHash = hashHex.substring(0, 12); 

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const rateLimitKey = `ratelimit:${today}:${clientHash}`;

      try {
        const currentCountStr = await env.FAMILYTREE_RATE_LIMITER.get(rateLimitKey);
        const currentCount = parseInt(currentCountStr, 10) || 0;

        if (currentCount >= 5) {
          return new Response('Rate limit exceeded (Too many failed attempts today).', { status: 429, headers: corsHeaders });
        }
      } catch (e) {
        console.error('Rate limit read error:', e);
      }

      const object = await env.BUCKET.get(id);
      
      if (object === null) {
        try {
           const currentCountStr = await env.FAMILYTREE_RATE_LIMITER.get(rateLimitKey);
           const currentCount = parseInt(currentCountStr, 10) || 0;
           
           await env.FAMILYTREE_RATE_LIMITER.put(rateLimitKey, (currentCount + 1).toString(), {
             expirationTtl: 86400 
           });
        } catch(e) {
          console.error('Rate limit write error:', e);
        }
        
        return new Response('Config not found', { status: 404, headers: corsHeaders });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      for (const [key, value] of Object.entries(corsHeaders)) {
        headers.set(key, value);
      }

      return new Response(object.body, { headers });
    }

    // POST / -> Save config (Create New)
    if (request.method === 'POST') {
      try {


        const content = await request.text();
        
        // Basic validation
        if (!content || content.length > 100000) { 
          return new Response('Payload too large or empty', { status: 413, headers: corsHeaders });
        }

        // Enforce 100 Object Limit
        const currentList = await env.BUCKET.list({ limit: 101 });
        if (currentList.objects.length >= 100) {
           return new Response('Storage limit reached (100 objects). Clean up unused files.', { status: 507, headers: corsHeaders });
        }

        // Generate UUID
        const id = crypto.randomUUID();

        // Generate Edit Token (Secret Key)
        const editToken = crypto.randomUUID().replace(/-/g, '');
        
        // Save to R2 with Edit Token in Metadata
        await env.BUCKET.put(id, content, {
          httpMetadata: { contentType: 'text/yaml' },
          customMetadata: { 'edit-token': editToken }
        });

        return new Response(JSON.stringify({ id, editToken, success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(`Error: ${err.message}`, { status: 500, headers: corsHeaders });
      }
    }

    // PUT /:id -> Update config (Overwrite)
    if (request.method === 'PUT') {
      const id = url.pathname.slice(1);
      if (!id) return new Response('Missing ID', { status: 400, headers: corsHeaders });

      try {
        // --- Edit Token Verification ---
        const requestToken = request.headers.get('X-Edit-Token');
        if (!requestToken) {
           return new Response('Missing Edit Token', { status: 401, headers: corsHeaders });
        }

        const existingObject = await env.BUCKET.head(id);
        if (!existingObject) {
           return new Response('Config not found', { status: 404, headers: corsHeaders });
        }

        const storedToken = existingObject.customMetadata?.['edit-token'];
        
        if (storedToken && storedToken !== requestToken) {
           return new Response('Invalid Edit Token', { status: 403, headers: corsHeaders });
        }

        const content = await request.text();
        if (!content || content.length > 100000) {
           return new Response('Payload too large or empty', { status: 413, headers: corsHeaders });
        }

        await env.BUCKET.put(id, content, {
          httpMetadata: { contentType: 'text/yaml' },
          customMetadata: { 'edit-token': storedToken || requestToken } 
        });

        return new Response(JSON.stringify({ id, success: true, updated: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (err) {
        return new Response(`Error: ${err.message}`, { status: 500, headers: corsHeaders });
      }
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  },
};
