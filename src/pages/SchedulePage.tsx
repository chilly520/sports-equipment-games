import { useState } from 'react'
import { Calendar, Plus, X, Clock, Trash2, Save, Edit3, MessageSquare } from 'lucide-react'
import { useScheduleStore } from '@/stores/usePersistStores'
import { equipmentData } from '@/data/equipmentData'
import { motion, AnimatePresence } from 'framer-motion'

const DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const PRESET_TIME_SLOTS = [
  '第1节 08:00-08:40',
  '第2节 08:50-09:30',
  '第3节 10:00-10:40',
  '第4节 10:50-11:30',
  '第5节 14:00-14:40',
  '第6节 14:50-15:30',
  '第7节 16:00-16:40',
  '第8节 16:50-17:30',
]

export function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
  const [showAddModal, setShowAddModal] = useState(false)
  const [isCustomTime, setIsCustomTime] = useState(false)
  const [customTimeStart, setCustomTimeStart] = useState('09:00')
  const [customTimeEnd, setCustomTimeEnd] = useState('09:40')
  const [newItem, setNewItem] = useState({
    timeSlot: PRESET_TIME_SLOTS[0],
    gameId: '',
    equipmentId: '',
    note: '',
  })
  
  const { scheduleItems, addItem, deleteItem, getScheduleByDay } = useScheduleStore()
  
  const daySchedule = getScheduleByDay(selectedDay)

  const handleAddItem = () => {
    if (!newItem.gameId || !newItem.equipmentId) return
    
    let finalTimeSlot = newItem.timeSlot
    if (isCustomTime && customTimeStart && customTimeEnd) {
      finalTimeSlot = `自定义 ${customTimeStart}-${customTimeEnd}`
    }
    
    const equipment = equipmentData.find(eq => eq.id === newItem.equipmentId)
    const game = equipment?.games.find(g => g.id === newItem.gameId)
    
    if (equipment && game) {
      addItem({
        dayOfWeek: selectedDay,
        timeSlot: finalTimeSlot,
        gameName: game.name,
        equipmentName: equipment.name,
        equipmentIcon: equipment.icon,
        color: equipment.color,
        note: newItem.note || undefined,
      })
      
      setNewItem({ timeSlot: PRESET_TIME_SLOTS[0], gameId: '', equipmentId: '', note: '' })
      setIsCustomTime(false)
      setCustomTimeStart('09:00')
      setCustomTimeEnd('09:40')
      setShowAddModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-24 lg:pb-0 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
            <span>课表计划器</span>
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95"
          >
            <Plus size={18} />
            添加课程
          </button>
        </div>

        {/* 日期选择器 */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm text-gray-500">左右滑动选择日期</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            </div>
          </div>
          
          <div 
            className="flex gap-2 overflow-x-auto snap-x snap-mandatory"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingLeft: '4px',
              paddingRight: '4px'
            }}
          >
            {DAYS.map((day, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedDay(index)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 snap-center px-5 py-3 rounded-xl font-medium transition-all ${
                  selectedDay === index
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow border border-gray-100'
                }`}
                style={{ minWidth: '72px' }}
              >
                <span className="text-sm sm:text-base">{day}</span>
              </motion.button>
            ))}
          </div>
          
          <div className="flex justify-center mt-3">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                animate={{ 
                  width: '14.28%',
                  x: `${selectedDay * 14.28}%`
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* 课程列表 */}
        <div className="space-y-3">
          {[...PRESET_TIME_SLOTS, ...daySchedule.filter(i => i.timeSlot.startsWith('自定义')).map(i => i.timeSlot)].map((slot) => {
            const item = daySchedule.find(i => i.timeSlot === slot)
            
            return (
              <div
                key={slot}
                className={`rounded-xl p-4 transition-all active:scale-[0.98] ${
                  item 
                    ? 'shadow-md' 
                    : 'bg-white/60 border-2 border-dashed border-gray-200'
                }`}
                style={item ? { backgroundColor: item.color + '15', borderColor: item.color + '30' } : {}}
              >
                <div className="flex items-start gap-2 sm:gap-3 min-h-[56px]">
                  <Clock size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-600 text-xs sm:text-sm mb-1">{slot}</div>
                    
                    {item && (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-xl sm:text-2xl flex-shrink-0">{item.equipmentIcon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-gray-800 text-sm sm:text-base truncate">{item.gameName}</div>
                            <div className="text-xs text-gray-500 truncate">{item.equipmentName}</div>
                            {item.note && (
                              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium max-w-full">
                                <MessageSquare size={12} className="flex-shrink-0" />
                                <span className="truncate">{item.note}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {item && (
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {daySchedule.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              📅 {DAYS[selectedDay]} 已安排 <span className="font-bold text-lg mx-1">{daySchedule.length}</span> 节课
            </p>
          </div>
        )}

        {/* 添加课程弹窗 */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">添加课程安排</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={22} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* 时间段选择 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      选择时间段
                    </label>
                    
                    {/* 预设/自定义切换 */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setIsCustomTime(false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          !isCustomTime ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        预设时段
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCustomTime(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isCustomTime ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Edit3 size={12} className="inline mr-1" />
                        自定义
                      </button>
                    </div>

                    {!isCustomTime ? (
                      <select
                        value={newItem.timeSlot}
                        onChange={(e) => setNewItem({ ...newItem, timeSlot: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 text-base"
                      >
                        {PRESET_TIME_SLOTS.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={customTimeStart}
                          onChange={(e) => setCustomTimeStart(e.target.value)}
                          className="flex-1 px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-base"
                        />
                        <span className="text-gray-400">至</span>
                        <input
                          type="time"
                          value={customTimeEnd}
                          onChange={(e) => setCustomTimeEnd(e.target.value)}
                          className="flex-1 px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-base"
                        />
                      </div>
                    )}
                  </div>

                  {/* 教具选择 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      选择教具
                    </label>
                    <select
                      value={newItem.equipmentId}
                      onChange={(e) => setNewItem({ ...newItem, equipmentId: e.target.value, gameId: '' })}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 text-base"
                    >
                      <option value="">请选择教具</option>
                      {equipmentData.map(eq => (
                        <option key={eq.id} value={eq.id}>{eq.icon} {eq.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 玩法选择 */}
                  {newItem.equipmentId && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        选择玩法
                      </label>
                      <select
                        value={newItem.gameId}
                        onChange={(e) => setNewItem({ ...newItem, gameId: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 text-base"
                      >
                        <option value="">请选择玩法</option>
                        {equipmentData
                          .find(eq => eq.id === newItem.equipmentId)
                          ?.games.map(game => (
                            <option key={game.id} value={game.id}>{game.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  )}

                  {/* 班级备注 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MessageSquare size={14} className="inline mr-1" />
                      班级备注（可选）
                    </label>
                    <input
                      type="text"
                      value={newItem.note}
                      onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
                      placeholder="例如：三年级(2)班、足球社团..."
                      maxLength={50}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-0 text-base placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    onClick={handleAddItem}
                    disabled={!newItem.gameId}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                  >
                    <Save size={20} />
                    添加到{DAYS[selectedDay]}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center text-sm text-gray-400 space-y-1 px-4">
          <p>💡 提示：可以为一周的每一天规划不同的体育课内容</p>
          <p>📅 左右滑动日期标签切换查看不同天的安排</p>
          <p>✏️ 支持自定义时间段和班级备注</p>
        </div>
      </div>
    </div>
  )
}
