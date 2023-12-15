<template>
    <body>
  
        <div>
          <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
          <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
          <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
        </div>
  
        <header>
          <h1> {{ uiLabels.letsplayjeopardy }} </h1> 
        </header>

        <div>
            <div>
            <jpollview @question-selected="updateSelectedQuestion" />
            <displayquestion :selectedQuestion="selectedQuestion" />
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
        }
      },
      created: function () {
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
          this.uiLabels = labels;
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