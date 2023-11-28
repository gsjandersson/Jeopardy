<template>

  <!-- Det som står längst upp på sidan -->
  <header>
    <!-- Navigeringen länst upp till vänster, kallas hamburger -->
    <div v-bind:class="['hamburger', {'close': !hideNav}]" 
         v-on:click="toggleNav">
         <!-- öppnar och stänger navigeringen-->
    </div>
    <div class="logo">
      <img src="/img/jeopardy.png">
      Welcome to Jeopardy
      <img src="../assets/logo.svg">
    </div>
  </header>

  <!-- ResponsiveNav component med möjlighet för eng och sve -->
  <!-- Responsive navigation component with dynamic 'hideNav' prop -->
  <ResponsiveNav v-bind:hideNav="hideNav">
    <!-- Button to switch language -->
    <button v-on:click="switchLanguage">{{ uiLabels.changeLanguage }}</button>

    <!-- Router link to create a new poll -->
    <router-link to="/create/">{{ uiLabels.createPoll }}</router-link>

    <!-- Links for 'About' and 'FAQ' -->
    <a href="">{{ uiLabels.about }}</a>
    <a href="">FAQ</a>
    <router-link to="/test/">Test</router-link>
  </ResponsiveNav>

  <!-- Headings and input for poll ID -->
  <h1>{{ uiLabels["sales-pitch"] }}</h1>
  <h2>{{ uiLabels.subHeading }}</h2>
  <label>
    Write poll id:
    <input type="text" v-model="id">
  </label>

  <!-- Router link to participate in a poll -->
  <router-link v-bind:to="'/poll/' + id">{{ uiLabels.participatePoll }}</router-link>
</template>

<script>
// Importing components and libraries
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  // Component name and imported components
  name: 'StartView',
  components: {
    ResponsiveNav
  },

  // Initial data properties
  data: function () {
    return {
      uiLabels: {}, // Object for storing UI labels
      id: "", // Input for poll ID
      lang: localStorage.getItem("lang") || "en", // Language setting
      hideNav: true // Flag for hiding the navigation menu
    }
  },

  // Lifecycle hook - component creation
  created: function () {
    // Emitting an event when the page is loaded and listening for initialization data
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },

  // Methods for language switching and toggling the navigation menu
  methods: {
    switchLanguage: function () {
      if (this.lang === "en") {
        this.lang = "sv"
      } else {
        this.lang = "en"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    },
    toggleNav: function () {
      this.hideNav = !this.hideNav;
    }
  }
}
</script>

<style scoped>
/* Scoped styles for the component */

header {
  background-color: gray;
  width: 100%;
  display: grid;
  grid-template-columns: 2em auto;
  /* Two columns with fixed and flexible widths */
}

.logo {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 2.5rem;
  color: red;
  padding-top: 0.2em;
}

.logo img {
  height: 2.5rem;
  vertical-align: bottom;
  margin-right: 0.5rem;
}

.hamburger {
  color: white;
  width: 1em;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0.5rem;
  top: 0;
  left: 0;
  height: 2rem;
  cursor: pointer;
  font-size: 1.5rem;
}

/* Media query for screens with a maximum width of 50em (800px) */
@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    /* Responsive font size based on viewport width */
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1em 1em 1em 1em;
  }

  .hamburger::before {
    content: "☰";
    /* Unicode character for the 'hamburger' icon */
  }

  .close::before {
    content: "✕";
    /* Unicode character for the 'close' icon */
  }

  .hide {
    left: -12em;
    /* Positioning for hiding the navigation menu */
  }
}</style>
