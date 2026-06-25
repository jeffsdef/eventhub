import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'O titulo e obrigatorio' })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty({ message: 'A categoria e obrigatoria' })
  category!: string;

  @IsString()
  @IsNotEmpty({ message: 'A data e obrigatoria' })
  date!: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsNotEmpty({ message: 'A localizacao e obrigatoria' })
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
