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

      <!--gör array i labels som man loopar över, för mycket kladd slay-->
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

      <p> Jeopardy ID: </p>
      <input type="text" v-model="pollId">

      <div>
      <button id="createButton" v-on:click="createPoll">
        {{ uiLabels.createPoll }} 
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
  name: 'JCreateInfo',
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
    // Lifecycle hook - component creation
    // this.id = this.$route.params.id;

    // Emit an event to the server when the page is loaded
    socket.emit("pageLoaded", this.lang);

    // Listen for initialization data from the server
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    // Listen for data updates from the server
    socket.on("dataUpdate", (data) =>
      this.data = data
    )

    // Listen for the event when a poll is created
    socket.on("pollCreated", (data) =>
      this.data = data)
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
    createPoll: function () {
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang })
      this.$router.push('/BoardViewSteph/' + this.pollId);
    }
  }
}
</script>

<style scoped>
/* Scoped styles for the component */

header {
  margin-top: 100px;
}

ol {

  text-align: left;
  display: inline-block;
}
</style>
