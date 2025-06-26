import axios from "axios";

// Environment-based API URL configuration
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3001' 
  : 'https://scrum-poker-9c6i.onrender.com';

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


