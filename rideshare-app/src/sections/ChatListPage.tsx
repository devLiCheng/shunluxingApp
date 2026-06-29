import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { chatStore } from '@/store/data';
import { Button } from '@/components/ui/button';
import { MessageSquareMore, Car } from 'lucide-react';

export default function ChatListPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
          <MessageSquareMore className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium mb-4">请先登录</p>
        <Link to="/login"><Button className="rounded-xl bg-indigo-600">去登录</Button></Link>
      </div>
    );
  }

  const chats = chatStore.userChats(user.id).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">消息</h1>

      {chats.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <MessageSquareMore className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium mb-1">暂无消息</p>
          <p className="text-sm text-slate-400">预订行程后可以与车主在线沟通</p>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat, idx) => {
            const otherId = chat.participants.find((p) => p !== user.id)!;
            const other = chatStore.getUserById(otherId);
            return (
              <Link key={chat.id} to={`/chat/${chat.id}`} className="block stagger-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 card-hover flex items-center gap-3 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                    {other?.name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800 text-sm">{other?.name || '未知用户'}</span>
                      {chat.lastMessage && (
                        <span className="text-[10px] text-slate-400">{formatTime(chat.lastMessage.createdAt)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {chat.tripId && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md shrink-0">
                          <Car className="w-3 h-3" /> 行程
                        </span>
                      )}
                      <p className="text-xs text-slate-400 truncate">{chat.lastMessage?.content || '暂无消息'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  return date.toLocaleDateString('zh-CN');
}
