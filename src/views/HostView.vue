<template>
    <body>
      <audio ref="audioElement" src="/music/lobbyMusic.mp3"></audio>
        <div>
          <button v-on:click="toggleMusic">Play/Pause Music</button>
          <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
          <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
          <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
        </div>
  
        <header>
          <h1> {{ uiLabels.hostTheGameTitle }} </h1>
        </header>
        <div>
        <h3> Jeopardy ID:</h3>
        <h1> {{ pollId }}</h1>
        <img :src="qrCodeUrl" alt="QR Code">
        </div>

        <div> 
            <h2>{{ uiLabels.players }} </h2>
            <li v-for="(participant, index) in participants" :key="index">
                {{ participant }}
            </li>
        </div>
        <div class="button-container">
          <button id="playButton" v-on:click="goToPlayerTurn">
            {{ uiLabels.letsplay }}
          </button>
        </div>
    </body>
  </template>
  
  <script>
  // Importing components and libraries
  import ResponsiveNav from '@/components/ResponsiveNav.vue';
  import io from 'socket.io-client';
  import QRCode from 'qrcode';
  const socket = io(sessionStorage.getItem("ipAdressSocket"));
  
  export default {
    // Component name and imported components
    name: 'JCreateInfo',
    components: {
      ResponsiveNav
    },
  
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

      let data = "http:/"+ sessionStorage.getItem("ipAdress") + ":5173" + "/EnterNameView/" + this.pollId;

      QRCode.toDataURL(data,  { color: { dark: '#ffff00', light: '#0000' }}, (err, url) => {
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
    
    // Methods for language switching and toggling the navigation menu
    methods: {
      playMusic() {
        this.$refs.audioElement.play();
      },
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
        socket.emit("updateActive", {pollId: this.pollId, makeActive: true})
        socket.emit('allParticipantsGoToBoard', this.pollId);
        this.$router.push('/PlayerTurnView/' + this.pollId);
      },
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

  .button-container {
    margin-top: 20px;
  }
  
  main {
    overflow: scroll;
  }
  </style>