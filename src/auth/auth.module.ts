import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CheckEmailMiddleware } from 'src/middlewares/CheckEmailAvailablity.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UsersModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || "dajsdkh823948dk",
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckEmailMiddleware)
            .forRoutes('auth/signup');
    }
}
