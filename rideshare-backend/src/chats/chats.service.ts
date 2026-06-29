import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
  ) {}

  async myChats(userId: string) {
    const chats = await this.chatRepo
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('chat.messages', 'message')
      .where((qb) => {
        const sub = qb
          .subQuery()
          .select('cp.chatId')
          .from('chat_participants', 'cp')
          .where('cp.userId = :userId')
          .getQuery();
        return 'chat.id IN ' + sub;
      })
      .setParameter('userId', userId)
      .orderBy('chat.updatedAt', 'DESC')
      .getMany();

    return chats.map((chat) => {
      const lastMessage = chat.messages?.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
      const { messages, ...rest } = chat;
      return { ...rest, lastMessage };
    });
  }

  async getMessages(chatId: string, userId: string) {
    const chat = await this.chatRepo.findOne({
      where: { id: chatId },
      relations: ['participants'],
    });
    if (!chat) throw new NotFoundException('聊天不存在');
    const inChat = chat.participants.some((p) => p.id === userId);
    if (!inChat) throw new ForbiddenException('无权访问');

    // mark messages as read
    await this.msgRepo
      .createQueryBuilder()
      .update()
      .set({ isRead: true })
      .where('chatId = :chatId AND senderId != :userId AND isRead = false', {
        chatId, userId,
      })
      .execute();

    const messages = await this.msgRepo.find({
      where: { chatId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
    return { chat, messages };
  }

  async sendMessage(chatId: string, sender: User, content: string) {
    const chat = await this.chatRepo.findOne({
      where: { id: chatId },
      relations: ['participants'],
    });
    if (!chat) throw new NotFoundException('聊天不存在');
    const inChat = chat.participants.some((p) => p.id === sender.id);
    if (!inChat) throw new ForbiddenException('无权发送');

    const msg = this.msgRepo.create({ chatId, senderId: sender.id, content });
    const saved = await this.msgRepo.save(msg);
    chat.updatedAt = new Date();
    await this.chatRepo.save(chat);
    return { ...saved, sender };
  }

  async getOrCreate(userA: string, userB: string, tripId?: string) {
    const existing = await this.chatRepo
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.participants', 'p')
      .where((qb) => {
        const sub1 = qb.subQuery().select('cp1.chatId').from('chat_participants', 'cp1')
          .where('cp1.userId = :userA').getQuery();
        const sub2 = qb.subQuery().select('cp2.chatId').from('chat_participants', 'cp2')
          .where('cp2.userId = :userB').getQuery();
        return `chat.id IN ${sub1} AND chat.id IN ${sub2}`;
      })
      .setParameters({ userA, userB })
      .getOne();

    if (existing) return existing;

    const [u1, u2] = await Promise.all([
      this.chatRepo.manager.findOne(User, { where: { id: userA } }),
      this.chatRepo.manager.findOne(User, { where: { id: userB } }),
    ]);
    const chat = this.chatRepo.create({ participants: [u1!, u2!], tripId });
    return this.chatRepo.save(chat);
  }
}
