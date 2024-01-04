<template>
  <body>
    <div>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    </div>

    <header>
      <h1> {{ uiLabels.questionResult }} </h1>
      <h2> {{ uiLabels.correctAnswerWas }} </h2>
      <h3>{{ correctAnswer }}</h3>
    </header>

    <h4>{{ uiLabels.Leaderboard }}</h4>
    <ul style="list-style-type: none;">
      <li v-for="(part, index) in participantsAndCashTotal" :key="index"
        style="display: inline-block; margin-right: 15px; font-size: 25px; font-weight: bold;">
        {{ part.name }}: {{ part.cashTotal }}$
      </li>
    </ul>

  </body>
</template>
  
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  name: 'QuestionResultView',
  data: function () {
    return {
      uiLabels: {},
      pollId: "",
      lang: localStorage.getItem("lang") || "en",
      row: "",
      col: "",
      question: "",
      correctAnswer: "",
      countdown: 10,
      participantsAndCashTotal: [],
      hasQuestionsCompleted: false
    }
  },
  created: function () {
    this.pollId = this.$route.params.pollId
    this.row = this.$route.params.row
    this.col = this.$route.params.col

    socket.emit('joinPoll', { pollId: this.pollId, participantName: undefined })

    socket.emit("pageLoaded", this.lang);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.on("questionsCompleted", (hasQuestionsCompleted) => {
      this.hasQuestionsCompleted = hasQuestionsCompleted;
    });

    socket.on('correctAnswer', (correctAnswer) => {
      console.log("correct answer", correctAnswer);
      this.correctAnswer = correctAnswer;
    });

    socket.on('participantsAndCashTotal', (participantsAndCashTotal) => {
      this.participantsAndCashTotal = participantsAndCashTotal
    });

    socket.emit('getParticipantsAndCashTotal', (this.pollId))

    socket.emit('getCorrectAnswer', { pollId: this.pollId, row: this.row, col: this.col })

    socket.emit("chosenQuestion", { pollId: this.pollId, questionRow: this.row, questionCol: this.col });

    socket.on('questionChosen', (question) => {
      console.log("question chosen", question)
      this.question = question;
    });

    socket.emit("allQuestionsCompleted", this.pollId)

    this.startCountdown();

  },

  methods: {
    startCountdown() {
      const countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        }
        else {
          clearInterval(countdownInterval);

          if (this.hasQuestionsCompleted) {
            socket.emit('allParticipantsGoToWinnerView', this.pollId);
            this.$router.push('/WinnerView/' + this.pollId);
          }
          else {
            socket.emit('allParticipantsGoToBoard', this.pollId);
            this.$router.push('/PlayerTurnView/' + this.pollId);
          }
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