<template>
  <button id="homescreenButtonTopLeft" v-on:click="exitCreatorMode">{{ uiLabels.exit }}</button>
  <button id="UKflagga" v-on:click="switchLanguageEnglish">
    {{ uiLabels.changeLanguage }}
  </button>
  <button id="sverigeflagga" v-on:click="switchLanguageSwedish">
    {{ uiLabels.changeLanguage }}
  </button>

  <header>
    <h1> {{ uiLabels.enterNameTitle }} </h1>
  </header>

  <p> {{ uiLabels.enterNameDescription }} </p>
  <input type="text" v-model="participantName" v-on:keydown.enter="joinPoll"/>

  <div>
    <button id="playButton" v-on:click="joinPoll">
      {{ uiLabels.participatePoll }}
    </button>
    <p v-if="errorNameEmptyMessage == true" style="color: red">
      {{ uiLabels.errorNameEmptyMessage }}
    </p>
    <p v-if="errorNameExistsMessage == true" style="color: red">
      {{ uiLabels.errorNameExistsMessage }}
    </p>
  </div>
</template>
  
  
<script>
// Import required modules
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  // Component name and imported components
  name: 'EnterNameView',

  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      participantName: "", // Input for name ID
      lang: localStorage.getItem("lang") || "en", // Language setting,
      errorNameEmptyMessage: false,
      errorNameExistsMessage: false,
      participants: "",
      pollId: "",
      isActive: false
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    this.pollId = this.$route.params.pollId

    // Emitting an event when the page is loaded and listening for initialization data
    socket.emit("pageLoaded", this.lang);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.on("activePoll", (isActive) => {
      this.isActive = isActive;
    });

    socket.on("participants", (participants) => {
      this.participants = participants;
    });

  },

  // Methods to interact with the server
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
    joinPoll() {
      socket.emit("checkActive", this.pollId)
      socket.emit("getParticipants", this.pollId)

      console.log(this.errorNameEmptyMessage, this.errorNameExistsMessage)
      console.log([this.participants], this.participantName)

      setTimeout(() => {
        this.errorNameExistsMessage = false;

        console.log([this.participants])

        for (let i = 0; i < this.participants.length; i++) {
          if (this.participants[i] === this.participantName) {
          this.errorNameExistsMessage = true;
          break;
          }
        }

        if (this.participantName === "") {
          console.log("empty name")
          this.errorNameEmptyMessage = true;
        }
        else {
          this.errorNameEmptyMessage = false;
        }

        console.log(this.errorNameEmptyMessage, this.errorNameExistsMessage)

        if (!this.errorNameEmptyMessage && !this.errorNameExistsMessage) {
          console.log("send off!")
          socket.emit('joinPoll', {pollId: this.pollId, participantName: this.participantName })
          this.errorNameEmptyMessage = false;

          if (this.isActive) {
            this.$router.push(`/JPollView/${this.pollId}/${this.participantName}`)
          }
          else {
            this.$router.push(`/WaitingRoom/${this.pollId}/${this.participantName}`);
          }
        }
      }, 5);
    },
    exitCreatorMode() {
      this.$router.push('/jStartView');
    }
  }
}
</script>