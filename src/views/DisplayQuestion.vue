<template>
  <body>

    <div>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    </div>

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
    this.row = this.$route.params.row
    this.col = this.$route.params.col

    socket.emit("pageLoaded", this.lang);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.on('hasAllAnswered', () => {
      console.log("------ has all answered detected ------")
      clearInterval(this.countdownInterval);
      setTimeout(() => {
        socket.emit('allParticipantsGoToAnswerResult', this.pollId);
        console.log("------ all answers ------");
        console.log("pollId: " + this.pollId);
        console.log("row: " + this.row);
        console.log("col: " + this.col);
        console.log("------ end all answers ------");
        this.$router.push(`/QuestionResultView/${this.pollId}/${this.row}/${this.col}`);
      }, 100);
    });

    console.log("----------------------------------")
    console.log("---------- NEW QUESTION ----------")
    console.log("----------------------------------")

    console.log("------ display question ------")
    console.log("pollId: " + this.pollId)
    console.log("row: " + this.row)
    console.log("col: " + this.col)
    console.log("------ end display question ------")

    socket.emit('joinPoll', { pollId: this.pollId, participantName: undefined })

    socket.emit("getDisplayQuestionData", { pollId: this.pollId, row: this.row, col: this.col });

    socket.on("displayQuestionData", (data) => {
      this.question = data.question;
      this.correctAnswer = data.correctAnswer;
      this.hiddenAnswer = data.correctAnswer.replace(/[^ ]/g, '_');
    });

    socket.emit('questionCompleted', { pollId: this.pollId, row: this.row, col: this.col });

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
          console.log("------ countdown over ------")
          console.log("pollId: " + this.pollId)
          console.log("row: " + this.row)
          console.log("col: " + this.col)
          console.log("------ end countdown over ------")

          console.log(`/QuestionResultView/${this.pollId}/${this.row}/${this.col}`)

          this.$router.push(`/QuestionResultView/${this.pollId}/${this.row}/${this.col}`);
        }
      }, 1000); // Update every 1000ms (1 second)
    },
    exitCreatorMode() {
      socket.emit("updateJoinable", { pollId: this.pollId, makeJoinable: false });
      this.$router.push('/');
    }
  }
}
</script>