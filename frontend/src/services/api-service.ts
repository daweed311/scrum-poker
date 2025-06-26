import axios from "axios";

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
  const response = await axios.get<RoomsResponse>('http://localhost:3001/api/rooms');
  return response.data.data;
};

export const createRoom = async (room: CreateRoomData) => {
  const response = await axios.post('http://localhost:3001/api/rooms', room);
  return response.data;

  }


