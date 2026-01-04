import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Custom hook for WebSocket connection
 * Manages STOMP client connection and subscriptions
 */
export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    // Create STOMP client
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        console.log('WebSocket Connected');
        setConnected(true);
      },
      
      onDisconnect: () => {
        console.log('WebSocket Disconnected');
        setConnected(false);
      },
      
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  /**
   * Subscribe to a topic
   * @param {string} topic - Topic to subscribe to (e.g., '/topic/post/123/likes')
   * @param {function} callback - Callback function to handle messages
   * @returns {function} Unsubscribe function
   */
  const subscribe = (topic, callback) => {
    if (!clientRef.current || !connected) {
      console.warn('WebSocket not connected');
      return () => {};
    }

    const subscription = clientRef.current.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  };

  return {
    connected,
    subscribe
  };
};