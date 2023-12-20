<template>
    <div id="answer-box-none">
      <h1>{{ uiLabels.tooSlow }}</h1>
      <p>{{ uiLabels.noCashEarned }}</p>
    </div>  
  </template>
  
    <script>
    import io from 'socket.io-client';
    const socket = io(sessionStorage.getItem("ipAdressSocket"));
    
    export default {
      name: 'AnswerNone',
      data: function () {
        return {
          uiLabels: {},
          pollId: "",
          lang: localStorage.getItem("lang") || "en",
          row: "",
          participant: ""
        }
      },
      created: function () {
        this.pollId = this.$route.params.pollId
        this.participant = this.$route.params.participantName
        this.row = this.$route.params.row

        socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participant })
    
        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
          this.uiLabels = labels;
        });

        socket.on('goToBoard', () => {
        this.goToBoard();
        });

      },
      methods: {
        goToBoard() {
          this.$router.push(`/jPollView/${this.pollId}/${this.participant}`);
        },
        exitCreatorMode() {
          this.$router.push('/jStartView');
        }
      }
    }
  </script>