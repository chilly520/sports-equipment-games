import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Equipment, Game } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X, Heart } from 'lucide-react'
import { useFavoriteStore } from '@/stores/usePersistStores'

interface EquipmentCardProps {
  equipment: Equipment
  compact?: boolean
  onClickGame?: (game: Game) => void
}

export const EquipmentCard = memo(function EquipmentCard({ equipment, compact = false, onClickGame }: EquipmentCardProps) {
  const navigate = useNavigate()
  const [showAllGames, setShowAllGames] = useState(false)
  const { toggleFavorite, isFavorite } = useFavoriteStore()

  const handleGameClick = (game: Game) => {
    if (onClickGame) {
      onClickGame(game)
    } else {
      navigate(`/games/${equipment.id}/${game.id}`)
    }
  }

  const handleCardClick = () => {
    if (!showAllGames) {
      setShowAllGames(true)
    }
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {equipment.games.slice(0, 3).map((game) => (
          <button
            key={game.id}
            onClick={() => handleGameClick(game)}
            className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">{game.name}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                game.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {game.difficulty === 'easy' ? '简单' : 
                 game.difficulty === 'medium' ? '中等' : '困难'}
              </span>
            </div>
          </button>
        ))}
        {equipment.games.length > 3 && !showAllGames && (
          <button
            onClick={() => setShowAllGames(true)}
            className="w-full text-center text-sm text-primary-500 hover:text-primary-600 font-medium py-2"
          >
            查看全部 {equipment.games.length} 种玩法 →
          </button>
        )}
        
        <AnimatePresence>
          {showAllGames && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-800">{equipment.name} - 全部玩法</span>
                <button 
                  onClick={() => setShowAllGames(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
              
              {equipment.games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    handleGameClick(game)
                    setShowAllGames(false)
                  }}
                  className="w-full text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-medium text-gray-800">{game.name}</span>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{game.steps[0]}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{game.ageRange}</span>
                    <span>·</span>
                    <span>{game.playerCount}</span>
                    <span>·</span>
                    <span>{game.duration}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded font-medium ${
                      game.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {game.difficulty === 'easy' ? '简单' : game.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div 
        className="cursor-pointer"
        onClick={handleCardClick}
      >
        <div 
          className="h-24 flex items-center justify-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${equipment.color}20, ${equipment.color}40)` }}
        >
          <div className="text-6xl transform hover:scale-110 transition-transform duration-300">
            {equipment.icon}
          </div>
          <div 
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
            style={{ backgroundColor: equipment.color }}
          >
            {equipment.games.length}个玩法
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{equipment.name}</h3>
          <p className="text-sm text-gray-500 mb-3">{equipment.description}</p>
          
          <div className="flex flex-wrap gap-1.5">
            {equipment.games.slice(0, 3).map((game) => (
              <span
                key={game.id}
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  game.difficulty === 'easy' ? 'bg-green-50 text-green-600 border border-green-200' :
                  game.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                  'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {game.name}
              </span>
            ))}
            {equipment.games.length > 3 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                +{equipment.games.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAllGames && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-xl">{equipment.icon}</span>
                  全部 {equipment.games.length} 种玩法
                </span>
                <button 
                  onClick={() => setShowAllGames(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>
              
              {equipment.games.map((game, index) => {
                const gameFavorite = isFavorite(game.id)
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <button
                      onClick={() => {
                        handleGameClick(game)
                        setShowAllGames(false)
                      }}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{game.name}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              game.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {game.difficulty === 'easy' ? '简单' : game.difficulty === 'medium' ? '中等' : '困难'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">{game.steps[0]}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                            <span>👥 {game.playerCount}</span>
                            <span>⏱️ {game.duration}</span>
                            <span>🎂 {game.ageRange}</span>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-primary-400 flex-shrink-0 mt-1" />
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(game.id)
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        gameFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
                      }`}
                    >
                      <Heart size={18} className={gameFavorite ? 'fill-current' : ''} />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})
