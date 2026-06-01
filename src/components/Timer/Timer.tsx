import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw, Timer as TimerIcon, Plus, History, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useTimerHistoryStore } from '@/stores/usePersistStores'

interface LapRecord {
  id: string
  lapTime: number
  totalTime: number
}

export function Timer() {
  const [mode, setMode] = useState<'stopwatch' | 'countdown'>('stopwatch')
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [countdownInput, setCountdownInput] = useState(300)
  const [showHistory, setShowHistory] = useState(false)
  const [note, setNote] = useState('')
  const [lapRecords, setLapRecords] = useState<LapRecord[]>([])
  const lapCounterRef = useRef(0)
  
  const { records, addRecord, clearRecords, deleteRecord, getTodayRecords, getTotalTodayTime } = useTimerHistoryStore()

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'stopwatch') {
          setTime(prev => prev + 1)
        } else {
          setTime(prev => {
            if (prev <= 0) {
              setIsRunning(false)
              if (prev === 0) {
                addRecord({ type: 'countdown', duration: countdownInput, note })
              }
              return 0
            }
            return prev - 1
          })
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, mode, countdownInput, addRecord, note])

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const handleReset = () => {
    if (!isRunning && time > 0 && mode === 'stopwatch') {
      addRecord({ type: 'stopwatch', duration: time, note })
    }
    setIsRunning(false)
    setTime(mode === 'countdown' ? countdownInput : 0)
    setNote('')
    setLapRecords([])
    lapCounterRef.current = 0
  }

  const handleStartCountdown = () => {
    setTime(countdownInput)
    setIsRunning(true)
  }

  const handleLap = () => {
    if (isRunning && mode === 'stopwatch') {
      lapCounterRef.current += 1
      const newLap: LapRecord = {
        id: Date.now().toString(),
        lapTime: time - (lapRecords.length > 0 ? lapRecords[lapRecords.length - 1].totalTime : 0),
        totalTime: time
      }
      setLapRecords(prev => [...prev, newLap])
    }
  }

  const presetTimes = [
    { label: '30秒', seconds: 30 },
    { label: '1分钟', seconds: 60 },
    { label: '3分钟', seconds: 180 },
    { label: '5分钟', seconds: 300 },
    { label: '10分钟', seconds: 600 },
    { label: '15分钟', seconds: 900 },
  ]

  const todayRecords = getTodayRecords()
  const todayTotal = getTotalTodayTime()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 lg:pt-24 pb-24 lg:pb-8 px-4">
      <div className="max-w-lg mx-auto space-y-6 mt-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-3 mb-6">
          <TimerIcon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-500" />
          体育课计时器
        </h1>

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl max-w-xs mx-auto">
            <button
              onClick={() => { setMode('stopwatch'); handleReset(); }}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                mode === 'stopwatch' 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              ⏱️ 计时
            </button>
            <button
              onClick={() => { setMode('countdown'); handleReset(); }}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                mode === 'countdown' 
                  ? 'bg-secondary-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              ⏳ 倒计时
            </button>
          </div>

          <div className="text-center py-10 bg-gradient-to-b from-gray-50 to-white rounded-2xl">
            <div className={`text-7xl sm:text-9xl font-mono font-bold tracking-wider ${
              mode === 'countdown' && time <= 10 && time > 0 
                ? 'text-red-500 animate-pulse' 
                : 'text-gray-900'
            }`}>
              {formatTime(time)}
            </div>
            
            {mode === 'countdown' && time === 0 && isRunning === false && countdownInput > 0 && (
              <div className="mt-6 text-2xl animate-bounce">⏰ 时间到！</div>
            )}
          </div>

          {mode === 'stopwatch' && isRunning && lapRecords.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto border border-blue-100">
              <div className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
                <span>📝</span> 分段记录 ({lapRecords.length}次)
              </div>
              {lapRecords.map((lap, index) => (
                <div key={lap.id} className="flex justify-between items-center text-sm py-2 px-3 bg-white rounded-lg shadow-sm last:border-0">
                  <span className="font-medium text-gray-600 w-16">第{index + 1}段</span>
                  <span className="font-mono text-blue-600 font-bold text-base">+{formatTime(lap.lapTime)}</span>
                  <span className="font-mono text-gray-400">{formatTime(lap.totalTime)}</span>
                </div>
              ))}
            </div>
          )}

          {mode === 'countdown' && !isRunning && time === 0 && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                  设置倒计时时长（秒）
                </label>
                <input
                  type="number"
                  value={countdownInput}
                  onChange={(e) => setCountdownInput(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-center text-3xl font-bold focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1"
                  max="3600"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {presetTimes.map((preset) => (
                  <button
                    key={preset.seconds}
                    onClick={() => setCountdownInput(preset.seconds)}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      countdownInput === preset.seconds
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  备注（可选）
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="例如：热身活动、接力赛..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* 美化按钮布局 */}
          <div className="flex justify-center items-center gap-3 pt-2">
            {!isRunning ? (
              <>
                <button
                  onClick={() => mode === 'countdown' && time === 0 ? handleStartCountdown() : setIsRunning(true)}
                  className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 min-w-[140px]"
                >
                  <Play size={22} />
                  开始
                </button>

                {mode === 'stopwatch' && time > 0 && (
                  <button
                    onClick={() => { addRecord({ type: mode, duration: time, note }); setTime(0); setNote(''); }}
                    className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
                    title="保存记录"
                  >
                    💾
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsRunning(false)}
                  className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 min-w-[140px]"
                >
                  <Pause size={22} />
                  暂停
                </button>
                
                {mode === 'stopwatch' && (
                  <button
                    onClick={handleLap}
                    className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95"
                    title="记录分段成绩（+1）"
                  >
                    <Plus size={22} />
                    +1
                  </button>
                )}
              </>
            )}
            
            <button
              onClick={handleReset}
              className={`p-4 rounded-2xl font-bold transition-all flex items-center justify-center active:scale-95 ${
                time > 0 || isRunning
                  ? 'bg-red-100 hover:bg-red-200 text-red-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
              }`}
              title="重置"
            >
              <RotateCcw size={22} />
            </button>
          </div>
        </div>

        {/* 今日统计 */}
        {(todayRecords.length > 0 || todayTotal > 0) && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-800 text-lg">📊 今日统计</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{todayRecords.length}次计时</span>
            </div>
            <div className="text-4xl font-bold text-primary-500 text-center py-2">
              总时长：{Math.floor(todayTotal / 60)}分{todayTotal % 60}秒
            </div>
          </div>
        )}

        {/* 历史记录 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <History size={22} className="text-blue-500" />
              计时历史
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{records.length}条</span>
              {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          {showHistory && (
            <div className="border-t border-gray-100 max-h-96 overflow-y-auto">
              {records.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <TimerIcon size={56} className="mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">暂无历史记录</p>
                  <p className="text-sm mt-1">开始计时后会自动保存</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {records.map((record) => (
                    <div key={record.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              record.type === 'stopwatch' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {record.type === 'stopwatch' ? '⏱ 计时' : '⏳ 倒计时'}
                            </span>
                            <span className="text-sm text-gray-400">{record.date}</span>
                          </div>
                          <div className="text-3xl font-bold text-gray-800 my-2">
                            {formatTime(record.duration)}
                          </div>
                          {record.note && (
                            <p className="text-sm text-gray-600 bg-gray-50 inline-block px-3 py-1 rounded-lg">{record.note}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {record.startTime} - {record.endTime}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-3"
                          title="删除此记录"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {records.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => {
                      if (confirm('确定要清空所有历史记录吗？')) {
                        clearRecords()
                      }
                    }}
                    className="w-full py-3 text-red-500 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors"
                  >
                    🗑️ 清空全部历史记录
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-6 pb-4 text-center text-sm text-gray-400 space-y-2">
          <p><strong className="text-gray-600">💡 使用提示：</strong></p>
          <p>+1 按钮：运行时点击记录当前时间点，计时继续不停止</p>
          <p>适用于多人跑步比赛计时，每到一个终点按一次+1</p>
        </div>
      </div>
    </div>
  )
}
