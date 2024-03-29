<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
      <div v-else>
        <button @click="renderChart" value="">All-time</button>
        <button @click="renderChart" value="2023">2023</button>
        <button @click="renderChart" value="2022">2022</button>
        <button @click="renderChart" value="2021">2021</button>
        <button @click="renderChart" value="2020">2020</button>
      </div>
      <canvas id="MonthlyReservationsCount" width="1080" height="650" :style="chartVisibility"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'MonthlyReservationsCount',
  data() {
    return {
      mapTitle: 'Average League Attendance by Month (2023)',
      chartDatasets: [],
      chartLabels: [],
      currentChart: null,
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
    async configureChart(year) {

      this.chartLabels = [];
      this.chartDatasets = [];

      const proms = [];

      proms.push(this.fetchData(year));

      await Promise.all(proms);

      this.mapTitle = 'Bookings by Month (All-time)';
      if (year) {
          this.mapTitle = `Bookings by Month (${year})`;
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
          document.getElementById('MonthlyReservationsCount'),
          this.chartConfig
      );


    },
    async fetchData(year) {
        let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getReservationCountByMonth`;
        const url = new URL(urlAddress);
        url.searchParams.append('Year', year);

        return fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {

          console.log(data)

          this.chartLabels = data.map(row => row._id.month);

          let lineLabel = 'All-time';
          if (year) {
            lineLabel = year;
          }

          const oneDataset = {
            label: lineLabel,
            data: data.map(row => row.totalQuantity),
            borderWidth: 5
          }
          this.chartDatasets.push(oneDataset);

        });
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.configureChart('2023');
    this.isLoading = false;
  }
}
</script>

