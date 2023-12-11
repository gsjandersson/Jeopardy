<template>
    <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    <button id="UKflagga" v-on:click="switchLanguageEnglish">
      {{ uiLabels.changeLanguage }}
    </button>
    <button id="sverigeflagga" v-on:click="switchLanguageSwedish">
      {{ uiLabels.changeLanguage }}
    </button>
  
    <header>
      <h1> {{ uiLabels.editViewTitle }} </h1>
    </header>

    <div>
        <div>
        <p> Jeopardy ID: </p>
        <input type="text" v-model="pollId">
      </div>      
    </div>
    
    <button id="playButton" v-on:click="goToBoard">
      {{ uiLabels.editThePoll }}
    </button>
    <p v-if="errorIdMessage == true" style="color: red">
        {{ uiLabels.errorPlayIdMessage }}
    </p>

  </template>
  
  <script>
//Går fortfarande att redigera quiz som ej är skapade än, vet ej hur man ska lösa detta


  // Import required modules
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
    // Component name and imported components
    name: 'EditQuiz',
  
    // Initial data properties
    data: function () {
      return {
        uiLabels: {}, // Object for storing UI labels
        pollId: "", // Input for poll ID
        lang: localStorage.getItem("lang") || "en", // Language setting,
        errorIdMessage: false
      }
    },
  
    // Lifecycle hook - component creation
    created: function () {
      // Emitting an event when the page is loaded and listening for initialization data
      socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels;
      })
    },
  
    // Methods to interact with the server
    methods: {
      switchLanguageEnglish: function () {
        if (this.lang === "sv") {
          this.lang = "en";
        }
        localStorage.setItem("lang", this.lang);
        socket.emit("switchLanguage", this.lang);
      },
      switchLanguageSwedish: function () {
        if (this.lang === "en") {
          this.lang = "sv";
        }
        localStorage.setItem("lang", this.lang);
        socket.emit("switchLanguage", this.lang);
      },
      goToBoard() {
        if (this.pollId !== "") {
          this.errorIdviewMessage = false;
          this.$router.push('/BoardViewSteph/' + this.pollId);
        }
        else {
          this.errorIdMessage = true;
        }
      },
      exitCreatorMode() {
        this.$router.push('/jStartView');
      }
    }
  }
  </script>