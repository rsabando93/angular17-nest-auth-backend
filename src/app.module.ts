import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), //me permite tener acceso a mis variables de entorno
    // MongooseModule.forRoot('mongodb://localhost:27017'), //importacion necesaria para conectar mongodb con nest
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME, //nombre de la base de datos en railway
    }), 
    AuthModule //modulo de authenticacion       -  cambiar mongodb://localhost/nest por mongodb://localhost:27017 que es nuestro puedto en mongo-compass
  ],
  // controllers: [AppController],
  // providers: [AppService],
    controllers: [],
  providers: [],
})
export class AppModule {

  // constructor(){
  //   console.log(process.env);
    
  // }
}
