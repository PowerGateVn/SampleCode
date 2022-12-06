import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './apps/auth/auth.module';
import { UserModule } from './apps/user/user.module';
import DBConfig from 'src/configs/db.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SchoolTypeModule } from './admins/school-type/school-type.module';
import redisConfig from './configs/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(DBConfig),
    CacheModule.register(redisConfig),
    AuthModule,
    UserModule,
    SchoolTypeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
