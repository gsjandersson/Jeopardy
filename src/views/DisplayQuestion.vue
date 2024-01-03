<template>
    <body>
  
        <div>
          <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
        </div>
  
        <header>
          <h1> {{ question }} </h1> 
          <span :style="{ fontSize: countdownSize + 'em' }">{{ countdown }}</span>
        </header>
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
          question: "",
          countdown: 10,
          countdownSize: 3, // Initial font size
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
          console.log("all have answered")
          // returns true if all have answered
        });

        this.startCountdown();
        
      },

      computed: {
    countdownClass() {
      // Define classes for different countdown values
      if (this.countdown >= 8) {
        return 'countdown-large';
      } else if (this.countdown >= 5) {
        return 'countdown-medium';
      } else {
        return 'countdown-small';
      }
    }
  },

      methods: {
    startCountdown() {
      const countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
          this.countdownSize -= 0.1; // Adjust the rate of size decrease as per your preference
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

  <style>

.countdown-large {
  font-size: 3em; /* Change the font size as per your requirement */
  transition: font-size 0.5s ease-in-out; /* Add a smooth transition effect */
}

.countdown-medium {
  font-size: 2em; /* Change the font size as per your requirement */
  transition: font-size 0.5s ease-in-out; /* Add a smooth transition effect */
}

.countdown-small {
  font-size: 1em; /* Change the font size as per your requirement */
  transition: font-size 0.5s ease-in-out; /* Add a smooth transition effect */
}
</style>