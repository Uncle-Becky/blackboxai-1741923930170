import { create } from 'zustand';
import { Room } from 'livekit-client';
import { Editor } from '@tldraw/tldraw';
import { liveKitService } from '../services/liveKitService';

interface DrawingState {
  room: Room | null;
  editor: Editor | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  setRoom: (room: Room | null) => void;
  setEditor: (editor: Editor | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  connectToRoom: (userId: string, roomName: string) => Promise<void>;
  disconnectFromRoom: () => Promise<void>;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  room: null,
  editor: null,
  isConnected: false,
  isLoading: false,
  error: null,
  
  setRoom: (room) => set({ room }),
  setEditor: (editor) => set({ editor }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  connectToRoom: async (userId: string, roomName: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Connect to the room using LiveKit service
      const room = await liveKitService.connectToRoom(userId, roomName);
      
      // Set up room event listeners
      room.on('connected', () => {
        set({ isConnected: true });
      });

      room.on('disconnected', () => {
        set({ isConnected: false });
      });

      set({ room });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to room';
      set({ error: errorMessage });
      console.error('Room connection error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  disconnectFromRoom: async () => {
    try {
      await liveKitService.disconnectFromRoom();
      set({ room: null, isConnected: false });
    } catch (err) {
      console.error('Failed to disconnect from room:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect from room';
      set({ error: errorMessage });
    }
  },
}));
