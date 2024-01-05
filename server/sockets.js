function sockets(io, socket, data) {

  ////////////////// DESSA HAR ALLA SIDOR ///////////////////////
  socket.emit('init', data.getUILabels());

  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  ////////////////// ONE TIME ///////////////////////
  socket.on("createTestQuiz", function () {
    console.log("socket createTestQuiz");
    data.createTestQuiz();
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  ////////////////// UPDATERADE (STORA EMITS OCH DATASAMLINGAR) ///////////////////////
  socket.on("getDisplayQuestionData", function (d) {
    const question = data.getQuestion(d.pollId, d.row, d.col);
    const correctAnswer = data.getCorrectAnswer(d.pollId, d.row, d.col);
    socket.emit("displayQuestionData", { question: question, correctAnswer: correctAnswer });
  });

  socket.on("getQuestionResultViewData", function (d) {
    console.log("--------- socket getQuestionResultViewData ---------")
    console.log("pollId", d.pollId)
    console.log("row", d.row)
    console.log("col", d.col)
    console.log("--------- end socket ---------")

    const question = data.getQuestion(d.pollId, d.row, d.col);
    const correctAnswer = data.getCorrectAnswer(d.pollId, d.row, d.col);
    const participantsAndCashTotal = data.getParticipantsAndCashTotal(d.pollId);
    socket.emit("questionResultViewData", { question: question, correctAnswer: correctAnswer, participantsAndCashTotal: participantsAndCashTotal });
  });

  socket.on("getJPollViewData", function (d) {
    const questions = data.getAllQuestions(d.pollId);
    const categories = data.getAllCategories(d.pollId);
    const cashTotal = data.getParticipantCashTotal(d.pollId, d.participantName);
    const participantTurn = data.getParticipantTurn(d.pollId);
    socket.emit("jPollViewData", { questions: questions, categories: categories, cashTotal: cashTotal, participantTurn: participantTurn });
  });

  socket.on("getQuestionViewData", function (d) {
    const question = data.getQuestion(d.pollId, d.row, d.col);
    const correctAnswer = data.getCorrectAnswer(d.pollId, d.row, d.col);
    socket.emit("questionViewData", { question: question, correctAnswer: correctAnswer });
  });

  ////////////////// UPDATERADE (SMÅ EMITS) ///////////////////////
  socket.on("checkParticipantAnswerCorrect", function (d) {
    const isCorrect = data.checkParticipantAnswerCorrect(d.pollId, d.participantName, d.row, d.col);
    socket.emit("isParticipantAnswerCorrect", isCorrect);
  });


  socket.on('editQuestion', function (d) {
    data.editQuestion(d.pollId, d.row, d.col, d.question, d.answer);
    socket.emit('allQuestions', data.getAllQuestions(d.pollId));
  });

  socket.on('editCategory', function (d) {
    data.editCategory(d.pollId, d.col, d.category);
    socket.emit('allCategories', data.getAllCategories(d.pollId));
  });

  socket.on('createPoll', function (d) {
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang, d.questionNo, d.categoryNo));
  });

  socket.on('joinPoll', function (d) {
    socket.join(d.pollId);
    if (d.participantName !== undefined) {
      data.newParticipant(d.pollId, d.participantName);
    }
    io.to(d.pollId).emit('participantUpdate', data.getParticipants(d.pollId));
  });

  socket.on('getParticipants', function (pollId) {
    socket.emit("participants", data.getParticipants(pollId))
  });

  socket.on('submitAnswer', function (d) {
    data.submitAnswer(d.pollId, d.participantName, d.answer);
  });

  socket.on('getAllQuestions', function (pollId) {
    socket.emit('allQuestions', data.getAllQuestions(pollId));
  });

  socket.on('getAllCategories', function (pollId) {
    socket.emit('allCategories', data.getAllCategories(pollId))
  });

  socket.on('questionCompleted', function (d) {
    data.completeQuestion(d.pollId, d.row, d.col);
  });

  socket.on('allParticipantsGoToQuestion', function (d) {
    io.to(d.pollId).emit("goToQuestion", (d));
  });

  socket.on('allParticipantsGoToBoard', function (pollId) {
    io.to(pollId).emit("goToBoard");
  });

  socket.on('allParticipantsGoToAnswerResult', function (pollId) {
    io.to(pollId).emit("goToAnswerResult");
  });

  socket.on('checkExisting', function (pollId) {
    socket.emit('isExisting', data.checkExisting(pollId));
  });

  socket.on('updateCashTotal', function (d) {
    data.updateCashTotal(d.pollId, d.participantName, d.row, d.col)
  });

  socket.on('updateTurnOrder', function (pollId) {
    data.updateTurnOrder(pollId)
  });

  socket.on('getParticipantTurn', function (pollId) {
    socket.emit('participantTurn', data.getParticipantTurn(pollId))
  });

  socket.on('getParticipantsAndCashTotal', function (pollId) {
    io.to(pollId).emit('participantsAndCashTotal', data.getParticipantsAndCashTotal(pollId))
  });

  socket.on('updateAutoPollId', () => {
    socket.emit('autoPollIdUpdated', data.updateAutoPollId())
  });

  socket.on("participantAnswerRegistered", function (d) {
    const hasAllAnswered = data.participantAnswerRegistered(d.pollId, d.row, d.col)
    console.log("socket answer logged")
    if (hasAllAnswered) {
      console.log("socket all answered")
      io.to(d.pollId).emit("hasAllAnswered")
    }
  });

  socket.on("updateJoinable", function (d) {
    data.updateJoinable(d.pollId, d.makeJoinable)
  });

  socket.on("checkJoinable", function (pollId) {
    socket.emit("isJoinable", data.isJoinable(pollId))
  });

  socket.on("updateActive", function (d) {
    data.updateActive(d.pollId, d.makeActive)
  });

  socket.on("checkActive", function (pollId) {
    socket.emit("isActive", data.isActive(pollId))
  });

  socket.on("checkHasAllQuestionsCompleted", function (pollId) {
    socket.emit("HasAllQuestionsCompleted", data.allQuestionsCompleted(pollId))
  });

  socket.on("allParticipantsGoToWinnerView", function (pollId) {
    io.to(pollId).emit("goToWinnerView")
  });

  socket.on("autoGenerateQuiz", async function (d) {
    console.log("socket autoGenerateQuiz");

    try {
      let result = await data.autoGenerateQuiz(d.pollId, d.lang, d.topic, d.questionNo, d.categoryNo);
      if (result instanceof Error) {
        socket.emit('quizAutoGenerationError');
        console.error('Error generating quiz:', result);
      } else {
        socket.emit('autoGeneratedQuizAutoGenerated');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Handle the error accordingly, e.g., emit an error event to the client
      socket.emit('quizAutoGenerationError', { error: error.message });
    }
  });

  ////////////////// TROR DESSA INTE BEHÖVS ///////////////////////
  /*
  socket.on('runQuestion', function (d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionRow, d.questionCol));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('addParticipantAnswer', function (d) {
    data.addParticipantAnswer(d.pollId, d.partName, d.partAnswer)
  });

  socket.on('getCorrectAnswer', function (d) {
    console.log("socket get correct answer", data.getCorrectAnswer(d.pollId, d.row, d.col))
    socket.emit('correctAnswer', data.getCorrectAnswer(d.pollId, d.row, d.col))
  });

  socket.on('getCashTotal', function (d) {
    console.log("socket get cash total")
    socket.emit('cashTotal', data.getCashTotal(d.pollId, d.partName))
  });

  socket.on('getParticipantAnswer', function (d) {
    socket.emit('participantAnswer', {
      participantAnswer: data.getParticipantAnswer(d.pollId, d.participantName),
      correctAnswer: data.getCorrectAnswer(d.pollId, d.row, d.col)
    });
  });

  socket.on('getPollLang', function (pollId) {
    socket.emit('pollLang', data.getPollLang(pollId))
  });

  socket.on("resetAnswerCount", function (pollId) {
    data.resetAnswerCount(pollId)
  });

  socket.on('chosenQuestion', function (d) {
    io.to(d.pollId).emit('questionChosen', data.getQuestion(d.pollId, d.questionRow, d.questionCol))
  });

  */

}
export { sockets };