<template>
  <body>
    <button id="homescreenButtonTopLeft" v-on:click="exit">{{ uiLabels.exit }}</button>
    
    <header>
    Poll id: {{ pollId }}
    </header>

    <h1> {{ uiLabels.answerWhatIsAre }} </h1>

    <div>
      <input type="text" v-model="participantAnswer" v-bind:placeholder="uiLabels.answer">
    </div>

    <main>
      <div class="jeopardy-board">
      <!-- Display column titles -->
      <div class="jeopardy-row">
        <div v-for="(category, index) in categories" :key="index" :style="{ width: `calc(90vw / ${categories.length})` }" 
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
          :style="{ width: `calc(90vw / ${categories.length})` }" @click="handleClick(indexRow, indexCol)">
          <div v-if="!col.question">
            <p> No question </p>
          </div>
          <div v-else>
            <div>${{ (indexRow+1)*100 }} </div>
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
      questions: []
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
    // socket.emit('joinPoll', this.pollId)

    socket.emit("retrieveQuestions", (this.pollId));

    socket.emit("retrieveCategories", (this.pollId));

    socket.on("questionsRetrieved", (questions) => 
      this.questions = questions
    );

    socket.on("categoriesRetrieved", (categories) => 
      this.categories = categories
    );
  },

  // Methods to interact with the server
  methods: {
    handleClick(rowNo, colNo) {
      // run question
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