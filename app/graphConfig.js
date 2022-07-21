// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages",
  getJunkEmail:
    "https://graph.microsoft.com/v1.0/me/mailFolders/JunkEmail/messages?$top=1000&$select=sender,subject",
  deleteJunkEmail: "https://graph.microsoft.com/v1.0/me/messages/",
};
