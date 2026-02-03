import { Controller, Get, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { MsAuthService } from "./msAuth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { MsAccount } from "./entity/ms-account.entity";
import { Repository } from "typeorm";

@Controller("api/ms/auth")
export class MsAuthController {
  constructor(private readonly msAuth: MsAuthService,
    @InjectRepository(MsAccount)
    private readonly repo: Repository<MsAccount>
  ) { }

  // 1) Redirect user to Microsoft login
  @Get("login")
  async login(@Res() res: Response, @Query("userId") userId: string) {
    // use your CRM logged-in userId here (from JWT). For demo: query param.
    const state = JSON.stringify({ userId, ts: Date.now() });

    const url = await this.msAuth.getAuthUrl(Buffer.from(state).toString("base64"));
    return res.redirect(url);
  }



  // 2) Callback from Microsoft, exchange code for tokens
  @Get("callback")
  async callback(
    @Res() res: Response,
    @Query("code") code: string,
    @Query("state") state: string
  ) {

    console.log("CODE:", code);
    console.log("STATE:", state);
    const decoded = JSON.parse(Buffer.from(state, "base64").toString("utf8"));
    const userId = decoded.userId;

    const token = await this.msAuth.exchangeCodeForToken(code);
    console.log(token)
    await this.repo.upsert(
      {
        userId,
        homeAccountId: token.account.homeAccountId,
        tenantId: token.account.tenantId,
        username: token.account.username,
        environment: token.account.environment,
        accessToken: token.accessToken,
        expiresOn: token.expiresOn ? new Date(token.expiresOn) : undefined,
      },
      ["userId"]
    );


    return res.redirect(
      `${process.env.FRONTEND_URL}?connected=outlook`
    );
  }

  


}
