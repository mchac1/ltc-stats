<template>
  <main>
    <div v-if="authenticated">
      <!-- <nav class="navbar fixed-top navbar-light bg-light">
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
              <div style="margin-top: 80px;">
                <Charts />
              </div>
        </div>
        <div class="tab-pane fade" id="nav-members" role="tabpanel" aria-labelledby="nav-members-tab">
              <IndividualMemberSummary />
        </div>
      </div> -->

      <!-- <IndividualMemberSummary /> -->
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

