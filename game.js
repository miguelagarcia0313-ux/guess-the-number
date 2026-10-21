//import necessary modules
import chalk from 'chalk';
import prompts from 'prompts';
import { randomInt } from 'crypto';
import fs from 'fs';

// Define game constants
const MAX_ATTEMPTS = 3;
const MAX_NUMBER = 10;
const LOG_FILE = 'game-output.txt';

// start a fresh log each game
fs.writeFileSync(LOG_FILE, ''); 

//Function to output messages to console and log file, with optional color formatting
function output(message, color = (t) => t) {
  console.log(color(message));
  fs.appendFileSync(LOG_FILE, message + '\n');
}

//Function to validate the user's guess input
function validateGuess(input) {
  const trimmed = String(input ?? '').trim();
  if (trimmed === '') throw new Error('A guess is required.');

  const num = Number(trimmed);
  if (!Number.isInteger(num)) throw new Error('Enter a whole number (no letters or decimals).');
  if (num <= 0) throw new Error('Guess must be at least 1.');
  if (num > MAX_NUMBER) throw new Error(`Guess cannot exceed ${MAX_NUMBER}.`);

  return num;
}

//Number to be guessed is randomly generated between 1 and MAX_NUMBER (inclusive)
const secret = randomInt(1, MAX_NUMBER + 1);

// Start the game Instruction are proper in game design
output('GUESS THE NUMBER!', chalk.bold.magenta);
output('____________________________________________', chalk.cyan);
output(`Guess a  number between 1 and ${MAX_NUMBER}.`, chalk.white);
output(`Rules: You have ${MAX_ATTEMPTS} attempts. I will tell you if your guess is too low or too high.`, chalk.white);

let attempts = 0;
let won = false;

// Main game loop
while (attempts < MAX_ATTEMPTS && !won) {
  const response = await prompts(
    {
      type: 'text',
      name: 'guess',
      message: `Attempt ${attempts + 1}/${MAX_ATTEMPTS} - Guess a number between 1 and ${MAX_NUMBER}:`
    },
    { onCancel: () => { output('Game cancelled.', chalk.gray); process.exit(0); } }
  );
attempts++;
  // Validate and process the user's guess
  try {
    const guess = validateGuess(response.guess);
    

    if (guess === secret) {
      won = true;
      //Final Message if the user guessed the number correctly
      output(`Congratulations! You guessed ${secret} in (${attempts}) attempt's!`, chalk.green);
    } else if (guess < secret) {
      output(`${guess} is too low.`, chalk.yellow);
    } else {
      output(`${guess} is too high.`, chalk.yellow);
    }
  } catch (error) {
    output(`Invalid input: ${error.message}`, chalk.red);
  }
}

//Final Message if the user did not guess the number within the allowed attempts
if (!won) {
  output('\nGame over!', chalk.bold.red);
  output(`The secret number was ${secret}.`, chalk.whiteBright);
  output("Thanks for playing!", chalk.magenta);
}