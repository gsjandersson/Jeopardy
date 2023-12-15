<!-- Code from playerturn -->
<template>
    <body>
  
        <header>
          <h1> {{ uiLabels.Winnertitle }} </h1>
        </header>
        d
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
        pollId: "", // Input for poll ID
        lang: localStorage.getItem("lang") || "en", // Language setting
        errorIdMessage: false,
        errorCategoryNo: false,
        errorQuestionNo: false,
        categoryNo: 5,
        questionNo: 5,
        participantTurn:""
      }
    },
  
    // Lifecycle hook - component creation
    created: function () {
        this.participantTurn = this.$route.params.participantTurn
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
        this.data = data),
      socket.on('participantTurn', (participant) =>
        this.participantTurn = participant
    );
    socket.emit('getParticipantTurn', (this.pollId))
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
        if (this.pollId !== "" && this.categoryNo > 0 && this.questionNo > 0) {
          this.errorIdMessage = false;
          this.errorCategoryNo = false;
          this.errorQuestionNo = false;
          socket.emit("createPoll", { pollId: this.pollId, lang: this.lang, 
            questionNo: this.questionNo, categoryNo: this.categoryNo});
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
        this.$router.push('/jStartView');
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
  