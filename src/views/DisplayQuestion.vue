<template>
    <body>
  
        <div>
          <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
        </div>
  
        <header>
          <h1> {{ question }} </h1> 
        </header>

        <div>
            <div>
            </div>
        </div>
    </body>
  </template>
  
    <script>
    import io from 'socket.io-client';
    const socket = io("localhost:3000");
    
    export default {
      name: 'DisplayQuestion',
      data: function () {
        return {
    uiLabels: {},
    pollId: "",
    lang: localStorage.getItem("lang") || "en",
    selectedQuestion: "",
    questionValue: 0,
        }
      },
      ccreated: function () {
  socket.emit("pageLoaded", this.lang);
  socket.on("init", (labels) => {
    this.uiLabels = labels;
  });

  // Listen for the selected question event
  socket.on("displaySelectedQuestion", ({ question, value }) => {
    // Update local data to display the selected question
    this.selectedQuestion = question;
    this.questionValue = value;
  });
      },

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
        exitCreatorMode() {
          this.$router.push('/jStartView');
        }
      }
    }
  </script>