"use client"
import { useState, useEffect } from 'react';

const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍'];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
}

const shuffle = (array: any[]) => {
  const clonedArray = [...array];
  for (let index = clonedArray.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clonedArray[index], clonedArray[randomIndex]] = [clonedArray[randomIndex], clonedArray[index]];
  }
  return clonedArray;
};

const pickRandom = (array: any[], items: number) => {
  const clonedArray = [...array];
  const randomPicks = [];
  for (let index = 0; index < items; index++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    randomPicks.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return randomPicks;
};

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const dimensions = 4;
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
    setCards(items.map((item, index) => ({ id: index, emoji: item, flipped: false })));
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted]);

  const flipCard = (index: number) => {
    if (gameStarted && flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(index)) {
      setFlippedCards((prev) => [...prev, index]);
      setMoves((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        setMatchedCards((prev) => [...prev, first, second]);
      }
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameStarted(false);
      alert(`You won! Moves: ${moves}, Time: ${time} seconds`);
      resetGame()
    }
  }, [matchedCards, cards.length, moves, time]);

  const startGame = () => {
    setGameStarted(true);
    setMoves(0);
    setTime(0);
    setMatchedCards([]);
    setFlippedCards([]);
    const dimensions = 4;
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
    setCards(items.map((item, index) => ({ id: index, emoji: item, flipped: false })));
  };

  const resetGame = () => {
    setGameStarted(false);
    setMoves(0);
    setTime(0);
    setMatchedCards([]);
    setFlippedCards([]);
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