import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { tripsApi } from '@/api/trips';
import { bookingsApi } from '@/api/bookings';
import { chatsApi } from '@/api/chats';
import { getPassengerIds } from '@/types';
import type { Trip } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Star, Car, MessageCircle, Shield, ArrowLeft } from 'lucide-react';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    tripsApi.getById(id)
      .then(setTrip)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-pulse">
        <div className="h-6 w-20 bg-slate-200 rounded" />
        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
          <div className="h-8 w-24 bg-slate-200 rounded-xl mb-4" />
          <div className="space-y-3">
            <div className="h-6 w-3/4 bg-slate-100 rounded" />
            <div className="h-6 w-2/3 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium mb-4">行程不存在或已取消</p>
        <Link to="/search"><Button variant="outline" className="rounded-xl">返回搜索</Button></Link>
      </div>
    );
  }

  const isDriver = user?.id === trip.driverId;
  const passengerIds = getPassengerIds(trip);
  const isPassenger = user && passengerIds.includes(user.id);

  const handleBooking = async () => {
    if (!user) { navigate('/login'); return; }
    setActionLoading(true);
    try {
      await bookingsApi.book(trip.id);
      await refresh();
      navigate(`/my-trips`, { replace: true });
    } catch (e: any) {
      alert(e.message || '预订失败');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChat = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const chat = await chatsApi.getOrCreate(trip.driverId, trip.id);
      navigate(`/chat/${chat.id}`);
    } catch (e: any) {
      alert(e.message || '创建会话失败');
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await tripsApi.cancel(trip.id);
      await refresh();
      navigate('/my-trips', { replace: true });
    } catch (e: any) {
      alert(e.message || '取消失败');
    } finally {
      setActionLoading(false);
    }
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    open: { label: '可预订', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    full: { label: '已满员', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    completed: { label: '已完成', color: 'bg-slate-50 text-slate-500 border-slate-200' },
    cancelled: { label: '已取消', color: 'bg-red-50 text-red-500 border-red-200' },
  };
  const status = statusMap[trip.status] || statusMap.open;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/search" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600">
        <ArrowLeft className="w-4 h-4" /> 返回
      </Link>

      {/* Route card */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={status.color}>{status.label}</Badge>
          <div className="text-2xl font-bold text-indigo-600">
            ¥{trip.price}<span className="text-sm text-slate-400 font-normal">/人</span>
          </div>
        </div>

        <div className="flex items-stretch gap-4 mb-5">
          <div className="flex flex-col items-center pt-1">
            <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
            <div className="w-0.5 flex-1 bg-gradient-to-b from-indigo-200 to-cyan-200 my-1" />
            <div className="w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-cyan-100" />
          </div>
          <div className="flex-1 space-y-5">
            <div>
              <div className="text-xs text-slate-400 mb-0.5">出发地</div>
              <div className="text-lg font-bold text-slate-900">{trip.from}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">目的地</div>
              <div className="text-lg font-bold text-slate-900">{trip.to}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[{ icon: Calendar, label: '日期', value: trip.date },
            { icon: Clock, label: '时间', value: trip.time },
            { icon: Users, label: '空位', value: `${trip.availableSeats}/${trip.seats}座` },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-b from-slate-50 to-white rounded-xl p-3 text-center border border-slate-100">
              <item.icon className="w-4 h-4 mx-auto mb-1 text-slate-300" />
              <div className="text-[10px] text-slate-400">{item.label}</div>
              <div className="text-sm font-semibold text-slate-700">{item.value}</div>
            </div>
          ))}
        </div>

        {trip.note && (
          <div className="mt-4 p-3.5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl text-sm text-indigo-700 border border-indigo-100">
            📝 {trip.note}
          </div>
        )}
      </div>

      {/* Driver card */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">车主信息</h3>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {trip.driver?.name?.[0] || '?'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{trip.driver?.name}</span>
              {trip.driver?.driverVerified && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 text-xs">
                  <Shield className="w-3 h-3 mr-0.5" /> 已认证
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
              <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />{trip.driver?.rating}</span>
              <span>{trip.driver?.tripCount}次行程</span>
            </div>
          </div>
        </div>
        {trip.driver?.driverVerified && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
            <div>🚗 {trip.driver.carModel} · {trip.driver.carColor}</div>
            <div>🔢 车牌：{trip.driver.carPlate}</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {isDriver ? (
          <Button variant="destructive" onClick={handleCancel} disabled={actionLoading || trip.status !== 'open'} className="flex-1 h-12 rounded-xl">
            {actionLoading ? '处理中...' : '取消行程'}
          </Button>
        ) : trip.status === 'open' && !isPassenger ? (
          <>
            <Button onClick={handleBooking} disabled={actionLoading} className="flex-1 h-12 text-base rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/25">
              {actionLoading ? '预订中...' : '立即预订'}
            </Button>
            <Button variant="outline" onClick={handleChat} className="h-12 w-12 rounded-xl">
              <MessageCircle className="w-5 h-5" />
            </Button>
          </>
        ) : isPassenger ? (
          <Button onClick={handleChat} className="flex-1 h-12 text-base rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600">
            <MessageCircle className="w-4 h-4 mr-2" /> 联系车主
          </Button>
        ) : trip.status === 'full' ? (
          <Button disabled className="flex-1 h-12 rounded-xl">已满员</Button>
        ) : (
          <Button disabled className="flex-1 h-12 rounded-xl">{trip.status === 'cancelled' ? '已取消' : '已完成'}</Button>
        )}
      </div>
    </div>
  );
}
