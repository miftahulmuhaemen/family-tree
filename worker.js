/**
 * Cloudflare Worker for Family Tree Storage
 * 
 * Setup Instructions:
 * 1. Create a new Worker in Cloudflare Dashboard.
 * 2. Create an R2 Bucket named 'family-tree-configs'.
 * 3. Bind the R2 Bucket to this Worker with variable name 'BUCKET'.
 * 4. (Optional) Set a purely client-side restriction or just allow public for this personal use case.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
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

      // --- Rate Limiting Pre-Check ---
      // We check if the IP is already blocked before doing anything.
      // We ONLY track failed attempts, but if they are blocked, we block everything.
      
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      // Hash IP only (ignoring User-Agent to prevent bypass by switching browsers)
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
      // -------------------------------

      const object = await env.BUCKET.get(id);
      
      if (object === null) {
        // --- Record Failed Attempt ---
        try {
           const currentCountStr = await env.FAMILYTREE_RATE_LIMITER.get(rateLimitKey);
           const currentCount = parseInt(currentCountStr, 10) || 0;
           
           await env.FAMILYTREE_RATE_LIMITER.put(rateLimitKey, (currentCount + 1).toString(), {
             expirationTtl: 86400 
           });
        } catch(e) {
          console.error('Rate limit write error:', e);
        }
        // -----------------------------
        
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
        // Optional: Check Access Token if configured
        if (env.API_TOKEN) {
          const authHeader = request.headers.get('Authorization');
          if (!authHeader || authHeader !== `Bearer ${env.API_TOKEN}`) {
             return new Response('Unauthorized', { status: 401, headers: corsHeaders });
          }
        }

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
        // Optional: Check Access Token
        if (env.API_TOKEN) {
          const authHeader = request.headers.get('Authorization');
          if (!authHeader || authHeader !== `Bearer ${env.API_TOKEN}`) {
             return new Response('Unauthorized', { status: 401, headers: corsHeaders });
          }
        }

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
        
        // If file has a token, it MUST match. If old file no token, allow update (legacy support) or block?
        // Let's be strict: if it has a token, match it.
        if (storedToken && storedToken !== requestToken) {
           return new Response('Invalid Edit Token', { status: 403, headers: corsHeaders });
        }
        // -------------------------------

        const content = await request.text();
        if (!content || content.length > 100000) {
           return new Response('Payload too large or empty', { status: 413, headers: corsHeaders });
        }

        // Overwrite R2 (Persist the token!)
        await env.BUCKET.put(id, content, {
          httpMetadata: { contentType: 'text/yaml' },
          customMetadata: { 'edit-token': storedToken || requestToken } // Keep existing or set new if none? stick to stored.
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
