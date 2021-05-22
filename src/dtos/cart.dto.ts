import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class BaseCartDTO {
  @IsNotEmpty()
  @IsUUID()
  public productId: string;
}

export class CartDto extends BaseCartDTO {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  public quantity: number;

  @IsNotEmpty()
  @IsString()
  public colour: string;

  @IsNotEmpty()
  @IsString()
  public size: string;
}

export class UpdateCartDto extends BaseCartDTO {
  @IsOptional()
  @IsNumber()
  public quantity: number;

  @IsOptional()
  @IsString()
  public colour: string;

  @IsOptional()
  @IsString()
  public size: string;
}
