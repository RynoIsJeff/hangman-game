import React, { useState, useEffect } from 'react';
import './App.css';
import dictionary from './dictionary.txt';

function App() {
  const [word, setWord] = useState(''); // Stores the current word to guess
  const [guessedLetters, setGuessedLetters] = useState([]); // Stores the letters that have been guessed
  const [remainingAttempts, setRemainingAttempts] = useState(7); // Stores the number of remaining attempts
  const [gameState, setGameState] = useState('playing'); // Stores the state of the game: 'playing', 'won', or 'lost'
  const [hangmanState, setHangmanState] = useState(1); // Stores the current state of the hangman image

  useEffect(() => {
    fetchWordFromDictionary(); // Fetches a word from the dictionary when the component mounts
  }, []);

  const fetchWordFromDictionary = () => {
    fetch(dictionary) // Fetches the dictionary file
      .then((response) => response.text())
      .then((data) => {
        const words = data.split('\n'); // Splits the data into an array of words
        const randomIndex = Math.floor(Math.random() * words.length); // Generates a random index within the range of words array
        setWord(words[randomIndex]); // Sets a random word as the current word to guess
      })
      .catch((error) => {
        console.log('Error fetching dictionary:', error);
      });
  };

  const handleLetterGuess = (guess) => {
    if (gameState !== 'playing') return; // If the game is not in the 'playing' state, do nothing

    const normalizedGuess = guess.toLowerCase(); // Convert the guess to lowercase

    if (guessedLetters.includes(normalizedGuess)) return; // If the letter has already been guessed, do nothing

    const newGuessedLetters = [...guessedLetters, normalizedGuess];
    setGuessedLetters(newGuessedLetters); // Add the new guess to the list of guessed letters

    const currentGuessedWord = guessedWord();

    if (currentGuessedWord === word) {
      setGameState('won'); // If the current guessed word is equal to the word, set the game state to 'won'
      return; // Exit the function early if the game is won
    }

    if (!word.toLowerCase().includes(normalizedGuess)) {
      setRemainingAttempts(remainingAttempts - 1); // Reduce the number of remaining attempts if the guessed letter is incorrect
      setHangmanState(hangmanState + 1); // Increment the hangman state to display the next hangman image

      if (remainingAttempts - 1 === 0) {
        setGameState('lost'); // If there are no remaining attempts, set the game state to 'lost'
      }
    }
  };

  const guessedWord = () => {
    return word
      .split('')
      .map((letter) =>
        guessedLetters.includes(letter.toLowerCase()) ? letter : '_' // Replaces the letters that have not been guessed with underscores
      )
      .join('');
  };

  const handleRestart = () => {
    setWord(''); // Reset the word
    setGuessedLetters([]); // Reset the guessed letters
    setRemainingAttempts(7); // Reset the remaining attempts
    setGameState('playing'); // Set the game state to 'playing'
    setHangmanState(1); // Reset the hangman state
    fetchWordFromDictionary(); // Fetch a new word from the dictionary
  };

  const renderHangman = () => {
    const hangmanImages = [
      // An array of hangman images, each represented as a multi-line string
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

    return <pre className="hangman">{hangmanImages[hangmanState - 1]}</pre>; // Renders the hangman image based on the current hangman state
  };

  return (
    <div className="App">
      <h1>Hangman Game</h1>
      <p>After completing the word, simply tap enter to end the game!</p>
      {gameState === 'won' && <h2>You Won!</h2>}
      {gameState === 'lost' && <h2>You Lost!</h2>}
      {gameState !== 'playing' && (
        <button onClick={handleRestart}>New Game</button>
      )}
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
    </div>
  );
}

export default App;