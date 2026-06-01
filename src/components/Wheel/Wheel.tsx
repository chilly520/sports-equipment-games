import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/useAppStore'
import { useWheelSpin } from '@/hooks/useWheelSpin'
import { WheelCanvas } from './WheelCanvas'
import { EquipmentCard } from '@/components/GameList/EquipmentCard'
import { motion, AnimatePresence } from 'framer-motion'

export function Wheel() {
  const navigate = useNavigate()
  const { equipments, isSpinning, setIsSpinning } = useAppStore()
  const [rotation, setRotation] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const { spin } = useWheelSpin(equipments)

  const handleSpin = useCallback(async () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    setSelectedIndex(null)
    
    const startTime = Date.now()
    const duration = 5000
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentRotation = easeOutQuart * (360 * (5 + Math.random() * 3) + Math.random() * 360)
      setRotation(currentRotation)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
    
    const result = await spin()
    
    setTimeout(() => {
      const finalAngle = rotation % 360
      const sliceAngle = 360 / equipments.length
      const adjustedAngle = (360 - finalAngle + 90) % 360
      const calculatedIndex = Math.floor(adjustedAngle / sliceAngle) % equipments.length
      setSelectedIndex(calculatedIndex)
      setIsSpinning(false)
    }, 500)
  }, [isSpinning, setIsSpinning, spin, rotation, equipments.length])

  const handleViewGames = useCallback(() => {
    if (selectedIndex !== null && equipments[selectedIndex]) {
      const equipment = equipments[selectedIndex]
      if (equipment.games.length > 0) {
        navigate(`/games/${equipment.id}/${equipment.games[0].id}`)
      }
    }
  }, [selectedIndex, equipments, navigate])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-red-500 drop-shadow-lg" />
        </div>
        
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: 'center center' }}
        >
          <WheelCanvas
            equipments={equipments}
            rotation={rotation}
            selectedIndex={selectedIndex}
            size={350}
          />
        </motion.div>
      </div>

      <motion.button
        onClick={handleSpin}
        disabled={isSpinning}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all ${
          isSpinning
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'bg-gradient-to-r from-primary-500 to-orange-600 text-white hover:shadow-2xl hover:from-primary-600 hover:to-orange-700'
        }`}
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            转动中...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            🎯 开始转动！
          </span>
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {selectedIndex !== null && !isSpinning && equipments[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-opacity-20"
                 style={{ borderColor: equipments[selectedIndex].color }}>
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{equipments[selectedIndex].icon}</div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {equipments[selectedIndex].name}
                </h3>
                <p className="text-gray-500 mt-1">{equipments[selectedIndex].description}</p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  🎮 共 {equipments[selectedIndex].games.length} 种玩法
                </span>
                <button
                  onClick={handleViewGames}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: equipments[selectedIndex].color }}
                >
                  查看玩法 →
                </button>
              </div>

              <EquipmentCard 
                equipment={equipments[selectedIndex]} 
                compact 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
