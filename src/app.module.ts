import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Moving24Controller } from './moving24.controller';

@Module({
  imports: [],
  controllers: [AppController, Moving24Controller],
  providers: [AppService],
})
export class AppModule {}
