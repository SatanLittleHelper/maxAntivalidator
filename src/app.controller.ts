import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('redirect')
  redirect(@Query('url') url: string, @Res() res: Response): void {
    res.redirect(302, url);
  }
}
