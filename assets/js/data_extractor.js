
/**
 * Extract and delete a random word by topic from the an array of words in data.js file
 */
function getRandomWord(topicName) {
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

