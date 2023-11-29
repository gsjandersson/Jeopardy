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
  
    <div class="buttonContainer">
      <div>
        <button id="playButton"> 
          <router-link style="color: #ffff00; font-size: 2em" v-bind:to="'/poll/' + id">{{ uiLabels.participatePoll }}</router-link> 
        </button>
      </div>
      <div>
        <button id="createButton"> <router-link style="color: #ffff00; font-size: 2em" v-bind:to="'/JCreateInfo/' + id">{{ uiLabels.createPoll }}</router-link> </button>
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
  
  body {
    background-color: #073763ff;
    color: #ffff00;
  }
  
  main {
    display: grid;
    grid-template-columns: 2em auto;
  }
  
  #UKflagga {
    background-image: url(/img/UKflagga.png);
    background-size: 100px 50px;
    margin: 25px 10px 0 0;
    position: fixed; /* Fixed position allows the image to stay in the same place even when scrolling */
    top: 0; /* Position at the top of the viewport */
    right: 15px; /* Position at the right of the viewport */
    width: 100px; /* Adjust the width as needed */
    height: 50px; /* Maintain the aspect ratio of the image */
  }
  
  #sverigeflagga {
    background-image: url(/img/sverigeflagga.png);
    background-size: 100px 50px;
    margin: 25px 10px 0 0;
    position: fixed; /* Fixed position allows the image to stay in the same place even when scrolling */
    top: 0; /* Position at the top of the viewport */
    right: 125px; /* Position at the right of the viewport */
    width: 100px; /* Adjust the width as needed */
    height: 50px; /* Maintain the aspect ratio of the image */
  }
  
  header {
    margin-bottom: 50px;
  }
  
  header img {
    margin-top: 100px;
  }
  
  .buttonContainer{
    display: grid;
    grid-template-columns: 50vw 50vw;
  }
  
  button {
    background-color: #073763ff;
    margin-bottom: 200px;
    padding: 1em;
    width: 10em;
  }
  
  #playButton{
    margin-left: 10px;
  }
  
  #createButton{
    margin-right: 10px;
  }
  
  button:hover{
    cursor: pointer;
  }
  
  </style>