<template>
  <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
  <button id="UKflagga" v-on:click="switchLanguageEnglish">
    {{ uiLabels.changeLanguage }}
  </button>
  <button id="sverigeflagga" v-on:click="switchLanguageSwedish">
    {{ uiLabels.changeLanguage }}
  </button>

  <header>
    <h1> {{ uiLabels.enterNameTitle }} </h1>
  </header>

  <p> {{ uiLabels.enterNameDescription }} </p>
  <input type="text" v-model="nameId"/>

  <div>
    <button id="playButton" v-on:click="joinPoll">
      {{ uiLabels.participatePoll }}
    </button>
    <p v-if="errorIdMessage == true" style="color: red">
      {{ uiLabels.errorNameIdMessage }}
    </p>
  </div>
</template>
  
  
<script>
// Import required modules
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  // Component name and imported components
  name: 'EnterNameView',

  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      nameId: "", // Input for name ID
      lang: localStorage.getItem("lang") || "en", // Language setting,
      errorIdMessage: false,
      pollId: ""
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    // Emitting an event when the page is loaded and listening for initialization data
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    })
    this.pollId = this.$route.params.pollId
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
    joinPoll() {
      if (this.nameId !== "") {
        this.errorIdMessage = false;
        this.$router.push('/jPollView/' + this.pollId);
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