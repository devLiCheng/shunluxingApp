import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tripsApi } from '@/api/trips';
import type { Trip } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Users, Star, Car, Navigation } from 'lucide-react';

export default function SearchPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [results, setResults] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await tripsApi.search({ from: from || undefined, to: to || undefined, date: date || undefined });
      setResults(res.items);
      setSearched(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Search form */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100">
        <div className="relative mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Navigation className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
              <Input
                placeholder="出发地（如：上海）"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="pl-9 h-11 rounded-xl border-slate-200 focus:border-indigo-300 focus:ring-indigo-200/50"
              />
            </div>
            <div className="w-7 h-0.5 bg-slate-200 rounded-full shrink-0" />
            <div className="flex-1 relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <Input
                placeholder="目的地（如：杭州）"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="pl-9 h-11 rounded-xl border-slate-200 focus:border-cyan-300 focus:ring-cyan-200/50"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 flex-1 rounded-xl border-slate-200"
          />
          <Button onClick={handleSearch} disabled={loading} className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/25">
            <Search className="w-4 h-4 mr-1.5" />
            {loading ? '搜索中...' : '搜索'}
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {searched && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              共 <span className="font-semibold text-indigo-600">{results.length}</span> 个行程
            </span>
          </div>
        )}

        {results.map((trip, idx) => (
          <Link key={trip.id} to={`/trip/${trip.id}`} className="block stagger-item" style={{ animationDelay: `${idx * 0.06}s` }}>
            <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 card-hover cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                    {trip.driver?.name?.[0] || '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 text-sm">{trip.driver?.name}</span>
                      <span className="flex items-center gap-0.5 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                        {trip.driver?.rating}
                      </span>
                      <span className="text-xs text-slate-300">· {trip.driver?.tripCount}次</span>
                      {trip.driver?.driverVerified && (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 text-[10px] h-5 px-1.5">
                          认证
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="text-slate-700 font-medium truncate">{trip.from}</span>
                      <span className="text-slate-300 mx-1 shrink-0">→</span>
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-slate-700 font-medium truncate">{trip.to}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="text-xl font-bold text-indigo-600">¥{trip.price}</div>
                  <div className="text-xs text-slate-400">/人</div>
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
                {trip.note && (
                  <span className="text-slate-300 truncate max-w-[160px]">{trip.note}</span>
                )}
              </div>
            </div>
          </Link>
        ))}

        {searched && results.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium mb-1">没有找到匹配的行程</p>
            <p className="text-sm text-slate-400 mb-4">试试调整搜索条件</p>
            <Link to="/post">
              <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700">发布行程</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
