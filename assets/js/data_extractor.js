
// TODO: add new Class constructor extending error class for getRandomWord errors
/**
 * Extract and delete a random word by topic from the an array of words in data.js file
 */
async function getRandomWord(topicName) {
  if (data[topicName].length < 1) {
    delete data[topicName]; // remove current topic from data as array is empty
    loadTopics(); // update dropdown list
    alert(`Topic <${topicName}> is out of words! Choose another topic.`)
    throw new Error(`The word list of topic <${topicName}> is Empty!`);
  }

  let wordList = data[topicName];  // get array of words by topic
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
 * extracted from data.js using the getRandomWord(topicName) func
 */
async function getDefinition(word) {
  const BASE_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  let response = await fetch(BASE_API_URL + word);
  if (response.status == 200) {
    let dataObj = await response.json();  // .json method convert json to js obj

    let rowDefinition = parseDefinition(dataObj);
    let definition = validateDefinition(rowDefinition);

    return definition;

  } else {
    // creates new error object with passing a response of a fetch request
    throw new HttpError(response);
  }
}

/**
 * Parse definition from data object
 */
function parseDefinition(dataObj) {
  return dataObj[0].meanings[0].definitions[0].definition;
}

// TODO check the definition string length and cut it by the last dot while the string too long
// TODO replace keyword with asterixes
function validateDefinition(definition) {
  return definition;
}


/**
 * @description Start a loop in which the call of functions is initialized that try to get data:
 * a random word from data.js, and definition from the dictionary api.
 * If it fails, the cycle restarts.
 * @param {String} topicName
 * @returns {Object} Object: word as property, definition as value
 */
async function getData(topic) {
  let word;
  let definition;

  while (true) {
    try {
      // Try to get values. Of success, break the loop and return values
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