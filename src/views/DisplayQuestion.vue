<template>
    <body>
  
        <div>
          <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
        </div>
  
        <header>
<<<<<<< HEAD
          <h1> </h1> 
=======
          <h1> {{ question }} </h1> 
>>>>>>> ad328ef87efdd8f8f419c38e03203b4bf081c628
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
<<<<<<< HEAD
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
=======
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
        
>>>>>>> ad328ef87efdd8f8f419c38e03203b4bf081c628
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