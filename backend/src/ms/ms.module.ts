import { Module } from "@nestjs/common";
import { MsAuthController } from "./msAuth.controller";
import { MsAuthService } from "./msAuth.service";
import { MsGraphService } from "./msGraph.service";
import { MsController } from "./ms.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MsAccount } from "./entity/ms-account.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MsAccount])],
  controllers: [MsAuthController,MsController],
  providers: [MsAuthService, MsGraphService],
  exports: [MsGraphService],
})
export class MsModule {}
