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
    console.log()
  });

  socket.on('editQuestion', function (d) {
    data.editQuestion(d.pollId, d.row, d.col, { q: d.q, a: d.a });
    socket.emit('questionRetrieved', data.retrieveQuestions(d.pollId));
  });

  socket.on('editCategory', function (d) {
    data.editCategory(d.pollId, d.col, d.cat);
    socket.emit('categoriesRetrieved', data.retrieveCategories(d.pollId));
  });

  socket.on('joinPoll', function (pollId) {
    socket.join(pollId);
    socket.emit('newQuestion', data.getQuestion(pollId))
    socket.emit('dataUpdate', data.getAnswers(pollId));
  });

  socket.on('runQuestion', function (d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function (d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on('retrieveQuestions', function (pollId){
    socket.emit('questionsRetrieved', data.retrieveQuestions(pollId));
  });

  socket.on('retrieveCategories', function (pollId){
    socket.emit('categoriesRetrieved', data.retrieveCategories(pollId))
  })

}

export { sockets };