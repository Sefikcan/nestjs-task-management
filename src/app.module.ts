import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'secret',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
