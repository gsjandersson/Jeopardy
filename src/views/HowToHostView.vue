<template>
    <body>
  
        <div>
          <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
          <button id="backToBoardButton" v-on:click="backToBoard">{{ uiLabels.boardAgain }}</button>
          <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
          <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
        </div>
  
        <header>
          <h1> {{ uiLabels.hostInfoTitle }} </h1>
        </header>

        <div>
        <ol>
          <li v-for="(instruction, index) in uiLabels.hostInfo" :key="index">
            {{ instruction }}
          </li>
        </ol>
      </div>

      <div>
        Jeopardy ID: {{ pollId }}
      </div>

      <div class="button-container">
        <button id="hostViewButton" v-on:click="goToHostView">{{ uiLabels.goToHostView }}</button>
      </div>

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
        lang: localStorage.getItem("lang") || "en" // Language setting
      }
    },
  
    // Lifecycle hook - component creation
    created: function () {
  
      // Emit an event to the server when the page is loaded
      socket.emit("pageLoaded", this.lang);
      this.pollId = this.$route.params.pollId
  
      // Listen for initialization data from the server
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
      exitCreatorMode() {
        this.$router.push('/');
      },
      backToBoard () {
        this.$router.push('/BoardViewSteph/' + this.pollId);
      },
      goToHostView () {
        socket.emit("updateJoinable", {pollId: this.pollId, makeJoinable: true});
        this.$router.push('/HostView/' + this.pollId);
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

  #backToBoardButton {
  position: absolute;
  top: 15px; /* Position at the top of the viewport */
  left: 150px; /* Position at the right of the viewport */
  width: 110px; /* Adjust the width as needed */
  height: 50px; /* Maintain the aspect ratio of the image */
  color: #ffff00;
  font-size: 1em;
  margin: 1em;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh; /* Optional: Adjust the height based on your layout */
}

#hostViewButton {
  position: absolute;
  width: 110px; /* Adjust the width as needed */
  height: 50px; /* Maintain the aspect ratio of the image */
  color: #ffff00;
  font-size: 1em;
  margin: 1em;
}
</style>