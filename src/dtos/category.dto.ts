import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  public name: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 300)
  public description: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 300)
  public imageURL: string;
}
