import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, ArrowLeft, Phone, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone || !password) {
      setError('请填写手机号和密码');
      return;
    }
    setLoading(true);
    const result = await login(phone, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || '登录失败');
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0F4FF] via-white to-[#ECFEFF] px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">欢迎回来</h1>
          <p className="text-slate-400 mt-1.5 text-sm">登录顺风搭，继续你的出行</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-[28px] shadow-card-lg border border-slate-100">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-slate-500 text-xs">手机号</Label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input
                id="phone"
                type="tel"
                placeholder="输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-11 rounded-xl border-slate-200 focus:border-indigo-300"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-500 text-xs">密码</Label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="输入密码（6位以上）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-xl border-slate-200 focus:border-indigo-300"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2.5">{error}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/25 text-sm font-semibold">
            {loading ? '登录中...' : '登录'}
          </Button>
          <div className="text-center">
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
              演示：13800138001 / 123456
            </span>
          </div>
        </form>

        <p className="text-center text-sm text-slate-400 mt-5">
          还没有账号？{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-700">立即注册</Link>
        </p>
      </div>
    </div>
  );
}
