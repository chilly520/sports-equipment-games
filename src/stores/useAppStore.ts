import { create } from 'zustand'
import { Equipment, Game, FilterType } from '@/types'
import { equipmentData } from '@/data/equipmentData'

interface AppState {
  equipments: Equipment[]
  activeFilter: FilterType
  selectedEquipment: Equipment | null
  selectedGame: Game | null
  isModalOpen: boolean
  isSpinning: boolean
  currentRotation: number
  
  filteredEquipments: Equipment[]
  
  setActiveFilter: (filter: FilterType) => void
  setSelectedEquipment: (equipment: Equipment | null) => void
  setSelectedGame: (game: Game | null) => void
  openModal: (game: Game) => void
  closeModal: () => void
  setIsSpinning: (spinning: boolean) => void
  setCurrentRotation: (rotation: number) => void
}

function getFilteredEquipments(equipments: Equipment[], activeFilter: FilterType): Equipment[] {
  if (activeFilter === 'all') return equipments

  if (activeFilter.startsWith('difficulty-')) {
    const difficulty = activeFilter.replace('difficulty-', '') as 'easy' | 'medium' | 'hard'
    return equipments.filter(eq =>
      eq.games.some(game => game.difficulty === difficulty)
    )
  }

  if (activeFilter === 'category-regular') {
    return equipments.filter(eq => eq.category === 'regular')
  }

  if (activeFilter === 'category-inflatable') {
    return equipments.filter(eq => eq.category === 'inflatable')
  }

  const equipment = equipments.find(eq => eq.id === activeFilter)
  return equipment ? [equipment] : []
}

export const useAppStore = create<AppState>((set, get) => ({
  equipments: equipmentData,
  activeFilter: 'all',
  selectedEquipment: null,
  selectedGame: null,
  isModalOpen: false,
  isSpinning: false,
  currentRotation: 0,

  filteredEquipments: getFilteredEquipments(equipmentData, 'all'),

  setActiveFilter: (filter) => {
    const { equipments } = get()
    set({
      activeFilter: filter,
      filteredEquipments: getFilteredEquipments(equipments, filter)
    })
  },

  setSelectedEquipment: (equipment) => set({ selectedEquipment: equipment }),

  setSelectedGame: (game) => set({ selectedGame: game }),

  openModal: (game) => set({
    isModalOpen: true,
    selectedGame: game
  }),

  closeModal: () => set({
    isModalOpen: false,
    selectedGame: null
  }),

  setIsSpinning: (spinning) => set({ isSpinning: spinning }),

  setCurrentRotation: (rotation) => set({ currentRotation: rotation }),
}))
