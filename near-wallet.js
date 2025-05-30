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
    // Get NEAR API from our imported module
    const nearApi = getNearApi();
    if (!nearApi) {
      console.error('NEAR API not loaded yet');
      return;
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
    this.walletConnection = new WalletConnection(near, 'higher-lower-game');

    // Load in account data
    if (this.walletConnection.isSignedIn()) {
      this.accountId = this.walletConnection.getAccountId();
      this.account = this.walletConnection.account();
      this.isSignedIn = true;
    }

    // Return if user is signed in
    signedInCallback(this.accountId);
  }

  // Sign-in method
  signIn() {
    // Redirects user to wallet to authorize your dApp
    this.walletConnection.requestSignIn({
      contractId: this.contractId,
      methodNames: [], // add methods you want to call
      successUrl: this.successUrl,
      failureUrl: this.failureUrl
    });
  }

  // Sign-out method
  signOut() {
    this.walletConnection.signOut();
    this.accountId = null;
    this.isSignedIn = false;
    window.location.replace(window.location.origin + window.location.pathname);
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
    const result = await this.walletConnection.account().viewFunction({
      contractId: contractId || this.contractId,
      methodName: method,
      args
    });
    return result;
  }

  // Call method - changes state
  async callMethod({ contractId, method, args = {}, gas = '30000000000000', deposit = '0' }) {
    const nearApi = getNearApi();
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
  }

  // Transfer NEAR tokens
  async transferNEAR(receiverId, amount) {
    const nearApi = getNearApi();
    // Convert amount to yoctoNEAR
    const amountInYocto = nearApi.utils.format.parseNearAmount(amount.toString());

    const outcome = await this.walletConnection.account().sendMoney(
      receiverId,
      amountInYocto
    );
    
    return outcome;
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