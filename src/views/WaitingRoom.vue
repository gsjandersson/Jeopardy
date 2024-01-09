<template>
  <body>

    <div>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    </div>

    <header>
      <h1> {{ uiLabels.waitingPlayersJoin }} </h1>
    </header>
    <div>
      <h3> Jeopardy ID:</h3>
      <h1> {{ pollId }}</h1>
    </div>

  </body>
</template>
  
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  // Component name and imported components
  name: 'JCreateInfo',

  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      pollId: "", // Input for poll ID
      lang: localStorage.getItem("lang") || "en", // Language setting
      participantName: ""
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    // Lifecycle hook - component creation
    // this.id = this.$route.params.id;

    this.pollId = this.$route.params.pollId
    this.participantName = this.$route.params.participantName

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participantName })

    socket.on('participantUpdate', (participants) => {
      this.participants = participants;
    });

    // Emit an event to the server when the page is loaded
    socket.emit("pageLoaded", this.lang);

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    socket.on('goToBoard', () => {
      this.$router.push(`/jPollView/${this.pollId}/${this.participantName}`)
    });

    socket.on("goToHome", () => {
          window.alert("Host has ended the quiz");
          this.$router.push('/');
        });


  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    exitCreatorMode() {
      socket.emit('leavePoll', { pollId: this.pollId, participantName: this.participantName });
      this.$router.push('/');
    }
  }
}
</script>
  
<style scoped>
/* Scoped styles for the component */

main {
  overflow: scroll;
}
</style>