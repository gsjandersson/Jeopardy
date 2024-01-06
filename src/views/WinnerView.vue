<!-- Code from playerturn -->
<template>
  <body>
    <div>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    </div>

    <header>
      <h1> {{ uiLabels.Winnertitle }} </h1>
    </header>

    <h4>{{ uiLabels.Leaderboard }}</h4>
    <ul style="list-style-type: none;">
      <li v-for="(part, index) in participantsAndCashTotal" :key="index"
        style="display: inline-block; margin-right: 15px; font-size: 25px; font-weight: bold;">
        {{ part.name }}: {{ part.cashTotal }}$
      </li>
    </ul>

  </body>
</template>
  
<script>
// Importing components and libraries
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  // Component name and imported components
  name: 'WinnerView',

  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      pollId: "", // Input for poll ID
      lang: localStorage.getItem("lang") || "en", // Language setting
      participantsAndCashTotal: []
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    this.pollId = this.$route.params.pollId

    socket.emit('joinPoll', { pollId: this.pollId, participantName: undefined })

    socket.emit("pageLoaded", this.lang);

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    socket.on('participantsAndCashTotal', (participantsAndCashTotal) => {
      this.participantsAndCashTotal = participantsAndCashTotal
    });

    socket.emit('getParticipantsAndCashTotal', (this.pollId))

  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    exitCreatorMode() {
      this.$router.push('/');
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
  