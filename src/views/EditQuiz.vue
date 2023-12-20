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
        <input type="text" v-model="pollId" v-on:keydown.enter="goToBoard">
      </div>      
    </div>
    
    <button id="playButton" v-on:click="goToBoard">
      {{ uiLabels.editThePoll }}
    </button>
    <p v-if="errorIdMessage == true" style="color: red">
        {{ uiLabels.errorIdNotExist }}
    </p>

  </template>
  <script>
  import io from 'socket.io-client';
  const socket = io(sessionStorage.getItem("ipAdressSocket"));
  
  export default {
    name: 'EditQuiz',
    data: function () {
      return {
        uiLabels: {},
        pollId: "",
        lang: localStorage.getItem("lang") || "en",
        errorIdMessage: false,
        isExisting: false
      }
    },
    created: function () {
      socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels;
      });
      socket.on('existingPoll', (isExisting) => {
        this.isExisting = isExisting;
      });
    },
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
        socket.emit('checkExisting', this.pollId);

        setTimeout(() => {
          if (this.isExisting) {
            this.errorIdMessage = false;
            this.$router.push('/BoardViewSteph/' + this.pollId);
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
