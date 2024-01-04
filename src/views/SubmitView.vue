<template>
  <header>
    <h1> You have submitted your answer. </h1>
    <h2> Waiting for the other participants to answer. </h2>

  </header>
</template>

<script>
// Importing components and libraries
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  // Component name and imported components
  name: 'SubmitView',
  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      pollId: "", // Input for poll ID
      lang: localStorage.getItem("lang") || "en", // Language setting
      participant: "",
      row: "",
      col: "",
      submittedAnswer: "",
      correctAnswer: "",
      redirectRoute: "",
      correctAnswerEdited: "",
      submittedAnswerEdited: "",
      hasCheckedCorrect: false
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    socket.on('goToAnswerResult', () => {
      console.log("go to answer result")

      setTimeout(() => {
        console.log("check correct answer")
        this.checkCorrectAnswer();

        setTimeout(() => {
          console.log("answer view")
          this.answerView();
        }, 200);

      }, 200);

    });

    this.pollId = this.$route.params.pollId
    this.participant = this.$route.params.participantName
    this.row = this.$route.params.row
    this.col = this.$route.params.col

    // Emit an event to the server when the page is loaded
    socket.emit("pageLoaded", this.lang);

    socket.on("correctAnswer", (correctAnswer) => {
      this.correctAnswer = correctAnswer;
      this.correctAnswerEdited = correctAnswer.toLowerCase();
      this.correctAnswerEdited = this.correctAnswerEdited.replace(/\s/g, '');
    });

    socket.on("participantAnswer", (submittedAnswer) => {
      this.submittedAnswer = submittedAnswer;
      this.submittedAnswerEdited = submittedAnswer.toLowerCase();
      this.submittedAnswerEdited = this.submittedAnswerEdited.replace(/\s/g, '');
    });

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit("getCorrectAnswer", { pollId: this.pollId, row: this.row, col: this.col })

    socket.emit("getParticipantAnswer", { pollId: this.pollId, participantName: this.participant })

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participant })

    socket.emit("participantAnswerRegistered", { pollId: this.pollId, row: this.row, col: this.col })

  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    checkCorrectAnswer() {
      if (!this.hasCheckedCorrect) {
        console.log("correct answer: " + this.correctAnswer);
        console.log("submitted answer: " + this.submittedAnswer);

        console.log("correct answer edited: " + this.correctAnswerEdited);
        console.log("submitted answer edited: " + this.submittedAnswerEdited);

        if (this.correctAnswerEdites === this.submittedAnswerEdited) {
          console.log("correct answer registered")
          socket.emit('updateCashTotal', { pollId: this.pollId, partName: this.participant, row: this.row, col: this.col });
          this.redirectRoute = 'AnswerRight';
        }
        else if (this.submittedAnswer === "") {
          console.log("no answer registered")
          this.redirectRoute = "AnswerNone";
        }
        else {
          console.log("wrong answer registered")
          this.redirectRoute = "AnswerWrong";
        }
      }
      this.hasCheckedCorrect = true;
    },
    answerView() {
      console.log(this.redirectRoute)
      this.$router.push(`/${this.redirectRoute}/${this.pollId}/${this.participant}/${this.row}`);
    }
  }
}
</script>

<style scoped>
/* Scoped styles for the component */

main {
  overflow: scroll;
}
</style>