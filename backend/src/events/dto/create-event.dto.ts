import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  category!: string;

  @IsString()
  @IsNotEmpty({ message: 'A data é obrigatória' })
  date!: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsNotEmpty({ message: 'A localização é obrigatória' })
  location!: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}