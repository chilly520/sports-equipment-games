import { useCallback, useRef } from 'react'
import { Equipment } from '@/types'

interface UseWheelSpinReturn {
  spin: () => Promise<number>
}

export function useWheelSpin(equipments: Equipment[]): UseWheelSpinReturn {
  const isSpinningRef = useRef(false)

  const spin = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      if (isSpinningRef.current || equipments.length === 0) {
        resolve(0)
        return
      }

      isSpinningRef.current = true
      
      const spins = 5 + Math.random() * 3
      const extraDegrees = Math.random() * 360
      const totalDegrees = spins * 360 + extraDegrees
      
      const duration = 4000 + Math.random() * 2000
      const startTime = Date.now()
      const startRotation = 0

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentRotation = startRotation + totalDegrees * easeOutQuart

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          isSpinningRef.current = false
          const finalAngle = currentRotation % 360
          const sliceAngle = 360 / equipments.length
          const adjustedAngle = (360 - finalAngle + 90) % 360
          const selectedIndex = Math.floor(adjustedAngle / sliceAngle) % equipments.length
          resolve(selectedIndex)
        }
      }

      requestAnimationFrame(animate)
    })
  }, [equipments])

  return { spin }
}
