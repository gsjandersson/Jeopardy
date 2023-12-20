<template>
    <body>
  
        <div>
          <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
        </div>
  
        <header>
          The question is:
          <h1> {{ question }} </h1> 

          <h3> You have: {{ countdown }} seconds left </h3>
          
        </header>
    </body>
  </template>
  
    <script>
    import io from 'socket.io-client';
    const socket = io(sessionStorage.getItem("ipAdressSocket"));
    
    export default {
      name: 'DisplayQuestion',
      data: function () {
        return {
          uiLabels: {},
          pollId: "",
          lang: localStorage.getItem("lang") || "en",
          row: "",
          col: "",
          question: "",
          countdown: 10,
        }
      },
      created: function () {
        this.pollId = this.$route.params.pollId
        this.row = this.$route.params.row
        this.col = this.$route.params.col

        socket.emit("resetAnswerCount", this.pollId);

        socket.emit("pageLoaded", this.lang);
        socket.on("init", (labels) => {
          this.uiLabels = labels;
        });

        socket.emit('joinPoll', { pollId: this.pollId, participantName: undefined })

        socket.emit("chosenQuestion", { pollId: this.pollId, questionRow: this.row, questionCol: this.col });

        socket.on('questionChosen', (question) => {
          console.log("question chosen", question)
          this.question = question;
        });

        socket.emit('questionCompleted', { pollId: this.pollId, row: this.row, col: this.col });

        socket.on('hasAllAnswered', () => {
          setTimeout(() => {
            console.log("all jas answered registered")
          socket.emit('allParticipantsGoToAnswerResult', this.pollId);
          this.$router.push(`/QuestionResultView/${this.pollId}/${this.row}/${this.col}`);
          // returns true if all have answered
        }, 1000);
        });

        this.startCountdown();
        
      },

      methods: {
        startCountdown() {
          const countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(countdownInterval);
          socket.emit('allParticipantsGoToAnswerResult', this.pollId);
          this.$router.push(`/QuestionResultView/${this.pollId}/${this.row}/${this.col}`);
        }
      }, 1000); // Update every 1000ms (1 second)
    },
        exitCreatorMode() {
          this.$router.push('/jStartView');
        }
      }
    }
  </script>