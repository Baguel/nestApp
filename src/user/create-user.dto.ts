import { IsNotEmpty, IsString, MaxLength, IsEmail, validate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  @MaxLength(8)
  password: string;

  isAdmin: number;
  Notification: number;
}
