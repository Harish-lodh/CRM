import { Injectable } from "@nestjs/common";
import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";

@Injectable()
export class MsAuthService {
  private msalClient: ConfidentialClientApplication;

  constructor() {
    const config: Configuration = {
      auth: {
        clientId: process.env.MS_CLIENT_ID!,
        authority: `https://login.microsoftonline.com/${process.env.MS_TENANT_ID || "common"}`,
        clientSecret: process.env.MS_CLIENT_SECRET!,
      },
    };

    this.msalClient = new ConfidentialClientApplication(config);
  }

  getAuthUrl(state: string) {
    const scopes = (process.env.MS_SCOPES || "").split(" ").filter(Boolean);

    return this.msalClient.getAuthCodeUrl({
      scopes,
      redirectUri: process.env.MS_REDIRECT_URI!,
      state,
      prompt: "select_account",
    });
  }

async exchangeCodeForToken(code: string) {
  const scopes = (process.env.MS_SCOPES || "").split(" ").filter(Boolean);

  const result = await this.msalClient.acquireTokenByCode({
    code,
    scopes,
    redirectUri: process.env.MS_REDIRECT_URI!,
  });

  if (!result || !result.account) {
    throw new Error("Microsoft token exchange failed");
  }

  return {
    accessToken: result.accessToken,
    expiresOn: result.expiresOn?.toISOString() || null,

    // ✅ THIS IS WHAT YOU NEED FOR DB
    account: {
      homeAccountId: result.account.homeAccountId,
      tenantId: result.account.tenantId,
      username: result.account.username,
      environment: result.account.environment,
    },
  };
}


  async refreshAccessToken(refreshToken: string) {
    const scopes = (process.env.MS_SCOPES || "").split(" ").filter(Boolean);

    const result = await this.msalClient.acquireTokenByRefreshToken({
      refreshToken,
      scopes,
    });

    if (!result?.accessToken) throw new Error("Refresh token failed");

    return {
      accessToken: result.accessToken,
      expiresOn: result.expiresOn?.toISOString() || null,
    };
  }



}
