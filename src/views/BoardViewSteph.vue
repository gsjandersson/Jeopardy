<template>
<body>
  <header>
    <h1>Create the board!</h1>
  </header>
  
  <button v-on:click="exitCreatorMode">Exit Creator Mode</button>
  <button v-on:click="createPoll"> Create poll </button>

    <main>
      <div class="jeopardy-board">
        <div v-for="(row, indexRow) in questions" :key="indexRow" class="jeopardy-row">
          <div v-for="(col, indexCol) in row" :key="indexCol" class="jeopardy-square"
            @click="handleClick(indexRow, indexCol)">
            <div v-if="!col.question">
              Click to Add Question
            </div>
            <div v-else>
              <div>Q: {{ col.question }}</div>
              <div>A: {{ col.answer }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer>
      Have fun!!
    </footer>
  </body>
</template>

<script>
export default {
  data() {

    return {
      questions: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({
        question: '',
        answer: ''
      }))),
    };
  },
  methods: {
    handleClick(row, col) {
      const newQuestion = prompt('Enter the question:');
      if (newQuestion !== null) {
        const newAnswer = prompt('Enter the correct answer:');
      }

      if (newQuestion !== null && newAnswer !== null) {
        this.questions[row][col].question = newQuestion;
        this.questions[row][col].answer = newAnswer;
      }
    },
    exitCreatorMode() {
      this.$router.push('/jstartview');
    },
    createPoll: function () {
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang })
    },
  },
};
</script>

<style scoped>
body {
  background-color: #073763ff;
  margin: 0;
  color: #ffff00;
  font-family: Arial, sans-serif;
}

main {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  background-color: #073763ff;
  padding: 1em;
  width: 10em;
  height: 5em;
  text-decoration: underline;
  color: #ffff00;
  font-size: 1em;
  margin: 1em;
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
  width: 250px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 5px;
}
</style>