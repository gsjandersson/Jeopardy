<!-- agnes ny categorymodal-->
<template>
  <div class="modal-backdrop" >
      <div class="modal">
        <div class="modal-body">
          <!-- <p> {{ uiLabels.categoryInputLabel }} </p> -->
          <p> Write a category: </p>
              <input type="text" v-model="categoryName" v-on:keydown.enter="saveCategory">
        </div>
            <footer class="modal-footer">
              <button type="button" v-on:click="saveCategory"> Save </button>
              <button type="button" v-on:click="closeCategoryModal"> Close </button>
            </footer>        
        </div>
      </div>
    </template>




<script>

export default {
  name: 'categoryModal',
  props: ['isCategoryModalVisible'],
  emits: ["saveCategory", "closeCategoryModal"],
  data: function () {
    return {
      // Initial data properties
      uiLabels: {},
      categoryName: '', // New data property for the category name
    };
  },
  methods: {
    saveCategory() {
      console.log(this.categoryName);
      this.$emit("saveCategory", this.categoryName)
      this.categoryName = "";
      this.$emit('closeCategoryModal');
  
    },
    closeCategoryModal() {
      this.$emit('closeCategoryModal'); // Emit the 'close' event to notify the parent component
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