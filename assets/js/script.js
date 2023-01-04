let but = document.getElementsByTagName('button')[0]
but.addEventListener('click', insertWord)
but.addEventListener('click', displayDefinition)

/**
 * Displays the word definition to the user
 */
function displayDefinition() {
  // let definition = getDefinition() //the func returns recieved definition from api and store in var
  let definition = 'Annual native to South America having underground stolons bearing edible starchy tubers; widely cultivated as a garden vegetable; vines are poisonous'
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
function insertWord() {
  let word = 'potato';
  // let word = getRandomWord();  // store the recieved word to the var
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
  }
  console.log(wordListEl)
}


function showLetter() {
  this.removeAttribute('class')
  // add func that decrease counter
}