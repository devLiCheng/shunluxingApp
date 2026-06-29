import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { tripStore } from '@/store/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Navigation, Calendar, Clock, DollarSign, Info, Minus, Plus, Send } from 'lucide-react';

export default function PostTripPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState(50);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium mb-4">请先登录再发布行程</p>
        <Link to="/login"><Button className="rounded-xl bg-indigo-600">去登录</Button></Link>
      </div>
    );
  }

  if (!user.driverVerified) {
    return (
      <div className="text-center py-16 max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">请先完成车主认证</h2>
        <p className="text-slate-400 text-sm mb-4">为了保障乘客安全，发布行程前需要先完成车主实名认证</p>
        <Link to="/driver-verify"><Button className="rounded-xl bg-amber-500 hover:bg-amber-600">去认证</Button></Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!from || !to || !date || !time) { setError('请填写完整行程信息'); return; }
    tripStore.create({ driverId: user.id, driver: user, from, to, date, time, seats, availableSeats: seats, price, note });
    navigate('/my-trips', { replace: true });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600">
        <ArrowLeft className="w-4 h-4" /> 返回
      </Link>
      <h1 className="text-2xl font-bold text-slate-900">发布行程</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-slate-500 text-xs font-medium">出发地</Label>
          <div className="relative">
            <Navigation className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
            <Input className="pl-10 h-11 rounded-xl border-slate-200 focus:border-indigo-300" placeholder="例如：上海虹桥站" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-500 text-xs font-medium">目的地</Label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
            <Input className="pl-10 h-11 rounded-xl border-slate-200 focus:border-cyan-300" placeholder="例如：杭州西站" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-medium">出发日期</Label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input type="date" className="pl-10 h-11 rounded-xl border-slate-200" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-medium">出发时间</Label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input type="time" className="pl-10 h-11 rounded-xl border-slate-200" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-medium">座位数</Label>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-2">
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-lg" onClick={() => seats > 1 && setSeats(seats - 1)}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-bold text-slate-800 w-8 text-center">{seats}</span>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 rounded-lg" onClick={() => seats < 6 && setSeats(seats + 1)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-medium">价格（元/人）</Label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input type="number" className="pl-10 h-11 rounded-xl border-slate-200" value={price} onChange={(e) => setPrice(Number(e.target.value))} min={0} />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-500 text-xs font-medium">备注（选填）</Label>
          <Textarea placeholder="例如：不抽烟、高速直达、途经点等" value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="rounded-xl border-slate-200 resize-none" />
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2.5">{error}</p>}

        <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/25 text-base font-semibold">
          <Send className="w-4 h-4 mr-2" />
          发布行程
        </Button>
      </form>
    </div>
  );
}
