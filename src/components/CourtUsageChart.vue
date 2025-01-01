<template>
  <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
      <div v-else>
        <button @click="renderChart" value="">All-time</button>
        <button @click="renderChart" value="2024">2024</button>
        <button @click="renderChart" value="2023">2023</button>
        <button @click="renderChart" value="2022">2022</button>
        <button @click="renderChart" value="2021">2021</button>
        <button @click="renderChart" value="2020">2020</button>
      </div>
      <canvas id="CourtUsageChart" width="1080" height="650" :style="chartVisibility"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'CourtUsageChart',
  data() {
    return {
      mapTitle: '',
      courtTotalsData: [],
      isLoading: null,
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
    async renderChart(event) {
      this.isLoading = true;
      await this.configureChart(event.target._value);
      this.isLoading = false;
    },
    async fetchData(year) {
      let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getReservationTypeCourtTotals`;
      if (year) {
          urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getReservationTypeCourtTotals?Year=${year}`;
      }
      const url = new URL(urlAddress);
      return fetch(url)
      .then((response) => {
            return response.json();
      }).then((data) => {
            // Filter out cases where there are multiple courts for one booking
            this.courtTotalsData = data.filter(item => !item.court.includes(','));
      });
    },
    async configureChart(year) {
      await this.fetchData(year);

      this.mapTitle = 'Total Bookings by Court (All-time)';
      if (year) {
          this.mapTitle = `Total Bookings by Court (${year})`;
      }

      this.chartConfig = {
          type: 'bar',
          data: {
              labels: this.courtTotalsData.map(a => a.court),
              datasets: [
                  {
                      label: 'Singles',
                      data: this.courtTotalsData.map(a => a.Singles)
                  },
                  {
                      label: 'Doubles',
                      data: this.courtTotalsData.map(a => a.Doubles)
                  },
                  {
                      label: 'Ball Machine',
                      data: this.courtTotalsData.map(a => a["Ball Machine"])
                  },
                  {
                      label: 'Backboard',
                      data: this.courtTotalsData.map(a => a["Backboard (only court 8)"])
                  },
              ]
          },
          options: {
              elements: {
                  bar: {
                      borderWidth: 2,
                  }
              },
              responsive: true,
              plugins: {
                  title: {
                      display: true,
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
      }

      if (this.currentChart) {
          this.currentChart.destroy();
      }

      this.currentChart = new Chart(
          document.getElementById('CourtUsageChart'),
          this.chartConfig
      );
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.configureChart('2024');
    this.isLoading = false;
  }
}
</script>
