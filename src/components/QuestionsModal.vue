<!-- agnes ny questionsmodal-->
<template>
  <div class="modal-backdrop" v-show="isQuestionModalVisible">
      <div class="modal">
        <div class="modal-body">
          <!-- <p> {{ uiLabels.categoryInputLabel }} </p> -->
          <p> Write a question: </p><!--byt till labels -->
              <input type="text" v-model="newQuestion" v-on:keydown.enter="saveQuestion"> 
            <p> Write an answer: </p> <!--byt till labels -->
                <input type="text" v-model="newAnswer" v-on:keydown.enter="saveQuestion">
              </div>
            <!-- <button id="closequizButton" v-on:click="closeQuestion">{{ uiLabels.closeButton }}</button> -->

            <footer class="modal-footer">
              <button type="button" v-on:click="saveQuestion"> Save </button>
              <button type="button" v-on:click="closeQuestionModal"> Close </button>
            </footer>    
      </div>
    </div>
  </template>
<script>

export default {
  name: 'questionModal',
  props: ['isQuestionModalVisible'],
  emits: ["saveQuestion", "closeQuestionModal"],
  data: function () {
    return {
      // Initial data properties
      uiLabels: {},
      newAnswer:'',
      newQuestion:'',
    };
  },
  methods: {
    saveQuestion() {
      if (this.newQuestion !== "" && this.newAnswer !== "") {
        this.$emit("saveQuestion", {question: this.newQuestion, answer: this.newAnswer});
        this.newAnswer = "";
        this.newQuestion = "";
        this.$emit('closeQuestionModal');
      }

      // skicka tillbaks till boardview

        /* if (this. isQuestionModalVisible && this.newQuestion !== "" && this.newAnswer !== "") {
        socket.emit("editQuestion", {
          pollId: this.pollId, row: rowNo, col: colNo,
          q: this.newQuestion, a: this.newAnswer
        });
      } */
    },
    closeQuestionModal() {
      this.$emit('closeQuestionModal'); // Emit the 'close' event to notify the parent component
    },
  },
};
</script>


<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
    border-top: 1px solid #eeeeee;
    flex-direction: row; 
    color: black;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
    color: #073763ff;
  }

  #closequizButton {
  font-size: 1em;
  margin: 1em;
}

</style>