<template>
  <body>

    <header>
      <h1> {{ question }} </h1>
    </header>

    <main>

      <div>
        <p> {{ uiLabels.answer }} </p>
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
      answer: "",
      participant: "",
      question: "",
      row: "",
      col: "",
      correctAnswer: "",
      answerSubmitted: false,
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    this.pollId = this.$route.params.pollId
    this.participant = this.$route.params.participantName
    this.row = this.$route.params.row
    this.col = this.$route.params.col

    /* socket.emit('getPollLang', (this.pollId))

    socket.on('pollLang', (lang) =>
      this.lang = lang
    ); */

    socket.on('correctAnswer', (correctAnswer) => {
        this.correctAnswer = correctAnswer
      });

    // Emit an event to the server when the page is loaded
    socket.emit("pageLoaded", this.lang);

    socket.emit('getCorrectAnswer', { pollId: this.pollId, row: this.row, col: this.col })

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participant })

    socket.emit("chosenQuestion", { pollId: this.pollId, questionRow: this.row, questionCol: this.col });

    socket.on('questionChosen', (question) => {
      this.question = question;
    });

    socket.on('correctAnswer', (correctAnswer) => {
      this.correctAnswer = correctAnswer;
    });

    socket.on('goToAnswerResult', () => {
      console.log("got ot answer relsut");
      this.closeQuestionView();
    });

  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    exitCreatorMode() {
      this.$router.push('/jStartView');
    },

    submitAnswer: function () {
      if (!this.answerSubmitted) {
        socket.emit("participantAnswerRegistered", {pollId: this.pollId, row: this.row, col: this.col})
        if (this.correctAnswer === this.answer) {
          socket.emit('updateCashTotal', {pollId: this.pollId, partName: this.participant, row: this.row, col: this.col});
        }
      this.answerSubmitted = true;
      }

    },
    
    closeQuestionView() {
      if (!this.answerSubmitted) {
      // If the answer was not submitted, handle it as a wrong answer
        this.showAnswerStatus("not submitted");
      } 
      else {
      // If the answer was submitted, check if it's correct
        const isCorrect = this.answer === this.correctAnswer;
        this.showAnswerStatus(isCorrect);
      }
    },

    showAnswerStatus(isCorrect) {
      let redirectRoute;
      if (isCorrect === true || isCorrect === false) {
        redirectRoute = isCorrect ? 'AnswerRight' : 'AnswerWrong';
      }
      else {
        redirectRoute = 'AnswerNone';
      }
      // Redirect to the appropriate answer status component
      this.$router.push(`/${redirectRoute}/${this.pollId}/${this.participant}/${this.row}`);
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