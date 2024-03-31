import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail() //valida que el correo debe tener forma de correo
    email: string;

    @IsString() //valida que el name tiene que ser de tipo string
    name: string;

    @MinLength(6)//valida que password debe tener min 6 caracteres
    password: string;
}
