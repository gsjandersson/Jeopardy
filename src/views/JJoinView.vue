<template>
  <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
  <button id="UKflagga" v-on:click="switchLanguageEnglish">
    {{ uiLabels.changeLanguage }}
  </button>
  <button id="sverigeflagga" v-on:click="switchLanguageSwedish">
    {{ uiLabels.changeLanguage }}
  </button>

  <header>
    <h1> {{ uiLabels.joinViewTitle }} </h1>
  </header>

  <p> Jeopardy ID: </p>
  <input type="text" v-model="pollId" v-on:keydown.enter="goToName">

  <div>
    <button id="playButton" v-on:click="goToName">
      {{ uiLabels.participatePoll }}
    </button>
    <p v-if="errorIdNotExist == true" style="color: red">
        {{ uiLabels.errorIdNotExist }}
    </p>
    <p v-if="errorIdNotJoinable == true" style="color: red">
        {{ uiLabels.errorIdNotJoinable }}
    </p>
    <p v-if="errorIdEmpty == true" style="color: red">
        {{ uiLabels.errorIdEmpty }}
    </p>

  </div>
</template>

<script>
// Import required modules
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  // Component name and imported components
  name: 'JJoinView',

  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      pollId: "", // Input for poll ID
      lang: localStorage.getItem("lang") || "en", // Language setting,
      errorIdNotExist: false,
      errorIdNotJoinable: false,
      errorIdEmpty: false,
      isExisting: false,
      isJoinable: false,
      isNotEmpty: false
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
    }
    )
    socket.on('joinablePoll', (isJoinable) => {
      this.isJoinable = isJoinable
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
    goToName() {
      socket.emit('checkExisting', this.pollId);
      socket.emit('checkJoinable', this.pollId);

      if (this.pollId === "") {
        this.isNotEmpty = false;
      }
      else {
        this.isNotEmpty = true;
      }

    setTimeout(() => {
      if (!this.isExisting) {
        this.errorIdNotExist = true;
      }
      else {
        this.errorIdNotExist = false;
      }
      if (!this.isJoinable) {
        this.errorIdNotJoinable = true;
      }
      else {
        this.errorIdNotJoinable = false;
      }
      if (!this.isNotEmpty) {
        this.errorIdEmpty = true;
      }
      else {
        this.errorIdEmpty = false;
      }
      if (this.isExisting && this.isJoinable && this.isNotEmpty) {
        this.errorIdNotExist = false;
        this.errorIdNotJoinable = false;
        this.errorIdEmpty = false;
        this.$router.push('/EnterNameView/' + this.pollId);
      }
    }, 5);
      
    },
    exitCreatorMode() {
      this.$router.push('/jStartView');
    }
  }
}
</script>