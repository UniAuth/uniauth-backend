import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
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
  constructor(private readonly userService: UserService) {}

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
   * Responds to: _DELETE(`/:id`)_
   *
   * To delete the user
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
