<template>
  <body>
    <main>

      <div style="margin: 0; padding: 0;">
        <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
        <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
      </div>

      <header>
        <img src="/img/jeopardy.png" style="width: 50vw">
        <h2 style="margin:1em">{{ uiLabels["sales-pitch"] }}</h2>
        <h3 style="margin:1em">{{ uiLabels.subHeading }}</h3>
      </header>

      <div class="buttonContainer">
        <div>
          <button id="playButton">
            <router-link style="color: #ffff00; font-size: 2em" v-bind:to="'/poll/' + id">{{ uiLabels.participatePoll
            }}</router-link>
          </button>
        </div>
        <div>
          <button id="createButton"> <router-link style="color: #ffff00; font-size: 2em"
              v-bind:to="'/JCreateInfo/' + id">{{ uiLabels.createPoll }}</router-link> </button>
        </div>
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
  name: 'StartView',
  components: {
    ResponsiveNav
  },

  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      id: "", // Input for poll ID
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

    toggleNav: function () {
      this.hideNav = !this.hideNav;
    }
  }
}
</script>

<style scoped>
/* Scoped styles for the component */

main {
  display: grid;
  grid-template-columns: 2em auto;
}

header {
  margin-bottom: 50px;
}

header img {
  margin-top: 100px;
}

.buttonContainer {
  display: grid;
  grid-template-columns: 50vw 50vw;
}

#playButton {
  margin-left: 10px;
}

#createButton {
  margin-right: 10px;
}

</style>