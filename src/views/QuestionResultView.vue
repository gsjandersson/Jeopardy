<template>
  <body>
    <div>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    </div>

    <header>
      <h1> {{ uiLabels.questionResult }} </h1>
      <h2> {{ uiLabels.correctAnswerWas }} </h2>
      <h2>{{ correctAnswer }}</h2>
    </header>

    <hr>
    <div style="display: flex; flex-wrap: wrap;">
      <div v-for="(answer, participantName) in allParticipantAnswers" :key="participantName" style="flex: 1;">
        <h2>{{ participantName }} {{ uiLabels.answered }}</h2>
        <h3>{{ answer }}</h3>
      </div>
    </div>

    <hr>
    <div v-if="!allQuestionsCompleted">
    <h4>{{ uiLabels.Leaderboard }}</h4>
    <ul style="list-style-type: none;">
      <li v-for="(part, index) in participantsAndCashTotal" :key="index"
        style="display: inline-block; margin-right: 15px; font-size: 25px; font-weight: bold;">
        {{ part.name }}: {{ part.cashTotal }}$
      </li>
    </ul>
  </div>



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
      allQuestionsCompleted: false,
      countdownInterval: null,
      allParticipantAnswers: {}
    }
  },
  created: function () {
    this.pollId = this.$route.params.pollId

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.emit('joinPoll', { pollId: this.pollId, participantName: undefined })

    socket.emit("pageLoaded", this.lang);

    socket.on("questionResultViewData", (data) => {
      this.question = data.question;
      this.correctAnswer = data.correctAnswer;
      this.participantsAndCashTotal = data.participantsAndCashTotal;
      this.allQuestionsCompleted = data.allQuestionsCompleted;
      this.allParticipantAnswers = data.allParticipantAnswers;
      this.row = data.currentQuestion.row;
      this.col = data.currentQuestion.col;
    });

    socket.emit("getQuestionResultViewData", this.pollId);

    this.startCountdown();

  },

  methods: {
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        }
        else {
          clearInterval(this.countdownInterval);

          if (this.allQuestionsCompleted) {
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
      socket.emit("allParticipantsGoToHome", this.pollId)
      socket.emit("updateJoinable", { pollId: this.pollId, makeJoinable: false });
      socket.emit("leavePoll", { pollId: this.pollId, participantName: undefined });
      this.$router.push('/');
    }
  }
}
</script>