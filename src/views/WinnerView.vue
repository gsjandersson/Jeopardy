<!-- Code from playerturn -->
<template>
  <body>
    <div>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    </div>

    <header>
      <h1> {{ uiLabels.Winnertitle }} </h1>
    </header>

    <h4>{{ uiLabels.Leaderboard }}</h4>
    <ul style="list-style-type: none;">
      <li v-for="(part, index) in participantsAndCashTotal" :key="index"
        style="display: inline-block; margin-right: 15px; font-size: 25px; font-weight: bold;">
        {{ part.name }}: {{ part.cashTotal }}$
      </li>
    </ul>

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
      participantsAndCashTotal: []
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    this.pollId = this.$route.params.pollId

    socket.emit("pageLoaded", this.lang);

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    socket.on('participantsAndCashTotal', (participantsAndCashTotal) => {
      this.participantsAndCashTotal = participantsAndCashTotal
    });

    socket.emit('getParticipantsAndCashTotal', (this.pollId))

    socket.emit('getParticipantTurn', (this.pollId))
  },
  // Methods for language switching and toggling the navigation menu
  methods: {
    exitCreatorMode() {
      this.$router.push('/');
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

    createPoll: function () {
      if (this.pollId !== "" && this.categoryNo > 0 && this.questionNo > 0) {
        this.errorIdMessage = false;
        this.errorCategoryNo = false;
        this.errorQuestionNo = false;
        socket.emit("createPoll", {
          pollId: this.pollId, lang: this.lang,
          questionNo: this.questionNo, categoryNo: this.categoryNo
        });
        this.$router.push('/BoardViewSteph/' + this.pollId);
      }
      if (this.pollId === "") {
        this.errorIdMessage = true;
      }
      else {
        this.errorIdMessage = false;
      }

      if (this.categoryNo < 1 || this.categoryNo === "") {
        this.errorCategoryNo = true;
      }
      else {
        this.errorCategoryNo = false;
      }

      if (this.questionNo < 1 || this.questionNo === "") {
        this.errorQuestionNo = true;
      }
      else {
        this.errorQuestionNo = false;
      }
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
  