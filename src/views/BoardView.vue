<template>
  <header>
    <h1>Create the board</h1>
  </header>

  <main>
    <div class="jeopardy-board">
      <div v-for="(row, indexRow) in questions" :key="indexRow" class="jeopardy-row">
        <div v-for="(col, indexCol) in row" :key="indexCol" class="jeopardy-square" @click="handleClick(indexRow, indexCol)">
          {{ col.question || 'Click to Add Question' }}
        </div>
      </div>
    </div>
  </main>

  <footer>
    Have fun
  </footer>
</template>

<script>
export default {
  data() {
    return {
      questions: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ question: '' }))),
    };
  },
  methods: {
    handleClick(row, col) {
      const newQuestion = prompt('Enter the question:');
      if (newQuestion !== null) {
        this.questions[row][col].question = newQuestion;
      }
    }
  }
};
</script>

<style>
  header {
    background-color: #bdb3b3;
  }

  body {
    background-color: #073763ff;
    margin: 0;
    font-family: Arial, sans-serif;
  }

  main {
    color: yellow;
    display: flex;
    justify-content: center;
    margin-top: 20px;
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