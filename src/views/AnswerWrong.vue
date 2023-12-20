<template>
  <div id="answer-box-wrong">
    <h1>{{ uiLabels.wrong }}</h1>
    <p>{{ uiLabels.noMoneyForYou }}: ${{100*(1+parseInt(row))}}</p>
  </div>  
</template>

  <script>
  import io from 'socket.io-client';
  const socket = io(sessionStorage.getItem("ipAdressSocket"));
  
  export default {
    name: 'AnswerWrong',
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
        this.goToBoard();
        });
    },
    methods: {
      // Wait for 5 seconds before redirecting to jpollview
      /*setTimeout(() => {
        this.$router.push(`/jPollView/${this.pollId}/${this.participant}`);
      }, 3000);*/
      goToBoard() {
        this.$router.push(`/jPollView/${this.pollId}/${this.participant}`);
        },
      exitCreatorMode() {
        this.$router.push('/jStartView');
      }
    }
  }
</script>