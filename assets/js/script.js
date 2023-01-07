let spinButton = document.getElementById('btn-spin');
spinButton.addEventListener('click', () => {runGame('wild_animals');})

const capitalLatinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Run game functions
 */
function runGame(topic) {
  resetFields();
  let word = getRandomWord(topic);  // get random word by topic from wordList array
  let definition = getDefinition(word); // get definition by the word and store it to the var

  // spinButton.disabled = true;  // disable the btn-spin to prevent restart the 'runGame' function while the word not guessed

  // start changing random letters in the wheel by interval
  let timer = setInterval(insertRandomChar, 100);

  // start spinning the wheel faster
  let animCircle = document.getElementsByClassName('animated-circle')[0];
  animCircle.style.animationDuration = '0.3s';

  // Set a delay 1sec for running functions
  setTimeout(function() {
    displayDefinition(definition);  // call displayDefinition func with passed definition
    insertWord(word);  // call insertWord func with passed word
    activateInputBox();  // focus text cursor on the input field
    clearInterval(timer);  // stop changing random letters in the wheel
    document.getElementById('wheel-letter').innerHTML = "?";  // insert '?' instead of random letters
    animCircle.style.animationDuration = '20s';  // return the wheel animation to normal rotation speed
  }, 1000);
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
 * Clean a word from excess spaces and special characters. Convert to lower case
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
  let letterCounter = 0;

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

    // if li element not empty add event listeners
    if (li.innerText) {
      letterCounter++;  //
      // Reveal the hidden letter by fliping the card and removing the 'flip' class from 'li' element
      li.addEventListener('click', function() {this.removeAttribute('class')});
      // reduce current score on click
      li.addEventListener('click', () => {decrementCurrentScore(letterCounter);});
    };
  };
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

/**
 * @description Calculate the average score per letter depending on the length of the word.
 * For each open letter removes a certain number of points from 'currentScore'
 * @param {Number} numLetters Takes the number of letters in the word as an argument.
 */
function decrementCurrentScore(numLetters) {
  let currentScoreEl = document.getElementById('current-score');
  let currentScore = parseFloat(currentScoreEl.innerText); // get current score

  let pointsPerChar = 10 / numLetters; // get average score per letter
  currentScore -= pointsPerChar;
  currentScoreEl.innerHTML = currentScore.toFixed(1);  //  rounds the string to a specified number of decimals
}

/**
 * Clear the wheel, definition, word sections and input field
 */
function resetFields() {
  document.getElementById('wheel-letter').innerHTML = "";  // clear the wheel
  document.getElementById('definition-wrapper').style.height = '0px';  // collapse borders of definition section by reseting the element height
  document.getElementById('word-section').innerHTML = '';  // clear the card-letter section
  document.getElementById('word-section').style.background = '#7f8b7c';  // return the initial background-color for word section rectangle
  document.getElementById('current-score').innerHTML = '10';
  disableInputBox();
}