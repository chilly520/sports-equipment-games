import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Clock, Star, AlertCircle, Heart } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { useFavoriteStore } from '@/stores/usePersistStores'
import { useRecentStore } from '@/stores/usePersistStores'
import { equipmentData } from '@/data/equipmentData'

export function GameModal() {
  const { isModalOpen, selectedGame, closeModal } = useAppStore()
  const { toggleFavorite, isFavorite } = useFavoriteStore()
  const { addRecent } = useRecentStore()

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
      
      if (selectedGame) {
        const equipment = equipmentData.find(eq => 
          eq.games.some(g => g.id === selectedGame.id)
        )
        
        if (equipment) {
          addRecent({
            gameId: selectedGame.id,
            gameName: selectedGame.name,
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            equipmentIcon: equipment.icon,
          })
        }
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, closeModal, selectedGame, addRecent])

  if (!selectedGame) return null

  const favorite = isFavorite(selectedGame.id)

  const difficultyConfig = {
    easy: { label: '简单', color: 'bg-green-500', textColor: 'text-green-600', bgLight: 'bg-green-50' },
    medium: { label: '中等', color: 'bg-yellow-500', textColor: 'text-yellow-600', bgLight: 'bg-yellow-50' },
    hard: { label: '困难', color: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50' }
  }

  const diff = difficultyConfig[selectedGame.difficulty]

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] mx-auto max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-800 truncate">{selectedGame.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${diff.bgLight} ${diff.textColor} flex-shrink-0`}>
                  {diff.label}
                </span>
              </div>
              
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => toggleFavorite(selectedGame.id)}
                  className={`p-2.5 rounded-full transition-all ${
                    favorite 
                      ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-400'
                  }`}
                  title={favorite ? '取消收藏' : '添加收藏'}
                >
                  <Heart size={20} className={favorite ? 'fill-current' : ''} />
                </button>
                
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className={`${diff.bgLight} rounded-xl p-4 text-center`}>
                  <Users className={`w-6 h-6 ${diff.textColor} mx-auto mb-2`} />
                  <div className="text-sm text-gray-500">适合人数</div>
                  <div className="font-bold text-gray-800">{selectedGame.playerCount}</div>
                </div>
                
                <div className={`${diff.bgLight} rounded-xl p-4 text-center`}>
                  <Clock className={`w-6 h-6 ${diff.textColor} mx-auto mb-2`} />
                  <div className="text-sm text-gray-500">建议时长</div>
                  <div className="font-bold text-gray-800">{selectedGame.duration}</div>
                </div>
                
                <div className={`${diff.bgLight} rounded-xl p-4 text-center`}>
                  <Star className={`w-6 h-6 ${diff.textColor} mx-auto mb-2`} />
                  <div className="text-sm text-gray-500">适用年龄</div>
                  <div className="font-bold text-gray-800">{selectedGame.ageRange}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                  游戏步骤
                </h3>
                <div className="space-y-3">
                  {selectedGame.steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <span className="flex-shrink-0 w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed pt-0.5">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                  教学要点 & 小贴士
                </h3>
                <div className="space-y-2">
                  {selectedGame.tips.map((tip, index) => (
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
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button
                onClick={closeModal}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                我知道了，开始上课！🎉
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
