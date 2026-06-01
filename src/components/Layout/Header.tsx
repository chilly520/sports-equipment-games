import { useState } from 'react'
import { BookOpen, X, Clock, Heart, History, Calendar, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-12">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 font-display">体育教具玩法大全</h1>
                <p className="text-xs text-gray-500 hidden sm:block">让每节课都充满新鲜感</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors text-sm font-medium"
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">使用说明</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showHelp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-x-4 bottom-24 lg:bottom-auto lg:top-20 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:max-w-lg bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl z-50 p-6 max-h-[70vh] lg:max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 -mt-2 -mx-6 px-6 z-10">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  📖 使用说明
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">🎡</span> 幸运转盘
                  </h3>
                  <p className="text-gray-600">点击"开始转动"按钮，转盘会随机选择一个教具，帮你快速决定今天玩什么！</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">📚</span> 玩法百科
                  </h3>
                  <p className="text-gray-600">浏览22种教具的完整玩法。点击顶部标签筛选，点击卡片展开查看所有玩法，点击玩法名称进入详情页。</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    计时器（重要！）
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>计时模式：</strong>点击开始计时，每到一个计时点按"+分段"记录成绩，计时继续不停止。</p>
                    <p><strong>倒计时模式：</strong>设置时长后开始倒计时，到0时自动提示。</p>
                    <p className="text-xs text-gray-500">💡 适用于多人跑步计时：每人到达计时点时按+分段，记录各自的成绩。</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl border border-pink-100">
                  <h3 className="font-bold text-pink-800 mb-2 flex items-center gap-2">
                    <Heart size={18} className="text-pink-600" />
                    我的收藏
                  </h3>
                  <p className="text-gray-600">点击玩法详情页的红心按钮收藏喜欢的玩法，方便以后快速访问。</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                  <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                    <History size={18} className="text-purple-600" />
                    最近浏览
                  </h3>
                  <p className="text-gray-600">自动记录最近查看的玩法，最多保存20条。方便快速回到之前看过的内容。</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                  <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-yellow-600" />
                    课表计划器
                  </h3>
                  <p className="text-gray-600">提前规划一周的体育课安排。选择日期、时间段、教具和玩法，添加到课表中。</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                  <h3 className="font-bold text-cyan-800 mb-2 flex items-center gap-2">
                    <Sparkles size={18} className="text-cyan-600" />
                    今日推荐
                  </h3>
                  <p className="text-gray-600">每天随机推荐3个教具，点击"换一批"刷新推荐。查看TOP5最常用的教具统计。</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-2">📱 底部导航</h3>
                  <p className="text-gray-600">底部导航栏包含：首页、转盘、玩法库、计时器，点击"更多"展开收藏、最近、课表、推荐。</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  开始使用！🚀
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
