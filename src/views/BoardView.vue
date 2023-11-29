<template>
<main>
    <div class="jeopardy-board">
      <div v-for="(row, indexRow) in 5" :key="indexRow" class="jeopardy-row">
        <div v-for="(col, indexCol) in 5" :key="indexCol" class="jeopardy-square" @click="handleClick(indexRow, indexCol)">
          {{ questions[indexRow][indexCol].question || 'Click to Add Question' }}
        </div>
      </div>
    </div>
</main>
  </template>

  
  <script>
  export default {
    data() {
      return {
        questions: [
          [{ question: '' }, { question: '' }, { question: '' }, { question: '' }, { question: '' }],
          [{ question: '' }, { question: '' }, { question: '' }, { question: '' }, { question: '' }],
          [{ question: '' }, { question: '' }, { question: '' }, { question: '' }, { question: '' }],
          [{ question: '' }, { question: '' }, { question: '' }, { question: '' }, { question: '' }],
          [{ question: '' }, { question: '' }, { question: '' }, { question: '' }, { question: '' }]
        ]
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

main {background-color: #073763ff;
    color: #ffff00;}


  /* Add your CSS styles for the board, rows, and squares here */
  .jeopardy-board {
    /* Style for the entire board */
  }
  .jeopardy-row {
    /* Style for each row */
    display: flex;
  }
  .jeopardy-square {
    /* Style for each square */
    border: 1px solid #000;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  </style>