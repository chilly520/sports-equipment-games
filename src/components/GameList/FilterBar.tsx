import { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { motion, AnimatePresence } from 'framer-motion'

type FilterType = 'all' | 'difficulty' | 'category' | 'equipment'

export function FilterBar() {
  const { equipments, activeFilter, setActiveFilter } = useAppStore()
  const [filterType, setFilterType] = useState<FilterType>('all')

  const difficultyFilters = [
    { id: 'difficulty-easy', name: '简单', color: '#10B981' },
    { id: 'difficulty-medium', name: '中等', color: '#F59E0B' },
    { id: 'difficulty-hard', name: '困难', color: '#EF4444' }
  ]

  const categoryFilters = [
    { id: 'category-regular', name: '常规教具', color: '#3B82F6' },
    { id: 'category-inflatable', name: '大型气模', color: '#8B5CF6' }
  ]

  const equipmentFilters = equipments.map(eq => ({
    id: eq.id,
    name: eq.name,
    color: eq.color
  }))

  const getCurrentFilters = () => {
    switch (filterType) {
      case 'difficulty':
        return difficultyFilters
      case 'category':
        return categoryFilters
      case 'equipment':
        return equipmentFilters
      default:
        return []
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm font-semibold text-gray-600">📋 分类筛选</span>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{equipments.length}种教具</span>
      </div>

      {/* 筛选类型切换 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => { setFilterType('all'); setActiveFilter('all') }}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            filterType === 'all'
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilterType('difficulty')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            filterType === 'difficulty'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          🎯 难度等级
        </button>
        <button
          onClick={() => setFilterType('category')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            filterType === 'category'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          📦 教具类别
        </button>
        <button
          onClick={() => setFilterType('equipment')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            filterType === 'equipment'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          🏷️ 具体教具
        </button>
      </div>

      {/* 动态筛选内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filterType}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {filterType === 'all' && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full text-center py-4 text-gray-400 bg-gray-50 rounded-xl"
            >
              显示全部 {equipments.length} 种教具的玩法
            </motion.div>
          )}

          {getCurrentFilters().map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                activeFilter === filter.id
                  ? 'text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              style={{
                backgroundColor: activeFilter === filter.id ? filter.color : undefined
              }}
            >
              {filter.name}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 当前选中提示 */}
      {activeFilter !== 'all' && filterType !== 'all' && (
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>当前筛选：{getCurrentFilters().find(f => f.id === activeFilter)?.name}</span>
          <button
            onClick={() => { setFilterType('all'); setActiveFilter('all') }}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            清除筛选
          </button>
        </div>
      )}
    </div>
  )
}
