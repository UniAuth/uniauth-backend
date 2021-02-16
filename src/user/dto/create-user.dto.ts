import { IsEmail, IsNotEmpty, MaxLength, MinLength, Validate } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { RegistrationNumber } from '../../auxiliary/validators/registrationNumber.validator';

/**
 * **Create User DTO**
 *
 * [[CreateUserDto]] is responsible for handling input and validating the same while
 * creating a new user for a problem
 *
 * @category User
 */
export class CreateUserDto {
  /** name of the user] */
  @ApiProperty({ description: 'full name of user', example: 'yash kumar verma' })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  /** college registration number of user */
  @ApiProperty({ description: 'registration number of user', example: '19BCE2669' })
  @IsNotEmpty()
  @Validate(RegistrationNumber)
  registrationNumber: string;

  /** college email of user */
  @ApiProperty({ description: 'college email of user', example: 'yashkumar.verma2019@vitstudent.ac.in' })
  @IsNotEmpty()
  @IsEmail({ domain_specific_validation: true })
  collegeEmail: string;

  /** password of user */
  @ApiProperty({ description: 'password of user', example: '12345678' })
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export class CreateUserDtoWithCaptcha extends CreateUserDto {
  @IsNotEmpty()
  token: string;
}
