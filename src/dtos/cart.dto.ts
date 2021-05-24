import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class BaseCartDTO {
  @IsNotEmpty()
  @IsUUID()
  public productId: string;

  @IsOptional()
  @IsString()
  public colour: string;

  @IsOptional()
  @IsString()
  public size: string;
}

export class CartDTO extends BaseCartDTO {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  public quantity: number;
}

export class UpdateCartDTO extends BaseCartDTO {
  @IsOptional()
  @IsNumber()
  public quantity: number;
}
