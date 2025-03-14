import { Room, RoomOptions, RoomConnectOptions } from 'livekit-client';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880';

class LiveKitService {
  private static instance: LiveKitService;
  private room: Room | null = null;

  private constructor() {}

  static getInstance(): LiveKitService {
    if (!LiveKitService.instance) {
      LiveKitService.instance = new LiveKitService();
    }
    return LiveKitService.instance;
  }

  async connectToRoom(userId: string, roomName: string, options?: RoomOptions & RoomConnectOptions): Promise<Room> {
    try {
      if (this.room) {
        await this.room.disconnect();
      }

      this.room = new Room({
        // Default options for optimal WebRTC performance
        adaptiveStream: true,
        dynacast: true,
        stopLocalTrackOnUnpublish: true,
        ...options
      });

      // For demo purposes, we'll use a simple token
      // In production, this should be generated securely on the server
      const token = `${userId}:${roomName}:demo`;

      // Connect to LiveKit room
      await this.room.connect(LIVEKIT_URL, token);
      
      return this.room;
    } catch (error) {
      console.error('Failed to connect to LiveKit room:', error);
      throw error;
    }
  }

  async disconnectFromRoom() {
    if (this.room) {
      await this.room.disconnect();
      this.room = null;
    }
  }

  getCurrentRoom(): Room | null {
    return this.room;
  }
}

export const liveKitService = LiveKitService.getInstance();
