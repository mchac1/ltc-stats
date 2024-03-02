<template>
  <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h2>{{ mapTitle }}</h2>
      <button @click="renderChart" value="">All-time</button>
      <button @click="renderChart" value="2023">2023</button>
      <button @click="renderChart" value="2022">2022</button>
      <button @click="renderChart" value="2021">2021</button>
      <button @click="renderChart" value="2020">2020</button>
      <canvas id="CourtUsageChart" width="1080" height="650"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'CourtUsageChart',
  data() {
    return {
      mapTitle: '',
      courtTotalsData: []
    }
  },
  methods: {
    async renderChart(event) {
      this.currentChart.destroy();
      await this.configureChart(event.target._value);
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
          this.courtTotalsData = data;
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

      this.currentChart = new Chart(
          document.getElementById('CourtUsageChart'),
          this.chartConfig
      );
    },
  },
  async mounted() {
    await this.configureChart('2023');
  }
}
</script>
