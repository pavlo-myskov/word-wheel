document.getElementById('btn-spin').addEventListener('click', () => {runGame('wild_animals');})

const capitalLatinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Run game functions
 */
function runGame(topic) {
  resetFields();
  let word = getRandomWord(topic);  // get random word by topic from wordList array
  let definition = getDefinition(word); // get definition by the word and store it to the var

  document.getElementById('btn-spin').disabled = true;  // disable the btn-spin to prevent restart the 'runGame' function while the word not guessed

  // check user answer on click submit button
  document.getElementById('btn-sm').addEventListener('click', () => {checkAnswer(word);});

  // start changing random letters in the wheel by interval
  let charChanger = setInterval(insertRandomChar, 100);

  // start spinning the wheel faster
  let animCircle = document.getElementsByClassName('animated-circle')[0];
  animCircle.style.animationDuration = '0.3s';

  // Set a delay 1sec for running functions
  setTimeout(function() {
    displayDefinition(definition);  // call displayDefinition func with passed definition
    insertWord(word);  // call insertWord func with passed word
    activateInputBox();  // focus text cursor on the input field
    giveCredit(word);  // fill credit score field based on word length

    clearInterval(charChanger);  // stop changing random letters in the wheel
    document.getElementById('wheel-letter').innerHTML = "?";  // insert '?' instead of random letters
    animCircle.style.animationDuration = '20s';  // return the wheel animation to normal rotation speed
    document.getElementById('btn-sm').disabled = false; // enable submit button
  }, 1000);
}

/**
 * Clear the wheel, definition, word sections; reset credit score; clear and disable input field;
 */
function resetFields() {
  document.getElementById('wheel-letter').innerHTML = "";  // clear the wheel
  document.getElementById('definition-wrapper').style.height = '0px';  // collapse borders of definition section by reseting the element height
  document.getElementById('word-section').innerHTML = '';  // clear the card-letter section
  document.getElementById('word-section').style.background = '#7f8b7c';  // return the initial background-color for word section rectangle
  document.getElementById('credit-score').innerHTML = '0';  // reset credit-score
  disableInputBox();
}

/**
 * Get random word by topic from the wordList array in data.js file
 */
function getRandomWord(topicName) {
  let word;
  if (data.hasOwnProperty(topicName)) {
    let wordList = data[topicName];
    let randNum = Math.floor(Math.random() * wordList.length);
    word = wordList[randNum];
  } else {
    alert(`Topic "${topicName}" not found! Try another.`)
    throw(`Error! User selected Topic "${topicName}" not found!`)
  }

  word = validateWord(word);

  return word;
}

/**
 * Clean the word from excess spaces and special characters. Convert to lower case
 */
function validateWord(word) {
  word = word.toLowerCase().trim();  // convert to LowerCase and Remove the leading and trailing whitespace
  word = word.replace(/  +/g, ' ');  // replace multiple spaces with a single space
  word = word.replace(/[^a-z ]/g, '');  // remove all special characters except lower case letters and spaces

  return word;
}

function getDefinition(word) {
  return 'some description';
}

/**
 * Insert random char to the wheel
 */
function insertRandomChar() {
  let wheel = document.getElementById('wheel-letter');
  let ranNum = Math.floor(Math.random() * capitalLatinChars.length);  //generate random num from 0 to 'chars' string length
  wheel.innerHTML = capitalLatinChars[ranNum];  // get random char from the 'chars' string and insert to the 'wheel' element
};

/**
 * Get and Display the word definition to the user
 */
function displayDefinition(definition) {
  let definitionEl = document.getElementById('definition');

  definitionEl.innerHTML = definition;  // Insert the definition into definition element
  let textHeight = definitionEl.offsetHeight;  // Get the height of the inserted text;
  document.getElementById('definition-wrapper').style.height = `${textHeight + 15}px`;  // Expand the definition-wrapper to text height;
}

/**
 * Insert a word into flip cards for each letter
 * and show them to the user with the reverse sider
 */
function insertWord(word) {
  let wordListEl = document.getElementById('word-section');
  wordListEl.style.background = 'none';  // remove the initial background rectangle below the word

  // loop the word and create 'li' element-card for each letter
  for (let char of word) {
    let li = document.createElement('li');

    // if the char not a space, insert it to li element and add css property to allow the card to be flipped,
    // otherwise the letter-card space will be empty
    if (char !== ' ') {
      li.setAttribute('class', 'flip');
      // add front and back side to the card with word letter
      let listInner = `
      <div class="front">${char}</div>
      <div class="back"></div>`;
      li.innerHTML = listInner;
    };

    wordListEl.appendChild(li);

    // if li element not empty add event listener
    if (li.innerText) {
      // Reveal the hidden letter by fliping the card and removing the 'flip' class from 'li' element
      li.addEventListener('click', function () {showLetter(li)});
      // reduce credit score on click
      li.addEventListener('click', decrementCreditScore);
    };
  };
}

/**
 * Reveal the hidden letter by fliping the card and removing the 'flip' class from 'li' element
 */
function showLetter(li) {
  li.classList.remove('flip');

  // remove the event listener from the open char to prevent re-clicking which could lead to the next creditScore decreasing
  li.removeEventListener('click', decrementCreditScore);
}

/**
 * Enable access to the input field and and get focus text cursor on it
 */
function activateInputBox() {
  let answerBox = document.getElementById('answer-box');

  answerBox.disabled = false;
  answerBox.placeholder = 'type your answer';
  answerBox.classList.add('active');
}

/**
 * Clear and disable input box
 */
function disableInputBox() {
  let answerBox = document.getElementById('answer-box');

  answerBox.placeholder = 'spin the wheel';
  answerBox.value = '';  // clear input field
  answerBox.disabled = true;
  answerBox.classList.remove('active');
}


function checkAnswer(correctWord) {
  let answer = document.getElementById('answer-box').value

  if (!answer) {
    alert('Type the anwer!');
    return;
  }

  if (answer.toLowerCase() === correctWord) {
    incrementTotalScore();
    displayWin();
    } else {
      resetScore(); // reset total score
      displayGameOver(); // display red wheel
    };

  document.getElementById('credit-score').innerHTML = '0'; // reset credit-score
  document.getElementById('btn-sm').disabled = true;  // disable submit button
  document.getElementById('btn-spin').disabled = false;  // enable spin button
  displayCorrectWord();
  removeWord();
  }

/**
 * Get the remaining points from the credit score and adds them to the total
 */
function incrementTotalScore() {
  let totalScoreEl = document.getElementById('total-score');
  let creditScoreEl = document.getElementById('credit-score');

  let totalScore = parseInt(totalScoreEl.innerText);
  let creditScore = parseInt(creditScoreEl.innerText);

  totalScoreEl.innerHTML = totalScore + creditScore;
};

/**
 * Reset total score
 */
function resetScore() {
  document.getElementById('total-score').innerHTML = 0;
};

function displayWin() {}; // display green wheel
function displayGameOver() {}; // display red wheel

/**
 * /Reveal all letter-cards
 */
function displayCorrectWord() {
  let letters = document.getElementsByClassName('flip');
  for (let letter of letters) {
    showLetter(letter);
  }
};

function removeWord() {}; // remove word from data
//TODO---------------

/**
 * @description Gives the number of credit points to the user based on word length
 * @param {String} word extracted from data.js using 'getRandomWord' function
 */
function giveCredit(word) {
  word = word.replace(/ /g, '');  // remove all spaces from the string
  numLetters = word.length;

  document.getElementById('credit-score').innerHTML = numLetters;  // insert credit points
}

/**
 * Decrement credit score on click a hidden letter
 */
function decrementCreditScore() {
  let creditScoreEl = document.getElementById('credit-score');
  let creditScore = parseInt(creditScoreEl.innerText); // get current credit score

  creditScoreEl.innerHTML = --creditScore;
}