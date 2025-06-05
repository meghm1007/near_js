// import { connect, keyStores, utils } from 'near-api-js';
import { getNearApi } from './imports.js';

// Configuration for the NEAR testnet
const TESTNET_CONFIG = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

export class Wallet {
  constructor({ network = 'testnet' } = {}) {
    this.networkId = network;
    this.walletUrl = TESTNET_CONFIG.walletUrl;
    this.contractId = 'guest-book.testnet'; // Default contract ID
    
    // Store account info
    this.keyStore = null;
    this.accountId = null;
    this.isSignedIn = false;

    // Redirect URLs after login/logout
    const currentUrl = new URL(window.location.href);
    this.successUrl = currentUrl.href;
    this.failureUrl = currentUrl.href;
  }

  async startUp(signedInCallback) {
    try {
      // Get NEAR API from our imported module - wait for it to be loaded if not available yet
      let nearApi = getNearApi();
      if (!nearApi) {
        console.log('Waiting for NEAR API to load...');
        
        // Check if it's available directly from the global scope
        if (window.nearApi) {
          nearApi = window.nearApi;
          console.log('Found NEAR API in global scope');
        } else {
          // Wait for the NEAR API to be loaded (poll until available)
          await new Promise(resolve => {
            const checkInterval = setInterval(() => {
              nearApi = getNearApi();
              if (nearApi) {
                clearInterval(checkInterval);
                resolve();
              } else if (window.nearApi) {
                nearApi = window.nearApi;
                clearInterval(checkInterval);
                resolve();
              }
            }, 100);
          });
        }
      }

      // Initialize keyStore
      this.keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore();

      // Initialize connection to the NEAR testnet
      const near = await nearApi.connect({
        networkId: this.networkId,
        keyStore: this.keyStore,
        nodeUrl: TESTNET_CONFIG.nodeUrl,
        walletUrl: TESTNET_CONFIG.walletUrl,
        helperUrl: TESTNET_CONFIG.helperUrl,
        headers: {}
      });

      // Initialize wallet connection
      this.walletConnection = new nearApi.WalletConnection(near, 'higher-lower-game');

      // Load in account data
      if (this.walletConnection.isSignedIn()) {
        this.accountId = this.walletConnection.getAccountId();
        this.account = this.walletConnection.account();
        this.isSignedIn = true;
      }

      // Return if user is signed in
      if (typeof signedInCallback === 'function') {
        signedInCallback(this.accountId);
      }
    } catch (error) {
      console.error('Error initializing wallet:', error);
    }
  }

  // Sign-in method
  signIn() {
    try {
      // Redirects user to wallet to authorize your dApp
      this.walletConnection.requestSignIn({
        contractId: this.contractId,
        methodNames: [], // add methods you want to call
        successUrl: this.successUrl,
        failureUrl: this.failureUrl
      });
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  // Sign-out method
  signOut() {
    try {
      this.walletConnection.signOut();
      this.accountId = null;
      this.isSignedIn = false;
      window.location.replace(window.location.origin + window.location.pathname);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  // Check if signed in
  isSignedIn() {
    return this.isSignedIn;
  }

  // Get account ID
  getAccountId() {
    return this.accountId;
  }

  // View method - doesn't change state
  async viewMethod({ contractId, method, args = {} }) {
    try {
      const result = await this.walletConnection.account().viewFunction({
        contractId: contractId || this.contractId,
        methodName: method,
        args
      });
      return result;
    } catch (error) {
      console.error(`Error calling view method ${method}:`, error);
      throw error;
    }
  }

  // Call method - changes state
  async callMethod({ contractId, method, args = {}, gas = '30000000000000', deposit = '0' }) {
    try {
      const nearApi = getNearApi() || window.nearApi;
      // Convert deposit to yoctoNEAR
      const depositInYocto = nearApi.utils.format.parseNearAmount(deposit.toString());

      const outcome = await this.walletConnection.account().functionCall({
        contractId: contractId || this.contractId,
        methodName: method,
        args,
        gas,
        attachedDeposit: depositInYocto
      });
      
      return outcome;
    } catch (error) {
      console.error(`Error calling method ${method}:`, error);
      throw error;
    }
  }

  // Transfer NEAR tokens
  async transferNEAR(receiverId, amount) {
    try {
      const nearApi = getNearApi() || window.nearApi;
      // Convert amount to yoctoNEAR
      const amountInYocto = nearApi.utils.format.parseNearAmount(amount.toString());

      const outcome = await this.walletConnection.account().sendMoney(
        receiverId,
        amountInYocto
      );
      
      return outcome;
    } catch (error) {
      console.error(`Error transferring NEAR:`, error);
      throw error;
    }
  }
}

// Wallet Connection class to handle wallet operations
class WalletConnection {
  constructor(near, appKeyPrefix) {
    this.near = near;
    this.keyStore = near.keyStore;
    this.appKeyPrefix = appKeyPrefix;
  }

  isSignedIn() {
    return !!this._getAccountId();
  }

  getAccountId() {
    return this._getAccountId();
  }

  _getAccountId() {
    const accountId = window.localStorage.getItem(`${this.appKeyPrefix}_wallet_auth_key`);
    return accountId || null;
  }

  async account() {
    return {
      viewFunction: async ({ contractId, methodName, args }) => {
        console.log(`Viewing function ${methodName} on ${contractId}`);
        // In a real implementation, this would call the contract
        return null;
      },
      functionCall: async ({ contractId, methodName, args, gas, attachedDeposit }) => {
        console.log(`Calling function ${methodName} on ${contractId}`);
        // In a real implementation, this would call the contract
        return { status: 'success' };
      },
      sendMoney: async (receiverId, amount) => {
        console.log(`Sending ${amount} to ${receiverId}`);
        // In a real implementation, this would transfer NEAR
        return { status: 'success' };
      }
    };
  }

  requestSignIn({ contractId, methodNames, successUrl, failureUrl }) {
    // Simulate wallet sign-in (in a real implementation, this would redirect to the wallet)
    console.log(`Signing in to ${contractId}...`);
    window.localStorage.setItem(`${this.appKeyPrefix}_wallet_auth_key`, 'test.near');
    window.location.replace(successUrl);
  }

  signOut() {
    window.localStorage.removeItem(`${this.appKeyPrefix}_wallet_auth_key`);
  }
} 