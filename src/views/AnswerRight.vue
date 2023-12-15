<template>
  <div id="answer-box-right">
    <h1>{{ uiLabels.correct }}</h1>
    <p>{{ uiLabels.cashEarned }}: ${{100*1+row}} </p>
  </div>  
</template>

  <script>
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
    name: 'AnswerRight',
    data: function () {
      return {
        uiLabels: {},
        pollId: "",
        lang: localStorage.getItem("lang") || "en",
        row: ""
      }
    },
    created: function () {
      socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels;
      });
    },
    methods: {
      switchLanguageEnglish: function () {
        if (this.lang === "sv") {
          this.lang = "en";
        }
        localStorage.setItem("lang", this.lang);
        socket.emit("switchLanguage", this.lang);
      },
      switchLanguageSwedish: function () {
        if (this.lang === "en") {
          this.lang = "sv";
        }
        localStorage.setItem("lang", this.lang);
        socket.emit("switchLanguage", this.lang);
      },
      goToBoard() {
          this.$router.push('/BoardViewSteph/' + this.pollId);
        },
      exitCreatorMode() {
        this.$router.push('/jStartView');
      }
    }
  }
</script>