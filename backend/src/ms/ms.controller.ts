import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import type { AuthRequest } from '../auth/types/auth-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MsGraphService } from './msGraph.service';
import { Public } from '../auth/public.decorator';
import { MsAccount } from './entity/ms-account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@UseGuards(JwtAuthGuard)
@Controller('api/ms')
export class MsController {
  constructor(private readonly msGraph: MsGraphService,
    @InjectRepository(MsAccount)
    private readonly msAccountRepo: Repository<MsAccount>,) { }


  @Get('me')
  me(@Req() req: AuthRequest) {
    console.log('REQ.USER =>', req.user); // 🔥 ADD THIS
    return this.msGraph.getProfile(req.user.userId);
  }
  // ✅ OUTLOOK CONNECTION STATUS (THIS FIXES ❌ CONNECTED ISSUE)
  @Get('status')
  async outlookStatus(@Req() req: AuthRequest) {
    const row = await this.msAccountRepo.findOne({
      where: { userId: req.user.userId },
    });

    // ❌ No record = not connected
    if (!row) {
      return { connected: false };
    }

    // ⏰ Check expiry
    const expired =
      !!row.expiresOn && new Date(row.expiresOn) < new Date();

    return {
      connected: true,
      expired,
      username: row.username,
      expiresOn: row.expiresOn,
    };
  }


  @Get('events')
  events(@Req() req: AuthRequest) {
    return this.msGraph.listEventsForUser(req.user.userId);
  }

  @Post('events')
  createEvent(@Req() req: AuthRequest, @Body() body: any) {
    return this.msGraph.createEventForUser(req.user.userId, body);
  }
}
