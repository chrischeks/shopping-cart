import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/, {
    message:
      'Enter a password at least 8 characters long which contains at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
  })
  public password: string;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @Length(11, 11, { message: '11-digit mobile number is required' })
  public mobileNumber: string;
}
