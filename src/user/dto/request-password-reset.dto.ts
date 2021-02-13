import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {


  /** college email of user */
  @ApiProperty({
    name: 'email',
    description: 'registered email id of student',
    example: 'yashkumar.verma2019@vitstudent.ac.in',
    required: true,
  })
  @IsEmail()
  email: string;

}


