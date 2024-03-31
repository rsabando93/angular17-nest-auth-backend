import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema() //hace todas la validaciones correspondientes - que el email sea unico, obtener los nombres por el id, etc
export class User {

    _id?: string;//mongo asigna el id por defecto

    @Prop({ unique: true, required: true }) //no debe repetirse el correo, debe ser obligatorio
    email: string;

    @Prop({ required: true }) //debe ser obligatorio
    name: string;

    @Prop({ minlength: 6, required: true  }) //este campo tiene que tener min 6 caracteres, debe ser obligatorio
    password?: string; //puede ser opcional - para poder devolver el user sin la contraseña al crear el user

    @Prop({ default: true }) //por defecto va a ser true
    isActive: boolean;

    @Prop({ type: [String], default: ['user'] }) //va a ser un arreglo de string y por defecto va a tener el rol de user
    roles: string[];


}

export const UserSchema = SchemaFactory.createForClass( User );
