import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { chatsApi } from '@/api/chats';
import { getOtherParticipant } from '@/types';
import type { Message, Chat } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Car, MoreVertical } from 'lucide-react';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<number | undefined>(undefined);

  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    try {
      const res = await chatsApi.getMessages(chatId);
      setChat(res.chat);
      setMsgs(res.messages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    loadMessages();
    // Poll every 3 seconds
    pollRef.current = setInterval(loadMessages, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  if (!user) { navigate('/login'); return null; }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-11rem)] animate-pulse">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-200" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="font-medium mb-4">会话不存在</p>
        <Link to="/chat"><Button variant="outline" className="rounded-xl">返回消息列表</Button></Link>
      </div>
    );
  }

  const other = getOtherParticipant(chat, user.id);

  const handleSend = async () => {
    if (!text.trim() || !chatId) return;
    const content = text.trim();
    setText('');
    try {
      const msg = await chatsApi.sendMessage(chatId, content);
      setMsgs((prev) => [...prev, msg]);
    } catch (e: any) {
      alert(e.message || '发送失败');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-11rem)]">
      {/* Chat header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 shrink-0">
        <Link to="/chat" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
          {other?.name?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 text-sm">{other?.name || '未知用户'}</div>
          {chat.tripId && (
            <span className="inline-flex items-center gap-1 text-xs text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">
              <Car className="w-3 h-3" /> 行程咨询中
            </span>
          )}
        </div>
        <button className="p-2 text-slate-300 hover:text-slate-500 rounded-xl hover:bg-slate-50">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1">
        {msgs.map((msg, idx) => {
          const isMe = msg.senderId === user.id;
          const showAvatar = idx === 0 || msgs[idx - 1]?.senderId !== msg.senderId;
          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''} ${showAvatar ? 'mt-2' : ''}`}>
              {!isMe && showAvatar ? (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0 self-end">
                  {other?.name?.[0] || '?'}
                </div>
              ) : !isMe ? (
                <div className="w-8 shrink-0" />
              ) : null}
              <div className={`max-w-[72%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                  isMe
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl rounded-br-md shadow-md shadow-indigo-500/15'
                    : 'bg-white text-slate-700 rounded-2xl rounded-bl-md shadow-sm border border-slate-100'
                }`}>
                  {msg.content}
                </div>
                <div className={`text-[10px] mt-0.5 px-1 ${isMe ? 'text-slate-400' : 'text-slate-300'}`}>
                  {formatMsgTime(msg.createdAt)}
                </div>
              </div>
              {isMe && showAvatar ? (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0 self-end">
                  {user.name[0]}
                </div>
              ) : isMe ? (
                <div className="w-8 shrink-0" />
              ) : null}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 shrink-0">
        <Input
          value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          className="flex-1 h-11 rounded-xl bg-slate-50 border-slate-200 focus:border-indigo-300 focus:bg-white"
        />
        <Button size="icon" onClick={handleSend} disabled={!text.trim()}
          className="h-11 w-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/25 disabled:opacity-40">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function formatMsgTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}
