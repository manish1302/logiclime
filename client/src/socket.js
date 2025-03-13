import {io} from 'socket.io-client';

export const initializeSocket = async (classCode) => {
    const options = {
        forceNew: true, 
        reconnectionAttempts: Infinity,  
        timeout: 5000,
        transports: ['websocket']
      }
  
      return io(import.meta.env.VITE_API_SOCKET_URL, options)
}

export const initializeDisussionSocket = async () => {
  const options = {
    forceNew: true, 
    reconnectionAttempts: Infinity,  
    timeout: 5000,
    transports: ['websocket']
  }

  return io(`${import.meta.env.VITE_API_SOCKET_URL}discuss`, options)
}