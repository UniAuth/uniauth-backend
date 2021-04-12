import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  UnauthorizedException,
  NotFoundException,
  Logger,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { LoggedInUser } from '../auth/interface/loggedInUser.interface';
import { AuthorizedUser } from '../user/interface/user.interface';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('application')
export class ApplicationController {
  // private readonly logger = new Logger('application');
  constructor(
    private readonly applicationService: ApplicationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger = new Logger('application'),
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  create(@Request() req, @Body() createApplicationDto: CreateApplicationDto) {
    const user: LoggedInUser = req.user;
    this.logger.verbose(`${user.email} creating ${createApplicationDto.name}`);
    return this.applicationService.create(createApplicationDto, user);
  }

  @Get()
  @UsePipes(ValidationPipe)
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async findOne(@Request() req, @Param('id') id: string) {
    const user: AuthorizedUser = req.user;
    const application = await this.applicationService.findOneById(id);
    if (String(application.admin) !== user.id) {
      throw new UnauthorizedException();
    }
    delete application.admin;
    return application;
  }

  //   @Put(':id')
  //   @UsePipes(ValidationPipe)
  //   update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
  //     return this.applicationService.update(+id, updateApplicationDto);
  //   }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(@Request() req, @Param('id') id: string) {
    const user: AuthorizedUser = req.user;
    const application = await this.applicationService.findOneById(id);
    if (application === null) {
      throw new NotFoundException();
    }
    if (String(application.admin) !== user.id) {
      throw new UnauthorizedException();
    }
    await application.remove();
    return 'removed';
  }
}
