import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, ArrowLeft, User, Phone, Lock } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !phone || !password) { setError('请填写所有必填项'); return; }
    if (password.length < 6) { setError('密码长度至少6位'); return; }
    if (password !== confirm) { setError('两次密码输入不一致'); return; }
    const ok = register(name, phone, password);
    if (!ok) { setError('该手机号已注册'); return; }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F4FF] via-white to-[#ECFEFF] px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-8">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">加入顺风搭</h1>
          <p className="text-slate-400 mt-1.5 text-sm">开启便捷出行新体验</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-[28px] shadow-card-lg border border-slate-100">
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs">昵称</Label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input placeholder="输入昵称" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11 rounded-xl border-slate-200 focus:border-indigo-300" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs">手机号</Label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input type="tel" placeholder="输入手机号" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-11 rounded-xl border-slate-200 focus:border-indigo-300" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs">密码</Label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input type="password" placeholder="设置密码（至少6位）" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11 rounded-xl border-slate-200 focus:border-indigo-300" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs">确认密码</Label>
            <Input type="password" placeholder="再次输入密码" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-11 rounded-xl border-slate-200 focus:border-indigo-300" />
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2.5">{error}</p>}
          <Button type="submit" className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/25 text-sm font-semibold">注册</Button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-5">
          已有账号？ <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">立即登录</Link>
        </p>
      </div>
    </div>
  );
}
