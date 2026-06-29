import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @ApiOperation({ summary: '我的会话列表' })
  myChats(@CurrentUser() user: User) {
    return this.chatsService.myChats(user.id);
  }

  @Get(':chatId/messages')
  @ApiOperation({ summary: '获取聊天消息' })
  getMessages(@Param('chatId') chatId: string, @CurrentUser() user: User) {
    return this.chatsService.getMessages(chatId, user.id);
  }

  @Post(':chatId/messages')
  @ApiOperation({ summary: '发送消息' })
  @ApiBody({ schema: { properties: { content: { type: 'string' } }, required: ['content'] } })
  sendMessage(
    @Param('chatId') chatId: string,
    @CurrentUser() user: User,
    @Body('content') content: string,
  ) {
    return this.chatsService.sendMessage(chatId, user, content);
  }

  @Post('get-or-create')
  @ApiOperation({ summary: '获取或创建会话（与指定用户）' })
  @ApiBody({
    schema: {
      properties: {
        targetUserId: { type: 'string' },
        tripId: { type: 'string' },
      },
      required: ['targetUserId'],
    },
  })
  getOrCreate(
    @CurrentUser() user: User,
    @Body('targetUserId') targetUserId: string,
    @Body('tripId') tripId: string,
  ) {
    return this.chatsService.getOrCreate(user.id, targetUserId, tripId);
  }
}
