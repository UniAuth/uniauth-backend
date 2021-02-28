import { Controller, Get, Logger, Res, UseGuards, Request, Inject, Param, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserService } from '../user/user.service';
import { LoggedInUser } from '../auth/interface/loggedInUser.interface';
import { SCOPE } from '../account/minions/scopeMapper.minion';
import { ApplicationService } from '../application/application.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('dashboard')
export class DashboardController {
  private readonly logger = new Logger('dashboard');

  /** initialize dashboard module */
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(ApplicationService) private readonly applicationService: ApplicationService,
  ) {
    this.logger.verbose('dashboard initialized');
  }

  /**
   * Render Landing Page
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async showDashboard(@Request() req, @Res() res: Response) {
    const loggedInUser: LoggedInUser = req.user;
    const user = await this.userService.findOneById(loggedInUser.id);
    return res.render('dashboard/dashboard.hbs', { user });
  }

  /**
   * To load user dashboard
   */
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async showProfile(@Request() req, @Res() res: Response) {
    const loggedInUser: LoggedInUser = req.user;
    const user = await this.userService.findOneById(loggedInUser.id);
    return res.render('dashboard/profile.hbs', { user });
  }
  /**
   * To load data tab
   */
  @Get('/data')
  @UseGuards(JwtAuthGuard)
  async showData(@Request() req, @Res() res: Response) {
    const loggedInUser: LoggedInUser = req.user;
    const user = await this.userService.findOneById(loggedInUser.id);
    const applications = await this.applicationService.findAllByParticipant(user);
    return res.render('dashboard/data.hbs', {
      user,
      app: {
        scope: SCOPE,
        items: applications,
      },
    });
  }

  /**
   * To load dev tab
   */
  @Get('/dev')
  @UseGuards(JwtAuthGuard)
  async showDev(@Request() req, @Res() res: Response) {
    const loggedInUser: LoggedInUser = req.user;
    const user = await this.userService.findOneById(loggedInUser.id);
    const applications = await this.applicationService.findAllByOwner(user);
    return res.render('dashboard/dev.hbs', {
      user,
      app: {
        scope: SCOPE,
        items: applications,
      },
    });
  }

  @Post('/dev/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Request() req, @Res() res: Response, @Param('id') id: string) {
    const loggedInUser: LoggedInUser = req.user;
    const user = await this.applicationService.findOneById(id);
    if (JSON.stringify(user.admin) === JSON.stringify(loggedInUser.id)) {
      await this.applicationService.delete(id);
    }
    res.redirect('/dashboard/dev');
  }

  @Get('/:id/edit')
  @UseGuards(JwtAuthGuard)
  async showEditForm(@Res() res: Response, @Param('id') id: string) {
    const user = await this.userService.findOneById(id);
    return res.render('profile/edit.hbs', { user });
  }

  @Post('/:id/edit')
  @UseGuards(JwtAuthGuard)
  async PostEditForm(@Res() res: Response, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(id, updateUserDto);
    return res.redirect('/dashboard/');
  }

  @Get('/dev/details/:id')
  @UseGuards(JwtAuthGuard)
  async showUserList(@Request() req, @Res() res: Response, @Param('id') id: string) {
    try {
      const userDetails = await this.applicationService.findUsersGrantedAccess(id);
      res.render('dashboard/details.hbs', {
        userDetails: userDetails.participants,
      });
    } catch (e) {
      res.render('error.hbs');
    }
  }
}
