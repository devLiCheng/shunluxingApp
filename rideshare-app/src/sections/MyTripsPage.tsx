import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { tripStore } from '@/store/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Users, Plus, Car } from 'lucide-react';

export default function MyTripsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium mb-4">请先登录</p>
        <Link to="/login"><Button className="rounded-xl bg-indigo-600">去登录</Button></Link>
      </div>
    );
  }

  const myTrips = tripStore.myTrips(user.id);
  const myBookings = tripStore.myBookings(user.id);

  const statusMap: Record<string, { label: string; color: string }> = {
    open: { label: '进行中', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    full: { label: '已满员', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    done: { label: '已完成', color: 'bg-slate-50 text-slate-500 border-slate-200' },
    cancelled: { label: '已取消', color: 'bg-red-50 text-red-500 border-red-200' },
  };

  const TripCard = ({ trip }: { trip: any }) => {
    const status = statusMap[trip.status];
    return (
      <Link to={`/trip/${trip.id}`}>
        <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100 card-hover mb-2.5 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className={status.color}>{status.label}</Badge>
            <span className="text-lg font-bold text-indigo-600">¥{trip.price}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm mb-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-slate-700 font-medium truncate">{trip.from}</span>
            <span className="text-slate-300 mx-1 shrink-0">→</span>
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-700 font-medium truncate">{trip.to}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{trip.date} {trip.time}</span>
            <Users className="w-3.5 h-3.5 ml-2" />
            <span>{trip.availableSeats}/{trip.seats}座</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">我的行程</h1>
        {user.driverVerified && (
          <Link to="/post">
            <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-sm">
              <Plus className="w-4 h-4 mr-1" /> 发布
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue={myTrips.length > 0 ? 'my' : 'booked'}>
        <TabsList className="w-full bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="my" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
            我发布的 ({myTrips.length})
          </TabsTrigger>
          <TabsTrigger value="booked" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
            我预订的 ({myBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="mt-4">
          {myTrips.length > 0 ? myTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
            : <EmptyState message="还没有发布过行程" linkTo="/post" action="去发布" />}
        </TabsContent>

        <TabsContent value="booked" className="mt-4">
          {myBookings.length > 0 ? myBookings.map((trip) => <TripCard key={trip.id} trip={trip} />)
            : <EmptyState message="还没有预订过行程" linkTo="/search" action="去找车" />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message, linkTo, action }: { message: string; linkTo: string; action: string }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-card">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
        <Car className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-slate-400 text-sm mb-3">{message}</p>
      <Link to={linkTo}><Button variant="outline" className="rounded-xl text-xs">{action}</Button></Link>
    </div>
  );
}
