import chalk from 'chalk';
import prompts from 'prompts';
import { randomInt } from 'crypto';

const MAX_ATTEMPTS = 5;
const secret = randomInt(1, 11);

console.log(chalk.bold.cyan('=== GUESS THE NUMBER ==='));
console.log(chalk.yellow(`Guess the secret number between 1 and 10. You have ${MAX_ATTEMPTS} attempts.`));

const { guess } = await prompts({
  type: 'text',
  name: 'guess',
  message: 'Enter a number between 1 and 10:'
});
console.log(`You entered: ${guess}`);