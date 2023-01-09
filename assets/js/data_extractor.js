
/**
 * Extract and delete a random word by topic from the an array of words in data.js file
 */
async function getRandomWord(topicName) {
  let word;
  try {
    if (data.hasOwnProperty(topicName)) {
      let wordList = data[topicName];  // het array of words by topic
      let randNum = Math.floor(Math.random() * wordList.length); // get rand number from 0 to word array length
      word = wordList.splice(randNum, 1)[0];  // pop the word from array by random index
    } else {
      alert(`Topic "${topicName}" not found! Try another.`)
      throw (`Error! User selected Topic "${topicName}" not found!`)
    }

    result = validateWord(topicName, word);
    console.log(`|${arguments.callee.name}()| Validated word: ${result}`);  // func name
    return result;
  }
  catch (error) {
    console.log(error)
  }
}

/**
 * Cleans the word from excess spaces and special characters; converts to lower case
 */
function validateWord(topicName, word) {
  word = word.toLowerCase().trim();  // convert to LowerCase and Remove the leading and trailing whitespace
  word = word.replace(/  +/g, ' ');  // replace multiple spaces with a single space
  word = word.replace(/[^a-z ]/g, '');  // remove all special characters except lower case letters and spaces

  if (!word) {
    console.log(`Word is undefined. Searching the new word`);
    word = getRandomWord(topicName);
  }

  return word;
}

/**
 * Get a definition from the free dictionary api by the random word
 * extracted from data.js using the getRandomWord(topicName) func
 */
async function getDefinition(word) {
  const BASE_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  let definition;

  try {
    let response = await fetch(BASE_API_URL + word);
    console.log(response)
    if (!response.ok) {
      definition = undefined;
      console.log(`|${arguments.callee.name}()| Definition for word: <${word}> not found!`)
      return definition;
    } else {
      let dataObj = await response.json();  // .json method convert json to js obj

      let rowDefinition = parseDefinition(dataObj);
      definition = validateDefinition(rowDefinition)

      return definition;
    }
  }
  catch (error) {
    console.log(error)
  }
}

/**
 * Extracts definition from data object
 */
function parseDefinition(dataObj) {
  return dataObj[0].meanings[0].definitions[0].definition
}

function validateDefinition(definition) {
  console.log(definition.length);
  return definition;
}

async function getData(topic) {
  try {
    let word = await getRandomWord(topic);
    let definition = await getDefinition(word);
    let dataObj = { 'word': word, 'definition': definition }

    console.log(`|${arguments.callee.name}()| word: ${word}, definition: ${definition}`)

    if (!word || !definition) {
      console.log(`|${arguments.callee.name}()| word: ${word}, definition: ${definition}`)
      dataObj = getData(topic);
    }

    return dataObj
  }
  catch (error) {
    console.log(error)
  }
}
