import { graphConfig } from "./authConfig";

/**
 * Attaches a given access token to a Microsoft Graph API call. Returns information about the user
 */
export async function callMsGraph(accessToken: any) {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*")
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers
  };
  let result: any = {}
  // graphConfig.[permission] is the URL of the Microsoft Graph API permission.
  // permissions have to be allowed in the app registration in azure portal
  // some need to be granted to the app in the azure portal by admins
  result.user = await fetch(graphConfig.graphMeEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
  result.groups = await fetch(graphConfig.graphTransitiveMemberOf, options)
    .then(response => response.json())
    .catch(error => console.log(error));
  return result;
}