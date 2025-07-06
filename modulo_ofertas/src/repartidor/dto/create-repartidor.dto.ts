import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateRepartidorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}