<!-- Code from playerturn -->
<template>
  <body>
    <div>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    </div>

    <header>
      <h1> {{ uiLabels.Winnertitle }} </h1>
    </header>

    <div class="podium">
      <div v-for="(part, index) in participantsAndCashTotal" :key="index" class="podium-item">
        {{ part.name }}: {{ part.cashTotal }}$
    </div>
    </div>

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
      socket.emit("leavePoll", { pollId: this.pollId, participantName: undefined })
      this.$router.push('/');
    }
  }
}
</script>

<style>
.podium {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.podium-item {
  width: 200px;;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}

/* Specific styles for winner, second, and third place */
.podium-item:nth-child(1) {
  font-size: 40px;
  font-weight: bold;
  color: gold;
  ;
}

.podium-item:nth-child(2) {
  font-size: 30px;
  font-weight: bold;
  color: silver;
}

.podium-item:nth-child(3) {
  font-size: 20px;
  font-weight: bold;
  color: rgb(172, 92, 35)
}

ol {
  text-align: center;
  display: inline-block;
}

main {
  overflow: scroll;
}
</style>
  