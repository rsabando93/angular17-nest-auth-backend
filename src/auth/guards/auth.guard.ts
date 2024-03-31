import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ){

  }
  async canActivate( context: ExecutionContext ): Promise<boolean>{

    const request = context.switchToHttp().getRequest();
    // console.log(request);
    const token = this.extractTokenFromHeader(request);

    if (!token) { //si el token no existe manda el error
      throw new UnauthorizedException('There is no bearer token');
    }
    // console.log({token});
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: process.env.JWT_SEED
        }
      );
      const user = await this.authService.findUserById(payload.id);

      if( !user ) throw new UnauthorizedException('User does not exist');
      if( !user.isActive ) throw new UnauthorizedException('User is not active');
      // console.log(payload); //muestra el payload
      request['user'] = user;

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // request['user'] = payload;
      // request['user'] = payload.id;
     

    } catch (error) {
      // console.log(error); //muestra el error
      throw new UnauthorizedException('no existe ese token');
      
    }

    return true;
    // return Promise.resolve(true);
  }

  private extractTokenFromHeader(request: Request): string | undefined { //Verificacion de token
    const [type, token] = request.headers['authorization']?.split(' ') ?? []; //editar authorization
    return type === 'Bearer' ? token : undefined;
  }
}
