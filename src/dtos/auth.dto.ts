import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  public password: string;

  @IsString()
  public mobileNumber: string;
}
