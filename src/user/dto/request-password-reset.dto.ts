import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
  /** college email id of student  */
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'college email id of student ',
    example: 'yashkumar.verma2019@vitstudent.ac.in',
    required: true,
  })
  email: string;
}

export class RequestPasswordResetDtoWithToken extends RequestPasswordResetDto {
  @IsNotEmpty()
  token: string;
}
