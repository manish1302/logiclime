import {io} from 'socket.io-client';

export const initializeSocket = async (classCode) => {
    const options = {
        forceNew: true, 
        reconnectionAttempts: Infinity,  
        timeout: 5000,
        transports: ['websocket']
      }
  
      return io(`http://localhost:5050`, options)
}

export const initializeDisussionSocket = async () => {
  const options = {
    forceNew: true, 
    reconnectionAttempts: Infinity,  
    timeout: 5000,
    transports: ['websocket']
  }

  return io('http://localhost:5050/discuss', options)
}