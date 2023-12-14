<template>
    <div id="answer-box-none">
      <h1>TOO SLOW</h1>
      <p>no cash earned</p>
    </div>  
  </template>
  
    <script>
    import io from 'socket.io-client';
    const socket = io("localhost:3000");
    
    export default {
      name: 'AnswerNone',
      data: function () {
        return {
          uiLabels: {},
          pollId: "",
          lang: localStorage.getItem("lang") || "en",
          errorIdMessage: false,
          isExisting: false
        }
      },
      created: function () {
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
          this.uiLabels = labels;
        });
        socket.on('existingPoll', (isExisting) => {
          this.isExisting = isExisting;
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
        goToBoard() {
          socket.emit('checkExisting', this.pollId);
  
          setTimeout(() => {
            if (this.isExisting) {
              this.errorIdMessage = false;
              this.$router.push('/BoardViewSteph/' + this.pollId);
            } else {
              this.errorIdMessage = true;
            }
          }, 5);
        },
        exitCreatorMode() {
          this.$router.push('/jStartView');
        }
      }
    }
  </script>