<template>
  <body>
    <header>
      <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
      <button id="finishQuizButton" v-on:click="howToHost">{{ uiLabels.howToHost }}</button>
      <button id="UKflagga" v-on:click="switchLanguageEnglish">{{ uiLabels.changeLanguage }}</button>
      <button id="sverigeflagga" v-on:click="switchLanguageSwedish">{{ uiLabels.changeLanguage }}</button>
    </header>

    <h1>{{ uiLabels.boardViewTitle }}</h1>
    <p class="pollDisplay"> Jeopardy Id: {{ pollId }}</p>

    <main>
      <div class="jeopardy-board">
        <!-- Display column titles -->
        <div class="jeopardy-row">
          <div v-for="(category, index) in categories" :key="index"
            :style="{ width: `calc(90vw / ${categories.length})` }" class="jeopardy-square"
            @click="showCategoryModal(index)">

            <div v-if="!category">
              <p> {{ uiLabels.boardViewCategoryBox }} </p>
            </div>
            <div v-else>
              <div>{{ category }}</div>
            </div>
            
              
          </div>
        </div>
        <categoryModal v-show="isCategoryModalVisible"
            @closeCategoryModal="hideCategoryModal"
            @saveCategory="saveCategory($event, index)"/>
        <div>
          <hr>
        </div>

        <!-- Display Jeopardy board content, gör istället en komponent mha questionskompent, vi ska göra en egen component med all styling etc, klickhantering och layout i kompknent-->
        <div v-for="(row, indexRow) in questions" :key="indexRow" class="jeopardy-row">
          <div v-for="(col, indexCol) in row" :key="indexCol" class="jeopardy-square"
            :style="{ width: `calc(90vw / ${categories.length})` }" 
            @click="showQuestionModal(indexRow, indexCol)">
            <div v-if="!col.question">
              <p>{{ uiLabels.boardViewQuestionBox }}</p>
            </div>
            <div v-else>
              <div>Q: {{ col.question }}</div>
              <div>A: {{ col.answer }}</div>
            </div>
          
          </div>
        </div>
              <questionModal v-show="isQuestionModalVisible"
            @closeQuestionModal="hideQuestionModal"
            @saveQuestion="saveQuestion($event, indexRow, indexCol, newQuestion, newAnswer )"
            />
      </div>
    </main> 
  </body>
</template>


<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));
import categoryModal from '../components/CategoryModal.vue'; // agnes ny
import questionModal from '../components/QuestionsModal.vue'; // agnes ny


export default {
  components: {
      categoryModal,
      questionModal,
    },

  data: function () {
    return {
      // Initial data properties
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      questionNumber: { questionRow: 0, questionColumn: 0 }, //behöver vi denna
      questions: [],
      categories: [],
      isCategoryModalVisible: false,
      isQuestionModalVisible: false

    };
  },
  created: function () {
    // Emitting an event when the page is loaded and listening for initialization data
    this.pollId = this.$route.params.pollId
    socket.emit("pageLoaded", this.lang);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.emit("getAllQuestions", (this.pollId));

    socket.emit("getAllCategories", (this.pollId));

    socket.on("allQuestions", (questions) =>
      this.questions = questions
    );

    socket.on("allCategories", (categories) =>
      this.categories = categories
    );
  },

  methods: {

    showCategoryModal(colNo) { 
      this.isCategoryModalVisible = true;
      },
      hideCategoryModal() { 
      this.isCategoryModalVisible = false;
      console.log("hideCategoryModal")
      },
      saveCategory(cat, index) {
        socket.emit("editCategory", { pollId: this.pollId, col: index, cat: cat })
        console.log("saveCategory", cat, index)
      },

      showQuestionModal(rowNo, colNo) { 
      this.isQuestionModalVisible = true;
      },
      hideQuestionModal() { 
      this.isQuestionModalVisible = false;
      console.log("hideQuestionModal")
      },
      saveQuestion(indexRow, indexCol, newQuestion, newAnswer) {
        socket.emit("editQuestion", { pollId: this.pollId, row: indexRow, col: indexCol, question: this.newQuestion, answer: this.newAnswer })
        console.log("saveQuestion", this.newQuestion, this.newAnswer, indexRow, indexCol);
      },

      /* 
      showQuestionModal(indexRow, indexCol) {
        this.isQuestionModalVisible = true;
        this.newQuestion = '';
        this.newAnswer = '';
      }, */

/* 

    handleQuestionClick(rowNo, colNo) {
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
        socket.emit("editQuestion", {
          pollId: this.pollId, row: rowNo, col: colNo,
          question: newQuestion, answer: newAnswer
        });
      }
    },

    handleCategoryClick(colNo) {
      let categoryName;

      if (this.lang == 'en') {
        categoryName = prompt('Enter the category name:');
      }
      if (this.lang == 'sv') {
        categoryName = prompt('Skriv kategorinamnet:');
      }
      if (categoryName !== "") {
        socket.emit("editCategory", { pollId: this.pollId, col: colNo, category: categoryName })
      }
    }, */
    exitCreatorMode() {
      this.$router.push('/');
    },
    howToHost() {
      this.$router.push('/HowToHostView/'+ this.pollId);
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

#finishQuizButton {
  position: absolute;
  top: 15px; /* Position at the top of the viewport */
  left: 150px; /* Position at the right of the viewport */
  width: 110px; /* Adjust the width as needed */
  height: 50px; /* Maintain the aspect ratio of the image */
  color: #ffff00;
  font-size: 1em;
  margin: 1em;
}
</style>