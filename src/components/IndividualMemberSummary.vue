<template>
  <div id='wrapper'>
    <div class="row no-gutters">
    <div class="card" style="width: 38rem;">
      <div class="card-body">
        <!-- <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
        <!-- <div >
        <input type="text" v-model="message" @keyup.enter="processMember" class="form-control" placeholder="Enter a member name" aria-label="Username" aria-describedby="basic-addon1" />
        <button type="button" class="btn btn-info" @click="processMember">Go</button>
      </div>
        <p>{{ spiel }}</p> -->
        <!-- <div class="input-group mb-3"> -->
        <div class="input-group mb-4 mt-2">
          <!-- <span class="input-group-text" id="basic-addon1">Member Name</span> -->
          <input type="text" v-model="message" class="form-control" @keyup.enter="processMember" placeholder="Enter a member name" aria-label="Username" aria-describedby="basic-addon1">
          <button type="button" class="btn btn-info" @click="processMember">Go</button>
        </div>
        <p>{{ spiel }}</p>
      </div>
    </div>
  </div>
  </div>
  <!-- <div> -->
  <!-- <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;"> -->
  <!-- <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:left;">
      <span class="input-group-text" id="basic-addon1">Member Name</span>
      <input type="text" v-model="message" @keyup.enter="processMember" class="form-control" placeholder="Enter a name here" aria-label="Username" aria-describedby="basic-addon1" />
      <button type="button" class="btn btn-info" @click="processMember">Go</button>
    <p>{{ spiel }}</p>
  </div> -->
</template>

<script>
// import { useAuthUserStore } from "@/stores/AuthUserStore";
// import { mapState, mapActions } from "pinia";
import YearlyBookings from './YearlyBookings.vue'

export default {
  name: 'IndividualMemberSummary',
  components: {
    YearlyBookings,
  },
  data() {
    return {
      countries: [
        { label: 'AUS', value: 'Australia'},
      ],
      userDeniedMessage: 'Access denied',
      pword: 'erg',
      message: '',
      memberFaves: {},
      spiel: '',
    }
  },
  methods: {
    processMember(event) {
      console.log('processing member')
      console.log(this.message)
      console.log(event)
      this.fetchMemberFaves(this.message)

    },
    async fetchMemberFaves(name) {
      const url = new URL(`${import.meta.env.VITE_MONGODB_URI}/getMemberFavourites?Name=${name}`);
      return fetch(url)
        .then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data)
          this.memberFaves = data

          this.spiel = `${name} is a ${data.type.type} specialist who can most often be spotted on ${data.court.court} at ${data.time.time} hitting with ${data.partner.name}.`;
        });
    },
  },
  // components: {
  // },
  mounted() {
    console.log('CAM mounted')

  }
}

</script>

<style scoped>
#wrapper {
  position: absolute;
  top: 80px;
  left: 20px;
}
</style>