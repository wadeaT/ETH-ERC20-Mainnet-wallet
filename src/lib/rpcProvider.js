// src/lib/rpcProvider.js
import { ethers } from 'ethers';

class RpcProvider {
  constructor() {
    this.providers = [
      'https://eth.llamarpc.com',
      'https://rpc.ankr.com/eth',
      'https://ethereum.publicnode.com',
    ].map(url => new ethers.JsonRpcProvider(url, undefined, {
      batchMaxCount: 20, // Limit batch size
      polling: true,
      pollingInterval: 4000
    }));
    
    this.currentProvider = 0;
    this.requestQueue = [];
  }

  async call(method, ...args) {
    let error;
    for (let i = 0; i < this.providers.length; i++) {
      try {
        const provider = this.providers[this.currentProvider];
        return await provider[method](...args);
      } catch (err) {
        error = err;
        this.currentProvider = (this.currentProvider + 1) % this.providers.length;
      }
    }
    throw error;
  }

  get provider() {
    return this.providers[this.currentProvider];
  }

  async processQueue() {
    while (this.requestQueue.length > 0) {
      const batch = this.requestQueue.splice(0, 20);
      await Promise.all(batch.map(req => req()));
    }
  }
}

export default new RpcProvider();