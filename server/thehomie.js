// Use strict mode for better error handling
'use strict';

import { readFileSync } from 'fs';
import { readFile } from 'fs';
import { writeFile } from 'fs';
import { writeFileSync } from 'fs';
import { promises } from 'fs';
import OpenAI from 'openai';
import { config } from 'dotenv';
config();

// Data class constructor
function Data() {
  // Object to store poll data
  this.polls = {};
  this.participants = {};
  this.autoPollId = 0;
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

// Method to retrieve UI labels based on the specified language
Data.prototype.getUILabels = function (lang = "en") {
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createTestQuiz = function () {
  if (typeof this.polls["testquiz"] === "undefined") {
  console.log("data create test quiz")
  let poll = {};
    poll.lang = "en";
    poll.questions = [
      [
        { "question": "Traditional Christmas color", "answer": "red", "completed": false, "numberAnswers": 0 },
        { "question": "Festive sweet treats often hung on trees", "answer": "candy canes", "completed": false, "numberAnswers": 0 },
        { "question": "Activity of decorating a tree with ornaments", "answer": "trimming the tree", "completed": false, "numberAnswers": 0 },
        { "question": "Jolly bearded man who delivers gifts", "answer": "santa claus", "completed": false, "numberAnswers": 0 },
        { "question": "Christmas song with the lyrics 'Jingle Bells'", "answer": "jingle bells", "completed": false, "numberAnswers": 0 }
      ],
      [
        { "question": "Color of Santa's suit", "answer": "red", "completed": false, "numberAnswers": 0 },
        { "question": "Popular Christmas beverage with spices", "answer": "eggnog", "completed": false, "numberAnswers": 0 },
        { "question": "Holiday where people exchange gifts", "answer": "christmas", "completed": false, "numberAnswers": 0 },
        { "question": "Fictional character who wants to steal Christmas presents", "answer": "grinch", "completed": false, "numberAnswers": 0 },
        { "question": "Famous Christmas poem about a visit from St. Nicholas", "answer": "twas the night before christmas", "completed": false, "numberAnswers": 0 }
      ],
      [
        { "question": "Shiny color often used in decorations", "answer": "gold", "completed": false, "numberAnswers": 0 },
        { "question": "Traditional Christmas dessert with fruit and nuts", "answer": "fruitcake", "completed": false, "numberAnswers": 0 },
        { "question": "Traditional Christmas meal with turkey", "answer": "christmas dinner", "completed": false, "numberAnswers": 0 },
        { "question": "Christmas character who checks if you've been naughty or nice", "answer": "santa claus", "completed": false, "numberAnswers": 0 },
        { "question": "Christmas movie about a boy left home alone", "answer": "home alone", "completed": false, "numberAnswers": 0 }
      ],
      [
        { "question": "Color associated with mistletoe", "answer": "green", "completed": false, "numberAnswers": 0 },
        { "question": "Sweet baked goods often exchanged during the holidays", "answer": "cookies", "completed": false, "numberAnswers": 0 },
        { "question": "Winter activity where you slide on frozen water", "answer": "ice skating", "completed": false, "numberAnswers": 0 },
        { "question": "Fictional character who tries to stop Christmas", "answer": "scrooge", "completed": false, "numberAnswers": 0 },
        { "question": "Christmas-themed ballet with a Nutcracker Prince", "answer": "nutcracker", "completed": false, "numberAnswers": 0 }
      ],
      [
        { "question": "Color of Rudolph's nose", "answer": "red", "completed": false, "numberAnswers": 0 },
        { "question": "Delicious treat made from sugar, butter, and nuts", "answer": "pralines", "completed": false, "numberAnswers": 0 },
        { "question": "Activity of singing holiday songs door-to-door", "answer": "caroling", "completed": false, "numberAnswers": 0 },
        { "question": "Magical character who guides Santa's sleigh", "answer": "rudolph", "completed": false, "numberAnswers": 0 },
        { "question": "Holiday song about a winter wonderland", "answer": "let it snow", "completed": false, "numberAnswers": 0 }
      ]
    ];
    poll.categories = ["Color", "Sweet Treats", "Traditions", "Characters", "Songs and Stories"];
    poll.isJoinable = false;
    poll.isActive = false;
    this.polls["testquiz"] = poll;

    let participantData = {};
    participantData.cashTotal = {};
    participantData.allParticipants = [];
    participantData.turnIndex = 0;
    participantData.turn = "";
    participantData.answers = {};
    this.participants["testquiz"] = participantData;
  }
}


// Method to create a new poll
Data.prototype.createPoll = function (pollId, lang = "en", questionNo = 5, categoryNo = 5) {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang;
    poll.questions = Array.from({ length: questionNo }, () => Array.from({ length: categoryNo }, () => ({
      question: '',
      answer: '',
      completed: false,
      numberAnswers: 0
    }))),
      // ha koll på completed
    poll.categories = Array.from({ length: categoryNo }, () => "");
    poll.isJoinable = false;
    poll.isActive = false;
    this.polls[pollId] = poll;

    let participantData = {};
    participantData.cashTotal = {};
    participantData.allParticipants = [];
    participantData.turnIndex = 0;
    participantData.turn = "";
    participantData.answers = {};
    this.participants[pollId] = participantData;

    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

Data.prototype.allQuestionsCompleted = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    for (let i = 0; i < poll.questions.length; i++) {
      for (let j = 0; j < poll.questions[i].length; j++) {
        if (poll.questions[i][j].completed === false && poll.questions[i][j].question !== '') {
          return false;
        }
      }
    }
    return true;
  }
  return false;
}

// Method to edit a question in an existing poll
Data.prototype.editQuestion = function (pollId, row, col, question, answer) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[row][col].question = question;
    poll.questions[row][col].answer = answer;
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
Data.prototype.submitAnswer = function (pollId, participantName, answer) {
  const part = this.participants[pollId];
  console.log("data submit answer", participantName, answer)
  if (typeof part !== 'undefined') {
    part.answers[participantName] = answer;
  }
}

Data.prototype.checkParticipantAnswerCorrect = function (pollId, participantName, row, col) {
  const part = this.participants[pollId];
  const poll = this.polls[pollId];

  let submittedAnswer = part.answers[participantName];
  let correctAnswer = poll.questions[row][col].answer;

  submittedAnswer = submittedAnswer.toLowerCase();
  const submittedAnswerEdited = submittedAnswer.replace(/\s/g, '');

  correctAnswer = correctAnswer.toLowerCase();
  const correctAnswerEdited = correctAnswer.replace(/\s/g, '');

  if (correctAnswerEdited === submittedAnswerEdited) {
    this.updateCashTotal(pollId, participantName, row, col);
    return true;
  }
  else {
    return false;
  }
}

// Method to get answers for the current question in a poll
Data.prototype.getParticipantAnswer = function (pollId, participantName) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    return part.answers[participantName];
  }
  return {};
}

Data.prototype.getAllQuestions = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const questions = poll.questions;
    return questions;
  }
  return {};
}

Data.prototype.getAllCategories = function (pollId) {
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
    console.log("money added", (100 * (1 + parseInt(row, 10))))
    console.log("row number " + row)
    part.cashTotal[partName] += (100 * (1 + parseInt(row, 10)));
  }
}

Data.prototype.getParticipantCashTotal = function (pollId, partName) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    console.log("data get cash total" + part.cashTotal[partName])
    return part.cashTotal[partName];
  }
}

Data.prototype.getParticipantTurn = function (pollId) {
  const part = this.participants[pollId];
  if (part.turnIndex === 0) {
    part.turn = part.allParticipants[0];
  }
  if (typeof part !== 'undefined') {
    return part.turn;
  }
}

Data.prototype.updateTurnOrder = function (pollId) {
  const part = this.participants[pollId];

  let i = 0;
  while (i < part.allParticipants.length) {
    if (part.allParticipants[i] === part.turn) {
      part.turnIndex = (part.turnIndex + 1) % part.allParticipants.length;
      part.turn = part.allParticipants[part.turnIndex];
      break;
    }
    i++;
  }
}

Data.prototype.getPollLang = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    return poll.lang;
  }
}

// Method to get all participants and their current cashTotal
Data.prototype.getParticipantsAndCashTotal = function (pollId) {
  console.log("get participants and cash total data.js")
  const participantData = this.participants[pollId];
  if (typeof participantData !== 'undefined') {
    const participantsAndCashTotal = participantData.allParticipants.map(participant => {
      return {
        name: participant,
        cashTotal: participantData.cashTotal[participant] || 0
      };
    });

    // Sort participants by cashTotal in descending order and get the first three
    return participantsAndCashTotal.sort((a, b) => b.cashTotal - a.cashTotal).slice(0, 3);
  }
  return [];
}

//Method to update pollId
Data.prototype.updateAutoPollId = function () {
  if (!this.usedNumbers) {
    this.usedNumbers = new Set();
  }
  
  let newNumber;
  do {
    newNumber = Math.floor(Math.random() * 100000) + 1;
  } while (this.usedNumbers.has(newNumber));

  this.usedNumbers.add(newNumber);
  this.autoPollId = newNumber;
  return this.autoPollId;
}

Data.prototype.participantAnswerRegistered = function (pollId, row, col) {
  const part = this.participants[pollId];
  const poll = this.polls[pollId];

  if (typeof part !== 'undefined') {
    console.log("data participant answer registered")
    poll.questions[row][col].numberAnswers += 1
    const numberAnswers = poll.questions[row][col].numberAnswers
    if (numberAnswers == part.allParticipants.length) {
      return(true);
    }
  }
  return (false);
}

Data.prototype.resetAnswerCount = function (pollId) {
  const poll = this.polls[pollId];
  // for loop over all quesitons
}

Data.prototype.updateJoinable = function (pollId, makeJoinable) {
  const poll = this.polls[pollId];
  console.log("update joinable " + pollId + " " + makeJoinable)
  if (typeof poll !== 'undefined') {
    if (makeJoinable === true) {
      poll.isJoinable = true;
    }
    else {
      poll.isJoinable = false;
    }
  }
  console.log("is joinable " + poll.isJoinable);
}

Data.prototype.isJoinable = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    console.log("is joinable " + poll.isJoinable);
    return poll.isJoinable;
  }
  return false;
}

Data.prototype.updateActive = function (pollId, makeActive) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    if (makeActive) {
      poll.isActive = true;
    }
    else {
      poll.isActive = false;
    }
  }
}

Data.prototype.isActive = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    return poll.isActive;
  }
}

Data.prototype.autoGenerateQuiz = async function (pollId, lang) {
  let poll = {};
  poll.lang = lang;
  let questionNo = 5;
  let categoryNo = 5;

  poll.questions = Array.from({ length: questionNo }, () => Array.from({ length: categoryNo }, () => ({
    question: '',
    answer: '',
    completed: false,
  })));

  poll.categories = Array.from({ length: categoryNo }, () => "");
  poll.isJoinable = false;
  poll.isActive = false;
  this.polls[pollId] = poll;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const jsonStructure = {
    "questions": [
      [
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false }
      ],
      [
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false }
      ],
      [
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false }
      ],
      [
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false }
      ],
      [
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false },
        { "question": "", "answer": "", "completed": false }
      ]
    ],
    "categories": ["", "", "", "", ""]
  };

  // Convert the JSON structure to a string
  const jsonString = JSON.stringify(jsonStructure);

  // Define the prompt with the JSON structure
  const prompt = `Fill this with questions, answers and categories: ${jsonString}`;

  // Generate quiz questions and answers
  try {
    console.log("1");
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.  The answers to the questions should be short and simple to answer",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });
    console.log("2");

    // Extract the assistant's response from the API response
    const assistantResponse = response.choices[0].message.content;

    // Log assistantResponse to the console
    console.log('assistantResponse:', assistantResponse);

    // Parse the assistant's response as JSON
    const assistantData = JSON.parse(assistantResponse);

    // Now you can use assistantData as needed
    console.log(assistantData);


  } catch (error) {
    console.error('Error: AI querying unsuccessful', error);
  }

  let participantData = {};
  participantData.cashTotal = {};
  participantData.allParticipants = [];
  participantData.turnIndex = 0;
  participantData.turn = "";
  this.participants[pollId] = participantData;

  console.log("poll created", pollId, poll);

  return this.polls[pollId];
}


/////////////// TROR INTE DETTA ANVÄNDS ///////////////////////
/*
Data.prototype.getQuestions = function () {
  const questions = readFileSync("./server/data/preparedquestions.json");
  return JSON.parse(questions);
}

Data.prototype.addQuestion = function (pollId, q) {
  const poll = this.polls[pollId];
  console.log("question added to", pollId, q);
  if (typeof poll !== 'undefined') {
    poll.questions.push(q);
  }
}

Data.prototype.addParticipantAnswer = function (pollId, participant, answerParticipant) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    part.answers[participant] = answerParticipant;
  }
}


*/

// Export the Data class for use in other modules
export { Data };