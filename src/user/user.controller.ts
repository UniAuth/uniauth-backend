import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  Logger,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Res,
  Req,
  forwardRef,
  Injectable,
  Inject,
} from '@nestjs/common';
import {DashboardController} from '../dashboard/dashboard.controller'
import { response, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthorizedUser } from './interface/user.interface';

/**
 * **User Controller**
 *
 * All routes related to user are declared here, and the decorators represent the type of request
 * they respond to. Use ValidationPipe to validate client requests, and the rules for validation are
 * defined in [[CreateUserDto]].
 *
 * The controller calls [[UserService]] for all operations.
 *
 * @category User
 */
@ApiTags('user')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  private readonly logger = new Logger('user');
  constructor(private readonly userService: UserService , @Inject(DashboardController) private readonly DashboardController: DashboardController) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * Creates a new user based on data from [[CreateUserDto]].
   */
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * Lists all the users
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * Lists details of currenty authenticated user
   */
  @Get('details')
  findOne(@Request() request) {
    const user: AuthorizedUser = request.user;
    return this.userService.findOneById(user.id);
  }

  /**
   * Responds to: _PUT(`/:id`)_
   *
   * To update details of user
   */
   /**
   * To load edit form
   */
  @Get('/:id/edit')

  @UseGuards(JwtAuthGuard)
  async showEditForm(@Request() req,@Res() res: Response,@Param('id') id: string){
    const user = await this.userService.findOneById(id);
    return res.render('profile/edit.hbs',{ user })
  }

  @Post('/:id/edit')

  @UseGuards(JwtAuthGuard)
  async PostEditForm(@Body() updateUserDto: UpdateUserDto, @Request() req,@Res() res: Response,@Param('id') id: string){
    const user = await this.userService.update(id, updateUserDto);
    return res.redirect('/dashboard/')
  }

  /**
   * Responds to: _DELETE(`/:id`)_
   *
   * To delete the user
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
