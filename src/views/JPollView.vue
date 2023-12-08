<template>
  <body>
    <button id="homescreenButtonTopLeft" v-on:click="exit">{{ uiLabels.exit }}</button>
    
    <header>
    Poll Id: {{ pollId }}
    </header>

    <h2> You are: {{ participantName }}</h2>
    <h3> You have: {{ cashTotal }}</h3>

    <main>
      <div class="jeopardy-board">
      <!-- Display column titles -->
      <div class="jeopardy-row">
        <div v-for="(category, index) in categories" :key="index" 
        :style="{ width: `calc(90vw / ${categories.length})`}" 
        class="jeopardy-category">
          <div v-if="!category">
            <p> No category title </p>
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
        <div v-for="(col, indexCol) in row" :key="indexCol" class="jeopardy-square"
          :style="{ width: `calc(90vw / ${categories.length})`,
          backgroundColor: col.completed ? '#0a4c8a' : ''}"
          @click="handleClick(indexRow, indexCol)">
          <div>
          <div v-if="!col.question">
            <p> No question </p>
          </div>
          <div v-else>
            <div>${{ (indexRow+1)*100 }} </div>
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
      cashTotal: 0
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    })
    // Set pollId from route parameters and join the poll
    this.pollId = this.$route.params.pollId
    this.participantName = this.$route.params.participantName

    socket.emit('joinPoll', {pollId: this.pollId, participantName: this.participantName})

    socket.emit("retrieveQuestions", (this.pollId));

    socket.emit("retrieveCategories", (this.pollId));

    socket.emit('getCashTotal', {pollId: this.pollId, partName: this.participantName})

    socket.on("questionsRetrieved", (questions) => 
      this.questions = questions
    );

    socket.on("categoriesRetrieved", (categories) => 
      this.categories = categories
    );
    
    socket.on('participantUpdate', (participants) => {
      console.log("participant update JpollView")
      this.participants = participants;
    }
    );

    socket.on('goToQuestion', (d) => {
      this.$router.push(`/QuestionView/${this.pollId}/${this.participantName}/${d.row}/${d.col}`);
    });

    socket.on('cashTotal', (cashTotal) => {
      this.cashTotal = cashTotal
    });

  },

  // Methods to interact with the server
  methods: {
    handleClick(rowNo, colNo) {
      let question = this.questions[rowNo][colNo]
      if (question.completed === false && question.question !== "") {
        socket.emit('allParticipantsGoToQuestion', {pollId: this.pollId, row: rowNo, col: colNo})
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

.jeopardy-board {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.jeopardy-row {
  display: flex;
}

.jeopardy-square {
  border: 1px solid #000;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 5px;
}

.jeopardy-category {
  border: 1px solid #000;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
}

footer {
  padding-bottom: 10px;
}

hr {
    color: black; /* Line color */
    background-color: black; /* Line color for older browsers */
    height: 5px; /* Line thickness */
    width: 100vw;
    border: none; /* Remove the default border */
  }

</style>