<template>
  <!-- <header> -->
    <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->

    <!-- <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div> -->
    <!-- <OptionsTry msg="Welcome to Your Vue.js App"/> -->
  <!-- </header> -->

  <main>
    <div v-if="authenticated">
      <h2 class="green" style="text-align:center; margin: 20px;">LTC Data Analysis</h2>
      <Charts />
    </div>
    <div v-else>
      <p>Access restricted. Please enter valid passcode below.</p>
      <input v-model="pword" @keyup.enter="authenticateUser" />
      <button @click="authenticateUser">Log In</button>
      <p style="color: red;" v-if="userDenied">{{ userDeniedMessage }}</p>
    </div>
  </main>
</template>


<script>
import Charts from './components/Charts.vue'
import { useAuthUserStore } from "@/stores/AuthUserStore";
import { mapState, mapActions } from "pinia";

export default {
  name: 'App',
  components: {
    Charts,
  },
  data() {
    return {
      userDenied: false,
      userDeniedMessage: 'Access denied',
      pword: '',
    }
  },
  computed: {
    ...mapState(useAuthUserStore, ["authenticated"]),
  },
  methods: {
    authenticateUser() {
      if (this.pword === import.meta.env.VITE_ACCESS_KEY) {
        this.grantUserAccess();
      } else {
        this.userDenied = true;
      }
      this.pword = '';
    },
    ...mapActions(useAuthUserStore, ['grantUserAccess']),
  },
}

</script>

