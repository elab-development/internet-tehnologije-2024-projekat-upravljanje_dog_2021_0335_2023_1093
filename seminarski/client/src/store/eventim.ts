import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IArtist, IEvent, IReservation, IReview } from '../data/types';
import { EventEntity } from '../data/domain/EventEntity';
import { ArtistProfile } from '../data/domain/ArtistProfile';
import { seedArtists, seedEvents } from '../data/seed';

type Filters = {
  search: string;
  typeFilter: 'all' | 'concert' | 'festival';
  artistFilter: string | null;
};

type State = {
  artists: IArtist[];
  events: IEvent[];
  reviews: IReview[];
  reservations: IReservation[];
  filters: Filters;
  lastSyncSource?: 'ticketmaster';
  lastSyncAt?: string;
};

type Actions = {
  setFilters: (f: Partial<Filters>) => void;
  setCatalog: (
    payload: { artists: IArtist[]; events: IEvent[] },
    meta?: { source?: State['lastSyncSource'] }
  ) => void;
  addReview: (r: Omit<IReview, 'id' | 'createdAt'>) => void;
  addReservation: (r: Omit<IReservation, 'id' | 'createdAt'>) => void;

  getEventEntities: () => EventEntity[];
  getArtistProfiles: () => ArtistProfile[];
};

export const useEventim = create<State & Actions>()(
  persist(
    (set, get) => ({
      artists: seedArtists,
      events: seedEvents,
      reviews: [],
      reservations: [],
      filters: { search: '', typeFilter: 'all', artistFilter: null },

      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),

      setCatalog: ({ artists, events }, meta) =>
        set(() => ({
          artists,
          events,
          lastSyncSource: meta?.source ?? 'ticketmaster',
          lastSyncAt: new Date().toISOString(),
        })),

      addReview: (r) =>
        set((s) => ({
          reviews: [
            ...s.reviews,
            {
              ...r,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      addReservation: (r) =>
        set((s) => ({
          reservations: [
            ...s.reservations,
            {
              ...r,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      getEventEntities: () => get().events.map((e) => new EventEntity(e)),
      getArtistProfiles: () => get().artists.map((a) => new ArtistProfile(a)),
    }),
    { name: 'eventim-store' }
  )
);
