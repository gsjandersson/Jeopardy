<template>
  <header>
    <h1> {{ uiLabels.youHaveSubmittedAnswer }} </h1>
    <h2> {{ uiLabels.waitingForOtherPlayersAnswer }} </h2>
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
      redirectRoute: ""
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    socket.on('goToAnswerResult', () => {
      this.answerView();
    });

    this.pollId = this.$route.params.pollId
    this.participant = this.$route.params.participantName

    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.on("isParticipantAnswerCorrect", (isCorrect) => {
      if (isCorrect) {
        this.redirectRoute = "AnswerRight";
      }
      else {
        this.redirectRoute = "AnswerWrong";
      }
    });

    socket.on("currentQuestion", (question) => {
      console.log("Submit view current question socket on registered")
      this.row = question.row;
      this.col = question.col;
    });

    socket.emit("checkParticipantAnswerCorrect", { pollId: this.pollId, participantName: this.participant})
    
    socket.emit("participantAnswerRegistered", this.pollId, this.participant);

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participant })

    socket.emit("getCurrentQuestion", this.pollId);

    // Emit an event to the server when the page is loaded
    socket.emit("pageLoaded", this.lang);

    //socket.emit("getSubmitViewData", { pollId: this.pollId, row: this.row, col: this.col, participantName: this.participant });

  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    answerView() {
      console.log(this.redirectRoute)
      this.$router.push(`/${this.redirectRoute}/${this.pollId}/${this.participant}`);
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