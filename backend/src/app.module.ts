import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OcrModule } from './ocr/ocr.module';
import { KycModule } from './kyc/kyc.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './lead/lead.module';
import { truncate } from 'fs';
import { MsModule } from './ms/ms.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
        autoLoadEntities: true,   // 🔥 REQUIRED
      synchronize: true, // ❗ disable in prod
    }),

    OcrModule,
    KycModule,
    UsersModule,
    AuthModule,
    LeadsModule,
    MsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
