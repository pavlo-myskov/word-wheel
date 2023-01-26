import { loadTopics, getData } from "./data_extractor.js";

const capitalLatinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

window.addEventListener('load', () => {
  // Attach an event listener to the topic button
  document.getElementById('topic-btn').addEventListener('click', displayTopics);
  // Attach an event listener to the dropdown menu
  document.getElementById('topic-dropdown-menu').addEventListener('click', updateTopicBtn);
  // Attach an event listener to the spin button and remove it after runs the func runGame only once
  document.getElementById('btn-spin').addEventListener('click', () => { runGame(); }, { once: true });
  // Attach an event listener to the rules button
  document.getElementById('rules-btn').addEventListener('click', displayRules);


  document.body.onkeydown = function (e) {
    let isDisabledInput = document.getElementById('answer-box').disabled;
    // Trigger the `Spin the Wheel` button with a click if the user presses the "Space" key and input field is Not active
    if (isDisabledInput && e.key === " ") {
      e.preventDefault();
      document.getElementById('btn-spin').click();
    }
    // Trigger the `Submit` button with a click if the user presses the "Enter" key and input field is Active
    if (!isDisabledInput && e.key === "Enter") {
      e.preventDefault();
      document.getElementById('btn-sm').click();
    }
  };
})

/**
 * Call the `loadTopics` and `toggleMenu` funcs
 */
function displayTopics() {
  loadTopics();
  toggleMenu();
}

/**
 * Update the topic button text to the text of the clicked topic.
 */
function updateTopicBtn(event) {
  let topicBtn = document.getElementById('topic-btn');

  // if the clicked element is an li
  if (event.target.tagName === "LI") {
    // Update the name of topic button with the innerText of the clicked li element
    topicBtn.innerHTML = event.target.innerText + ' ';
    // get the row value attribute of the clicked li element
    let activeValue = event.target.getAttribute('value');
    // sets the data-value attribute of the topic-btn to the value of the clicked list item
    topicBtn.setAttribute("data-value", activeValue);

    toggleMenu();
  }
}

function toggleMenu() {
  let topicBtn = document.getElementById('topic-btn');
  let dropdownMenu = document.getElementById('topic-dropdown-menu');
  topicBtn.classList.toggle("inactive");
  topicBtn.classList.toggle("active");
  dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
}

/**
 * Initializes the launch of the game
 */
function runGame() {
  let word = '';
  let definition = '';

  resetFields();
  let letterChanger = spinWheel();  // start wheel animation

  // calls the getData() function which returns a promise
  // start a promise chaining, create new promise and pass the resolved value of getData()
  getData()
    .then(obj => new Promise(function (resolve) {
      word = obj.word;  // get a word value
      definition = obj.definition;  // get a definition value

      // sets a timeout of 1 sec and after that the callback function is executed
      setTimeout(() => {
        document.getElementsByClassName('wheel-outer')[0].style.background = '#d4d387'; // change wheel color
        document.getElementById('wheel-letter').innerHTML = "?";  // insert '?' instead of random letters
        displayDefinition(definition);  // call displayDefinition func with passed definition
        insertWord(word);  // call insertWord func with passed word
        activateInputBox();  // Enable access to the input field
        giveCredit(word);  // fill credit score field based on word length
        activateSubmitBtn(word);
        resolve(obj);  // resolve the promise
      }, 1000);
    }))
    // catch block for the promise, where if the promise is rejected, it logs the error message and resets the game
    .catch(err => {
      console.log(err);
      console.log('Resseting game..');
      resetFields();
      // enable spin button
      document.getElementById('btn-spin').disabled = false;
      // Attach an event listener to the spin button and remove it after runs the func runGame only once
      document.getElementById('btn-spin').addEventListener('click', () => { runGame(); }, { once: true });
    })
    .finally(() => {
      stopWheel(letterChanger);  // stop wheel animation
    });
}
/**
 * Clear the wheel, definition, word sections; reset credit score;
 * clear and disable input field; disable spin button
 */
function resetFields() {
  document.getElementById('wheel-letter').innerHTML = "";  // clear the wheel
  document.getElementById('definition-wrapper').style.height = '0px';  // collapse borders of definition section by reseting the element height
  document.getElementById('word-section').innerHTML = '';  // clear the card-letter section
  document.getElementsByClassName('wheel-outer')[0].style.background = '#bac189';  // reset color of the wheel
  document.getElementById('word-section').style.background = '#7f8b7c';  // return the initial background-color for word section rectangle
  document.getElementById('credit-score').innerHTML = '0';  // reset credit-score
  disableInputBox();
  // disable the btn-spin to prevent restart the 'runGame' function while the word not guessed
  document.getElementById('btn-spin').disabled = true;
}

/**
 * Spinning wheel animation with changing letters
 */
function spinWheel() {
  // start spinning the wheel faster
  let animCircle = document.getElementsByClassName('animated-circle')[0];
  animCircle.style.animationDuration = '0.3s';
  // Insert random char to the wheel the wheel by interval
  let letterChanger = setInterval(() => {
    let wheel = document.getElementById('wheel-letter');
    let ranNum = Math.floor(Math.random() * capitalLatinChars.length);  //generate random num from 0 to 'chars' string length
    wheel.innerHTML = capitalLatinChars[ranNum];  // get random char from the 'chars' string and insert to the 'wheel' element
  }, 100);

  return letterChanger;
}

/**
 * Reset the wheel animation
 */
function stopWheel(letterChanger) {
  let animCircle = document.getElementsByClassName('animated-circle')[0];
  animCircle.style.animationDuration = '20s';  // return the wheel animation to normal rotation speed
  clearInterval(letterChanger);  // stop changing random letters in the wheel
}

/**
 * Enable access to the input field
 */
function activateInputBox() {
  let answerBox = document.getElementById('answer-box');

  answerBox.disabled = false;
  answerBox.placeholder = 'type your answer';
  answerBox.classList.add('active');
}

/**
 * Reset and disable input box
 */
function disableInputBox() {
  let answerBox = document.getElementById('answer-box');

  answerBox.placeholder = 'spin the wheel';
  answerBox.value = '';  // clear input field
  answerBox.disabled = true;
  answerBox.classList.remove('active');
}

/**
 * Enable submit button and add event listener on click
 */
function activateSubmitBtn(word) {
  // enable submit button
  document.getElementById('btn-sm').disabled = false;
  // check user answer on click submit button
  document.getElementById('btn-sm').onclick = () => { checkAnswer(word); };
}

/**
 * Remove event listener and disable submit button
 */
function disableSubmitBtn() {
  document.getElementById('btn-sm').onclick = null; // remove event listener
  document.getElementById('btn-sm').disabled = true;  // disable submit button
}

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
 * Reveal all letter-cards
 */
function displayCorrectWord() {
  document.querySelectorAll('.flip').forEach(function (li) {
    // Reveal the hidden letter by fliping the card and removing the 'flip' class from 'li' element
    li.classList.remove('flip');
    // remove the event listener from the open char to prevent re-clicking which could lead to the next creditScore decreasing
    li.removeEventListener('click', decrementCreditScore);
  });
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
    }

    wordListEl.appendChild(li);

    // if li element not empty add event listener
    if (li.innerText) {
      // Reveal the hidden letter by fliping the card and removing the 'flip' class from 'li' element
      li.addEventListener('click', function () { this.classList.remove('flip'); });
      // reduce credit score on click
      li.addEventListener('click', decrementCreditScore);
    }
  }
}

/**
 * Checks if user answer equal to correct word and call relevant functions
 */
function checkAnswer(correctWord) {
  let answer = document.getElementById('answer-box').value;

  if (!answer) {
    alert('Type the anwer!');
  } else {
    if (answer.toLowerCase().trim() === correctWord) {
      incrementTotalScore();
      displayWin();
    } else {
      resetScore(); // reset total score
      displayGameOver(); // display red wheel
    }

    disableSubmitBtn();
    displayCorrectWord();
    disableInputBox();

    document.getElementById('credit-score').innerHTML = 0; // reset credit-score

    document.getElementById('btn-spin').disabled = false;  // enable spin button
    // Attach an event listener to the spin button and remove it after runs the func runGame only once
    document.getElementById('btn-spin').addEventListener('click', () => { runGame(); }, { once: true });
  }
}


/* ----Total Score ---- */
/**
 * Get the remaining points from the credit score and adds them to the total
 */
function incrementTotalScore() {
  let totalScoreEl = document.getElementById('total-score');
  let creditScoreEl = document.getElementById('credit-score');

  let totalScore = parseInt(totalScoreEl.innerText);
  let creditScore = parseInt(creditScoreEl.innerText);

  totalScoreEl.innerHTML = totalScore + creditScore;
}

/**
 * Reset total score
 */
function resetScore() {
  document.getElementById('total-score').innerHTML = 0;
}

/**
 * Display green wheel and check xmark ico
 */
function displayWin() {
  document.getElementById('wheel-letter').innerHTML = '<i class="fa-solid fa-check"></i>';
  document.getElementsByClassName('wheel-outer')[0].style.background = '#8cd1cf';
}

/**
 * Display red wheel and
 */
function displayGameOver() {
  document.getElementById('wheel-letter').innerHTML = '<i class="fa-solid fa-xmark"></i>';
  document.getElementsByClassName('wheel-outer')[0].style.background = '#d8b69d'; // change wheel color
}



/* ----Gredit Score ---- */
/**
 * @description Gives the number of credit points to the user based on word length
 * @param {String} word extracted from vocabData.js using 'getRandomWord' function
 */
function giveCredit(word) {
  word = word.replace(/ /g, '');  // remove all spaces from the string
  let numLetters = word.length;

  document.getElementById('credit-score').innerHTML = numLetters;  // insert credit points
}

/**
 * Decrement credit score on click a hidden letter
 */
function decrementCreditScore() {
  let creditScoreEl = document.getElementById('credit-score');
  let creditScore = parseInt(creditScoreEl.innerText); // get current credit score

  creditScoreEl.innerHTML = --creditScore;

  // remove the event listener from the open char to prevent re-clicking which could lead to the next creditScore decreasing
  this.removeEventListener('click', decrementCreditScore);

  if (creditScore < 1) {
    restartGameByCreditScore();
  }
}

/**
 * If all hidden letters opened by the user, the func disables acces to sumbit btn
 * and gives access to continue the game
 */
function restartGameByCreditScore() {
  disableSubmitBtn();
  disableInputBox();
  displayGameOver();

  // enable spin button
  document.getElementById('btn-spin').disabled = false;
  // Attach an event listener to the spin button and remove it after runs the func runGame only once
  document.getElementById('btn-spin').addEventListener('click', () => { runGame(); }, { once: true });
}

/**
 * Display the box of rules over the game window
 */
function displayRules() {
  document.getElementById('manual-box').style.display = 'block';
  document.getElementById('close').addEventListener('click', closeRules);
  document.getElementById('bye').addEventListener('click', closeRules);
}

/**
 * Close the box of rules and remove event listeners from `close` and `bye` buttons
 */
function closeRules() {
  document.getElementById('manual-box').style.display = 'none';
  document.getElementById('close').removeEventListener('click', closeRules);
  document.getElementById('bye').removeEventListener('click', closeRules);
}