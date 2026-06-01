import { useMemo } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { EquipmentCard } from './EquipmentCard'
import { motion, AnimatePresence } from 'framer-motion'

export function GameList() {
  const { equipments, activeFilter } = useAppStore()

  const filteredEquipments = useMemo(() => {
    if (activeFilter === 'all') return equipments
    return equipments.filter(eq => eq.id === activeFilter)
  }, [equipments, activeFilter])

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredEquipments.map((equipment, index) => (
            <motion.div
              key={equipment.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <EquipmentCard equipment={equipment} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredEquipments.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">🔍</div>
          <p>没有找到相关教具</p>
        </div>
      )}
    </div>
  )
}
