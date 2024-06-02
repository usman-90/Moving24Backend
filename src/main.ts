import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
var cron = require('node-cron');

function runEverySecond() {
    cron.schedule('* * * * * *', () => {
        console.log("hello")
    });
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
//    runEverySecond()
    app.enableCors();
    await app.listen(4000);
}
bootstrap();
