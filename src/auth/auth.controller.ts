import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto,LoginDto,RegisterUserDto, UpdateAuthDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { LoginDto } from './dto/login.dto';
// import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post() //si no se agrega nada pasa por el auth
  create(@Body() CreateUserDto: CreateUserDto) { //el CreateUserDto es el user que llaga atraves de la peticion y se valida que debe tener el aspecto de CreateUserDto
    // console.log(CreateUserDto);
    
    return this.authService.create(CreateUserDto);
  }

  @Post('login') //auth/login - Endpoint
  login(@Body() loginDto: LoginDto){
    // return 'Login Works!'
    return this.authService.login(loginDto);
  }

  @Post('register') //auth/login - Endpoint
  register(@Body() registerDto: RegisterUserDto){
    // return 'Login Works!'
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll( @Request() req: Request ) {
    // console.log(req);
    return this.authService.findAll();
    /////////////////////
    //Obtener un usuario en especifico
    // const user = req['user'];
    // return user;
    /////////////////////
  }
  
  @UseGuards(AuthGuard)//permite verificar si existe ese token
  @Get('check-token') 
  checkToken( @Request() req: Request ): LoginResponse{
    // console.log('hola');
    const user = req['user'] as User;
    // console.log(user);
    return {
      user: user,
      token: this.authService.getJwtToken( { id: user._id } ), 
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
