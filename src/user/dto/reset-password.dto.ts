import { IsNotEmpty, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * **Reset Password DTO**
 *
 * [[ResetPasswordDto]] is responsible for handling input and updating the same
 *
 *
 * @category User
 */
export class ResetPasswordDto {
  /** password of user */
  @ApiProperty({ description: 'password of user', example: '12345678' })
  @MinLength(8)
  @IsNotEmpty()
  password_1: string;

  @ApiProperty({ description: 'password of user', example: '12345678' })
  @MinLength(8)
  @IsNotEmpty()
  password_2: string;
}

export class ResetPasswordDtoWithCaptcha extends ResetPasswordDto {
  @IsNotEmpty()
  token: string;
}
