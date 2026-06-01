import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppStore } from '@/stores/useAppStore'
import { EquipmentCard } from '@/components/GameList/EquipmentCard'
import { FilterBar } from '@/components/GameList/FilterBar'

export function GamesPage() {
  const [searchParams] = useSearchParams()
  const initialFilter = searchParams.get('filter') || 'all'
  
  const { filteredEquipments, activeFilter, setActiveFilter } = useAppStore()
  
  useEffect(() => {
    if (initialFilter !== 'all') {
      setActiveFilter(initialFilter)
    }
  }, [initialFilter, setActiveFilter])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pb-24 lg:pb-0 pt-20 lg:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2 sm:gap-3 flex-wrap">
            📚 玩法百科全书
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-1">
            点击任意教具卡片查看该器材的所有创新玩法！
          </p>
        </div>

        <FilterBar />

        <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredEquipments.map((equipment) => (
            <EquipmentCard 
              key={equipment.id} 
              equipment={equipment}
            />
          ))}
        </div>

        {filteredEquipments.length === 0 && (
          <div className="text-center py-20 px-4">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg sm:text-xl">没有找到相关教具</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-6 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              查看全部教具
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
