// The 'readFilesSync()' function is based on "Read files synchronously, store in array, natural sorting" code answer from this topic:
// https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object


/*This script is NOT a part of the GAME.

This is an additional script that simplifies the work for developer
and helps to get words from the external file and add them to the game

Node.js is required
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
const stringForJS = `const data = ${string}`; // create variable contains an object with topics and words for javascript file

try {
  fs.writeFileSync('assets/js/data.js', stringForJS, 'utf-8');  // generate javascript file with object of topics and words
  console.log('data.js file is sucsesfully generated')
} catch (err) {
  console.error(err);
}
