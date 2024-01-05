<template>
  <body>

    <header>
      <h1> {{ question }} </h1>
    </header>

    <main>

      <div>
        <p> {{ uiLabels.answer }} </p>
        <p> {{ hiddenAnswer }} </p>
        <input type="text" v-model="answer" v-on:keydown.enter="submitAnswer">
      </div>

      <div>
        <!-- <button @click="submitAnswer"> Submit Answer </button> -->
        <button ref="submitButton" @click="submitAnswer">{{ uiLabels.submitAnswer }}</button>
      </div>

    </main>
  </body>
</template>

<script>
// Importing components and libraries
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));


export default {
  // Component name and imported components
  name: 'QuestionView',
  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      pollId: "", // Input for poll ID
      lang: localStorage.getItem("lang") || "en", // Language setting
      participant: "",
      answerSubmitted: false,
      answer: "",
      question: "",
      row: "",
      col: "",
      correctAnswer: "",
      hiddenAnswer: ""
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    this.pollId = this.$route.params.pollId
    this.participant = this.$route.params.participantName
    this.row = this.$route.params.row
    this.col = this.$route.params.col

    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit("pageLoaded", this.lang);

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participant })

    socket.on("questionViewData", (d) => {
      this.question = d.question;
      this.correctAnswer = d.correctAnswer;
      this.hiddenAnswer = d.correctAnswer.replace(/[^ ]/g, '_');
    });

    socket.emit("getQuestionViewData", { pollId: this.pollId, row: this.row, col: this.col });

    socket.on('goToAnswerResult', () => {
      if (!this.answerSubmitted) {
        socket.emit('submitAnswer', { pollId: this.pollId, participantName: this.participant, answer: "" });
        this.$router.push(`/AnswerNone/${this.pollId}/${this.participant}/${this.row}`);
      }
      
    });
  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    exitCreatorMode() {
      this.$router.push('/');
    },
    submitAnswer: function () {
      console.log("answer submitted by " + this.participant);
      console.log("answer " + this.answer);

      if (!this.answerSubmitted && this.answer !== "") {
        console.log("answer submitted");
        this.answerSubmitted = true;

        socket.emit('submitAnswer', { pollId: this.pollId, participantName: this.participant, answer: this.answer });
        this.$router.push(`/SubmitView/${this.pollId}/${this.participant}/${this.row}/${this.col}`);
      }
    }
  }
}
</script>

<style scoped>
/* Scoped styles for the component */

ol {
  text-align: left;
  display: inline-block;
}

main {
  overflow: scroll;
}
</style>