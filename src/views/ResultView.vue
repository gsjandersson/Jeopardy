<template>
  <div>
    <!-- Display the current question -->
    {{ question }}
  </div>

  <!-- Include the BarsComponent and bind data prop -->
  <BarsComponent v-bind:data="submittedAnswers" />

  <!-- Display submitted answers -->
  <span>{{ submittedAnswers }}</span>
</template>

<script>
// Import required modules
import BarsComponent from '@/components/BarsComponent.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  // Component name and imported components, ska prenumerera på ändringar!!! skicka till alla som är anslutna men bara lyssna för de views där det är intreesant
  name: 'ResultView',
  components: {
    BarsComponent
  },

  // Initial data properties
  data: function () {
    return {
      question: "",
      submittedAnswers: {}
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    // Set pollId from route parameters and join the poll
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId) //lyssnar på ändringar i poll, vilka ämdringar vill vi visa//

    // Listen for data updates and new questions from the server
    socket.on("dataUpdate", (update) => {
      this.submittedAnswers = update.a;
      this.question = update.q;
    });
    socket.on("newQuestion", update => {
      this.question = update.q;
      this.data = {};
    })
  }
}
</script>
