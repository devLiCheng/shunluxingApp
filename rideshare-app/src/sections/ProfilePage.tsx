import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Shield, Star, LogOut, ChevronRight, ClipboardList, Car as CarIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Profile card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-slate-100">
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500" />
        <div className="p-5 -mt-12">
          <div className="w-[72px] h-[72px] rounded-2xl bg-white p-1 shadow-lg">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.name[0]}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              {user.driverVerified ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <Shield className="w-3 h-3" /> 已认证车主
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                  未认证
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
              <span className="flex items-center gap-0.5"><Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" /> {user.rating}</span>
              <span>{user.tripCount}次行程</span>
              <span>{user.joinDate}加入</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="space-y-1.5">
        {!user.driverVerified && (
          <Link to="/driver-verify">
            <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 card-hover flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center border border-amber-100">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">成为车主</div>
                  <div className="text-xs text-slate-400">完成实名认证，开始发布行程</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </Link>
        )}

        <Link to="/my-trips">
          <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 card-hover flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center border border-indigo-100">
                <ClipboardList className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-sm font-semibold text-slate-800">我的行程</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </Link>

        {/* 车辆信息卡片 */}
        {user.driverVerified && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <CarIcon className="w-3.5 h-3.5" /> 我的车辆
              </div>
              <Link
                to="/driver-verify?mode=edit"
                className="inline-flex items-center gap-1 text-xs text-indigo-500 font-medium hover:text-indigo-700 transition-colors"
              >
                <Pencil className="w-3 h-3" /> 编辑
              </Link>
            </div>
            <div className="px-4 pb-4 grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">车型</div>
                <div className="font-semibold text-slate-700 text-sm">{user.carModel}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">车牌号</div>
                <div className="font-semibold text-slate-700 text-sm">{user.carPlate}</div>
              </div>
              <div className="col-span-2 bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 mb-0.5 uppercase tracking-wide">车身颜色</div>
                <div className="font-semibold text-slate-700 text-sm">{user.carColor}</div>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => { logout(); navigate('/'); }} className="w-full">
          <div className="bg-white rounded-2xl p-4 shadow-card border border-red-50 card-hover flex items-center justify-between cursor-pointer hover:border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-sm font-semibold text-red-500">退出登录</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
