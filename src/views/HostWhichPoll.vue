<template>
    <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    <button id="UKflagga" v-on:click="switchLanguageEnglish">
      {{ uiLabels.changeLanguage }}
    </button>
    <button id="sverigeflagga" v-on:click="switchLanguageSwedish">
      {{ uiLabels.changeLanguage }}
    </button>
  
    <header>
      <h1> {{ uiLabels.hostViewTitle }} </h1>
    </header>
  
    <p> Jeopardy ID: </p>
    <input type="text" v-model="pollId" v-on:keydown.enter="goToHost">
  
    <div>
      <button id="playButton" v-on:click="goToHost">
        {{ uiLabels.participatePoll }}
      </button>
      <p v-if="errorIdMessage == true" style="color: red">
          {{ uiLabels.errorIdNotExist }}
      </p>
    </div>
  </template>
  
  <script>
  // Import required modules
  import io from 'socket.io-client';
  const socket = io(sessionStorage.getItem("ipAdressSocket"));
  
  export default {
    // Component name and imported components
    name: 'HostWhichPoll',
  
    // Initial data properties
    data: function () {
      return {
        uiLabels: {}, // Object for storing UI labels
        pollId: "", // Input for poll ID
        lang: localStorage.getItem("lang") || "en", // Language setting,
        errorIdMessage: false,
        isExisting: false
      }
    },
  
    // Lifecycle hook - component creation
    created: function () {
    // Emitting an event when the page is loaded and listening for initialization data
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on('existingPoll', (isExisting) => {
        this.isExisting = isExisting
        console.log(isExisting, this.isExisting)
        }
      )

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
      goToHost() {
        socket.emit('checkExisting', this.pollId);

        setTimeout(() => {
          if (this.isExisting) {
            this.errorIdMessage = false;
            socket.emit("updateJoinable", {pollId: this.pollId, makeJoinable: true});
            this.$router.push('/HostView/' + this.pollId);
          } else {
            this.errorIdMessage = true;
          }
        }, 5);
      },
      exitCreatorMode() {
        this.$router.push('/jStartView');
      }
    }
  }
  </script>