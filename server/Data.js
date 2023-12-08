// Use strict mode for better error handling
'use strict';

// Array of supported languages
const languages = ["en", "se"];

// Importing the readFileSync function from the 'fs' module
import { readFileSync } from "fs";

// Data class constructor
function Data() {
  // Object to store poll data
  this.polls = {};
  this.participants = {};
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

// Method to retrieve questions from a JSON file
Data.prototype.getQuestions = function () {
  const questions = readFileSync("./server/data/preparedquestions.json");
  return JSON.parse(questions);
}

// Method to retrieve UI labels based on the specified language
Data.prototype.getUILabels = function (lang = "en") {
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

// Method to create a new poll
Data.prototype.createPoll = function (pollId, lang = "en", questionNo = 5, categoryNo = 5) {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang;
    poll.questions = Array.from({ length: questionNo }, () => Array.from({ length: categoryNo }, () => ({
      question: '',
      answer: '',
      completed: false
    }))),
      // ha koll på completed
      poll.categories = Array.from({ length: categoryNo }, () => "");
    poll.currentQuestion = 0;
    this.polls[pollId] = poll;

    let participantData = {};
    participantData.cashTotal = {};
    participantData.allParticipants = [];
    this.participants[pollId] = participantData;

    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

// Method to add a question to an existing poll
Data.prototype.addQuestion = function (pollId, q) {
  const poll = this.polls[pollId];
  console.log("question added to", pollId, q);
  if (typeof poll !== 'undefined') {
    poll.questions.push(q);
  }
}

// Method to edit a question in an existing poll
Data.prototype.editQuestion = function (pollId, row, col, newQuestion) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[row][col].question = newQuestion.q;
    poll.questions[row][col].answer = newQuestion.a;
  }
}

Data.prototype.editCategory = function (pollId, col, newCategory) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.categories[col] = newCategory;
  }
}

// Method to get the current question in a poll
Data.prototype.getQuestion = function (pollId, questionRow, questionCol) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    if (questionRow !== null && questionCol !== null) {
      return poll.questions[questionRow][questionCol].question;
    }
  }
  return [];
}

// Method to submit an answer to the current question in a poll
Data.prototype.submitAnswer = function (pollId, answer) {
  const poll = this.polls[pollId];
  console.log("answer submitted for ", pollId, answer);
  if (typeof poll !== 'undefined') {
    let answers = poll.answers[poll.currentQuestion];
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    else if (typeof answers[answer] === 'undefined') {
      answers[answer] = 1;
    }
    else {
      answers[answer] += 1;
    }
    console.log("answers looks like ", answers, typeof answers);
  }
}

// Method to get answers for the current question in a poll
Data.prototype.getAnswers = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return { q: poll.questions[poll.currentQuestion].q, a: answers };
    }
  }
  return {};
}

Data.prototype.retrieveQuestions = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const questions = poll.questions;
    return questions;
  }
  return {};
}

Data.prototype.retrieveCategories = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const categories = poll.categories;
    return categories;
  }
  return {};
}

Data.prototype.newParticipant = function (pollId, participantName) {
  const poll = this.polls[pollId];
  const part = this.participants[pollId];
  if (typeof part !== 'undefined' && typeof poll !== 'undefined' && !this.participants[pollId].allParticipants.includes(participantName)) {
    part.allParticipants.push(participantName);
    part.cashTotal[participantName] = 0;
  }
}

Data.prototype.getParticipants = function (pollId) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    const allParticipants = part.allParticipants;
    console.log("data getparticipants", allParticipants)
    return allParticipants;
  }
}

Data.prototype.completeQuestion = function (pollId, row, col) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[row][col].completed = true;
  }
}

Data.prototype.checkExisting = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    return true;
  }
  return false;
}

Data.prototype.addParticipantAnswer = function (pollId, participant, answerParticipant) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    part.answers[participant] = answerParticipant;
  }
}

Data.prototype.getCorrectAnswer = function (pollId, row, col) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    console.log("data get correct answer", poll.questions[row][col].answer)
    return poll.questions[row][col].answer;
  }
}

Data.prototype.updateCashTotal = function (pollId, partName, row, col) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    console.log(100*(row + 1))
    console.log(row)
    part.cashTotal[partName] += (100 * (1 + parseInt(row, 10)));
  }
}

Data.prototype.getCashTotal = function (pollId, partName) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    return part.cashTotal[partName];
  } 
};



// Export the Data class for use in other modules
export { Data };