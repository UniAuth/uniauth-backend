import { IsArray, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * **Create Application DTO**
 *
 * [[CreateApplicationDto]] is responsible for handling input and validating the same while
 * creating a new [[Application]] for a [[User]]
 *
 * @category Application
 */
export class CreateApplicationDto {
  /** name of the application */
  @ApiProperty({ description: 'name to identify applicaiton in your console', example: 'simple oauth' })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @MaxLength(100)
  description: string;

  @ApiProperty({ description: 'email displayed at consent page', example: 'yk.verma2000@gmail.com' })
  @IsEmail()
  supportEmail: string;

  @ApiProperty({
    description: 'list of origins that are allowed to invoke the client',
    example: ['localhost:5000', 'http://localhost:5000', 'https://localhost:5000/login'],
  })
  @IsArray()
  @IsNotEmpty()
  authorizedOrigin: Array<string>;

  @ApiProperty({
    description: 'list of locations that the application is allowed to navigate after success',
    example: ['localhost:5000/callback', 'http://localhost:5000/callback', 'https://localhost:5000/login/callback'],
  })
  @IsArray()
  authorizedRedirect: Array<string>;

  @ApiProperty({
    description: 'list of data groups shared with application, displayed to user at login',
    example: ['name', 'registrationNumber', 'github', 'twitter', 'linkedIn', 'previousEvents'],
  })
  @IsNotEmpty()
  @IsArray()
  scope: Array<string>;
}
