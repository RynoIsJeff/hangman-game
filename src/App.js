import React, { useState, useEffect } from 'react';
import './App.css';
import dictionary from './dictionary.txt';

function App() {
  // State variables
  const [word, setWord] = useState(''); // The word to guess
  const [guessedLetters, setGuessedLetters] = useState([]); // Array of guessed letters
  const [remainingAttempts, setRemainingAttempts] = useState(7); // Number of remaining attempts
  const [gameState, setGameState] = useState('playing'); // Current game state ('playing', 'won', 'lost')
  const [hangmanState, setHangmanState] = useState(1); // Current hangman state (1-7)

  // Fetch a random word from the dictionary when the component mounts
  useEffect(() => {
    fetchWordFromDictionary();
  }, []);

  // Fetch a random word from the dictionary file
  const fetchWordFromDictionary = () => {
    fetch(dictionary)
      .then((response) => response.text())
      .then((data) => {
        const words = data.split('\n');
        const randomIndex = Math.floor(Math.random() * words.length);
        setWord(words[randomIndex]);
      })
      .catch((error) => {
        console.log('Error fetching dictionary:', error);
      });
  };

  // Handle a letter guess
  const handleLetterGuess = (guess) => {
    if (gameState !== 'playing') return; // Ignore guesses if the game is not in progress

    const normalizedGuess = guess.toLowerCase();

    if (guessedLetters.includes(normalizedGuess)) return; // Ignore duplicate guesses

    const newGuessedLetters = [...guessedLetters, normalizedGuess];
    setGuessedLetters(newGuessedLetters);

    const currentGuessedWord = guessedWord();

    if (currentGuessedWord === word) {
      setGameState('won'); // Player won the game
      return;
    }

    if (!word.toLowerCase().includes(normalizedGuess)) {
      setRemainingAttempts(remainingAttempts - 1);
      setHangmanState(hangmanState + 1);

      if (remainingAttempts - 1 === 0) {
        setGameState('lost'); // Player lost the game
      }
    }
  };

  // Generate the current guessed word with underscores for unguessed letters
  const guessedWord = () => {
    return word
      .split('')
      .map((letter) =>
        guessedLetters.includes(letter.toLowerCase()) ? letter : '_ '
      )
      .join('');
  };

  // Restart the game
  const handleRestart = () => {
    setWord('');
    setGuessedLetters([]);
    setRemainingAttempts(7);
    setGameState('playing');
    setHangmanState(1);
    fetchWordFromDictionary();
  };

  // Render the hangman image based on the hangman state
  const renderHangman = () => {
    const hangmanImages = [
      `
       _____
      |     |
            |
            |
            |
            |
      `,
      `
       _____
      |     |
      O     |
            |
            |
            |
      `,
      `
       _____
      |     |
      O     |
      |     |
            |
            |
      `,
      `
       _____
      |     |
      O     |
     /|     |
            |
            |
      `,
      `
       _____
      |     |
      O     |
     /|\\    |
            |
            |
      `,
      `
       _____
      |     |
      O     |
     /|\\    |
     /      |
            |
      `,
      `
       _____
      |     |
      O     |
     /|\\    |
     / \\    |
            |
      `
    ];

    return <pre className="hangman">{hangmanImages[hangmanState - 1]}</pre>;
  };

  // Instructions component
  const Instructions = () => {
    return (
      <div className="instructions">
        <h3>How to Play:</h3>
        <p>Guess letters to complete the word.</p>
        <p>Enter your guess and press Enter to submit.</p>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Hangman Game</h1>
      {gameState === 'won' && <h2>You Won!</h2>}
      {gameState === 'lost' && <h2>You Lost!</h2>}
      {gameState !== 'playing' && <button onClick={handleRestart}>New Game</button>}
      <div className="hangman">{renderHangman()}</div>
      <div className="word-display">{guessedWord()}</div>
      <div className="guessed-letters">
        <p>Guessed Letters: {guessedLetters.join(', ')}</p>
      </div>
      <div className="remaining-attempts">
        <p>Remaining Attempts: {remainingAttempts}</p>
      </div>
      {gameState === 'playing' && (
        <div>
          <Instructions />
          <p>Make a guess:</p>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLetterGuess(e.target.value);
                e.target.value = '';
              }
            }}
            maxLength={1}
          />
        </div>
      )}
    </div>
  );
}

export default App;
