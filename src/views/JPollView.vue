<template>
  <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">
    {{ uiLabels.exit }}
  </button>

  <div>
    <!-- Display the current pollId -->
    {{ pollId }}

    <!-- Include the QuestionComponent and bind question prop -->
    <QuestionComponent v-bind:question="question" v-on:answer="submitAnswer($event)" />

    <!-- Display submitted answers -->
    <span>{{ submittedAnswers }}</span>
  </div>
</template>


<script>
// Import required modules
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  // Component name and imported components
  name: 'JPollView',
  components: {
    QuestionComponent
  },

  // Initial data properties
  data: function () {
    return {
      uiLabels: {},
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      lang: localStorage.getItem("lang") || "en"
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    // Set pollId from route parameters and join the poll
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)

    // Listen for new questions and data updates from the server
    socket.on("newQuestion", q =>
      this.question = q
    )
    socket.on("dataUpdate", answers =>
      this.submittedAnswers = answers
    )
  },

  // Methods to interact with the server
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", { pollId: this.pollId, answer: answer })
    },
    exitCreatorMode() {
      this.$router.push('/jStartView');
    },
  }
}
</script>
