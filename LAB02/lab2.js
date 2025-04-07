// Luca Pitoscia
// 200290440
// Javascript Frameworks
// LAB02 Rock, Paper, Scissors in JavaScript
// Thursday Feb 6 2025

// Importing the prompt package
const prompt = require('prompt');

// Starting the prompt interface
prompt.start();

// Asking the user to choose either Rock, Paper, or Scissors
prompt.get(['userSelection'], function (err, result) {
  if (err) {
    console.error(err);
    return;
  }

  // Converting the users input to uppercase to allow for case-insensitive matching
  const userSelection = result.userSelection.toUpperCase();

  // Generating a random number between 0 and 1
  const randomNum = Math.random();
  let computerSelection;

  // Determining computers selection based on the generated random number
  if (randomNum < 0.34) {
    computerSelection = 'PAPER';
  } else if (randomNum < 0.68) {
    computerSelection = 'SCISSORS';
  } else {
    computerSelection = 'ROCK';
  }

  // Displaying the selections
  console.log(`Users Selection: ${userSelection}`);
  console.log(`Computers Selection: ${computerSelection}`);

  // Determining the outcome using standard Rock Paper Scissors rules
  if (userSelection === computerSelection) {
    console.log("It's a tie");
  } else if (
    (userSelection === 'ROCK' && computerSelection === 'SCISSORS') ||
    (userSelection === 'SCISSORS' && computerSelection === 'PAPER') ||
    (userSelection === 'PAPER' && computerSelection === 'ROCK')
  ) {
    console.log("User Wins!");
  } else {
    console.log("Computer Wins!");
  }
});

