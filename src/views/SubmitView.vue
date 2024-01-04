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
    this.row = this.$route.params.row
    this.col = this.$route.params.col

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participant })

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

    // Emit an event to the server when the page is loaded
    socket.emit("pageLoaded", this.lang);

    socket.emit("checkParticipantAnswerCorrect", { pollId: this.pollId, participantName: this.participant, row: this.row, col: this.col })

    //socket.emit("getSubmitViewData", { pollId: this.pollId, row: this.row, col: this.col, participantName: this.participant });

    socket.emit("participantAnswerRegistered", { pollId: this.pollId, row: this.row, col: this.col })

  },
  // Methods for language switching and toggling the navigation menu
  methods: {
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