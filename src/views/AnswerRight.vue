<template>
  <div id="answer-box-right">
    <h1>{{ uiLabels.correct }}</h1>
    <p>{{ uiLabels.cashEarned }}: ${{ (100 * (1 + parseInt(row, 10))) }} </p>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  name: 'AnswerRight',
  data: function () {
    return {
      uiLabels: {},
      pollId: "",
      lang: localStorage.getItem("lang") || "en",
      row: "",
      participant: ""
    }
  },
  created: function () {
    this.pollId = this.$route.params.pollId
    this.participant = this.$route.params.participantName
    this.row = this.$route.params.row

    socket.emit('joinPoll', { pollId: this.pollId, participantName: this.participant })

    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.on('goToBoard', () => {
      this.$router.push(`/jPollView/${this.pollId}/${this.participant}`);
    });

    socket.on("goToWinnerView", () => {
      this.$router.push(`/WinnerView/${this.pollId}`);
    });
  }
}
</script>