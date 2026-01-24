<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
      <div v-else>
        <SearchAutocomplete @selectedMember="processPlayer"
        :items="memberJustNames"
        />
        <button @click="toggleChart" value="485052" :style="buttonVisibility">{{ buttonText }}</button>
        <!-- <button @click="renderChart" value="485052">Chad</button>
        <button @click="renderChart" value="207777">Patrice</button> -->
        <!-- <button @click="renderChart" value="GameType">Game Type</button>
        <button @click="renderChart" value="Primetime">Primetime</button> -->
      </div>
      <canvas id="IndividualBreakdown" width="1080" height="650" :style="chartVisibility"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
import SearchAutocomplete from './SearchAutocomplete.vue'

export default {
  name: 'IndividualBreakdown',
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
      buttonText: 'Switch to Type Breakdown',
      currentMember: {},
      currentType: '',
      timeToggle: true,
    }
  },
  computed: {
      chartVisibility() {
          if (this.isLoading) {
              return "visibility: hidden;"
          }
          return "visibility: visible;"
      },
      buttonVisibility() {
          if (Object.keys(this.currentMember).length === 0) {
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
        this.currentMember = memberMatch;
        console.log('CAM id')
        console.log(memberMatch.id)

        this.isLoading = true;
        if (this.timeToggle) {
          await this.configureChart(memberMatch.id, 'TimeType');
        } else {
          await this.configureChart(memberMatch.id, 'GameType');
        }
        this.isLoading = false;
      }
    },
    async toggleChart(event) {
      console.log('CAM into toggleChart')
      console.log('CAM currentMember')
      console.log(this.currentMember)

      this.timeToggle = !this.timeToggle;

      // if (this.currentType === 'TimeType') {
      if (!this.timeToggle) {
        this.isLoading = true;
        this.buttonText = 'Switch to Time Breakdown';
        await this.configureChart(this.currentMember.id, 'GameType');
        this.isLoading = false;
      } else {
        this.isLoading = true;
        this.buttonText = 'Switch to Type Breakdown';
        await this.configureChart(this.currentMember.id, 'TimeType');
        this.isLoading = false;
      }
    },
    // async renderChart(event) {
    //     this.isLoading = true;
    //     await this.configureChart(event.target._value, 'TimeType');
    //     this.isLoading = false;
    // },
    async configureChart(memberId, chartType) {

      this.currentType = chartType;

      this.chartLabels = [];
      this.chartDatasets = [];

      const proms = [];

      proms.push(this.fetchData(memberId, chartType));

      await Promise.all(proms);

      const memberMatch = this.memberItems.find(a => a.id === memberId)
      if (memberMatch) {
        this.currentMember = memberMatch;
        console.log('CAM id')
        console.log(memberMatch.id)

        this.mapTitle = `Individual Playing Time - ${memberMatch.name}`;
      }

      this.chartConfig = {
        // type: 'line',
        type: 'bar',
        options: {
            plugins: {
                title: {
                    display: true,
                }
            },
            elements: {
                bar: {
                    borderWidth: 2,
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
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
          document.getElementById('IndividualBreakdown'),
          this.chartConfig
      );
    },
    async fetchData(memberId, breakdownType) {
        let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMemberYearlyHours`;
        const url = new URL(urlAddress);
        url.searchParams.append('Member', memberId);

        return fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {

          this.chartLabels = data.map(row => row.year);

          if (breakdownType === 'TimeType') {
            const oneDataset = {
              label: 'Regular Hours',
              data: data.map(row => row.hoursOnCourt - row.primetimeHoursOnCourt),
            }
            this.chartDatasets.push(oneDataset);

            const anotherDataset = {
              label: 'Prime Time Hours',
              data: data.map(row => row.primetimeHoursOnCourt),
            }
            this.chartDatasets.push(anotherDataset);
          } else if (breakdownType === 'GameType') {
            let thisDataset = {
              label: 'Singles Hours',
              data: data.map(row => row.singlesHours),
            }
            this.chartDatasets.push(thisDataset);

            thisDataset = {
              label: 'Doubles Hours',
              data: data.map(row => row.doublesHours),
            }
            this.chartDatasets.push(thisDataset);

            thisDataset = {
              label: 'Lesson Hours',
              data: data.map(row => row.lessonHours),
            }
            this.chartDatasets.push(thisDataset);

            thisDataset = {
              label: 'Other Hours',
              data: data.map(row => row.otherHours),
            }
            this.chartDatasets.push(thisDataset);
          }
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
    // await this.configureChart('485052', 'TimeType');
    await this.fetchAllMembers();
    this.isLoading = false;

    // const proms = [];

    // proms.push(this.fetchData("485052"));

    // await Promise.all(proms);

    // new Chart(
    //   document.getElementById('IndividualBreakdown'),
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

