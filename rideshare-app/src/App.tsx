import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/sections/Layout';
import HomePage from '@/sections/HomePage';
import LoginPage from '@/sections/LoginPage';
import RegisterPage from '@/sections/RegisterPage';
import SearchPage from '@/sections/SearchPage';
import TripDetailPage from '@/sections/TripDetailPage';
import PostTripPage from '@/sections/PostTripPage';
import MyTripsPage from '@/sections/MyTripsPage';
import ChatListPage from '@/sections/ChatListPage';
import ChatPage from '@/sections/ChatPage';
import DriverVerifyPage from '@/sections/DriverVerifyPage';
import ProfilePage from '@/sections/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/trip/:id" element={<TripDetailPage />} />
            <Route path="/post" element={<PostTripPage />} />
            <Route path="/my-trips" element={<MyTripsPage />} />
            <Route path="/chat" element={<ChatListPage />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/driver-verify" element={<DriverVerifyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}
