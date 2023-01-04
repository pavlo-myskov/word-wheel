let but = document.getElementsByTagName('button')[0]
but.addEventListener('click', runGame)

/**
 * Insert random letters to the wheel by interval and than Run functions
 */
function runGame() {
  let charWindow = document.getElementById('wheel-letter');
  let timer = setInterval(insertRandomChar, 100); // insert random letters to the wheel by interval

  // Set a delay for running functions
  setTimeout(function() {
    // let word = getRandomWord();  // store the recieved word to the var
    // let definition = getDefinition(); // store the recieved definition to the var
    let word = 'potato';
    let definition = 'Annual native to South America having underground stolons bearing edible starchy tubers; widely cultivated as a garden vegetable; vines are poisonous'
    displayDefinition(definition);  // run displayDefinition func with passed definition
    insertWord(word);  // run insertWord func with passed word
    clearInterval(timer);  // stop changing random letters in the wheel
    charWindow.innerHTML = "?";
  }, 1000)
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
  let definitionWrapper = document.getElementById('definition-wrapper');

  definitionEl.innerHTML = definition;  // Insert the definition into definition element
  let textHeight = definitionEl.offsetHeight;  // Get the height of the inserted text;
  definitionWrapper.style.height = `${textHeight + 15}px`;  // Expand the definition-wrapper to text height;
}

/**
 * Get and Divide the correct word into flip cards for each letter
 * and show them to the user with the reverse sider
 */
function insertWord(word) {
  let wordListEl = document.getElementById('word-list');

  for (char of word) {
    let li = document.createElement('li');  // loop the word and create 'li'element-card for each letter
    li.setAttribute('class', 'flip');  // add a css property to allow the card to be flipped
    let listInner = `
        <div class="front">${char}</div>
        <div class="back"></div>`;  // add front and back side to the card
    li.innerHTML = listInner;
    wordListEl.appendChild(li);
    wordListEl.style.background = 'none';

    li.addEventListener('click', showLetter);
  };
}


function showLetter() {
  this.removeAttribute('class')
  // add func that decrease counter
}