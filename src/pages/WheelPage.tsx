import { Wheel } from '@/components/Wheel/Wheel'

export function WheelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-50 pb-24 lg:pb-0 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2 sm:gap-3">
            🎡 幸运转盘
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            点击按钮开始转动，随机选择今天的游戏内容！
          </p>
        </div>

        <div className="flex justify-center">
          <Wheel />
        </div>
      </div>
    </div>
  )
}
