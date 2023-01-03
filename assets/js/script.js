let but = document.getElementsByTagName('button')[0]
but.addEventListener('click', insertWord)
but.addEventListener('click', displayDefinition)

/**
 * Displays the word definition for the user
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

let word = 'potato';

function insertWord() {
  let wordListEl = document.getElementById('word-list');

  for (char of word) {
    let li = document.createElement('li');
    li.setAttribute('class', 'flip')
    li.innerHTML = char
    wordListEl.appendChild(li)

    li.addEventListener('click', flipper)
  }
}

function flipper() {
  this.removeAttribute('class')
  console.log(this)
}