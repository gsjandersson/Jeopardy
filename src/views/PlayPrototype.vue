<template>
  <body>
    <header>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
      <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
      <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
    </header>

    <h1>{{ uiLabels.playGame }}</h1>
    <p class="pollDisplay"> Poll Id: {{ pollId }}</p>

    <main>
      <div class="jeopardy-board">
        <!-- Display column titles -->
        <div class="jeopardy-row">
          <div v-for="(category, index) in categories" :key="index" class="jeopardy-square"
            @click="handleCategoryClick(index)">
            <div v-if="!category">
              <p>Kategori</p>
            </div>
            <div v-else>
              <div>{{ category }}</div> <!-- Här vill vi hämta objektet med kategori-->
            </div>
          </div>
        </div>

        <div>
          <hr>
        </div>

        <!-- Display Jeopardy board content -->
        <div v-for="(row, indexRow) in questions" :key="indexRow" class="jeopardy-row">
          <div v-for="(col, indexCol) in row" :key="indexCol" class="jeopardy-square"
            @click="handleClick(indexRow, indexCol)">
            <div v-if="!col.question">
              <p>${{ (indexRow + 1) * 100 }}</p>
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
      questions: Array.from({ length: 5 }, (_, rowIndex) => {
        const amount = (rowIndex + 1) * 100; // Calculate the amount dynamically
        return Array.from({ length: 5 }, () => ({
          amount,
          question: '',
          answer: ''
        }));
      }),
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      questions: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({
        question: '',
        answer: ''
      }))),
      pollId: "",
      categories: Array.from({ length: 5 }, () => ""),
      questionNumber: { questionRow: 0, questionColumn: 0 },
      data: {}
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
    exitCreatorMode() {
      this.$router.push('/jStartView');
    },
    runQuestion: function () {
      socket.emit("runQuestion", { pollId: this.pollId, questionNumber: this.questionNumber })
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

input {
  margin: 2px;
}

hr {
  color: black;
  /* Line color */
  background-color: black;
  /* Line color for older browsers */
  height: 5px;
  /* Line thickness */
  width: 1300px;
  border: none;
  /* Remove the default border */
}
</style>