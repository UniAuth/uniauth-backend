import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { appData } from '../config/appData';
@ApiTags('root')
@Controller('')
export class AppController {
  /** to show homepage */
  @Get()
  showIndexPage(@Res() res: Response) {
    const templateData = {
      header: appData.Description,
      project_name: appData.Name,
      body: 'the only registration form you will ever fill',
      button: {
        title: 'Get Involved',
        href: 'account/login',
      },
    };
    return res.render('landing', templateData);
  }
}
