import { useEffect, useRef } from 'react'
import { Equipment } from '@/types'

interface WheelCanvasProps {
  equipments: Equipment[]
  rotation: number
  selectedIndex: number | null
  size?: number
}

const COLORS = [
  '#FF6B35', '#06D6A0', '#118AB2', '#FFD166', '#EF476F',
  '#7209B7', '#F77F00', '#06A77D', '#E63946', '#457B9D',
  '#2A9D8F'
]

export function WheelCanvas({ equipments, rotation, selectedIndex, size = 350 }: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2
    const radius = (size / 2) - 10

    ctx.clearRect(0, 0, size, size)

    if (equipments.length === 0) {
      ctx.fillStyle = '#f3f4f6'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fill()
      return
    }

    const sliceAngle = (2 * Math.PI) / equipments.length

    equipments.forEach((equipment, index) => {
      const startAngle = index * sliceAngle + (rotation * Math.PI / 180)
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      const isSelected = index === selectedIndex
      if (isSelected) {
        ctx.fillStyle = COLORS[index % COLORS.length]
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 15
      } else {
        ctx.fillStyle = COLORS[index % COLORS.length] + 'CC'
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }
      
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.font = size < 280 ? 'bold 10px Inter, sans-serif' : 'bold 14px Inter, sans-serif'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 3
      const text = equipment.name.length > 6 ? equipment.name.substring(0, 6) + '..' : equipment.name
      ctx.fillText(`${equipment.icon} ${text}`, radius - 20, 0)
      ctx.restore()
    })

    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI)
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 3
    ctx.stroke()

    if (selectedIndex !== null && equipments[selectedIndex]) {
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.fillStyle = '#374151'
      ctx.font = size < 280 ? 'bold 10px Inter, sans-serif' : 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const shortName = equipments[selectedIndex].name.length > 4 
        ? equipments[selectedIndex].name.substring(0, 4) + '..' 
        : equipments[selectedIndex].name
      ctx.fillText(shortName, 0, 0)
      ctx.restore()
    }

  }, [equipments, rotation, selectedIndex, size])

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        width: '100%', 
        maxWidth: size, 
        aspectRatio: '1 / 1',
        display: 'block'
      }}
      className="drop-shadow-2xl mx-auto"
    />
  )
}
