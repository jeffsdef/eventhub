import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Insira um email válido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'A palavra-passe é obrigatória' })
  password!: string;
}