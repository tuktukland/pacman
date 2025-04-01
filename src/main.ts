// import './style.css'; // Keep default styles for now, can be cleaned later
import Game from './Game'

// Ensure the DOM is fully loaded before starting the game
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game('gameCanvas')
  game.start()
})
