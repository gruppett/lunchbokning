export const msalConfig = {
  auth: {
    clientId: "8093d559-a89b-4018-b31d-01f801f8dd9c",
    authority: "https://login.microsoftonline.com/b044c43f-1079-452b-ab8b-739063671654", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
 scopes: ["User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphTransitiveMemberOf: "https://graph.microsoft.com/v1.0/me/transitiveMemberOf"
};