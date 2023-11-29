<template>
<body>
  <header>
    <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
    <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
  </header>

  <h1 v-if="this.lang=='en'">Create the board!</h1>
  <h1 v-if="this.lang=='sv'">Skapa brädan!</h1>
  
  <div v-if="this.lang=='en'">
    <button v-on:click="exitCreatorMode">Exit Creator Mode</button>
    <button v-on:click="createPoll"> Create Jeopardy Quiz</button>
  </div>

  <div v-if="this.lang=='sv'">
    <button v-on:click="exitCreatorMode">Lämna Skaparläge</button>
    <button v-on:click="createPoll"> Skapa Jeopardy Quiz</button>
  </div>

    <main>
      <div class="jeopardy-board">
        <div v-for="(row, indexRow) in questions" :key="indexRow" class="jeopardy-row">
          <div v-for="(col, indexCol) in row" :key="indexCol" class="jeopardy-square"
            @click="handleClick(indexRow, indexCol)">
            <div v-if="!col.question && this.lang=='en'" >
              Click to Add Question
            </div>
            <div v-else-if="!col.question && this.lang=='sv'" >
              Klicka för att Lägga till Fråga
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
      <p v-if="this.lang=='en'">Have fun!! </p>
      <p v-if="this.lang=='sv'">Ha det så kul!! </p>
    </footer>
  </body>
</template>

<script>
export default {
  data() {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      questions: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({
        question: '',
        answer: ''
      }))),
    };
  },
  methods: {
    created: function () {
    // Emitting an event when the page is loaded and listening for initialization data
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    },
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
    switchLanguageEnglish: function () {
      if (this.lang === "sv") {
        this.lang = "en"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    },
    switchLanguageSwedish: function () {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    }
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

#UKflagga {
  background-image: url(/img/UKflagga.png);
  background-size: 100px 50px;
  margin: 25px 10px 0 0;
  position: fixed; /* Fixed position allows the image to stay in the same place even when scrolling */
  top: 0; /* Position at the top of the viewport */
  right: 15px; /* Position at the right of the viewport */
  width: 100px; /* Adjust the width as needed */
  height: 50px; /* Maintain the aspect ratio of the image */
}

#sverigeflagga {
  background-image: url(/img/sverigeflagga.png);
  background-size: 100px 50px;
  margin: 25px 10px 0 0;
  position: fixed; /* Fixed position allows the image to stay in the same place even when scrolling */
  top: 0; /* Position at the top of the viewport */
  right: 125px; /* Position at the right of the viewport */
  width: 100px; /* Adjust the width as needed */
  height: 50px; /* Maintain the aspect ratio of the image */
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