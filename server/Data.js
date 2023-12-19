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
    participantData.turnIndex = 0;
    participantData.turn = "";
    participantData.numberAnswers = 0;
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
    console.log(100 * (row + 1))
    console.log(row)
    part.cashTotal[partName] += (100 * (1 + parseInt(row, 10)));
  }
}

Data.prototype.getCashTotal = function (pollId, partName) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
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

Data.prototype.participantAnswerRegistered = function (pollId) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    part.numberAnswers += 1
    if (part.numberAnswers == part.allParticipants.length) {
      return (true);
    }
  }
  return (false);
}

Data.prototype.resetAnswerCount = function (pollId) {
  const part = this.participants[pollId];
  if (typeof part !== 'undefined') {
    part.numberAnswers = 0
  }
}

Data.prototype.autoGenerateQuiz = async function (pollId, lang) {
  let poll = {};
  poll.lang = lang;
  poll.currentQuestion = 0;
  let questionNo = 5;
  let categoryNo = 5;

  poll.questions = Array.from({ length: questionNo }, () => Array.from({ length: categoryNo }, () => ({
    question: '',
    answer: '',
    completed: false
  })));

  poll.categories = Array.from({ length: categoryNo }, () => "");

  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
  });

  // Define the JSON structure''

  const jsonStructure = {
    "questions": [
      [
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" }
      ],
      [
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" }
      ],
      [
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" }
      ],
      [
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" }
      ],
      [
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" },
        { "question": "", "answer": "" }
      ],

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
          content: "You are a helpful assistant designed to output JSON. The answers to the questions should be short and simple to answer",
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

    if ('questions' in assistantData) {
      poll.questions = assistantData.questions;

      // Iterate over the outer array
      for (const innerArray of poll.questions) {
        // Iterate over the inner array
        for (const questionObject of innerArray) {
          console.log(`Question: ${questionObject.question}`);
          console.log(`Answer: ${questionObject.answer}`);
        }
      }
    }
    if ('categories' in assistantData) {
      poll.categories = assistantData.categories;
    }
  } catch (error) {
    console.error('Error: AI querying unsuccessful', error);
  }


  this.polls[pollId] = poll;

  let participantData = {};
  participantData.cashTotal = {};
  participantData.allParticipants = [];
  participantData.turnIndex = 0;
  participantData.turn = "";
  participantData.numberAnswers = 0;
  this.participants[pollId] = participantData;

  console.log("poll created", pollId, poll);

  return this.polls[pollId];
}


// Export the Data class for use in other modules
export { Data };