import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Car, User, PlusCircle, LogOut, Menu, X, Home, Search, ShieldCheck, MessageSquareMore } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { path: '/', label: '首页', icon: Home },
  { path: '/search', label: '找车', icon: Search },
  { path: '/post', label: '发布', icon: PlusCircle },
  { path: '/chat', label: '消息', icon: MessageSquareMore },
  { path: '/profile', label: '我的', icon: User },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (location.pathname === '/login' || location.pathname === '/register') {
    return <Outlet />;
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top bar - glass morphism */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:shadow-lg group-hover:shadow-indigo-500/40 transition-shadow">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold text-gradient tracking-tight">
              顺风搭
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {!user.driverVerified && (
                  <Link to="/driver-verify">
                    <Button variant="outline" size="sm" className="rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 text-xs h-8">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      成为车主
                    </Button>
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-700 hover:text-indigo-600 transition-colors px-1">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.name[0]}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-slate-300 hover:text-red-400 transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors px-3 py-1.5">
                  登录
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-xl text-xs h-8 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                    注册
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-slate-500 hover:text-slate-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl animate-fade-in-up">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 py-2.5 text-sm rounded-xl px-3 transition-colors ${
                      active
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              {user && !user.driverVerified && (
                <Link
                  to="/driver-verify"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2.5 text-sm rounded-xl px-3 text-amber-600 hover:bg-amber-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  成为车主
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}
                  className="flex items-center gap-3 py-2.5 text-sm rounded-xl px-3 text-red-500 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center text-sm py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">
                    登录
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center text-sm py-2.5 rounded-xl bg-indigo-600 text-white">
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>

      {/* Bottom nav bar (mobile) - pill style */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="bg-white/85 backdrop-blur-xl shadow-bottom-nav border border-white/50 rounded-[28px] px-2 py-1.5 flex items-center justify-around mx-auto max-w-lg">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-[22px] transition-all duration-200 min-w-[56px] ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
