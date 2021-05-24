import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  public name: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  public description: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  public sku: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  public imageURL: string;

  @IsNotEmpty()
  @IsNumber()
  public sellingPrice: number;

  @IsOptional()
  @IsArray()
  public colours: string[];

  @IsOptional()
  @IsArray()
  public sizes: string[];

  @IsNotEmpty()
  @IsNumber()
  public stockLevel: number;

  @IsOptional()
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  public expirationDate?: Date;

  @IsUUID()
  @IsNotEmpty()
  public categoryId: string;
}
