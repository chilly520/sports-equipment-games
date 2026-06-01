import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Layout/Header'
import { MobileNav } from '@/components/Layout/MobileNav'
import { HomePage } from '@/pages/HomePage'
import { WheelPage } from '@/pages/WheelPage'
import { GamesPage } from '@/pages/GamesPage'
import { GameDetailPage } from '@/pages/GameDetailPage'
import { TimerPage } from '@/pages/TimerPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { RecentPage } from '@/pages/RecentPage'
import { SchedulePage } from '@/pages/SchedulePage'
import { TodayRecommendPage } from '@/pages/TodayRecommendPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-pattern">
        <Header />
        <MobileNav />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wheel" element={<WheelPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:equipmentId/:gameId" element={<GameDetailPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recent" element={<RecentPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/recommend" element={<TodayRecommendPage />} />
        </Routes>

        <footer className="mt-16 py-8 text-center text-gray-400 text-sm border-t border-gray-200/50 bg-white/30 backdrop-blur-sm mb-20 lg:mb-0">
          <p>🎯 体育教具玩法大全 | 让每个孩子都爱上运动</p>
          <p className="mt-1">专为热爱创新的体育老师打造 ❤️</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
