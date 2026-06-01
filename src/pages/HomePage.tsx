import { Link } from 'react-router-dom'
import { Dice6, List, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { equipmentData } from '@/data/equipmentData'

export function HomePage() {
  const regularEquipments = equipmentData.slice(0, 11)
  const inflatableEquipments = equipmentData.slice(11)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 pb-24 lg:pb-0 pt-20 lg:pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-4xl sm:text-5xl">🎯</span>
            体育教具玩法大全
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            让每节体育课都充满新鲜感！收录 <span className="font-bold text-primary-500">{equipmentData.length}种</span> 教具，
            <span className="font-bold text-secondary-500"> {equipmentData.reduce((sum, eq) => sum + eq.games.length, 0)}种</span> 创新玩法
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Link
            to="/wheel"
            className="group bg-white rounded-2xl p-5 sm:p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary-300 active:scale-[0.98]"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-400 to-orange-500 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Dice6 size={28} className="sm:size-[32] text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">🎡 幸运转盘</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">不知道玩什么？让转盘帮你决定！</p>
            <div className="flex items-center text-primary-500 font-medium text-sm sm:text-base group-hover:gap-3 transition-all">
              开始转动 <ArrowRight size={16} className="sm:size-[18]" />
            </div>
          </Link>

          <Link
            to="/games"
            className="group bg-white rounded-2xl p-5 sm:p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-secondary-300 active:scale-[0.98]"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary-400 to-green-500 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <List size={28} className="sm:size-[32] text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">📚 玩法百科</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">浏览所有教具的详细玩法说明</p>
            <div className="flex items-center text-secondary-500 font-medium text-sm sm:text-base group-hover:gap-3 transition-all">
              探索玩法 <ArrowRight size={16} className="sm:size-[18]" />
            </div>
          </Link>

          <Link
            to="/timer"
            className="group bg-white rounded-2xl p-5 sm:p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-300 active:scale-[0.98]"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Clock size={28} className="sm:size-[32] text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">⏱️ 计时器</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">计时/倒计时，掌控课堂节奏</p>
            <div className="flex items-center text-blue-500 font-medium text-sm sm:text-base group-hover:gap-3 transition-all">
              打开计时器 <ArrowRight size={16} className="sm:size-[18]" />
            </div>
          </Link>
        </div>

        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <Sparkles className="text-yellow-500 w-5 h-5 sm:w-6 sm:h-6" />
            常规教具 ({regularEquipments.length}种)
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {regularEquipments.map((eq) => (
              <Link
                key={eq.id}
                to={`/games?filter=${eq.id}`}
                className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all text-center group active:scale-[0.97]"
                style={{ borderTop: `3px solid ${eq.color}` }}
              >
                <div className="text-3xl sm:text-4xl mb-1.5 sm:mb-2 group-hover:scale-125 transition-transform inline-block">
                  {eq.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-xs sm:text-sm truncate">{eq.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{eq.games.length}个玩法</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🎪</span>
            大型气模教具 ({inflatableEquipments.length}种)
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {inflatableEquipments.map((eq) => (
              <Link
                key={eq.id}
                to={`/games?filter=${eq.id}`}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all text-center group border border-purple-100 active:scale-[0.97]"
              >
                <div className="text-3xl sm:text-4xl mb-1.5 sm:mb-2 group-hover:scale-125 transition-transform inline-block">
                  {eq.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-xs sm:text-sm truncate">{eq.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{eq.games.length}个玩法</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
