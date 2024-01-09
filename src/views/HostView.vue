<template>
  <body>
    <audio ref="audioElement" src="/music/lobbyMusic.mp3"></audio>
    <div>
      <button id = "musicButton" v-on:click="toggleMusic">{{ uiLabels.pausePlayMusic }}</button>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
      <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
      <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
    </div>

    <header>
      <h1> {{ uiLabels.hostTheGameTitle }} </h1>
    </header>

    <main>
      <div class="container">
        <div class="column">
          <h2>Jeopardy ID</h2>
            <h1> {{ pollId }}</h1>
            <img :src="qrCodeUrl" alt="QR Code" style="width: 60%">
            <h3> {{ uiLabels.scanToJoin }}</h3>
        </div>

        <div class="column">
          <h2>{{ uiLabels.players }}</h2>
          <li v-for="(participant, index) in participants" :key="index">
            {{ participant }}
          </li>
        </div>
      </div>

      <div class="button-container">
        <button id="playButton" @click="goToPlayerTurn">{{ uiLabels.letsplay }}</button>
      </div>
    </main>
  </body>
</template>
  
<script>
// Importing components and libraries
import io from 'socket.io-client';
import QRCode from 'qrcode';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  // Component name and imported components
  name: 'HostView',

  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      pollId: "", // Input for poll ID
      lang: localStorage.getItem("lang") || "en", // Language setting
      participants: '',
      qrCodeUrl: ''
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    // Lifecycle hook - component creation
    // this.id = this.$route.params.id;

    this.pollId = this.$route.params.pollId

    let data = "http:/" + sessionStorage.getItem("ipAdress") + ":5173" + "/EnterNameView/" + this.pollId;

    QRCode.toDataURL(data, { color: { dark: '#ffff00', light: '#0000' } }, (err, url) => {
      if (err) console.log('Error: ' + err);
      this.qrCodeUrl = url;
    });

    socket.emit('joinPoll', { pollId: this.pollId, participantName: undefined })

    socket.on('participantUpdate', (participants) => {
      this.participants = participants;
    });

    // Emit an event to the server when the page is loaded
    socket.emit("pageLoaded", this.lang);

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });

  },
  mounted: function () {
    ////////////// IBLAND FUNKAR IBLAND INTE, KRAV FRÅN //////////////
    ////////////// HEMSIDAN ATT KLIENTEN MÅSTE INTERAGERA MED DEN //////////////
    //this.$refs.audioElement.play();
  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    toggleMusic() {
      if (this.$refs.audioElement.paused) {
        this.$refs.audioElement.play();
      }
      else {
        this.$refs.audioElement.pause();
      }
    },
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
    goToPlayerTurn() {
      socket.emit("updateActive", { pollId: this.pollId, makeActive: true })
      socket.emit('allParticipantsGoToBoard', this.pollId);
      this.$router.push('/PlayerTurnView/' + this.pollId);
    },
    exitCreatorMode() {
      socket.emit("allParticipantsGoToHome", this.pollId)
      socket.emit("updateJoinable", {pollId: this.pollId, makeJoinable: false});
      socket.emit('leavePoll', { pollId: this.pollId, participantName: undefined });
      this.$router.push('/');
    }
  }
}
</script>
  
<style scoped>
/* Scoped styles for the component */

.container {
  display: flex;
  justify-content: space-between;
}

.column {
  flex: 1;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button-container {
  margin-top: 20px;
}

main {
  overflow: scroll;
}

li {
  list-style-type: none;
}
</style>