// lib/walletConnect.js
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

class WalletConnectService {
  constructor() {
    this.connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal
    });
  }

  async connect() {
    if (!this.connector.connected) {
      // Create session
      await this.connector.createSession();
    }
    return this.connector;
  }

  async disconnect() {
    if (this.connector.connected) {
      await this.connector.killSession();
    }
  }

  getAccounts() {
    return this.connector.connected ? this.connector.accounts : [];
  }

  getChainId() {
    return this.connector.connected ? this.connector.chainId : null;
  }

  onConnect(callback) {
    this.connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts, chainId } = payload.params[0];
      callback(accounts, chainId);
    });
  }

  onDisconnect(callback) {
    this.connector.on("disconnect", (error) => {
      if (error) {
        throw error;
      }
      callback();
    });
  }
}

export const walletConnect = new WalletConnectService();