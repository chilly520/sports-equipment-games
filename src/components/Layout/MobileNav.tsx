import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Dice6, List, Clock, Heart, History, Calendar, Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showMore, setShowMore] = useState(false)

  const mainNavItems = [
    { icon: Home, label: '首页', path: '/' },
    { icon: Dice6, label: '转盘', path: '/wheel' },
    { icon: List, label: '玩法库', path: '/games' },
    { icon: Clock, label: '计时器', path: '/timer' },
  ]

  const moreNavItems = [
    { icon: Heart, label: '收藏', path: '/favorites', color: 'text-red-500' },
    { icon: History, label: '最近', path: '/recent', color: 'text-blue-500' },
    { icon: Calendar, label: '课表', path: '/schedule', color: 'text-green-500' },
    { icon: Sparkles, label: '推荐', path: '/recommend', color: 'text-yellow-500' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive(item.path) 
                    ? 'text-primary-500' 
                    : 'text-gray-400 hover:text-primary-400'
                }`}
              >
                <Icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                <span className={`text-xs mt-0.5 ${isActive(item.path) ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
          
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              showMore ? 'text-primary-500' : 'text-gray-400 hover:text-primary-400'
            }`}
          >
            <Menu size={22} />
            <span className={`text-xs mt-0.5 ${showMore ? 'font-bold' : 'font-medium'}`}>更多</span>
          </button>
        </div>

        {showMore && (
          <div className="absolute bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl rounded-t-3xl animate-slide-up">
            <div className="p-4 grid grid-cols-4 gap-2">
              {moreNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setShowMore(false)
                    }}
                    className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                      isActive(item.path) 
                        ? 'bg-gray-100' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={24} className={item.color || 'text-gray-600'} />
                    <span className="text-xs mt-1 font-medium text-gray-700">{item.label}</span>
                  </button>
                )
              })}
            </div>
            
            <div className="px-4 pb-4">
              <button
                onClick={() => setShowMore(false)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                收起菜单 ↑
              </button>
            </div>
          </div>
        )}
      </nav>

      <nav className="hidden lg:flex fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
            {[...mainNavItems, ...moreNavItems].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
