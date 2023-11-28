<template>
    <div class="app-container">
      <header>
        <div class="stortext">QUIZ ID:</div>
        <!-- Make QUIZ ID big, yellow, and in caps -->
        <div class="big-yellow-caps">{{ quizID }}</div>
      </header>
  
      <div class="form-container">
        <form>
          <p>
            <label for="quizIdInput">Quiz ID</label><br>
            <input v-model="quizID" type="text" id="quizIdInput" required="required" placeholder="Write Quiz ID here" class="quiz-input">
          </p>
          <button @click.prevent="submitQuizId" class="submit-button">Submit</button>
        </form>
  
        <!-- "Exit Player Mode" button in the top right corner -->
        <button @click.prevent="exitPlayerMode" class="exit-button">EXIT PLAYER MODE</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        quizID: "",
      };
    },
    methods: {
      submitQuizId() {
        // Handle logic for submitting quiz ID
        console.log("Quiz ID submitted:", this.quizID);
      },
      exitPlayerMode() {
        // Handle logic for exiting player mode
        console.log("Exiting player mode");
      },
    },
  };
  </script>
  
  <style scoped>
  .app-container {
    background-color: darkblue;
    padding: 20px;
    min-height: 100vh;
    position: relative; /* Make sure the children are positioned relative to this container */
  }
  
  header {
    display: flex;
    justify-content: space-between;
  }
  
  .stortext {
    color: yellow;
    font-size: 24px; /* Adjust font size as needed */
    text-transform: uppercase;
  }
  
  .big-yellow-caps {
    color: yellow;
    font-size: 36px; /* Adjust font size as needed */
    text-transform: uppercase;
  }
  
  form {
    margin-bottom: 20px;
  }
  
  label {
    color: white;
  }
  
  .quiz-input {
    border: 2px solid white;
    padding: 8px;
    width: 200px;
    margin-bottom: 10px;
    color: black; /* Adjust text color as needed */
  }
  
  .submit-button,
  .exit-button {
    background-color: white;
    color: darkblue;
    border: 2px solid darkblue;
    padding: 10px;
    cursor: pointer;
    text-transform: uppercase;
  }
  
  .submit-button:hover,
  .exit-button:hover {
    background-color: darkblue;
    color: white;
  }
  </style>