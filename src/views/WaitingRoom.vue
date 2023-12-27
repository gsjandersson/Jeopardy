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
  // Importing components and libraries
  import ResponsiveNav from '@/components/ResponsiveNav.vue';
  import io from 'socket.io-client';
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
        participantName: ""
      }
    },
  
    // Lifecycle hook - component creation
    created: function () {
      // Lifecycle hook - component creation
      // this.id = this.$route.params.id;
  
      this.pollId = this.$route.params.pollId
      this.participantName = this.$route.params.participantName

      socket.emit('joinPoll', { pollId: this.pollId, participantName: undefined })

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
        this.$router.push(`/JPollView/${this.pollId}/${this.participantName}`)
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
      goToPlayerTurn() {
        this.$router.push(`/jPollView/${this.pollId}/${this.participantName}`)
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