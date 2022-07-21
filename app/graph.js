/**
 * Helper function to call MS Graph API endpoint
 * using the authorization bearer token scheme
 */
function callMSGraph(endpoint, token, callback, method) {
  const headers = new Headers();
  const bearer = `Bearer ${token}`;

  headers.append("Authorization", bearer);

  const options = {
    method: method || "GET",
    headers: headers,
  };

  console.log("request made to Graph API at: " + new Date().toString());

  if (method === "DELETE") {
    fetch(endpoint, options)
      .then((response) => callback(response, endpoint))
      .catch((error) => console.log(error));
  } else {
    fetch(endpoint, options)
      .then((response) => response.json())
      .then((response) => callback(response, endpoint))
      .catch((error) => console.log(error));
  }
}
