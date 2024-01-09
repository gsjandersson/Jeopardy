<template>
  <body>
    <button id="homescreenButtonTopLeft" v-on:click="exit">{{ uiLabels.exit }}</button>

    <header>
      Jeopardy Id: {{ pollId }}
    </header>

    <h2> {{ uiLabels.YouAre }} {{ participantName }} </h2>
    <h3> {{ uiLabels.moneyInBank }}: ${{ cashTotal }} </h3>

    <main>
      <div class="jeopardy-board">
        <!-- Display column titles -->
        <div class="jeopardy-row">
          <div v-for="(category, index) in categories" :key="index"
            :style="{ width: `calc(90vw / ${categories.length})` }" class="jeopardy-category">
            <div v-if="!category">
              <p> {{ uiLabels.noCategoryTitle }} </p>
            </div>
            <div v-else>
              <div>{{ category }}</div>
            </div>
          </div>
        </div>

        <div>
          <hr>
        </div>

        <!-- Display Jeopardy board content -->
        <div v-for="(row, indexRow) in questions" :key="indexRow" class="jeopardy-row">
          <div v-for="(col, indexCol) in row" :key="indexCol" class="jeopardy-square" :style="{
            width: `calc(90vw / ${categories.length})`,
            backgroundColor: col.completed ? '#0a4c8a' : ''
          }" @click="handleClick(indexRow, indexCol)">
            <div>
              <div v-if="!col.question">
                <p> {{ uiLabels.noQuestion }} </p>
              </div>
              <div v-else>
                <div>${{ (indexRow + 1) * 100 }} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

  </body>
</template>


<script>
// Import required modules
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  // Component name and imported components
  name: 'JPollView',

  // Initial data properties
  data: function () {
    return {
      uiLabels: {},
      pollId: "",
      lang: localStorage.getItem("lang") || "en",
      categories: [],
      questions: [],
      participantName: "",
      cashTotal: 0,
      participantTurn: "",
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    this.pollId = this.$route.params.pollId
    this.participantName = this.$route.params.participantName

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participantName })

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.emit("pageLoaded", this.lang);

    socket.on("jPollViewData", (d) => {
      console.log("------- j poll view data-------")
      console.log("categories: " + d.categories)
      console.log("cashTotal: " + d.cashTotal)
      console.log("participantTurn: " + d.participantTurn)
      console.log("------- j poll view data-------")

      this.categories = d.categories;
      this.questions = d.questions;
      this.cashTotal = d.cashTotal;
      this.participantTurn = d.participantTurn;
    });

    socket.emit("getJPollViewData", {pollId: this.pollId, participantName: this.participantName});

    socket.on("goToHome", () => {
          window.alert("Host has ended the quiz, let's see who won!");
          this.$router.push(`/WinnerView/${this.pollId}`);
        });

    socket.on('goToQuestion', () => {
      console.log("go to question j poll view")
      this.$router.push(`/QuestionView/${this.pollId}/${this.participantName}`);
    });
  },

  // Methods to interact with the server
  methods: {
    handleClick(rowNo, colNo) {
      let question = this.questions[rowNo][colNo]
      if (question.completed === false && question.question !== "" && this.participantName == this.participantTurn) {
        socket.emit("updateCurrentQuestion", { pollId: this.pollId, row: rowNo, col: colNo })
        socket.emit('updateTurnOrder', (this.pollId))
        socket.emit('allParticipantsGoToQuestion', this.pollId)
      }
    },
    exit() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  margin: 0;
}

footer {
  padding-bottom: 10px;
}

hr {
  color: black;
  /* Line color */
  background-color: black;
  /* Line color for older browsers */
  height: 5px;
  /* Line thickness */
  width: 100vw;
  border: none;
  /* Remove the default border */
}
</style>