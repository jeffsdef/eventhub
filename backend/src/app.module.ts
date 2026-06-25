import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, EventsModule, UsersModule, AuthModule, CategoriesModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
