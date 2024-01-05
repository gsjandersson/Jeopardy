function sockets(io, socket, data) {

  socket.emit('init', data.getUILabels());

  socket.on("createTestQuiz", function () {
    console.log("socket createTestQuiz");
    data.createTestQuiz();
  });

  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function (d) {
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang, d.questionNo, d.categoryNo));
  });

  socket.on('editQuestion', function (d) {
    data.editQuestion(d.pollId, d.row, d.col, { q: d.q, a: d.a });
    socket.emit('questionsRetrieved', data.retrieveQuestions(d.pollId));
  });

  socket.on('editCategory', function (d) {
    data.editCategory(d.pollId, d.col, d.cat);
    socket.emit('categoriesRetrieved', data.retrieveCategories(d.pollId));
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

  socket.on('runQuestion', function (d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionRow, d.questionCol));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function (d) {
    console.log("socket submit answer", d.participantName, d.answer)
    data.submitAnswer(d.pollId, d.participantName, d.answer);
  });

  socket.on('getParticipantAnswer', function (d) {
    socket.emit('participantAnswer', data.getParticipantAnswer(d.pollId, d.participantName));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on('retrieveQuestions', function (pollId) {
    socket.emit('questionsRetrieved', data.retrieveQuestions(pollId));
  });

  socket.on('retrieveCategories', function (pollId) {
    socket.emit('categoriesRetrieved', data.retrieveCategories(pollId))
  });

  socket.on('chosenQuestion', function (d) {
    io.to(d.pollId).emit('questionChosen', data.getQuestion(d.pollId, d.questionRow, d.questionCol))
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
    socket.emit('existingPoll', data.checkExisting(pollId));
  });

  socket.on('addParticipantAnswer', function (d) {
    data.addParticipantAnswer(d.pollId, d.partName, d.partAnswer)
  });

  socket.on('getCorrectAnswer', function (d) {
    console.log("socket get correct answer", data.getCorrectAnswer(d.pollId, d.row, d.col))
    socket.emit('correctAnswer', data.getCorrectAnswer(d.pollId, d.row, d.col))
  });

  socket.on('updateCashTotal', function (d) {
    data.updateCashTotal(d.pollId, d.partName, d.row, d.col)
  });

  socket.on('getCashTotal', function (d) {
    console.log("socket get cash total")
    socket.emit('cashTotal', data.getCashTotal(d.pollId, d.partName))
  });

  socket.on('updateTurnOrder', function (pollId) {
    data.updateTurnOrder(pollId)
  });

  socket.on('getParticipantTurn', function (pollId) {
    socket.emit('participantTurn', data.participantTurnOrder(pollId))
  });

  socket.on('getPollLang', function (pollId) {
    socket.emit('pollLang', data.getPollLang(pollId))
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

  socket.on("resetAnswerCount", function (pollId) {
    data.resetAnswerCount(pollId)
  });

  socket.on("updateJoinable", function (d) {
    data.updateJoinable(d.pollId, d.makeJoinable)
  });

  socket.on("checkJoinable", function (pollId) {
    socket.emit("joinablePoll", data.isJoinable(pollId))
  });

  socket.on("updateActive", function (d) {
    data.updateActive(d.pollId, d.makeActive)
  });

  socket.on("checkActive", function (pollId) {
    socket.emit("activePoll", data.isActive(pollId))
  });

  socket.on("allQuestionsCompleted", function (pollId) {
    socket.emit("questionsCompleted", data.allQuestionsCompleted(pollId))
  });

  socket.on("allParticipantsGoToWinnerView", function (pollId) {
    io.to(pollId).emit("goToWinnerView")
  });

  socket.on("autoGenerateQuiz", async function (d) {
    console.log("socket autoGenerateQuiz");

    try {
      await data.autoGenerateQuiz(d.pollId, d.lang, d.topic, d.questionNo, d.categoryNo);
      socket.emit('autoGeneratedQuizAutoGenerated');
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Handle the error accordingly, e.g., emit an error event to the client
      socket.emit('quizAutoGenerationError', { error: error.message });
    }
    console.log("socket autoGenerateQuizAutoGenerated");
  });

}

export { sockets };