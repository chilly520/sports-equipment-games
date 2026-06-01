import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, RefreshCw, TrendingUp, Dice6 } from 'lucide-react'
import { equipmentData } from '@/data/equipmentData'
import { useUsageStatsStore } from '@/stores/usePersistStores'
import { motion } from 'framer-motion'

export function TodayRecommendPage() {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<typeof equipmentData>([])
  const { stats, getTopUsed } = useUsageStatsStore()

  useEffect(() => {
    generateRecommendations()
  }, [])

  const generateRecommendations = () => {
    const shuffled = [...equipmentData].sort(() => Math.random() - 0.5)
    setRecommendations(shuffled.slice(0, 3))
  }

  const topUsed = getTopUsed(5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 pb-24 lg:pb-0 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Sparkles size={48} className="text-yellow-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🌟 今日推荐</h1>
          <p className="text-gray-600">每天为你精选3个教具，让课堂充满新鲜感！</p>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Dice6 className="text-orange-500" />
              今日幸运推荐
            </h2>
            <button
              onClick={generateRecommendations}
              className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              换一批
            </button>
          </div>

          <div className="grid gap-4">
            {recommendations.map((equipment, index) => (
              <motion.button
                key={equipment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                onClick={() => navigate(`/games?filter=${equipment.id}`)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-left group"
                style={{ borderTop: `4px solid ${equipment.color}` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform">
                    {equipment.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">
                        #{index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800">{equipment.name}</h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{equipment.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {equipment.games.slice(0, 3).map(game => (
                        <span
                          key={game.id}
                          className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs"
                        >
                          {game.name}
                        </span>
                      ))}
                      {equipment.games.length > 3 && (
                        <span className="px-2.5 py-1 bg-gray-50 text-gray-400 rounded-full text-xs">
                          +{equipment.games.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    共 {equipment.games.length} 种玩法等你探索
                  </span>
                  <span className="text-primary-500 font-medium text-sm group-hover:gap-2 transition-all flex items-center">
                    查看全部 →
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {topUsed.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <TrendingUp className="text-green-500" />
              最常使用 TOP {topUsed.length}
            </h2>
            <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">
              {topUsed.map((stat, index) => (
                <motion.button
                  key={stat.equipmentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/games?filter=${stat.equipmentId}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className="text-2xl">{stat.equipmentIcon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-800">{stat.equipmentName}</div>
                    <div className="text-xs text-gray-400">使用了 {stat.count} 次</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-500">{stat.count}</div>
                    <div className="text-xs text-gray-400">次</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/wheel')}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Dice6 size={20} />
            还是用转盘随机选吧！
          </button>
        </div>
      </div>
    </div>
  )
}
