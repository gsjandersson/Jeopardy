<template>
  <body>
    <main>

      <div>
        <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
        <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
      </div>

      <header>
        <img src="/img/jeopardy.png" style="width: 50vw">
        <h2 style="margin:1em">{{ uiLabels["sales-pitch"] }}</h2>
        <h3 style="margin:1em">{{ uiLabels.subHeading }}</h3>
      </header>

      <div class="buttonRow">

          <button id="playButton" v-on:click="play">
          {{ uiLabels.participatePoll}}
          </button>
        
          <button id="createButton" v-on:click="create"> 
          {{uiLabels.createPoll }}
            </button>
        
          <button id="editButton" v-on:click="edit"> 
          {{ uiLabels.editPoll }}
            </button>

            <button id="hostButton" v-on:click="host"> 
          {{ uiLabels.hostPoll }}
            </button>
        
      </div>


    </main>
  </body>
</template>

<script>
// Importing components and libraries
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  // Component name and imported components
  name: 'JStartView',
  components: {
    ResponsiveNav
  },

  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      lang: localStorage.getItem("lang") || "en", // Language setting
      hideNav: true // Flag for hiding the navigation menu
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    // Emitting an event when the page is loaded and listening for initialization data
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
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

    play () { 
      this.$router.push('/JJoinView');
    },

    create () {
      this.$router.push('/JCreateInfo');
    },

    edit () {
      this.$router.push('/JCreateInfo');
    },

    host () {
      this.$router.push('/HostWhichPoll');
    },
  }
}
</script>

<style scoped>
/* Scoped styles for the component */

main {
  display: grid;
  grid-template-columns: 3em auto;
}

header {
  margin-bottom: 50px;
}

header img {
  margin-top: 100px;
}
.buttonRow {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Three columns with equal width */
  gap: 40px; /* Adjust the gap between buttons as needed */
  margin-left: 155px;
}

#playButton, #createButton, #editButton, #hostButton {
  height: 120px;
  width: 210px;
  font-size: 1.5em;
}

</style>