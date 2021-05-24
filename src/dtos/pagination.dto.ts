import { IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  public skip: number;

  @IsNumber()
  public take: number;
}
