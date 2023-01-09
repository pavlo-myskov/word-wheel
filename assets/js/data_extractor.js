
/**
 * Extract and delete a random word by topic from the an array of words in data.js file
 */
async function getRandomWord(topicName) {
  // TODO if topic is end and start new topic
  // FIXME total score counter
  let result;
  try {
    let wordList = data[topicName];  // het array of words by topic
    let randNum = Math.floor(Math.random() * wordList.length); // get rand number from 0 to word array length
    let word = wordList.splice(randNum, 1)[0];  // pop the word from array by random index

    if (word) {
      lowerCaseWord = word.toLowerCase().trim();  // convert to LowerCase and Remove the leading and trailing whitespace
      withoutSpacesWord = lowerCaseWord.replace(/  +/g, ' ');  // replace multiple spaces with a single space
      result = withoutSpacesWord.replace(/[^a-z ]/g, '');  // remove all special characters except lower case letters and spaces
      if (result) {
        return result;
      } else {
        result = getRandomWord(topicName);  // recursive function that extracts new word from data
      };
    } else {
      result = getRandomWord(topicName);
    }
    console.log(`Validated word: ${result}`);
    return result;
  }
  catch (error) {
    console.log(error)
  }
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
      switch (response.status) {
        case 404:
          console.log(`Definition for word: <${word}> not found!`)
          break;
        default:
          alert('There has been a breakdown. Restart the game or try again later');
          throw new Error(`HTTP error: ${response.status}`);
      }

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
  console.log('definition.length:', definition.length);
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
