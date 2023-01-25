import { topicWords } from "./vocabData.js";

/**
 * @description Start a loop in which the call of functions is initialized that try to get data:
 * topic data-value from topic button, random word from vocabData.js, definition from the dictionary api.
 * If it fails, the cycle restarts.
 * @param {String} topicName
 * @returns {Object} Object: word as property, definition as value
 */
export async function getData() {
  let topic;
  let word;
  let definition;

  while (true) {
    try {
      // Try to get values. Of success, break the loop and return values
      topic = await getTopic();
      word = await getRandomWord(topic);
      definition = await getDefinition(word);
      break;
    } catch (error) {
      // handle rethrow-ed HttpError instance and check responce status code. Restart loop
      // code 404 - the server cannot find the requested resource
      if (error instanceof HttpError && error.response.status == 404) {
        console.log(`${error}. | Definition for word <${word}> Not found. Searching new one...`);
      } else if (error instanceof WordError) {
        console.log(`${error} Searching new one...`)
      } else {
        throw error;
      }
    }
  }

  console.log(`|getData()| word: ${word}, definition: ${definition}`);
  return { 'word': word, 'definition': definition }
}

/**
 * Load topic names from vocabData.js and populate the dropdown menu with a list of topics
 */
export function loadTopics() {
  let topicBtn = document.getElementById('topic-btn');
  let dropdownMenu = document.getElementById('topic-dropdown-menu');
  // get the data-value attribute of the button which is equal to the value of the selected list item
  let topicBtnDataValue = topicBtn.getAttribute('data-value');
  // clear the content of the dropdown menu
  dropdownMenu.innerHTML = "";
  let topicNames = Object.keys(topicWords);  // get array of topic names

  topicNames.forEach(topicName => {
    // change all special characters with spaces
    let clearString = topicName.replace(/[^A-Za-z0-9']/g, ' ').trim();
    // capitalize the first letter for each word of the topic name string
    let topic = clearString.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');

    let li = document.createElement("li");
    // insert the parsed topic name to the 'li' element which will be displayed to the user
    li.innerHTML = topic;
    // set a row topic name string as a 'li' value
    li.setAttribute('value', topicName);

    // if the topic name is equal to the currently selected topic,
    // add the class "active-dropdown" to the <li> element to hide it from the dropdown menu
    if (topicName === topicBtnDataValue) {
      li.classList.add("active-dropdown");
    }

    dropdownMenu.appendChild(li);
  });
}

/**
 * Retrieve topic row value stored in a data-value attribute of the topic button
 */
async function getTopic() {
  let topicBtn = document.getElementById('topic-btn');
  let selectedTopic = topicBtn.getAttribute('data-value');

  // if topic is selected and the array of the related topic words is NOT empty, return data-value of the topic button
  if (selectedTopic && topicWords[selectedTopic].length > 0) {
    return selectedTopic
    // if topic is selected by the user, but array of the related topic words is EMPTY
  } else if (selectedTopic && topicWords[selectedTopic].length < 1) {
    delete topicWords[selectedTopic]; // remove current topic from topicWords object
    topicBtn.removeAttribute('data-value'); // remove data-value attribute from the topic button
    alert(`Topic <${topicBtn.innerHTML}> is out of words! Choose another topic.`); // notify the user
    topicBtn.innerHTML = 'Topics ';  // reset name of the topic button
    changeColor(topicBtn, 'rgb(186, 76, 3)', 2000);  // highlight the topic button in 2 sec
    throw new TopicError(`The word list of topic <${selectedTopic}> is Empty!`);
    // if data-value attribute of the topic button is empty, prompt the user select a topic
  } else if (!selectedTopic) {
    alert('Select a topic!');
    changeColor(topicBtn, 'rgb(186, 76, 3)', 1000);  // highlight the topic button
    throw new TopicError(`Topic not selected by the User`);
  } else {
    alert('Select a topic or refresh the game page!');
    throw new TopicError( `
    Data-value of the topic button: <${selectedTopic}>;
    InnerHTML of the topic button: <${topicBtn.innerHTML}>;
    Unknown error thought extracting topic. Aborting!
    `);
  }
}

/**
 * Extract and delete a random word by topic from the an array of words in vocabData.js file
 */
async function getRandomWord(topicName) {

  let wordList = topicWords[topicName];  // get array of words by topic

  let randNum = Math.floor(Math.random() * wordList.length); // get rand number from 0 to word array length
  let word = wordList.splice(randNum, 1)[0];  // pop the word from array by random index

  if (word) {
    let lowerCaseWord = word.toLowerCase().trim();  // convert to LowerCase and Remove the leading and trailing whitespace
    let withoutSpacesWord = lowerCaseWord.replace(/  +/g, ' ');  // replace multiple spaces with a single space
    let result = withoutSpacesWord.replace(/[^a-z ]/g, '');  // remove all special characters except lower case letters and spaces
    if (result) {
      if (result.length > 15) {
        throw new WordError(`The word <${word}> is too long!`);
      }
      return result;
    } else {
      throw new WordError(`The word <${word}> cannon be processed!`);
    };
  } else {
    throw new WordError(`An empty string cannot be processed!`);
  }
}

/**
 * Get a definition from the dictionary api by the random word
 * extracted from vocabData.js using the getRandomWord(topicName) func
 */
async function getDefinition(word) {
  const BASE_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  let response = await fetch(BASE_API_URL + word);
  if (response.status == 200) {
    let dataObj = await response.json();  // .json method convert json to js obj

    let definition = processDefinition(word, dataObj);

    return definition;

  } else {
    // creates new error object with passing a response of a fetch request
    throw new HttpError(response);
  }
}

/**
 * Extract definition from dataObj.
 * Replace all occurrences of the keyword with asterisks.
 * Truncate the definition to 210 characters if it longer.
 */
function processDefinition(word, dataObj) {
  // Parse definition from topicWords object
  let definition = dataObj[0].meanings[0].definitions[0].definition;
  let wordLength = word.length;
  // Replace the keyword with a string of asterisks of the word length
  // using pattern of a new regular expression with flag "i" to make it case-insensitive
  // and flag "g" - replace all occurrences of the substring
  let hiddenWordDef = definition.replace(new RegExp(word, 'gi'), '*'.repeat(wordLength));
  // truncate definition to 210 characters if it longer and add '...' to the end
  let truncatedDef = hiddenWordDef.length > 210 ? hiddenWordDef.substring(0, 210) + '...' : hiddenWordDef;
  return truncatedDef;
}

/**
 * Class representing an HTTP error.
 * @extends Error
 */
class HttpError extends Error {
  /**
     * Create an HTTP error.
     * @param {Object} response - The HTTP response object.
     * @property {number} response.status - The HTTP status code of the response.
     * @property {string} response.url - The URL of the request.
     * @property {string} name - The name of the error, defaults to "HttpError".
     * @property {Object} response - The HTTP response object.
     */
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

/**
 * A custom error class for handling errors related to processing topics.
 * @extends {Error}
 */
class WordError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WordError';
  }
}

/**
 * A custom error class for handling errors related to processing words.
 * @extends {Error}
 */
class TopicError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TopicError';
  }
}

/**
 * @description Change color of a passed element for a given amount of time and than return original color
 * @param {String} element
 * @param {String} color New color
 * @param {String} milliseconds
 */
function changeColor(element, color, milliseconds) {
  let originalColor = element.style.color;
  if (originalColor == color) {
    return;
  }
  element.style.color = color;
  setTimeout(function () {
    element.style.color = originalColor;
  }, milliseconds);
}