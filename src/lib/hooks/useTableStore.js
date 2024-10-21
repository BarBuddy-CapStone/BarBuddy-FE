import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTableStore = create(
  persist(
    (set, get) => ({
      selectedTables: [],
      setSelectedTables: (tables) => set({ selectedTables: tables }),
      addTable: (table) => set((state) => ({
        selectedTables: [...state.selectedTables, table]
      })),
      removeTable: (tableId) => set((state) => ({
        selectedTables: state.selectedTables.filter(t => t.tableId !== tableId)
      })),
      updateTable: (updatedTable) => set((state) => ({
        selectedTables: state.selectedTables.map(t => 
          t.tableId === updatedTable.tableId ? { ...t, ...updatedTable } : t
        )
      })),
      clearExpiredTables: () => set((state) => ({
        selectedTables: state.selectedTables.filter(t => {
          const now = new Date().getTime();
          return new Date(t.holdExpiry).getTime() > now;
        })
      })),
      clearAllTables: () => set({ selectedTables: [] }),
      releaseTable: (tableId, date, time) => set((state) => ({
        selectedTables: state.selectedTables.filter(t => 
          !(t.tableId === tableId && t.date === date && t.time === time)
        )
      })),
    }),
    {
      name: 'table-storage',
      getStorage: () => sessionStorage,
    }
  )
);

export default useTableStore;
