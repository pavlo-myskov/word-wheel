// The 'readFilesSync()' function is based on "Read files synchronously, store in array, natural sorting" code answer from this topic:
// https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object


/*This script is NOT a part of the GAME.

This is an additional script that simplifies the work for developer
and helps to get words from the external file and add them to the game

Node.js is required

How to use:
1. Add txt file with topic name to the 'topics' folder located next to the 'parser.js' file.
- Relative path to the the parser: < assets/data/parser.js >
- The file name must be without spaces. A space can be replaced with an underscore, e.g. wild_animals
2. Fill in this file with the English words you want to add to the game.
- Each word must be on the new line.
- Avoid words that are too long or contain any characters other than letters of the Latin alphabet.
3. Run in the terminal: < nodejs relative_path_to/parser.js >, e.g. nodejs assets/data/parser.js
4. vocabData.js file is sucsesfully generated on path < assets/js/vocabData.js >.
- All topics and words will be replaced with the words from 'topics' folder located next to the 'parser.js' file.
- The filename will be used as a property in the javascript object in < assets/js/vocabData.js >
- All words from the file will be added to array and used as a value in the javascript object in < assets/js/vocabData.js >
*/

const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * @description Read all files synchronously from a folder,
 * split words from the file by the line break and store to the arrays
 *
 * @param {String} dir path to directory
 * @returns {Object} Object with topics as properties and values as lists of related words:
 * `topicName: wordList`
 */
function readFilesSync(dir) {
  let data = {};

  fs.readdirSync(dir).forEach(filename => {
    let filepath = path.resolve(dir, filename);  // get absolute path to the file
    let content = fs.readFileSync(filepath, {encoding:'utf8', flag:'r'});  // read and return each file

    let wordList = content.split("\n");  // split words from the file by the line break
    wordList = [... new Set(wordList)]; // remove dublicates and store as array
    let topicName = path.parse(filename).name;  // remove type of file (e.g .txt)

    data[topicName] = wordList;
  });

  return data;
}

const words = readFilesSync('assets/data/topics/');

const string = util.inspect(words, { maxArrayLength: null });  // convert an object to a string
const stringForJS = `export const topicWords = ${string}`; // create variable contains an object with topics and words for javascript file

try {
  fs.writeFileSync('assets/js/vocabData.js', stringForJS, 'utf-8');  // generate javascript file with object of topics and words
  console.log('vocabData.js file is sucsesfully generated')
} catch (err) {
  console.error(err);
}
