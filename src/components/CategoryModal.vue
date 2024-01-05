<!-- agnes ny categorymodal-->
<template>
  <div class="modal-backdrop" v-show="isCategoryModalVisible">
      <div class="modal">
        <div class="modal-body">
          <!-- <p> {{ uiLabels.categoryInputLabel }} </p> -->
          <p> Write a category: </p>
              <input type="text" v-model="categoryName" v-on:keydown.enter="saveCategory(colNo)">
        </div>
            <footer class="modal-footer">
              <button type="button" v-on:click="saveCategory(colNo)"> Save </button>
              <button type="button" v-on:click="closeModal"> Close </button>
            </footer>        
        </div>
      </div>
    </template>


<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("ipAdressSocket"));

export default {
  name: 'categoryModal',
  props: {
    isCategoryModalVisible: Boolean, 
  },
  data: function () {
    return {
      // Initial data properties
      uiLabels: {},
      categoryName: '', // New data property for the category name
    };
  },
  methods: {
    saveCategory(colNo) {
      console.log(this.categoryName);
      console.log(this.isCategoryModalVisible);
      if (this.isCategoryModalVisible && this.categoryName !== "") {
        socket.emit("editCategory", { pollId: this.pollId, col: colNo, cat: this.categoryName })
      }
    },
    closeModal() {
      this.$emit('close'); // Emit the 'close' event to notify the parent component
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