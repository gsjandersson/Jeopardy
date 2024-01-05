// Use strict mode for better error handling
'use strict';

import { readFileSync } from 'fs';
import { readFile } from 'fs';
import { writeFile } from 'fs';
import { writeFileSync } from 'fs';
import { promises } from 'fs';
import OpenAI from 'openai';
import { config } from 'dotenv';
import e from 'express';
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

Data.prototype.createTestQuiz = function () {
  console.log(typeof this.polls["testquiz"])
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
  console.log(poll.questions)
  if (typeof poll !== 'undefined') {
    for (let i = 0; i < poll.questions.length; i++) {
      console.log(poll.questions[i])
      for (let j = 0; j < poll.questions[i].length; j++) {
        console.log(poll.questions[i][j])
        if (poll.questions[i][j].completed === false && poll.questions[i][j].question !== '') {
          return false;
        }
      }
    }
    return true;
  }
  return false;
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
Data.prototype.submitAnswer = function (pollId, participantName, answer) {
  const part = this.participants[pollId];
  console.log("data submit answer", participantName, answer)
  if (typeof part !== 'undefined') {
    part.answers[participantName] = answer;
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
    console.log("money added", (100 * (1 + parseInt(row, 10))))
    console.log("row number" + row)
    part.cashTotal[partName] += (100 * (1 + parseInt(row, 10)));
  }
}

Data.prototype.getCashTotal = function (pollId, partName) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    console.log("data get cash total" + part.cashTotal[partName])
    return part.cashTotal[partName];
  }
}

Data.prototype.participantTurnOrder = function (pollId) {
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
      return (true);
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

Data.prototype.autoGenerateQuiz = async function (pollId, lang, topic, questionNo, categoryNo) {
  console.log("topic:", topic)
  let poll = {};
  poll.lang = lang;
  console.log("lang:", lang)
  let prompt;
  let systemMessage;
  let questions;
  let categories;

  poll.isJoinable = false;
  poll.isActive = false;
  this.polls[pollId] = poll;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const jsonStructure = {
    categories: Array.from({ length: categoryNo }, () => ({
      category: "",
      questions: Array.from({ length: questionNo }, () => ({
        question: "",
        answer: "",
        completed: false
      }))
    }))
  };

  console.log('jsonStructure: ', jsonStructure)


  // Convert the JSON structure to a string
  const jsonString = JSON.stringify(jsonStructure);

  if (lang === "en") {

    prompt = `FIll this with categories, questions and answers related to the respective category based on this topic: ${topic}. 
    The answers to the questions should be very short and simple to answer in text format: ${jsonString}. 
    Do not change "completed": false to "completed": true. Do not add more than ${questionNo} questions per category. 
    Do not add more than ${categoryNo} categories. Do not change the string "categories" or "questions" or "category".`;

    systemMessage = "You output JSON.";

  } else if (lang === "sv") {
    prompt = `Fyll detta med kategorier, frågor och svar relaterade till respektive kategori 
    baserat på detta ämne: ${topic}. Svaren på frågorna bör vara mycket korta och enkla 
    att svara på i textformat: ${jsonString}. 
    Ändra inte "completed": false till "completed": true. Lägg inte till mer än ${questionNo} frågor per kategori. 
    Lägg inte till mer än ${categoryNo} kategorier. Ändra inte strängen "categories" eller "questions" eller "category".`; ''

    systemMessage = "Du matar ut JSON.";
  }

  // Generate quiz questions and answers
  try {
    console.log("1");
    console.time("timer");

    const response = await Promise.race([
      openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 90000)
      )
    ]);

    console.timeEnd("timer");
    console.log("2");

    // Extract the assistant's response from the API response
    const assistantResponse = response.choices[0].message.content;

    console.log('assistantResponse:', assistantResponse);

    // Parse the assistant's response as JSON
    const assistantData = JSON.parse(assistantResponse);

    // Now you can use assistantData as needed
    console.log('assistantData: ', assistantData);

    if (assistantData.categories) {
      // Extract categories from assistantData.data
      categories = assistantData.categories.map(category => category.category);
      questions = assistantData.categories.map(category => category.questions);

      console.log('questions: ', questions);
      console.log('categories: ', categories);

      let restructuredQuestions = [];

      questions[0].forEach((_, i) => {
        restructuredQuestions[i] = questions.map(question => question[i]);
      });

      questions = restructuredQuestions;

      console.log("restructured questions: ", poll.questions);
    } else {
      console.log('Error: assistantData.categories is undefined');
    }

  } catch (error) {
    console.error('Error: AI querying unsuccessful', error);
  }

  poll.questions = questions;
  poll.categories = categories;

  console.log("poll.questions: ", poll.questions);  // Array of questions

  let participantData = {};
  participantData.cashTotal = {};
  participantData.allParticipants = [];
  participantData.turnIndex = 0;
  participantData.turn = "";
  this.participants[pollId] = participantData;

  console.log("poll created", pollId, poll);

  return this.polls[pollId];
}

// Export the Data class for use in other modules
export { Data };