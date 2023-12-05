<template>
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
  name: 'PollView',
  components: {
    QuestionComponent
  },

  // Initial data properties
  data: function () {
    return {
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {}
    }
  },

  // Lifecycle hook - component creation
  created: function () {
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
    }
  }
}
</script>
