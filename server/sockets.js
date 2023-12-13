import fs from 'fs';

function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());

  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function (d) {
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang, d.questionNo, d.categoryNo));
  });

  socket.on('addQuestion', function (d) {
    data.addQuestion(d.pollId, { q: d.q, a: d.a });
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
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
    // socket.emit('newQuestion', data.getQuestion(pollId))
    // socket.emit('dataUpdate', data.getAnswers(pollId));
  });

  socket.on('runQuestion', function (d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionRow, d.questionCol));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function (d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  //svar till alla anslutna klienter, lägga till fler...//

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on('retrieveQuestions', function (pollId){
    socket.emit('questionsRetrieved', data.retrieveQuestions(pollId));
  });

  socket.on('retrieveCategories', function (pollId){
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

  socket.on('allParticipantsGoToBorard', function () {
    io.to(d.pollId).emit("goToBoard", (d));
  });

  socket.on('checkExisting', function (pollId) {
    socket.emit('existingPoll', data.checkExisting(pollId));
  });

  socket.on('addParticipantAnswer', function (d) {
    data.addParticipantAnswer(d.pollId, d.partName, d.partAnswer)
  });

  socket.on('getCorrectAnswer', function (d){
    console.log("socket get correct answer")
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

}

export { sockets };