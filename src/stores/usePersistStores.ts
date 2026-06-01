import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteState {
  favoriteGameIds: string[]
  toggleFavorite: (gameId: string) => void
  isFavorite: (gameId: string) => boolean
  clearFavorites: () => void
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteGameIds: [],
      
      toggleFavorite: (gameId: string) => {
        const current = get().favoriteGameIds
        if (current.includes(gameId)) {
          set({ favoriteGameIds: current.filter(id => id !== gameId) })
        } else {
          set({ favoriteGameIds: [...current, gameId] })
        }
      },
      
      isFavorite: (gameId: string) => {
        return get().favoriteGameIds.includes(gameId)
      },
      
      clearFavorites: () => {
        set({ favoriteGameIds: [] })
      }
    }),
    {
      name: 'sports-favorites',
    }
  )
)

interface RecentItem {
  gameId: string
  gameName: string
  equipmentId: string
  equipmentName: string
  equipmentIcon: string
  timestamp: number
}

interface RecentState {
  recentItems: RecentItem[]
  addRecent: (item: Omit<RecentItem, 'timestamp'>) => void
  clearRecent: () => void
  getRecentByEquipment: (equipmentId: string) => RecentItem[]
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      recentItems: [],
      
      addRecent: (item) => {
        const current = get().recentItems.filter(i => i.gameId !== item.gameId)
        const newItem = { ...item, timestamp: Date.now() }
        set({ recentItems: [newItem, ...current].slice(0, 20) })
      },
      
      clearRecent: () => {
        set({ recentItems: [] })
      },
      
      getRecentByEquipment: (equipmentId: string) => {
        return get().recentItems.filter(i => i.equipmentId === equipmentId)
      }
    }),
    {
      name: 'sports-recent',
    }
  )
)

interface TimerRecord {
  id: string
  type: 'stopwatch' | 'countdown'
  duration: number // 秒
  startTime: string
  endTime: string
  date: string
  note?: string
}

interface TimerHistoryState {
  records: TimerRecord[]
  addRecord: (record: Omit<TimerRecord, 'id' | 'date' | 'startTime' | 'endTime'>) => void
  clearRecords: () => void
  deleteRecord: (id: string) => void
  getTodayRecords: () => TimerRecord[]
  getTotalTodayTime: () => number
}

export const useTimerHistoryStore = create<TimerHistoryState>()(
  persist(
    (set, get) => ({
      records: [],
      
      addRecord: (record) => {
        const now = new Date()
        const newRecord: TimerRecord = {
          ...record,
          id: Date.now().toString(),
          date: now.toLocaleDateString('zh-CN'),
          startTime: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          endTime: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        }
        set({ records: [newRecord, ...get().records].slice(0, 100) })
      },
      
      clearRecords: () => {
        set({ records: [] })
      },
      
      deleteRecord: (id: string) => {
        set({ records: get().records.filter(r => r.id !== id) })
      },
      
      getTodayRecords: () => {
        const today = new Date().toLocaleDateString('zh-CN')
        return get().records.filter(r => r.date === today)
      },
      
      getTotalTodayTime: () => {
        return get().getTodayRecords().reduce((sum, r) => sum + r.duration, 0)
      }
    }),
    {
      name: 'sports-timer-history',
    }
  )
)

interface ScheduleItem {
  id: string
  dayOfWeek: number // 0-6
  timeSlot: string
  gameName: string
  equipmentName: string
  equipmentIcon: string
  color: string
  note?: string // 班级备注
}

interface ScheduleState {
  scheduleItems: ScheduleItem[]
  addItem: (item: Omit<ScheduleItem, 'id'>) => void
  updateItem: (id: string, updates: Partial<ScheduleItem>) => void
  deleteItem: (id: string) => void
  getScheduleByDay: (day: number) => ScheduleItem[]
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      scheduleItems: [],
      
      addItem: (item) => {
        const newItem = { ...item, id: Date.now().toString() + Math.random() }
        set({ scheduleItems: [...get().scheduleItems, newItem] })
      },
      
      updateItem: (id: string, updates: Partial<ScheduleItem>) => {
        set({
          scheduleItems: get().scheduleItems.map(item =>
            item.id === id ? { ...item, ...updates } : item
          )
        })
      },
      
      deleteItem: (id: string) => {
        set({ scheduleItems: get().scheduleItems.filter(item => item.id !== id) })
      },
      
      getScheduleByDay: (day: number) => {
        return get().scheduleItems
          .filter(item => item.dayOfWeek === day)
          .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
      }
    }),
    {
      name: 'sports-schedule',
    }
  )
)

interface UsageStat {
  equipmentId: string
  equipmentName: string
  equipmentIcon: string
  count: number
  lastUsed: number
}

interface UsageStatsState {
  stats: UsageStat[]
  incrementUsage: (equipmentId: string, equipmentName: string, equipmentIcon: string) => void
  getTopUsed: (limit?: number) => UsageStat[]
  clearStats: () => void
}

export const useUsageStatsStore = create<UsageStatsState>()(
  persist(
    (set, get) => ({
      stats: [],
      
      incrementUsage: (equipmentId, equipmentName, equipmentIcon) => {
        const current = get().stats
        const existing = current.find(s => s.equipmentId === equipmentId)
        
        if (existing) {
          set({
            stats: current.map(s =>
              s.equipmentId === equipmentId
                ? { ...s, count: s.count + 1, lastUsed: Date.now() }
                : s
            )
          })
        } else {
          set({
            stats: [...current, { equipmentId, equipmentName, equipmentIcon, count: 1, lastUsed: Date.now() }]
          })
        }
      },
      
      getTopUsed: (limit = 5) => {
        return [...get().stats]
          .sort((a, b) => b.count - a.count)
          .slice(0, limit)
      },
      
      clearStats: () => {
        set({ stats: [] })
      }
    }),
    {
      name: 'sports-usage-stats',
    }
  )
)
