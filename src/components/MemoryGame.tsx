"use client"
import { useState, useEffect } from 'react';

// List of emojis to use on the cards
const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍'];

// Interface defining the structure of a single card in the memory game
interface Card {
  id: number; // Unique identifier for each card
  emoji: string; // Emoji associated with the card
  flipped: boolean; // Current state of the card: true - card is facing up (content visible) | false - card is facing down (content not visible)
}

/**
 * Shuffles an array using the Fisher-Yates shuffle algorithm.
 * This function creates a copy of the original array, then randomly swaps elements within the array.
 * 
 * @param array - The array to be shuffled.
 * @returns A new array with the elements shuffled.
 */
const shuffle = (array: any[]) => {
  const clonedArray = [...array]; // Create a copy of the array to avoid mutating the original array.

  // Iterate over the array from the last element to the second element.
  for (let index = clonedArray.length - 1; index > 0; index--) { 
    const randomIndex = Math.floor(Math.random() * (index + 1)); // Generate a random index from 0 to the current index.
    [clonedArray[index], clonedArray[randomIndex]] = [clonedArray[randomIndex], clonedArray[index]]; // Swap the element at the current index with the element at the random index.
  }
  return clonedArray; // Return the shuffled array.
};

/**
 * Picks a specified number of random items from an array.
 * This function creates a copy of the original array, then randomly selects elements from the copied array.
 * 
 * @param array - The array to pick items from.
 * @param items - The number of items to pick.
 * @returns A new array containing the randomly picked items.
 */
const pickRandom = (array: any[], items: number) => {
  const clonedArray = [...array]; // Create a copy of the array to avoid mutating the original array.
  const randomPicks = []; // Array to store the randomly picked items.

  // Iterate until we have picked the specified number of items.
  for (let index = 0; index < items; index++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length); // Generate a random index within the bounds of the cloned array.
    randomPicks.push(clonedArray[randomIndex]); // Add the element at the random index to the randomPicks array.
    clonedArray.splice(randomIndex, 1); // Remove the picked element from the cloned array to ensure uniqueness.
  }
  return randomPicks; // Return the array containing the randomly picked items.
};

const MemoryGame: React.FC = () => {
  // State variables to manage the game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Effect to initialize the game with a shuffled deck of cards
  useEffect(() => {
    const dimensions = 4; // Define the dimensions of the game board (e.g., a 4x4 grid).
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2); // Pick a set of unique emoji pairs based on the board dimensions.
    const items = shuffle([...picks, ...picks]); // Duplicate the picked emojis to create pairs and shuffle the combined list.
    setCards(items.map((item, index) => ({ id: index, emoji: item, flipped: false }))); // Set the shuffled cards in the component state.
  }, []);

  // Effect to handle the game timer
  useEffect(() => {
    let timer: NodeJS.Timeout; // Declare a variable to hold the timer.

    // If the game has started, set up an interval to increment the timer every second.
    if (gameStarted) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1); // Update the time state every second.
      }, 1000); // 1000 milliseconds = 1 second
    }
    return () => clearInterval(timer); // Clean up the timer when the component unmounts or when gameStarted changes.
  }, [gameStarted]);

  // Effect to handle matching logic for flipped cards
  useEffect(() => {
    // Check if exactly two cards are flipped
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards; // Destructure the indices of the flipped cards

      // Check if the emojis of the two flipped cards match
      if (cards[first].emoji === cards[second].emoji) {
        setMatchedCards((prev) => [...prev, first, second]); // If they match, add their indices to the matched cards state
      }

      // Reset the flipped cards after a 1-second delay
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000); // 1000 milliseconds = 1 second
    }
  }, [flippedCards, cards]); // Depend on flippedCards and cards to run this effect whenever either changes

  // Effect to check if the game is won
  useEffect(() => {
    // Check if the number of matched cards is equal to the total number of cards and ensure cards array is not empty
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameStarted(false); // Stop the game
      alert(`You won! Moves: ${moves}, Time: ${time} seconds`); // Display an alert with the number of moves and time taken to win the game
      resetGame() // Reset the game to its initial state
    }
  }, [matchedCards, cards.length, moves, time]); // Depend on matchedCards, cards.length, moves, and time to run this effect whenever any of these change

  // Function to handle flipping a card
  const flipCard = (index: number) => {
    // Check if the game is started, only allow flipping if less than 2 cards are currently flipped, and prevent flipping already flipped or matched cards
    if (
      gameStarted && // The game must be started
      flippedCards.length < 2 && // No more than two cards should be flipped at a time
      !flippedCards.includes(index) && // The card should not be already flipped
      !matchedCards.includes(index) // The card should not be already matched
    ) {
      setFlippedCards((prev) => [...prev, index]); // Add the index of the flipped card to the flippedCards array
      setMoves((prev) => prev + 1); // Increment the move count
    }
  };

  // Function to start the game
  const startGame = () => {
    setGameStarted(true); // Set the game state to started
    setMoves(0); // Reset the move count to 0
    setTime(0); // Reset the timer to 0
    setMatchedCards([]); // Clear the list of matched cards
    setFlippedCards([]); // Clear the list of flipped cards
    const dimensions = 4; // Define the dimensions of the game board (4x4 grid)
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2); // Pick a specified number of random emojis (half of the total number of cards)
    const items = shuffle([...picks, ...picks]); // Duplicate the picked emojis and shuffle them to create the game deck
    setCards(items.map((item, index) => ({ id: index, emoji: item, flipped: false }))); // Initialize the cards state with the shuffled deck, each card has an id, emoji, and flipped status
  };

  // Function to reset the game
  const resetGame = () => {
    setGameStarted(false); // Set the game state to started
    setMoves(0); // Reset the move count to 0
    setTime(0); // Reset the timer to 0
    setMatchedCards([]); // Clear the list of matched cards
    setFlippedCards([]); // Clear the list of flipped cards
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-col sm:flex-row justify-between w-full max-w-md mb-6 gap-2">
        <button onClick={startGame} disabled={gameStarted} className="px-4 py-2 bg-green-900 text-white rounded disabled:opacity-50">Start</button>
        <button onClick={resetGame} disabled={!gameStarted} className="px-4 py-2 bg-red-900 text-white rounded disabled:opacity-50">Reset</button>
        <div className='text-amber-600'>Moves: {moves}</div>
        <div className='text-amber-600'>Time: {time} sec</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`relative w-20 h-20 sm:w-24 sm:h-24 perspective ${flippedCards.includes(index) || matchedCards.includes(index) ? 'flipped' : ''}`}
            onClick={() => flipCard(index)}
          >
            <div className="absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d">
              <div className="absolute w-full h-full bg-gray-300 backface-hidden flex items-center justify-center text-2xl">
                {card.emoji}
              </div>
              <div className="absolute w-full h-full bg-blue-900 transform rotate-y-180 backface-hidden"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;