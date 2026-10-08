// Type definitions for Google Identity Services and Google Picker API

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: any) => void;
          }): GoogleTokenClient;
          revoke?(token: string, done?: () => void): void;
        };
      };
      picker?: any;
    };
    gapi?: {
      load(apiName: string, callbacks: { callback: () => void; onerror?: () => void } | (() => void)): void;
      client?: any;
      picker?: any;
    };
  }

  interface GoogleTokenResponse {
    access_token: string;
    expires_in: string;
    scope: string;
    token_type: string;
    error?: string;
    error_description?: string;
    error_uri?: string;
  }

  interface GoogleTokenClient {
    requestAccessToken(overrideConfig?: { prompt?: string }): void;
  }
}

export {};
