<template>
  <!-- <header> -->
    <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->

    <!-- <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div> -->
    <!-- <OptionsTry msg="Welcome to Your Vue.js App"/> -->
  <!-- </header> -->

  <main>
    <div v-if="userAuthenticated">
      <h1 class="green" style="text-align:center; margin: 20px;">LTC Data Analysis</h1>
      <Charts />
    </div>
    <div v-else>
      <p>Access restricted. Please enter valid passcode below.</p>
      <input v-model="pword" />
      <button @click="authenticateUser">Log In</button>
      <p style="color: red;" v-if="userDenied">{{ userDeniedMessage }}</p>
    </div>
  </main>
</template>

<!-- <script setup> -->
<script>
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
// import OptionsTry from './components/OptionsTry.vue'
// import OptionsChart from './components/OptionsChart.vue'
// import CourtUsageChart from './components/CourtUsageChart.vue'
// import YearlyBookings from './components/YearlyBookings.vue'
// import MemberPlayingTimeChart from './components/MemberPlayingTimeChart.vue'
// import FamilyPlayingTimeChart from './components/FamilyPlayingTimeChart.vue'
import Charts from './components/Charts.vue'

export default {
  name: 'App',
  components: {
    Charts,
  },
  data() {
    return {
      userAuthenticated: false,
      userDenied: false,
      userDeniedMessage: 'Access denied',
      pword: '',
    }
  },
  methods: {
    authenticateUser() {
      if (this.pword === import.meta.env.VITE_ACCESS_KEY) {
        this.userAuthenticated = true
      } else {
        this.userDenied = true
      }
      this.pword = '';
    }
  }
}

</script>

<!-- <style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style> -->
