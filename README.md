# Higher Lower Game on NEAR Protocol

A browser-based Higher/Lower guessing game built with vanilla JavaScript that integrates with the NEAR Protocol blockchain.

## Project Overview

This game lets users guess whether a search term has higher or lower search volume than another term. Users can connect their NEAR wallet, place bets with NEAR tokens, and win rewards based on their performance.

## File Structure

- `index.html` - Main HTML file containing the structure of the web app
- `main.js` - Core JavaScript file that initializes the application and handles the game logic
- `near-wallet.js` - Handles NEAR wallet integration (connecting, signing in/out, transactions)
- `higher-lower-game.js` - Contains the game mechanics and scoring logic
- `background-effect.js` - Creates the animated background effects using Three.js
- `card-effect.js` - Adds interactive 3D card effects using Three.js
- `imports.js` - Helper file to load external dependencies from CDN
- `higher-lower.css` - Game-specific styling
- `global.css` - Global styles for the application

## Test the app yourself
Clone the repo and run:
python -m http.server 8000

## Current Issue

The application is currently encountering module import errors:

```
Uncaught TypeError: Failed to resolve module specifier "buffer". Relative references must start with either "/", "./", or "../".

Uncaught TypeError: Failed to resolve module specifier "near-api-js". Relative references must start with either "/", "./", or "../".
```
