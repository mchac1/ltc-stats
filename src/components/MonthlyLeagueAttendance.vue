<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ chartTitle }}</h4>
      <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
      <div v-else>
          <button
              v-for="btn in yearButtons"
              :key="btn.label"
              @click="renderChart(btn.value)"
          >
              {{ btn.label }}
          </button>
      </div>
      <canvas id="MonthlyLeagueAttendance" width="1080" height="650" :style="chartVisibility"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'MonthlyLeagueAttendance',
  data() {
    return {
      chartTitle: 'Average League Attendance by Month (2024)',
      chartDatasets: [],
      chartLabels: [],
      currentChart: null,
      isLoading: null,
      mostRecentYear: 0,
      yearButtons: [],
    }
  },
  computed: {
      chartVisibility() {
          if (this.isLoading) {
              return "visibility: hidden;"
          }
          return "visibility: visible;"
      },
  },
  methods: {
    async renderChart(year) {
        this.isLoading = true;
        await this.configureChart(year);
        this.isLoading = false;
    },
    async configureChart(year) {

      this.chartLabels = [];
      this.chartDatasets = [];

      const proms = [];

      proms.push(this.fetchLeagueAttendanceData("Men's League", year));
      proms.push(this.fetchLeagueAttendanceData("Women's League", year));
      proms.push(this.fetchLeagueAttendanceData("Novice League", year));
      proms.push(this.fetchLeagueAttendanceData("Daytime League", year));

      await Promise.all(proms);

      this.chartTitle = 'Average League Attendance by Month (All-time)';
      if (year) {
          this.chartTitle = `Average League Attendance by Month (${year})`;
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
          document.getElementById('MonthlyLeagueAttendance'),
          this.chartConfig
      );


    },
    async getAllYears() {
        let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getAllYears`;
        const url = new URL(urlAddress);
        return fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {
            this.yearButtons = [
                { label: 'All-time', value: '' },
                ...data[0].years.map(year => ({
                    label: year,
                    value: year
                }))
            ];
            this.mostRecentYear = data[0].years[0];
        });
    },
    async fetchLeagueAttendanceData(eventName, year) {
        let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getAverageMonthlyAttendance`;
        const url = new URL(urlAddress);
        url.searchParams.append('EventName', eventName);
        url.searchParams.append('Year', year);

        return fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {

          this.chartLabels = data.map(row => row.month);

          let lineColour = null;

          if (eventName === "Women's League") {
            lineColour = import.meta.env.VITE_WOMENS_COLOUR;
          } else if (eventName === "Men's League") {
            lineColour = import.meta.env.VITE_MENS_COLOUR;
          } else if (eventName === "Novice League") {
            lineColour = import.meta.env.VITE_NOVICE_COLOUR;
          } else if (eventName === "Daytime League") {
            lineColour = import.meta.env.VITE_DAYTIME_COLOUR;
          }

          const oneDataset = {
            label: eventName,
            data: data.map(row => row.total / row.count),
            borderWidth: 5,
            borderColor: lineColour,
            backgroundColor: lineColour
          }
          this.chartDatasets.push(oneDataset);

        });
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.getAllYears();
    await this.configureChart(this.mostRecentYear);
    this.isLoading = false;
  }
}
</script>

