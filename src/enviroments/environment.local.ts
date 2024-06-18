import { AuthConfig } from "@auth0/auth0-angular";

export const authConfig: AuthConfig = {
  domain: 'vathevor.eu.auth0.com',
  clientId: 'ojFsIWYWMSCKj13bHocEcvAwhtkkVE4U',
  cacheLocation: 'localstorage',
  authorizationParams: {
    audience: 'https://linklake.vathevor.com',
    redirect_uri: window.location.origin
  },
  errorPath: '/error',
  httpInterceptor: {
    allowedList: [
      '/api/*'
    ]
  },
};
