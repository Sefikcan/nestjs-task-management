import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`], //environment bazlı config bilgilerini alacağımız dosyamızı belirttik.
      validationSchema: configValidationSchema
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Kullanacağımız modülü import ettik
      inject: [ConfigService], // Kullanacağımız servisi inject ettik
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT')),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE')
        }
      }
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
