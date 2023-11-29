<template>
  <body>
    <main>

      <div>
        <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
        <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
      </div>

      <header>
        <h1 v-if="this.lang == 'en'">HOW TO CREATE A QUIZ</h1>
        <h1 v-if="this.lang == 'sv'">HUR SKAPAR DU ETT QUIZ</h1>
      </header>


      <div>
        <ol v-if="this.lang == 'en'">
          <li>Write 5 topics</li>
          <li>Click on each $ box to create a new question</li>
          <li>Type the question</li>
          <li>Click on YES or NO to mark the right answer</li>
          <li>Press Complete and return to Jeopardy Board to lock in the answer</li>
          <li>The completed questions will be marked with a lighter colour</li>
          <li>Continue to fill in the rest of the questions</li>
          <li>Great job, you have created your own Jeopardy!</li>
        </ol>

        <ol v-if="this.lang == 'sv'">
          <li>Skriv 5 ämnen</li>
          <li>Klicka på de olika $ i tabellen för att skapa nya frågor</li>
          <li>Skiv ut frågan</li>
          <li>Klicka på JA eller NEJ för att märkera rätt svar</li>
          <li>Tryck klar och returnera till Jeopardy brädan för att låsa in svaret</li>
          <li>De klarskrivna frågorna märkeras med en ljusare färg</li>
          <li>Fortsätt att fylla i resten av frågorna</li>
          <li>Bra jobbat, du har skapat ditt eget Jeopardy!</li>
        </ol>
      </div>

      <button id="createButton"> <router-link style="color: #ffff00; font-size: 2em"
          v-bind:to="'/BoardViewSteph/' + id">{{ uiLabels.createPoll }}</router-link> </button>
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
  name: 'JCreateInfoSwe',
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

body {
  background-color: #073763ff;
  color: #ffff00;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
}


#UKflagga {
  background-image: url(/img/UKflagga.png);
  background-size: 100px 50px;
  margin: 25px 10px 0 0;
  position: fixed;
  /* Fixed position allows the image to stay in the same place even when scrolling */
  top: 0;
  /* Position at the top of the viewport */
  right: 15px;
  /* Position at the right of the viewport */
  width: 100px;
  /* Adjust the width as needed */
  height: 50px;
  /* Maintain the aspect ratio of the image */
}

#sverigeflagga {
  background-image: url(/img/sverigeflagga.png);
  background-size: 100px 50px;
  margin: 25px 10px 0 0;
  position: fixed;
  /* Fixed position allows the image to stay in the same place even when scrolling */
  top: 0;
  /* Position at the top of the viewport */
  right: 125px;
  /* Position at the right of the viewport */
  width: 100px;
  /* Adjust the width as needed */
  height: 50px;
  /* Maintain the aspect ratio of the image */
}

header {
  background-color: #073763ff;
  margin: 0; /* Set margin to 0 to remove any default margin */
  padding-top: 100px; /* Set padding to 0 to remove any default padding */
}

h1 {
  background-color: #073763ff;
  margin: 0; /* Set margin to 0 to remove any default margin */
  padding: 0; /* Set padding to 0 to remove any default padding */
}

button {
  background-color: #073763ff;
  width: 10em;
  margin: 0; /* Set margin to 0 to remove any default margin */
  padding: 1em; /* Set padding to 0 to remove any default padding */
}

button:hover {
  cursor: pointer;
}

ol {
  text-align: left;
  display: inline-block;
  margin: 0; /* Set margin to 0 to remove any default margin */
  padding: 50px; /* Set padding to 0 to remove any default padding */
}</style>
