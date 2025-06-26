import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface CreateRoomData {
  name: string;
  description: string;
  questionTimer: number;
  roundCount: number;
  createdBy: string;
}

export interface RoomListItem {
  roomId: string;
  name: string;
  createdBy: string;
  participants: string[];
  currentRound: number;
  createdAt: string;
  participantCount: number;
}

export interface RoomsResponse {
  success: boolean;
  data: RoomListItem[];
}

export const getRooms = async (): Promise<RoomListItem[]> => {
  const response = await axios.get<RoomsResponse>(`${API_BASE_URL}/api/rooms`);
  return response.data.data;
};

export const createRoom = async (room: CreateRoomData) => {
  const response = await axios.post(`${API_BASE_URL}/api/rooms`, room);
  return response.data;
};


