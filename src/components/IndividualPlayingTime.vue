<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
      <div v-else>
        <SearchAutocomplete @selectedMember="processPlayer"
        :items="memberJustNames"
        />
        <!-- <button @click="renderChart" value="485052">Chad</button>
        <button @click="renderChart" value="207777">Patrice</button> -->
        <!-- <button @click="renderChart" value="GameType">Game Type</button>
        <button @click="renderChart" value="Primetime">Primetime</button> -->
      </div>
      <canvas id="IndividualPlayingTime" width="1080" height="650" :style="chartVisibility"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
import SearchAutocomplete from './SearchAutocomplete.vue'

export default {
  name: 'IndividualPlayingTime',
  components: {
    SearchAutocomplete
  },
  data() {
    return {
      mapTitle: 'Individual Playing Time',
      chartDatasets: [],
      chartLabels: [],
      currentChart: null,
      isLoading: null,
      searchMember: '',
      memberItems: [],
      allMembers: [],
    }
  },
  computed: {
      chartVisibility() {
          if (this.isLoading) {
              return "visibility: hidden;"
          }
          return "visibility: visible;"
      },
      memberJustNames() {
        return this.memberItems.map(a => a.dropdownName);
      },
  },
  methods: {
    async processPlayer(member) {
      console.log('CAM member')
      console.log(member)

      const memberMatch = this.memberItems.find(a => a.dropdownName === member)
      if (memberMatch) {
        console.log('CAM id')
        console.log(memberMatch.id)

        this.isLoading = true;
        await this.configureChart(memberMatch.id);
        this.isLoading = false;
      }
    },
    async renderChart(event) {
        this.isLoading = true;
        await this.configureChart(event.target._value);
        this.isLoading = false;
    },
    async configureChart(memberId) {

      this.chartLabels = [];
      this.chartDatasets = [];

      const proms = [];

      proms.push(this.fetchData(memberId));

      await Promise.all(proms);

      // this.mapTitle = ''

      const memberMatch = this.memberItems.find(a => a.id === memberId)
      if (memberMatch) {
        console.log('CAM id')
        console.log(memberMatch.id)

        this.mapTitle = `Individual Playing Time - ${memberMatch.name}`;
      }

      this.chartConfig = {
        type: 'line',
        options: {
            plugins: {
                title: {
                    display: true,
                }
            }
        },
        data: {
          labels: this.chartLabels,
          datasets: this.chartDatasets
        }
      }

      if (this.currentChart) {
          this.currentChart.destroy();
      }

      this.currentChart = new Chart(
          document.getElementById('IndividualPlayingTime'),
          this.chartConfig
      );
    },
    async fetchData(memberId) {
        let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMemberYearlyHours`;
        const url = new URL(urlAddress);
        url.searchParams.append('Member', memberId);

        return fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {

          this.chartLabels = data.map(row => row.year);

          const oneDataset = {
            label: 'Total Hours',
            data: data.map(row => row.hoursOnCourt ),
            borderWidth: 5
          }
          this.chartDatasets.push(oneDataset);

          const anotherDataset = {
            label: 'Prime Time Hours',
            data: data.map(row => row.primetimeHoursOnCourt),
            borderWidth: 5
          }
          this.chartDatasets.push(anotherDataset);
        });
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
  },
  async mounted() {

    this.isLoading = true;
    await this.configureChart('485052');
    await this.fetchAllMembers();
    this.isLoading = false;

    // const proms = [];

    // proms.push(this.fetchData("485052"));

    // await Promise.all(proms);

    // new Chart(
    //   document.getElementById('IndividualPlayingTime'),
    //   {
    //     type: 'line',
    //     // type: 'bar',
    //     options: {
    //         plugins: {
    //             title: {
    //                 display: true,
    //             }
    //         },
    //     },
    //     data: {
    //       labels: this.chartLabels,
    //       datasets: this.chartDatasets
    //     }
    //   }
    // );
  }
}
</script>

