import { useState, useEffect, useMemo, useCallback } from 'react';
import { getRooms, createRoom, type CreateRoomData, type RoomListItem } from '../services/api-service';

export enum RequestName {
  GET_ROOMS = 'getRooms',
  CREATE_ROOM = 'createRoom',
}

export interface RequestParams {
  name: RequestName;
  method: 'GET' | 'POST';
  data?: CreateRoomData;
}

interface ApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const getApiRequest = (params: RequestParams) => {
  switch (params.name) {
    case RequestName.GET_ROOMS:
      return () => getRooms();
    case RequestName.CREATE_ROOM:
      return () => createRoom(params.data!);
    default:
      throw new Error(`Unknown request type: ${params.name}`);
  }
};

export const useApiRequest = <T = any>(
  params: RequestParams | null,
  pollInterval: number | null = null
): ApiState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiRequest = useMemo(() => {
    if (!params) return null;
    return getApiRequest(params);
  }, [params?.name, params?.method, params?.data]);

  const fetchData = useCallback(async () => {
    if (!apiRequest) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest();
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    if (!apiRequest) return;

    fetchData(); // Initial fetch

    if (pollInterval) {
      const intervalId = setInterval(fetchData, pollInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchData, pollInterval]);

  return { data, error, loading };
};

// Convenience hooks for specific operations
export const useRooms = (pollInterval: number | null = null) => {
  const params = useMemo(() => ({ 
    name: RequestName.GET_ROOMS, 
    method: 'GET' as const 
  }), []);
  
  return useApiRequest<RoomListItem[]>(params, pollInterval);
};

export const useCreateRoom = () => {
  const [createRoomParams, setCreateRoomParams] = useState<RequestParams | null>(null);
  
  const state = useApiRequest(createRoomParams);
  
  const createRoom = useCallback((roomData: CreateRoomData) => {
    setCreateRoomParams({
      name: RequestName.CREATE_ROOM,
      method: 'POST',
      data: roomData,
    });
  }, []);

  return { ...state, createRoom };
};