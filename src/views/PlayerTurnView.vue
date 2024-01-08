<template>
    <body>
  
        <div>
          <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
          <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
          <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
        </div>
  
        <header>
          <h1> {{ uiLabels.PlayerTurnTitle }} </h1>
        </header>
         <div>
            <h2> {{ uiLabels.Participant }} {{ participantTurn }} {{ uiLabels.willPickQuestion }} </h2>
        </div> 
    </body>
  </template>
  
  <script>
  // Importing components and libraries
  import io from 'socket.io-client';
  const socket = io(sessionStorage.getItem("ipAdressSocket"));
  
  export default {
    // Component name and imported components
    name: 'PlayerTurnView',
  
    // Initial data properties
    data: function () {
      return {
        uiLabels: {}, // Object for storing UI labels
        pollId: "", // Input for poll ID
        lang: localStorage.getItem("lang") || "en", // Language setting
        participantTurn: ""
      }
    },
  
    // Lifecycle hook - component creation
    created: function () {
      this.pollId = this.$route.params.pollId
      // Lifecycle hook - component creation
      // this.id = this.$route.params.id;
  
      // Emit an event to the server when the page is loaded

      socket.emit("pageLoaded", this.lang);

      socket.emit('joinPoll', { pollId: this.pollId, participantName: undefined })

      socket.on('goToQuestion', (d) => {
        this.$router.push(`/DisplayQuestion/${this.pollId}`);
      });
  
      // Listen for initialization data from the server
      socket.on("init", (labels) => {
        this.uiLabels = labels
      })

      socket.on('participantTurn', (participant) =>
        this.participantTurn = participant
      );
  
      socket.emit('getParticipantTurn', (this.pollId))
    
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
      exitCreatorMode() {
        this.$router.push('/');
      }, 
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
  