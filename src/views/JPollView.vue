<template>
  <body>
    <button id="homescreenButtonTopLeft" v-on:click="exit">{{ uiLabels.exit }}</button>

    <header>
      Poll Id: {{ pollId }}
    </header>

    <h2> You are: {{ participantName }}</h2>
    <h2> Participant turn: {{ participantTurn }}</h2>
    <h2> Participants: </h2>
    <ul style="list-style-type: none;">
      <li v-for="(participant, index) in participants" :key="index"
        style="display: inline-block; margin-right: 15px; font-size: 25px; font-weight: bold;">
        {{ participant }}
      </li>
    </ul>
    <h3> You have: {{ cashTotal }}</h3>
    <h4>Participants and their Cash Total:</h4>
    <ul style="list-style-type: none;">
      <li v-for="(part, index) in participantsAndCashTotal" :key="index"
        style="display: inline-block; margin-right: 15px; font-size: 25px; font-weight: bold;">
        {{ part.name }}: {{ part.cashTotal }}
      </li>
    </ul>

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
const socket = io("localhost:3000");

export default {
  // Component name and imported components
  name: 'JPollView',

  // Initial data properties
  data: function () {
    return {
      uiLabels: {},
      pollId: "",
      participantAnswer: "",
      lang: localStorage.getItem("lang") || "en",
      categories: [],
      questions: [],
      participantName: "",
      participants: [],
      cashTotal: 0,
      participantTurn: "",
      participantsAndCashTotal: []
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    this.pollId = this.$route.params.pollId
    this.participantName = this.$route.params.participantName

    /*socket.emit('getPollLang', (this.pollId))

    socket.on('pollLang', (lang) =>
      this.lang = lang
    );*/

    socket.emit("pageLoaded", this.lang);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    })

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participantName })

    socket.emit("retrieveQuestions", (this.pollId));

    socket.emit("retrieveCategories", (this.pollId));

    socket.emit('getCashTotal', { pollId: this.pollId, partName: this.participantName })

    socket.emit('getParticipantTurn', (this.pollId))

    socket.emit('getParticipantsAndCashTotal', (this.pollId))

    socket.on("questionsRetrieved", (questions) =>
      this.questions = questions
    );

    socket.on("categoriesRetrieved", (categories) =>
      this.categories = categories
    );

    socket.on('participantUpdate', (participants) => {
      this.participants = participants;
    }
    );

    socket.on('goToQuestion', (d) => {
      this.$router.push(`/QuestionView/${this.pollId}/${this.participantName}/${d.row}/${d.col}`);
    });

    socket.on('cashTotal', (cashTotal) => {
      this.cashTotal = cashTotal
    });

    socket.on('participantTurn', (participant) =>
      this.participantTurn = participant
    );

    socket.on('participantsAndCashTotal', (participantsAndCashTotal) => {
      this.participantsAndCashTotal = participantsAndCashTotal
      console.log("participantsAndCashtotal: " + participantsAndCashTotal)
    });

  },

  // Methods to interact with the server
  methods: {
    handleClick(rowNo, colNo) {
      let question = this.questions[rowNo][colNo]
      if (question.completed === false && question.question !== "") {
        socket.emit('updateTurnOrder', (this.pollId))
        socket.emit('allParticipantsGoToQuestion', { pollId: this.pollId, row: rowNo, col: colNo })
      }
    },
    exit() {
      this.$router.push('/jStartView');
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