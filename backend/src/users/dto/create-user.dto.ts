import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome e obrigatorio' })
  name!: string;

  @IsEmail({}, { message: 'Forneca um email valido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha e obrigatoria' })
  password!: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];
}
