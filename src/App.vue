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
      <!-- <h2 class="green" style="text-align:center; margin: 20px;">LTC Data Analysis</h2> -->
<!-- 
      <nav class="navbar fixed-top navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Fixed top</a>
        </div>
      </nav> -->

      <!-- <nav class="nav">
        <a class="nav-link active" href="#">Active</a>
        <a class="nav-link" id="nav-bot-tab" href="#">Bot</a>
        <a class="nav-link" href="#">Link</a>
        <a class="nav-link disabled" href="#">Disabled</a>
      </nav> -->

      <!-- TABS BELOW DONT DELETE -->

      <!-- <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
              <a class="nav-link" href="#">Features</a>
              <a class="nav-link" href="#">Pricing</a>
              <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
            </div>
          </div>
        </div>
      </nav> -->

      <!-- <nav class="navbar fixed-top navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" id="nav-general-tab" data-bs-toggle="tab" data-bs-target="#nav-general" aria-controls="nav-general" href="#">Bingo</a>
          <a class="navbar-brand" href="#">Bango</a>
          <a class="navbar-brand" href="#">Fixed top</a>
        </div>
      </nav> -->

      <!-- <ul class="nav nav-pills">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Active</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li>
      </ul> -->


      <nav class="navbar fixed-top navbar-light bg-light">
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link active" id="nav-general-tab" data-bs-toggle="tab" data-bs-target="#nav-general" type="button" role="tab" aria-controls="nav-general" aria-selected="true">
                                      General
                                  </button>
          <button class="nav-link" id="nav-members-tab" data-bs-toggle="tab" data-bs-target="#nav-members" type="button" role="tab" aria-controls="nav-members" aria-selected="false">
                                      Members
                                  </button>
        </div>
      </nav>

      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-general" role="tabpanel" aria-labelledby="nav-general-tab">
          <!-- <div class="card">
            <div class="card-body"> -->
              <!-- <h2 class="green" style="text-align:center; margin: 20px;">LTC Data Analysis</h2> -->
              <!-- <h2 class="green" style="text-align:center; margin: 20px; margin-top: 70px;">LTC Data Analysis</h2> -->
              <div style="margin-top: 80px;">
                <Charts />
              </div>
            <!-- </div>
          </div> -->
        </div>
        <div class="tab-pane fade" id="nav-members" role="tabpanel" aria-labelledby="nav-members-tab">
          <!-- <div class="card">
            <div class="card-body"> -->
              <IndividualMemberSummary />
            <!-- </div>
          </div> -->
        </div>
      </div>

      <!-- <IndividualMemberSummary />
      <Charts /> -->
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
import IndividualMemberSummary from './components/IndividualMemberSummary.vue'
import { useAuthUserStore } from "@/stores/AuthUserStore";
import { mapState, mapActions } from "pinia";

export default {
  name: 'App',
  components: {
    Charts,
    IndividualMemberSummary,
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

