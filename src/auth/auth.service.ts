import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import  * as bcryptjs  from 'bcryptjs'

import { RegisterUserDto, CreateUserDto, UpdateAuthDto, LoginDto } from './dto';

// import { RegisterUserDto } from './dto/register-user.dto';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { LoginDto } from './dto/login.dto';

import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name )
    private userModel: Model<User>, //con este modelo userModel ya se puede hacer todas las interacciones con la base de datos relacionada a el Schema User
    private jwtService: JwtService, //libreria para crear jwt
    ){}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    // return 'This action adds a new auth';
    // const newUser = new this.userModel( CreateUserDto );//crea una nueva instancia de CreateUserDto
    // return await newUser.save();//Graba el usuario en la base - save() es una promesa
    
    // 1. Encriptar la contraseña
    try {
      const { password, ...userData } = CreateUserDto; //saca el password para poder encriptarlo
      const newUser = new this.userModel( { //crea un nuevo user pero con la contraseña encryptada
        password: bcryptjs.hashSync( password, 10), //encripta la password
        ...userData //esparce el resto de campos(email, name)
      } );

      // 2. Guardar el user
      // return await newUser.save();
      await newUser.save();
      const { password:_, ...user } = newUser.toJSON(); //se usa password:_ (con subguion) para evitar que choque con la de arriba
      return user;

      // 3. Generar el JWT(Json Web Token)
      
      
    } catch (error) {
      // console.log(error.code);
      if( error.code === 11000){ //11000 es cuando el valor ya existe en la base
        throw new BadRequestException(`${ CreateUserDto.email} already exist!`); //Error controlado
      }
      throw new InternalServerErrorException('Something terrible happen!');
      
      
      
    }

  }

  async register( registerDto: RegisterUserDto): Promise<LoginResponse>{

    const user = await this.create(registerDto);
    console.log(user);
    
    return {
      user: user,
      token: this.getJwtToken( { id: user._id } ), 
    }
  }

  async login( loginDto: LoginDto ): Promise<LoginResponse>{
    
    // console.log(loginDto);
    const { password, email } = loginDto;
    const user = await this.userModel.findOne({ email: email }); //busca el email en la base

    if( !user ){ //si no existe el user
      throw new UnauthorizedException('Not valid credentials - email');
    }

    if( !bcryptjs.compareSync(password, user.password )) {//compara la password del input con la password de la base de datos - si no son iguales entonces ejecuta el codigo
      throw new UnauthorizedException('Not valid credentials - password');
    }
    // return 'Todo bien!';
    const { password:_, ...rest } = user.toJSON(); //desestructuracion para sacar el password

    return { //regresa todo menos la password y genera el token de acceso
      user: rest,
      token: this.getJwtToken( { id: user.id } ), //crea el jswt con el id del user
      // token: 'ABC-123',
    }
    /**
     * Debe regresar:
     * User: {id_, name, email, roles, etc}
     * Json web token -> ASDASDA.ADSADASDAS.ASDASDADADS
     */
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
    // return `This action returns all auth`;
  }


  async findUserById( id: string ){
    const user = await this.userModel.findById( id );

    const { password, ...rest } = user.toJSON(); //toJSON permite que se omita los metodos que vengan en ese modelo y solo envie las propiedades
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload ){ //crea el jwt
    const token = this.jwtService.sign(payload);
    return token;
  }
}
