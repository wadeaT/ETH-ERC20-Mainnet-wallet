// src/services/priceWebSocket.js
class PriceWebSocketService {
    constructor() {
      this.connections = new Map();
      this.subscribers = new Map();
      this.reconnectAttempts = new Map();
      this.maxReconnectAttempts = 5;
      this.reconnectDelay = 3000; // 3 seconds
    }
  
    subscribe(symbol, callback) {
      if (!symbol) {
        console.warn('No symbol provided for subscription');
        return () => {};
      }
  
      // Convert symbol to lowercase for consistency
      const normalizedSymbol = symbol.toLowerCase();
  
      if (!this.subscribers.has(normalizedSymbol)) {
        this.subscribers.set(normalizedSymbol, new Set());
        this.reconnectAttempts.set(normalizedSymbol, 0);
      }
  
      this.subscribers.get(normalizedSymbol).add(callback);
  
      if (!this.connections.has(normalizedSymbol)) {
        this.connect(normalizedSymbol);
      }
  
      // Return unsubscribe function
      return () => {
        const subs = this.subscribers.get(normalizedSymbol);
        if (subs) {
          subs.delete(callback);
          if (subs.size === 0) {
            this.disconnect(normalizedSymbol);
          }
        }
      };
    }
  
    connect(symbol) {
      try {
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const priceData = {
              price: parseFloat(data.c) || 0,
              priceChange: parseFloat(data.P) || 0,
              timestamp: Date.now()
            };
            
            const subs = this.subscribers.get(symbol);
            if (subs) {
              subs.forEach(callback => {
                try {
                  callback(priceData);
                } catch (callbackError) {
                  console.error(`Callback error for ${symbol}:`, callbackError);
                }
              });
            }
          } catch (parseError) {
            console.error(`Data parsing error for ${symbol}:`, parseError);
          }
        };
  
        ws.onerror = (error) => {
          // Log more detailed error information
          console.error(`WebSocket error for ${symbol}:`, {
            error,
            timestamp: new Date().toISOString(),
            reconnectAttempt: this.reconnectAttempts.get(symbol)
          });
        };
  
        ws.onclose = () => {
          this.handleDisconnect(symbol);
        };
  
        // Reset reconnect attempts on successful connection
        ws.onopen = () => {
          this.reconnectAttempts.set(symbol, 0);
          console.log(`WebSocket connected for ${symbol}`);
        };
  
        this.connections.set(symbol, ws);
      } catch (error) {
        console.error(`Failed to connect WebSocket for ${symbol}:`, error);
        this.handleDisconnect(symbol);
      }
    }
  
    handleDisconnect(symbol) {
      const ws = this.connections.get(symbol);
      const attempts = this.reconnectAttempts.get(symbol) || 0;
  
      // Clean up existing connection
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      this.connections.delete(symbol);
  
      // Attempt to reconnect if we haven't exceeded max attempts
      if (attempts < this.maxReconnectAttempts) {
        this.reconnectAttempts.set(symbol, attempts + 1);
        console.log(`Attempting to reconnect ${symbol} (Attempt ${attempts + 1}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
          if (this.subscribers.get(symbol)?.size > 0) {
            this.connect(symbol);
          }
        }, this.reconnectDelay * (attempts + 1)); // Exponential backoff
      } else {
        console.warn(`Max reconnection attempts reached for ${symbol}`);
        this.subscribers.delete(symbol);
        this.reconnectAttempts.delete(symbol);
      }
    }
  
    disconnect(symbol) {
      const ws = this.connections.get(symbol);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      this.connections.delete(symbol);
      this.subscribers.delete(symbol);
      this.reconnectAttempts.delete(symbol);
    }
  
    disconnectAll() {
      Array.from(this.connections.keys()).forEach(symbol => {
        this.disconnect(symbol);
      });
    }
  }
  
  export const priceWs = new PriceWebSocketService();