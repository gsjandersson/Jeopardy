<template>
  <body>
    <header>
      <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
      <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
    </header>

    <h1>{{ uiLabels.boardViewTitle }}</h1>

    <div>
      <button v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
    </div>

    <main>
      <div class="jeopardy-board">
        <div v-for="(row, indexRow) in questions" :key="indexRow" class="jeopardy-row">
          <div v-for="(col, indexCol) in row" :key="indexCol" class="jeopardy-square"
            @click="handleClick(indexRow, indexCol)">
            <div v-if="!col.question" >
              <p>{{ uiLabels.boardViewQuestionBox }}</p>
            </div>
            <div v-else>
              <div>Q: {{ col.question }}</div>
              <div>A: {{ col.answer }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>

  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  data() {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      questions: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({
        question: '',
        answer: ''
      }))),
      pollId: "",
      // answers: ["", ""],
      questionNumber: 1,
      data: {},
      uiLabels: {}
    };
  },
  created: function () {
    // Emitting an event when the page is loaded and listening for initialization data
    this.pollId = this.$route.params.pollId
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    },
  methods: {
    handleClick(row, col) {
      let newQuestion;
      let newAnswer;

      if (this.lang == 'en') {
        newQuestion = prompt('Enter the question:');
        newAnswer = prompt('Enter the correct answer:');
      }
      if (this.lang == 'sv') {
        newQuestion = prompt('Skriv frågan:');
        newAnswer = prompt('Skriv de korrekta svaret:');
      }
      if (newQuestion !== "" && newAnswer !== "") {
        this.questions[row][col].question = newQuestion;
        this.questions[row][col].answer = newAnswer;
        socket.emit("addQuestion", { pollId: this.pollId, 
          q: this.questions[row][col].question, a: this.questions[row][col].answer })
        console.log(this);
      }
    },
    getCategoryName() {
      if (this.lang == 'en') {
        this.categoryName = prompt('Enter the category name:');
      }
      if (this.lang == 'sv') {
        this.categoryName = prompt('Skriv kategorinamnet:');
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
  width: 250px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 5px;
}

footer {
  padding-bottom: 10px;
}

button:hover {
  cursor: pointer;
}

</style>