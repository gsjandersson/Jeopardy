<template>
  <body>

    <header>
      {{ uiLabels.questionIs }}
      <h1> {{ question }} </h1>
      <h2> {{ hiddenAnswer }}</h2>

      <h3> {{ uiLabels.youHave }} {{ countdown }} {{ uiLabels.secondsLeft }} </h3>

    </header>
  </body>
</template>
  
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  name: 'DisplayQuestion',

  data: function () {
    return {
      uiLabels: {},
      pollId: "",
      lang: localStorage.getItem("lang") || "en",
      row: "",
      col: "",
      question: "",
      correctAnswer: "",
      hiddenAnswer: "",
      countdown: 20,
      countdownInterval: null
    }
  },
  created: function () {
    this.pollId = this.$route.params.pollId

    socket.emit("pageLoaded", this.lang);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.on('hasAllAnswered', () => {
      console.log("------ has all answered detected ------")
      clearInterval(this.countdownInterval);
      setTimeout(() => {
        socket.emit('allParticipantsGoToAnswerResult', this.pollId);
        this.$router.push(`/QuestionResultView/${this.pollId}`);
      }, 100);
    });

    console.log("----------------------------------")
    console.log("---------- NEW QUESTION ----------")
    console.log("----------------------------------")

    socket.emit('joinPoll', { pollId: this.pollId, participantName: undefined })

    socket.emit("getDisplayQuestionData", this.pollId);

    socket.emit('questionCompleted', this.pollId);

    socket.on("displayQuestionData", (data) => {
      this.question = data.question;
      this.correctAnswer = data.correctAnswer;
      this.hiddenAnswer = data.correctAnswer.replace(/[^ ]/g, '_');
      this.row = data.currentQuestion.row;
      this.col = data.currentQuestion.col;
    });

    this.startCountdown();

  },

  methods: {
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.countdownInterval);
          socket.emit('allParticipantsGoToAnswerResult', this.pollId);
          
          socket.emit('questionCompleted', this.pollId);
          this.$router.push(`/QuestionResultView/${this.pollId}`);
        }
      }, 1000); // Update every 1000ms (1 second)
    }
  }
}
</script>