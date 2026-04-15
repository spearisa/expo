import { create } from 'zustand';

type FavoritesState = {
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
};

/**
 * In-memory favorites store. Persistence is intentionally deferred
 * until a real auth/user backend is in place.
 */
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: ['mde-001', 'mde-006'], // seeded so the Favorites screen has content on first run
  isFavorite: (id) => get().ids.includes(id),
  toggle: (id) =>
    set((state) => ({
      ids: state.ids.includes(id)
        ? state.ids.filter((x) => x !== id)
        : [...state.ids, id],
    })),
  clear: () => set({ ids: [] }),
}));
