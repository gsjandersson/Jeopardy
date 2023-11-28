<template>
  <div>
    <!-- Poll link input field -->
    Poll link:
    <input type="text" v-model="pollId">

    <!-- Create poll button -->
    <button v-on:click="createPoll">
      Create poll
    </button>

    <!-- Question input and answers input fields -->
    <div>
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <!-- Input field for each answer -->
        <input v-for="(_, i) in answers" v-model="answers[i]" v-bind:key="'answer' + i">
        <!-- Button to add a new answer -->
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>

    <!-- Button to add a new question -->
    <button v-on:click="addQuestion">
      Add question
    </button>

    <!-- Input field for question number and button to run the question -->
    <input type="number" v-model="questionNumber">
    <button v-on:click="runQuestion">
      Run question
    </button>

    <!-- Display data -->
    {{ data }}

    <!-- Router link to check result -->
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
  </div>
</template>


<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
  data: function () {
    return {
      // Initial data properties
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {}
    }
  },
  created: function () {
    // Lifecycle hook - component creation
    this.id = this.$route.params.id;

    // Emit an event to the server when the page is loaded
    socket.emit("pageLoaded", this.lang);

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    // Listen for data updates from the server
    socket.on("dataUpdate", (data) =>
      this.data = data
    )

    // Listen for the event when a poll is created
    socket.on("pollCreated", (data) =>
      this.data = data)
  },
  methods: {
    // Methods to interact with the server
    createPoll: function () {
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang })
    },
    addQuestion: function () {
      socket.emit("addQuestion", { pollId: this.pollId, q: this.question, a: this.answers })
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", { pollId: this.pollId, questionNumber: this.questionNumber })
    }
  }
}
</script>

