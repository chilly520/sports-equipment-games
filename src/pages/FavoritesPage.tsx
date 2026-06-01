import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Trash2, ArrowLeft, Gamepad2 } from 'lucide-react'
import { useFavoriteStore } from '@/stores/usePersistStores'
import { equipmentData } from '@/data/equipmentData'
import { motion, AnimatePresence } from 'framer-motion'

export function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteGameIds, toggleFavorite, isFavorite, clearFavorites } = useFavoriteStore()
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const favoriteGames = equipmentData
    .flatMap(eq => eq.games.map(game => ({ ...game, equipment: eq })))
    .filter(game => favoriteGameIds.includes(game.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 pb-24 lg:pb-0 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            我的收藏
          </h1>
        </div>

        {favoriteGames.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Heart size={80} className="mx-auto mb-4 text-gray-200" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">还没有收藏</h2>
            <p className="text-gray-400 mb-6">浏览玩法时点击 ❤️ 即可收藏喜欢的游戏</p>
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              去发现好玩的 →
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">共 {favoriteGames.length} 个收藏</span>
              <button
                onClick={() => setShowConfirmClear(true)}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <Trash2 size={14} />
                清空全部
              </button>
            </div>

            <AnimatePresence>
              {showConfirmClear && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4"
                >
                  <p className="text-red-700 text-sm mb-3">确定要清空所有收藏吗？此操作不可撤销。</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        clearFavorites()
                        setShowConfirmClear(false)
                      }}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                    >
                      确认清空
                    </button>
                    <button
                      onClick={() => setShowConfirmClear(false)}
                      className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      取消
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {favoriteGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{game.equipment.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">{game.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          game.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {game.difficulty === 'easy' ? '简单' : game.difficulty === 'medium' ? '中等' : '困难'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{game.equipment.name} · {game.ageRange} · {game.duration}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{game.steps[0]}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(game.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Heart size={18} className="fill-current" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
