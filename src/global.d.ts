export interface Message {
  data: string
  timestamp: string
  device: string
}

export interface CustomNotification {
  data: string
  error: boolean
}

export interface RoomData {
  timestamp: number
}
