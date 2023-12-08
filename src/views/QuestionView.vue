<template>
  <body>

      <div>
        <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
        <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
        <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
      </div>

      <header>
        <h1> {{ question }} </h1>
      </header>

      <main>

      <div>
        <p> Your answer: </p>
        <input type="text" v-model="answer">
      </div>

      <div>
        <button @click="submitAnswer"> Submit Answer </button>
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
      col: ""
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    this.pollId = this.$route.params.pollId
    this.participant = this.$route.params.participantName
    this.row = this.$route.params.row
    this.col = this.$route.params.col

    // Emit an event to the server when the page is loaded
    socket.emit("pageLoaded", this.lang);

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

    socket.emit('joinPoll', {pollId: this.pollId, participantName: this.participant})

    socket.emit("chosenQuestion", {pollId: this.pollId, questionRow: this.row, questionCol: this.col});

    socket.on('questionChosen', (question) => {
      this.question = question;
      console.log("question view question chosen")
    }); 


  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    switchLanguageEnglish: function () {
      if (this.lang === "sv") {
        this.lang = "en"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    },
    switchLanguageSwedish: function () {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    },
    exitCreatorMode() {
      this.$router.push('/jStartView');
    },
    submitAnswer: function () {
      // some answer lagring
      socket.emit('questionCompleted', {pollId: this.pollId, row: this.row, col: this.col})
      this.$router.push(`/jPollView/${this.pollId}/${this.participant}`)
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
