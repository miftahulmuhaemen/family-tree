export interface DriveFileResult {
  id: string;
  name: string;
  mimeType?: string;
}

export class GoogleDriveService {
  private apiKey: string;
  private clientId: string;
  private accessToken: string | null = null;
  private tokenClient: GoogleTokenClient | null = null;
  private tokenPromise: { resolve: (token: string) => void; reject: (err: any) => void } | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.clientId);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearToken(): void {
    if (this.accessToken && window.google?.accounts?.oauth2?.revoke) {
      try {
        window.google.accounts.oauth2.revoke(this.accessToken);
      } catch {
        // Ignore revocation errors
      }
    }
    this.accessToken = null;
  }

  async loadScripts(): Promise<void> {
    if (typeof window === 'undefined') return;

    const checkGis = () => Boolean(window.google?.accounts?.oauth2);
    const checkGapi = () => Boolean(window.gapi);

    if (checkGis() && checkGapi()) return;

    await new Promise<void>((resolve, reject) => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (checkGis() && checkGapi()) {
          clearInterval(interval);
          resolve();
        } else if (attempts > 50) {
          clearInterval(interval);
          reject(new Error('Google scripts failed to load within timeout'));
        }
      }, 100);
    });
  }

  async requestAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    if (!this.isConfigured()) {
      throw new Error('Google API Key or Client ID is missing in environment variables');
    }

    await this.loadScripts();

    return new Promise((resolve, reject) => {
      this.tokenPromise = { resolve, reject };

      if (!this.tokenClient && window.google?.accounts?.oauth2) {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: 'https://www.googleapis.com/auth/drive.file',
          callback: (response: GoogleTokenResponse) => {
            if (response.error) {
              this.tokenPromise?.reject(new Error(response.error_description || response.error));
            } else if (response.access_token) {
              this.accessToken = response.access_token;
              this.tokenPromise?.resolve(response.access_token);
            } else {
              this.tokenPromise?.reject(new Error('No access token returned from Google'));
            }
            this.tokenPromise = null;
          },
          error_callback: (err: any) => {
            this.tokenPromise?.reject(err);
            this.tokenPromise = null;
          }
        });
      }

      if (!this.tokenClient) {
        reject(new Error('Google Identity Services token client failed to initialize'));
        return;
      }

      this.tokenClient.requestAccessToken({ prompt: '' });
    });
  }

  async saveFile(name: string, content: string, existingFileId?: string): Promise<DriveFileResult> {
    const token = await this.requestAccessToken();

    if (existingFileId) {
      // Overwrite existing file via PATCH
      const response = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain; charset=UTF-8'
          },
          body: content
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update file on Google Drive: ${errorText}`);
      }

      const result = await response.json();
      return { id: result.id || existingFileId, name: result.name || name };
    }

    // Create new file via multipart POST
    const boundary = '-------familytreeboundary' + Date.now();
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: name.endsWith('.ged') ? name : `${name}.ged`,
      mimeType: 'text/plain'
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
      content +
      closeDelimiter;

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartRequestBody
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create file on Google Drive: ${errorText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      mimeType: data.mimeType
    };
  }

  async loadFile(fileId: string): Promise<string> {
    let url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const headers: Record<string, string> = {};

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    } else if (this.apiKey) {
      url += `&key=${encodeURIComponent(this.apiKey)}`;
    }

    let response = await fetch(url, { headers });

    // If unauthorized and unauthenticated, prompt sign-in
    if (!response.ok && (response.status === 401 || response.status === 403) && !this.accessToken) {
      const token = await this.requestAccessToken();
      response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to load file from Google Drive: ${err || response.statusText}`);
    }

    return await response.text();
  }

  async setPublicPermission(fileId: string, role: 'reader' | 'writer' = 'reader'): Promise<void> {
    const token = await this.requestAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role,
          type: 'anyone'
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to set Google Drive permission: ${err}`);
    }
  }

  async openPicker(onSelect: (fileId: string, fileName: string) => void): Promise<void> {
    await this.loadScripts();
    const token = await this.requestAccessToken();

    await new Promise<void>((resolve, reject) => {
      if (window.gapi?.picker) {
        resolve();
        return;
      }
      if (!window.gapi) {
        reject(new Error('Google API Client (gapi) is not available'));
        return;
      }
      window.gapi.load('picker', {
        callback: () => resolve(),
        onerror: () => reject(new Error('Failed to load Google Picker module'))
      });
    });

    const google = window.google;
    if (!google?.picker) {
      throw new Error('Google Picker library is unavailable');
    }

    const docsView = new google.picker.DocsView()
      .setIncludeFolders(true)
      .setMimeTypes('text/plain,application/octet-stream,application/x-gedcom');

    const picker = new google.picker.PickerBuilder()
      .addView(docsView)
      .setOAuthToken(token)
      .setDeveloperKey(this.apiKey)
      .setCallback((data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          const doc = data.docs?.[0];
          if (doc?.id) {
            onSelect(doc.id, doc.name || 'family.ged');
          }
        }
      })
      .build();

    picker.setVisible(true);
  }
}

export const googleDriveService = new GoogleDriveService();
