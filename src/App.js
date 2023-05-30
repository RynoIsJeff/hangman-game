import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State variables
  const [word, setWord] = useState(''); // The random word to be guessed
  const [guessedLetters, setGuessedLetters] = useState([]); // Array of guessed letters
  const [remainingAttempts, setRemainingAttempts] = useState(7); // Number of remaining attempts
  const [gameState, setGameState] = useState('playing'); // Current game state ('playing', 'lost')
  const [hangmanState, setHangmanState] = useState(1); // Current hangman state (used for rendering hangman image)

  useEffect(() => {
    // Load the dictionary and pick a random word
    fetch('/dictionary.txt')
      .then((response) => response.text())
      .then((data) => {
        const words = data.split('\n');
        const randomIndex = Math.floor(Math.random() * words.length);
        setWord(words[randomIndex]);
      });
  }, []);

  const handleLetterGuess = (letter) => {
    if (gameState !== 'playing') return; // Ignore letter guesses if the game is not in the 'playing' state
    const normalizedLetter = letter.toLowerCase();

    if (guessedLetters.includes(normalizedLetter)) return; // Ignore letter guesses that have already been made

    setGuessedLetters([...guessedLetters, normalizedLetter]); // Add the guessed letter to the array

    if (!word.includes(normalizedLetter)) {
      // Incorrect guess
      setRemainingAttempts(remainingAttempts - 1); // Decrement the remaining attempts
      setHangmanState(hangmanState + 1); // Increment the hangmanState

      if (remainingAttempts - 1 === 0) {
        // No remaining attempts, set game state to 'lost'
        setGameState('lost');
      }
    }
  };

  const handleRestart = () => {
    // Restart the game by resetting all state variables
    setWord('');
    setGuessedLetters([]);
    setRemainingAttempts(11);
    setGameState('playing');
    setHangmanState(1); // Reset the hangmanState
  };

  const renderWordDisplay = () => {
    // Render the word display with guessed letters and underscores
    return word.split('').map((letter, index) => {
      const isLetterGuessed = guessedLetters.includes(letter.toLowerCase());
      return (
        <span key={index} className="letter">
          {isLetterGuessed ? letter : '_'}
        </span>
      );
    });
  };

  const renderHangman = () => {
    // Render the hangman sketch based on the hangmanState
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

  return (
    <div className="App">
      <h1>Hangman Game</h1>
      <div className="hangman">{renderHangman()}</div>
      <div className="word-display">{renderWordDisplay()}</div>
      <div className="guessed-letters">
        <p>Guessed Letters: {guessedLetters.join(', ')}</p>
      </div>
      <div className="remaining-attempts">
        <p>Remaining Attempts: {remainingAttempts}</p>
      </div>
      {gameState === 'playing' && (
        <div>
          <p>Make a guess:</p>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLetterGuess(e.target.value);
                e.target.value = ''; // Clear the input field after each guess
              }
            }}
            maxLength={1}
          />
        </div>
      )}
      {gameState === 'lost' && (
        <div>
          <h2>You Lost!</h2>
          <button onClick={handleRestart}>New Game</button>
        </div>
      )}
    </div>
  );
}

export default App;
