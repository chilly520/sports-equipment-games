import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Heart, Users, Clock, Star, AlertCircle } from 'lucide-react'
import { equipmentData } from '@/data/equipmentData'
import { useFavoriteStore } from '@/stores/usePersistStores'
import { useRecentStore } from '@/stores/usePersistStores'
import { motion } from 'framer-motion'

export function GameDetailPage() {
  const { equipmentId, gameId } = useParams()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const { addRecent } = useRecentStore()
  const [hasAddedRecent, setHasAddedRecent] = useState(false)

  const equipment = equipmentData.find(eq => eq.id === equipmentId)
  const game = equipment?.games.find(g => g.id === gameId)

  useEffect(() => {
    if (game && equipment && !hasAddedRecent) {
      addRecent({
        gameId: game.id,
        gameName: game.name,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        equipmentIcon: equipment.icon,
      })
      setHasAddedRecent(true)
    }
  }, [game, equipment, addRecent, hasAddedRecent])

  if (!equipment || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center pb-24 lg:pb-0 pt-20">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">玩法不存在</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-primary-500 text-white rounded-xl"
          >
            返回
          </button>
        </div>
      </div>
    )
  }

  const favorite = isFavorite(game.id)

  const difficultyConfig = {
    easy: { label: '简单', color: 'bg-green-500', textColor: 'text-green-600', bgLight: 'bg-green-50' },
    medium: { label: '中等', color: 'bg-yellow-500', textColor: 'text-yellow-600', bgLight: 'bg-yellow-50' },
    hard: { label: '困难', color: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50' }
  }

  const diff = difficultyConfig[game.difficulty]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24 lg:pb-0 pt-16 lg:pt-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>

        {/* 头部信息 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{equipment.icon}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${diff.bgLight} ${diff.textColor}`}>
                  {diff.label}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{game.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{equipment.name}</p>
            </div>
            <button
              onClick={() => toggleFavorite(game.id)}
              className={`p-3 rounded-full transition-all ${
                favorite 
                  ? 'bg-red-100 text-red-500' 
                  : 'bg-gray-100 text-gray-400 hover:text-red-400'
              }`}
            >
              <Heart size={24} className={favorite ? 'fill-current' : ''} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className={`${diff.bgLight} rounded-xl p-3 text-center`}>
              <Users className={`w-5 h-5 ${diff.textColor} mx-auto mb-1`} />
              <div className="text-xs text-gray-500">适合人数</div>
              <div className="font-bold text-gray-800 text-sm">{game.playerCount}</div>
            </div>
            
            <div className={`${diff.bgLight} rounded-xl p-3 text-center`}>
              <Clock className={`w-5 h-5 ${diff.textColor} mx-auto mb-1`} />
              <div className="text-xs text-gray-500">建议时长</div>
              <div className="font-bold text-gray-800 text-sm">{game.duration}</div>
            </div>
            
            <div className={`${diff.bgLight} rounded-xl p-3 text-center`}>
              <Star className={`w-5 h-5 ${diff.textColor} mx-auto mb-1`} />
              <div className="text-xs text-gray-500">适用年龄</div>
              <div className="font-bold text-gray-800 text-sm">{game.ageRange}</div>
            </div>
          </div>
        </div>

        {/* 游戏步骤 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
            游戏步骤
          </h2>
          {game.steps && game.steps.length > 0 ? (
            <div className="space-y-3">
              {game.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed pt-0.5">{step}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">暂无步骤说明</p>
          )}
        </div>

        {/* 教学要点 */}
        {game.tips && game.tips.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              教学要点 & 小贴士
            </h2>
            <div className="space-y-2">
              {game.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200"
                >
                  <span className="text-yellow-500 mt-0.5">💡</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 其他玩法 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            其他 {equipment.name} 玩法
          </h2>
          <div className="space-y-2">
            {equipment.games.filter(g => g.id !== game.id).slice(0, 3).map((otherGame) => (
              <button
                key={otherGame.id}
                onClick={() => navigate(`/games/${equipment.id}/${otherGame.id}`)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
              >
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  otherGame.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  otherGame.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {otherGame.difficulty === 'easy' ? '简单' : otherGame.difficulty === 'medium' ? '中等' : '困难'}
                </span>
                <span className="flex-1 text-gray-700 truncate">{otherGame.name}</span>
                <ArrowLeft size={16} className="text-gray-400 rotate-180" />
              </button>
            ))}
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="mt-6 pb-6">
          <button
            onClick={() => navigate('/timer')}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          >
            🎯 开始上课！
          </button>
        </div>
      </div>
    </div>
  )
}
