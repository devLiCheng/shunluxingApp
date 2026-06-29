import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat } from './chat.entity';
import { Message } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message])],
  providers: [ChatsService],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}
