let spinButton = document.getElementById('spin-button');
spinButton.addEventListener('click', runGame)

/**
 * Insert random letters to the wheel by interval and than Run functions
 */
function runGame() {
  resetFields();
  let word = getRandomWord();  // get random word from and store it to the var
  let definition = getDefinition(word); // get definition by the word and store it to the var

  // spinButton.disabled = true;  // disable the spin-button to prevent restart the 'runGame' function

  // start changing random letters in the wheel by interval
  let timer = setInterval(insertRandomChar, 100);

  // start spinning the wheel faster
  let animCircle = document.getElementsByClassName('animated-circle')[0];
  animCircle.style.animationDuration = '0.3s';

  // Set a delay 1sec for running functions
  setTimeout(function() {
    displayDefinition(definition);  // run displayDefinition func with passed definition
    insertWord(word);  // run insertWord func with passed word

    clearInterval(timer);  // stop changing random letters in the wheel
    document.getElementById('wheel-letter').innerHTML = "?";  // insert '?' instead of random letters
    animCircle.style.animationDuration = '20s';  // return the wheel animation to normal rotation speed
  }, 1000);
}

/**
 * Get random word from the object
 */
function getRandomWord() {
  let keys = Object.keys(dict);
  let randNum = Math.floor(Math.random() * keys.length);
  let word = keys[randNum];
  return word.toLowerCase();
}

function getDefinition(word) {
  return dict[word];
}

/**
 * Insert random char to the wheel
 */
function insertRandomChar() {
  let wheel = document.getElementById('wheel-letter');
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let ranNum = Math.floor(Math.random() * chars.length);  //generate random num from 0 to 'chars' string length
  wheel.innerHTML = chars[ranNum];  // get random char from the 'chars' string and insert to the 'wheel' element
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
 * Get and Divide the correct word into flip cards for each letter
 * and show them to the user with the reverse sider
 */
function insertWord(word) {
  let wordListEl = document.getElementById('word-section');

  // loop the word and create 'li' element-card for each letter
  for (char of word) {
    let li = document.createElement('li');
    li.setAttribute('class', 'flip');  // add a css property to allow the card to be flipped

    // add front and back side to the card with word letter
    let listInner = `
        <div class="front">${char}</div>
        <div class="back"></div>`;
    li.innerHTML = listInner;
    wordListEl.appendChild(li);

    wordListEl.style.background = 'none';  // remove the initial background rectangle below the word

    li.addEventListener('click', showLetter);  // add event listener for each flip-card with letter
  };
}

/**
 * Reveal the hidden letter by fliping the card and removing the 'flip' class from 'li' element
 */
function showLetter() {
  this.removeAttribute('class')
  // add func that decrease counter
}

/**
 * Reset wheel, definition, word fields
 */
function resetFields() {
  document.getElementById('wheel-letter').innerHTML = "";  // clear the wheel
  document.getElementById('definition-wrapper').style.height = '0px';  // collapse borders of definition section by reseting the element height
  document.getElementById('word-section').innerHTML = '';  // clear the card-letter section
  document.getElementById('word-section').style.background = '#7f8b7c';  // return the initial background-color for word section rectangle
}