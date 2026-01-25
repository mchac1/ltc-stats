<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
      <div v-else>
        <SearchAutocomplete @selectedMember="processPlayer"
        :items="memberJustNames"
        />
        <button @click="toggleChart" value="485052" :style="buttonVisibility">{{ buttonText }}</button>
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
      const memberMatch = this.memberItems.find(a => a.dropdownName === member)
      if (memberMatch) {
        this.currentMember = memberMatch;

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
      this.timeToggle = !this.timeToggle;

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
        this.mapTitle = `Individual Playing Time - ${memberMatch.name}`;
      }

      this.chartConfig = {
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
          this.allMembers = data

          data.sort(function(a, b) {
              const fullNameA = `${a["First Name"]} ${a["Last Name"]}`
              const fullNameB = `${b["First Name"]} ${b["Last Name"]}`
              return fullNameA.localeCompare(fullNameB);
          });

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
    await this.fetchAllMembers();
    this.isLoading = false;
  }
}
</script>

