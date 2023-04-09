import { OAuth2Client } from "google-auth-library";
const { google } = require("googleapis");

class Auth {
  oauth2Client: OAuth2Client;
  constructor() {
    const redirectUrl  = "http://localhost:8080/auth/gmail/callback"
    this.oauth2Client = new google.auth.OAuth2(
      process.env.CLIENTID,
      process.env.ClIENT_SECRET,
      process.env.REDIRECT_URI || redirectUrl
    );

    this.oauth2Client.on("tokens", (tokens: any) => {
      if (tokens.refresh_token) {
         console.log(tokens.refresh_token);
      }
      console.log(tokens.access_token);
    });
  }

 

  public async getAuthUrl() {
    const scopes = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];
    const url = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    return url;
  }

  public async getAccessToken(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);

    this.oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: this.oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    const email = data.email;
    const name = data.name;

    return {
      tokens,
      email,
      name,
    };
  }

  public getClient() {
    return this.oauth2Client;
  }
}

export default Auth;
