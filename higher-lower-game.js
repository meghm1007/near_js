/**
 * Higher Lower Game - A game where players guess if a search term has higher or lower
 * search volume than the previous term.
 */
export class HigherLowerGame {
  constructor() {
    this.score = 0;
    this.bestScore = 0;
    this.currentTerm1 = '';
    this.currentTerm2 = '';
    this.currentSearches1 = 0;
    this.currentSearches2 = 0;
    this.isRoundComplete = false;
    this.isGameOver = false;
    this.lastGuessCorrect = false;
    this.betAmount = 0;
    this.MAX_ROUNDS = 15; // Maximum number of rounds
    this.currentRound = 0;
    
    // Search terms data with average monthly search volumes
    this.searchData = [
      { term: "Facebook", searches: 1680000000 },
      { term: "YouTube", searches: 1140000000 },
      { term: "Weather", searches: 995000000 },
      { term: "Amazon", searches: 782000000 },
      { term: "Google", searches: 681000000 },
      { term: "Gmail", searches: 574000000 },
      { term: "Instagram", searches: 552000000 },
      { term: "Twitter", searches: 436000000 },
      { term: "Netflix", searches: 412000000 },
      { term: "Walmart", searches: 339000000 },
      { term: "Yahoo", searches: 326000000 },
      { term: "Hotmail", searches: 274000000 },
      { term: "eBay", searches: 261000000 },
      { term: "News", searches: 247000000 },
      { term: "Craigslist", searches: 226000000 },
      { term: "ESPN", searches: 204000000 },
      { term: "Fox News", searches: 196000000 },
      { term: "Minecraft", searches: 173000000 },
      { term: "CNN", searches: 169000000 },
      { term: "NFL", searches: 151000000 },
      { term: "Bitcoin", searches: 135000000 },
      { term: "Roblox", searches: 124000000 },
      { term: "Zoom", searches: 114000000 },
      { term: "PayPal", searches: 102000000 },
      { term: "Target", searches: 92000000 },
      { term: "NBA", searches: 89000000 },
      { term: "Spotify", searches: 86000000 },
      { term: "LinkedIn", searches: 83000000 },
      { term: "Twitch", searches: 78000000 },
      { term: "Home Depot", searches: 74000000 },
      { term: "Apple", searches: 71000000 },
      { term: "TikTok", searches: 67000000 },
      { term: "Reddit", searches: 62000000 },
      { term: "Costco", searches: 58000000 },
      { term: "GameStop", searches: 42000000 },
      { term: "Airbnb", searches: 36000000 },
      { term: "Zillow", searches: 31000000 },
      { term: "DoorDash", searches: 28000000 },
      { term: "Tesla", searches: 26000000 },
      { term: "Snapchat", searches: 24000000 },
      { term: "Robinhood", searches: 19000000 },
      { term: "Uber", searches: 17000000 },
      { term: "Disney+", searches: 15000000 },
      { term: "Coinbase", searches: 13000000 },
      { term: "NEAR Protocol", searches: 820000 },
      { term: "Blockchain", searches: 6100000 },
      { term: "Smart Contract", searches: 580000 },
      { term: "Web3", searches: 2700000 },
      { term: "NFT", searches: 4200000 },
      { term: "Crypto Wallet", searches: 1400000 }
    ];
    
    // Shuffle the data
    this.shuffleData();
  }
  
  /**
   * Shuffle the search data to randomize the game
   */
  shuffleData() {
    for (let i = this.searchData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.searchData[i], this.searchData[j]] = [this.searchData[j], this.searchData[i]];
    }
  }
  
  /**
   * Start a new game
   */
  startGame() {
    this.score = 0;
    this.isGameOver = false;
    this.currentRound = 0;
    this.shuffleData();
    this.nextRound();
  }
  
  /**
   * Set up the next round
   */
  nextRound() {
    if (this.currentRound >= this.MAX_ROUNDS) {
      this.isGameOver = true;
      return;
    }
    
    // If this is not the first round, move term2 to term1
    if (this.currentRound > 0) {
      this.currentTerm1 = this.currentTerm2;
      this.currentSearches1 = this.currentSearches2;
    } else {
      // First round, get a new term
      const termData = this.searchData.pop();
      this.currentTerm1 = termData.term;
      this.currentSearches1 = termData.searches;
    }
    
    // Get a new term for term2
    const termData = this.searchData.pop();
    this.currentTerm2 = termData.term;
    this.currentSearches2 = termData.searches;
    
    this.isRoundComplete = false;
    this.currentRound++;
  }
  
  /**
   * Make a guess (higher or lower)
   * @param {string} guess - The player's guess ('higher' or 'lower')
   */
  makeGuess(guess) {
    if (this.isRoundComplete || this.isGameOver) {
      return;
    }
    
    const isHigher = this.currentSearches2 > this.currentSearches1;
    
    // Check if the guess is correct
    if ((guess === 'higher' && isHigher) || (guess === 'lower' && !isHigher)) {
      this.score++;
      this.lastGuessCorrect = true;
    } else {
      this.isGameOver = true;
      this.lastGuessCorrect = false;
    }
    
    this.isRoundComplete = true;
  }
} 