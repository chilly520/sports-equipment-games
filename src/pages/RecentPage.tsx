import { useNavigate } from 'react-router-dom'
import { Clock, ArrowLeft, Trash2 } from 'lucide-react'
import { useRecentStore } from '@/stores/usePersistStores'
import { equipmentData } from '@/data/equipmentData'
import { motion } from 'framer-motion'

export function RecentPage() {
  const navigate = useNavigate()
  const { recentItems, clearRecent } = useRecentStore()

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - timestamp
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24 lg:pb-0 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-8 h-8 text-blue-500" />
              最近浏览
            </h1>
          </div>
          
          {recentItems.length > 0 && (
            <button
              onClick={() => {
                if (confirm('确定要清空浏览历史吗？')) {
                  clearRecent()
                }
              }}
              className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
            >
              <Trash2 size={14} />
              清空
            </button>
          )}
        </div>

        {recentItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Clock size={80} className="mx-auto mb-4 text-gray-200" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">暂无浏览记录</h2>
            <p className="text-gray-400 mb-6">查看玩法详情后会自动记录在这里</p>
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              去探索玩法 →
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {recentItems.map((item, index) => (
              <motion.button
                key={`${item.gameId}-${item.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => navigate(`/games?filter=${item.equipmentId}`)}
                className="w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg">
                    {item.equipmentIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{item.gameName}</h3>
                    <p className="text-sm text-gray-500 truncate">{item.equipmentName}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
