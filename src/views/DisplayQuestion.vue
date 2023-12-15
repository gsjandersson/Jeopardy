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
          row: "",
          col: "",
          question: ""
        }
      },
      created: function () {
        this.pollId = this.$route.params.pollId
        this.row = this.$route.params.row
        this.col = this.$route.params.col

        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
          this.uiLabels = labels;
        });

        socket.on('questionChosen', (question) => {
          this.question = question;
        });

        socket.emit("chosenQuestion", { pollId: this.pollId, questionRow: this.row, questionCol: this.col });

        socket.emit('questionCompleted', { pollId: this.pollId, row: this.row, col: this.col });
        
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