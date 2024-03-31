import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); //permite conectar el frontend con el backend cuando estan en diferentes servidores

  app.useGlobalPipes(// valida que la imformacion que se recibe de una peticion post debe ser tal cual esta en mi backend, caso contrario no se acepta
    new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    })
    );

  // await app.listen(process.env.PORT || 3000);
  // await app.listen(process.env.PORT ?? 3000);
  const PORT = process.env.PORT ?? 3000;
    
  console.log(`App corriendo en puerto: ${ PORT } `)

  await app.listen( PORT );
}
bootstrap();
