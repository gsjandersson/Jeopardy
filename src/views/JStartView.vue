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
  <ResponsiveNav v-bind:hideNav="hideNav">
    <button v-on:click="switchLanguage">{{ uiLabels.changeLanguage }}</button>
    <router-link to="/create/">{{ uiLabels.createPoll }}</router-link>
    <a href="">{{ uiLabels.about }}</a>
    <a href="">FAQ</a>
  </ResponsiveNav>
  <h1>{{ uiLabels["sales-pitch"] }}</h1>
  <h2>{{ uiLabels.subHeading }}</h2>
  <label>
    Write poll id:
    <input type="text" v-model="id">
  </label>
  <router-link v-bind:to="'/poll/' + id">{{ uiLabels.participatePoll }}</router-link>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    switchLanguage: function () {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
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
header {
  background-color: gray;
  width: 100%;
  display: grid;
  grid-template-columns: 2em auto;
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

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1em 1em 1em 1em;
  }

  .hamburger::before {
    content: "☰";
  }

  .close::before {
    content: "✕";
  }

  .hide {
    left: -12em;
  }
}</style>
