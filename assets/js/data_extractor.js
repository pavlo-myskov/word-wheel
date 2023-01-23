// TODO: add new Class constructor extending error class for getRandomWord errors
/**
 * @description Start a loop in which the call of functions is initialized that try to get data:
 * topic data-value from topic button, random word from vocabData.js, definition from the dictionary api.
 * If it fails, the cycle restarts.
 * @param {String} topicName
 * @returns {Object} Object: word as property, definition as value
 */
async function getData() {
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
        console.log(`Error: ${error}. | Definition for word <${word}> Not found. Searching new one...`);
      } else {
        // TODO: Catch passed(rethrow) custom error instance from getRandomWord and print them here, otherwise <else: throw error;> to runGame
        throw error;
      }
    }
  }

  console.log(`|${arguments.callee.name}()| word: ${word}, definition: ${definition}`);
  return { 'word': word, 'definition': definition }
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
    topicBtn.innerHTML = 'Topics ';  // reset name of the topic button
    topicBtn.removeAttribute('data-value'); // remove data-value attribute from the topic button
    alert(`Topic <${selectedTopic}> is out of words! Choose another topic.`); // notify the user
    changeColor(topicBtn, '#ba4c03', 1000);  // highlight the topic button in 1 sec
    throw new Error(`The word list of topic <${selectedTopic}> is Empty!`);
    // if data-value attribute of the topic button is empty, prompt the user select a topic
  } else if (!selectedTopic) {
    alert('Select a topic!');
    changeColor(topicBtn, '#ba4c03', 1000);  // highlight the topic button
    throw new Error(`Topic not selected by the User`);
  } else {
    alert('Select a topic or refresh the game page!');
    throw `
    Data-value of the topic button: <${selectedTopic}>;
    InnerHTML of the topic button: <${topicBtn.innerHTML}>;
    Unknown error thought extracting topic. Aborting!
    `
  }
}

/**
 * Extract and delete a random word by topic from the an array of words in vocabData.js file
 */
async function getRandomWord(topicName) {

  let wordList = topicWords[topicName];  // get array of words by topic
  let result;

  let randNum = Math.floor(Math.random() * wordList.length); // get rand number from 0 to word array length
  let word = wordList.splice(randNum, 1)[0];  // pop the word from array by random index

  if (word) {
    lowerCaseWord = word.toLowerCase().trim();  // convert to LowerCase and Remove the leading and trailing whitespace
    withoutSpacesWord = lowerCaseWord.replace(/  +/g, ' ');  // replace multiple spaces with a single space
    result = withoutSpacesWord.replace(/[^a-z ]/g, '');  // remove all special characters except lower case letters and spaces
    if (result) {
      return result;
    } else {
      throw new Error(`The word <${word}> cannon be processed!`);
    };
  } else {
    throw new Error(`An empty string cannot be processed!`);
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
 * Error handling middleware.
 * From the instance of the class you can acces the error value from the fetch response message property
 */
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

/**
 * @description Change color of a passed element for a given amount of time and than return original color
 * @param {String} element
 * @param {String} color New color
 * @param {String} milliseconds
 */
function changeColor(element, color, milliseconds) {
  var originalColor = element.style.color;
  element.style.color = color;
  setTimeout(function () {
    element.style.color = originalColor;
  }, milliseconds);
}