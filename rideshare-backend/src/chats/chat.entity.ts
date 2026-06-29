import {
  Entity, PrimaryGeneratedColumn, Column, ManyToMany,
  OneToMany, JoinTable, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Message } from './message.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'chat_participants',
    joinColumn: { name: 'chatId' },
    inverseJoinColumn: { name: 'userId' },
  })
  participants: User[];

  @Column({ nullable: true })
  tripId: string;

  @OneToMany(() => Message, (msg) => msg.chat)
  messages: Message[];

  @Column({ nullable: true })
  lastMessageId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
