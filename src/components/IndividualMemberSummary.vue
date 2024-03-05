<template>
  <div id='wrapper'>
    <div class="row no-gutters">
    <div class="card" style="width: 40rem;">
      <div class="card-body">

        <SearchAutocomplete @selectedMember="processPlayer"
        :items="memberJustNames"
        />

        <!-- <div class="input-group mb-4 mt-2">
          <input type="text" v-model="message" class="form-control" @keyup.enter="processMember" placeholder="Enter a member name" aria-label="Username" aria-describedby="basic-addon1">
          <button type="button" class="btn btn-info" @click="processMember">Go</button>
        </div> -->

        <p>{{ spiel }}</p>

        <div class="row">
  <div class="col-sm-6">

        <!-- <div v-if="gotFaves" class="card" style="width: 18rem; display: none;"> -->
        <div v-if="gotFaves" class="card" style="width: 18rem; background-color: pink">
          <div class="card-body">
            <h6>Favorite court is</h6>
            <h3>{{ memberFaves.court.court }}</h3>
          </div>
        </div>

        <div v-if="gotFaves" class="card" style="width: 18rem; background-color: rgb(232, 250, 166)">
          <div class="card-body">
            <h6>Likes to play at</h6>
            <h3>{{ memberFaves.time.time }}</h3>
          </div>
        </div>

      </div>
  <div class="col-sm-6">

        <div v-if="gotFaves" class="card" style="width: 18rem; background-color: rgb(116, 185, 139)">
          <div class="card-body">
            <h6>Hits most often with</h6>
            <h3>{{ memberFaves.partner.name }}</h3>
          </div>
        </div>

        <div v-if="gotFaves" class="card" style="width: 18rem; background-color: rgb(213, 183, 250)">
          <div class="card-body">
            <h6>Prefers</h6>
            <h3>{{ memberFaves.type.type }}</h3>
          </div>
        </div>

      </div>
    </div>

      </div>
    </div>
  </div>
  </div>
</template>

<script>
import YearlyBookings from './YearlyBookings.vue'
import SearchAutocomplete from './SearchAutocomplete.vue'

export default {
  name: 'IndividualMemberSummary',
  components: {
    YearlyBookings,
    SearchAutocomplete
  },
  data() {
    return {
      message: '',
      memberFaves: {},
      spiel: '',
      memberItems: [],
      gotFaves: false,
    }
  },
  methods: {
    processPlayer(member) {
      // console.log('CAM processPlayer')
      // console.log(member)
      const memberId = this.memberItems.find(a => a.dropdownName == member)
      if (!memberId) {
        this.spiel = 'That did not work.'
        return
      }

      this.fetchMemberFaves(memberId.name)

    },
    processMember(event) {
      console.log('processing member')
      console.log(this.message)
      console.log(event)
      this.fetchMemberFaves(this.message)

    },
    async fetchAllMembers(name) {
      const url = new URL(`${import.meta.env.VITE_MONGODB_URI}/getAllMembers`);
      return fetch(url)
        .then((response) => {
          return response.json();
        }).then((data) => {
          // console.log(data)
          this.allMembers = data

          data.sort(function(a, b) {
              const fullNameA = `${a["First Name"]} ${a["Last Name"]}`
              const fullNameB = `${b["First Name"]} ${b["Last Name"]}`
              return fullNameA.localeCompare(fullNameB);
          });

          // const memberNames = data.map((a) => {
          //   return `${a["First Name"]} ${a["Last Name"]} - ${a["Member #"]}`
          // })

          this.memberItems = data.map((a) => {
            return {
              dropdownName: `${a["First Name"]} ${a["Last Name"]} - ${a["Member #"]}`,
              name: `${a["First Name"]} ${a["Last Name"]}`,
              id: a["Member #"]
            }
          })

        });
    },
    async fetchMemberFaves(name) {
      const url = new URL(`${import.meta.env.VITE_MONGODB_URI}/getMemberFavourites?Name=${name}`);
      return fetch(url)
        .then((response) => {
          return response.json();
        }).then((data) => {
          // console.log('CAM THE data')
          // console.log(data)

          if (Object.keys(data).length === 0) {
            console.log('CAM none')
            this.spiel = `There is no record of ${name} playing at Lakeshore Tennis Club.`;
            this.gotFaves = false;
            return;
          }

          this.spiel = '';
          this.memberFaves = data
          this.gotFaves = true;

          // this.spiel = `${name} is a ${data.type.type} specialist who can most often be spotted on ${data.court.court} at ${data.time.time} hitting with ${data.partner.name}.`;
        });
    },
  },
  computed: {
      memberJustNames() {
        return this.memberItems.map(a => a.dropdownName);
      },
  },
  async mounted() {
    console.log('CAM mounted')

    await this.fetchAllMembers();

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