import { Link } from 'react-router-dom';
import { tripStore } from '@/store/data';
import { Car, MapPin, Calendar, ArrowRight, Shield, Users, Star, Sparkles, Navigation, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const trips = tripStore.all().filter((t) => t.status === 'open').slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center pt-4 md:pt-8 pb-4">
        <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 text-sm font-medium border border-indigo-100 shadow-sm">
          <Sparkles className="w-4 h-4" />
          实名认证，安全出行
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          顺风出行
          <br className="md:hidden" />
          <span className="text-gradient">一路同行</span>
        </h1>
        <p className="mt-3 text-slate-500 text-lg max-w-lg mx-auto">
          加入百万用户信赖的顺风出行平台 — 便捷、实惠、环保
        </p>

        {/* Quick search bar */}
        <div className="mt-8 max-w-xl mx-auto">
          <Link to="/search">
            <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-lg shadow-indigo-500/5 border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 cursor-pointer group">
              <div className="flex-1 flex items-center gap-3 py-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Navigation className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-slate-400 text-sm group-hover:text-slate-600 transition-colors">输入出发地</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex-1 flex items-center gap-3 py-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-slate-400 text-sm group-hover:text-slate-600 transition-colors">输入目的地</span>
              </div>
              <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/40 transition-all">
                搜索
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { icon: Shield, label: '实名认证', desc: '双重认证', color: 'from-emerald-50 to-green-50', iconColor: 'text-emerald-600', border: 'border-emerald-100' },
          { icon: Car, label: '海量行程', desc: '全国覆盖', color: 'from-indigo-50 to-blue-50', iconColor: 'text-indigo-600', border: 'border-indigo-100' },
          { icon: Star, label: '真实评价', desc: '信用体系', color: 'from-amber-50 to-orange-50', iconColor: 'text-amber-600', border: 'border-amber-100' },
        ].map((f, i) => (
          <div
            key={i}
            className="text-center bg-white rounded-2xl p-4 shadow-card border border-slate-100 card-hover stagger-item"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-2 shadow-sm ${f.border} border`}>
              <f.icon className={`w-5 h-5 ${f.iconColor}`} />
            </div>
            <p className="text-sm font-semibold text-slate-800">{f.label}</p>
            <p className="text-xs text-slate-400 hidden sm:block mt-0.5">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Nearby trips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">近期行程</h2>
            <p className="text-sm text-slate-400 mt-0.5">发现身边的顺风车</p>
          </div>
          <Link to="/search" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            查看更多 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {trips.map((trip, idx) => (
            <Link key={trip.id} to={`/trip/${trip.id}`} className={`stagger-item`} style={{ animationDelay: `${0.05 * (idx + 4)}s` }}>
              <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 card-hover group cursor-pointer">
                {/* Driver row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {trip.driver.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{trip.driver.name}</div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                        <span className="text-amber-600 font-medium">{trip.driver.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 text-sm font-bold px-3 py-1 rounded-xl border border-indigo-100">
                    ¥{trip.price}
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-stretch gap-3 pl-1">
                  <div className="flex flex-col items-center pt-1.5 gap-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-100" />
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-indigo-200 to-cyan-200 my-1 mx-auto" style={{ minHeight: '24px' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 ring-2 ring-cyan-100" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="pb-3">
                      <p className="text-sm font-semibold text-slate-800 truncate">{trip.from}</p>
                      <p className="text-xs text-slate-400">出发</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 truncate">{trip.to}</p>
                      <p className="text-xs text-slate-400">到达</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {trip.date} {trip.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    余{trip.availableSeats}/{trip.seats}座
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {trips.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium mb-1">暂无行程</p>
            <p className="text-sm text-slate-400 mb-4">去发布第一个行程吧</p>
            <Link to="/post">
              <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                发布行程
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
