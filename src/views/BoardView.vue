<template>
    <div :style="{ backgroundColor: backgroundColor }">
      <h1 :style="{ fontSize: fontSize + 'px' }">Hello World!</h1>
      <input type="text" v-model="inputText" @input="handleInput">
      <button :style="{ color: buttonColor }" @click="handleClick">{{ buttonText }}</button>
      <button @click="resetButton">Reset</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'tView',
    data() {
      return {
        buttonText: 'Click me',
        buttonColor: 'black',
        backgroundColor: 'white',
        inputText: '',
        fontSize: 16
      }
    },
    methods: {
      handleClick() {
        this.buttonText = 'You clicked me!';
        this.buttonColor = this.getRandomColor();
        this.backgroundColor = this.getRandomColor();
      },
      handleInput() {
        this.buttonColor = this.getRandomColor();
        this.fontSize++;
      },
      resetButton() {
        this.buttonText = 'Click me';
        this.buttonColor = 'black';
        this.fontSize = 16;
        this.backgroundColor = 'white';
        this.inputText = '';
      },
      getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    }
  }
  </script>