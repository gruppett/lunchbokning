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
  result.user = await fetch(graphConfig.graphMeEndpoint, options)
    .then(response => response.json())
    .catch(error => console.log(error));
  result.groups = await fetch(graphConfig.graphTransitiveMemberOf, options)
    .then(response => response.json())
    .catch(error => console.log(error));
  return result;
}