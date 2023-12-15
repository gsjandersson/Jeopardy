<template>
  <body>

    <p v-if="countdown > 0">Countdown: {{ countdown }}</p>

    <header>
      <h1> {{ question }} </h1>
    </header>

    <main>

      <div>
        <p> {{ uiLabels.answer }} </p>
        <input type="text" v-model="answer">
      </div>

      <div>
        <!-- <button @click="submitAnswer"> Submit Answer </button> -->
        <button ref="submitButton" @click="submitAnswer">Submit Answer</button>
      </div>



    </main>
  </body>
</template>

<script>
// Importing components and libraries
import io from 'socket.io-client';
const socket = io("localhost:3000");

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
      countdown: 10,
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

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participant })

    socket.emit("chosenQuestion", { pollId: this.pollId, questionRow: this.row, questionCol: this.col });

    socket.emit('questionCompleted', { pollId: this.pollId, row: this.row, col: this.col });

    socket.on('questionChosen', (question) => {
      this.question = question;
    });

    this.startCountdown();


  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    exitCreatorMode() {
      this.$router.push('/jStartView');
    },

    submitAnswer: function () {
      console.log("submit answr")
      // Check if the answer has already been submitted
      if (this.answerSubmitted) {
        return;
      }
      // Disable the button to prevent multiple clicks
      this.$refs.submitButton.disabled = true;
      socket.emit('getCorrectAnswer', { pollId: this.pollId, row: this.row, col: this.col })

      socket.on('correctAnswer', (correctAnswer) => {
        this.correctAnswer = correctAnswer;

        if (this.correctAnswer == this.answer) {
          socket.emit('updateCashTotal', {pollId: this.pollId, partName: this.participant, row: this.row, col: this.col});
      }
      this.answerSubmitted = true;
      this.$refs.submitButton.disabled = false;
    });
  },
    startCountdown() {
      const countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(countdownInterval);
          this.closeQuestionView();
        }
      }, 1000); // Update every 1000ms (1 second)
    },
    
    closeQuestionView() {
  if (!this.answerSubmitted) {
    // If the answer was not submitted, handle it as a wrong answer
    this.showAnswerStatus(false);
  } else {
    // If the answer was submitted, check if it's correct
    const isCorrect = this.answer === this.correctAnswer;
    this.showAnswerStatus(isCorrect);
  }
},

showAnswerStatus(isCorrect) {
  const redirectRoute = isCorrect ? 'AnswerRight' : 'AnswerWrong';

  // Redirect to the appropriate answer status component
  this.$router.push({
    name: redirectRoute,
    params: { pollId: this.pollId, participant: this.participant },
  });

  // Wait for 5 seconds before redirecting to jpollview
  setTimeout(() => {
    this.$router.push(`/jPollView/${this.pollId}/${this.participant}`);
  }, 3000);
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