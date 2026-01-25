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
      <canvas id="BookingsByMonth" width="1080" height="650" :style="chartVisibility"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'BookingsByMonth',
  data() {
    return {
      chartTitle: 'Bookings by Month (2024)',
      chartDatasets: [],
      chartLabels: [],
      currentChart: null,
      isLoading: null,
      monthNames: [
        { num: '01', name: 'January' },
        { num: '02', name: 'February' },
        { num: '03', name: 'March' },
        { num: '04', name: 'April' },
        { num: '05', name: 'May' },
        { num: '06', name: 'June' },
        { num: '07', name: 'July' },
        { num: '08', name: 'August' },
        { num: '09', name: 'September' },
        { num: '10', name: 'October' },
        { num: '11', name: 'November' },
        { num: '12', name: 'December' },
      ],
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

      proms.push(this.fetchData(year));

      await Promise.all(proms);

      this.chartTitle = 'Bookings by Month (All-time)';
      if (year) {
          this.chartTitle = `Bookings by Month (${year})`;
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
          document.getElementById('BookingsByMonth'),
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
    async fetchData(year) {
        let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getReservationCountByMonth`;
        const url = new URL(urlAddress);
        url.searchParams.append('Year', year);

        return fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {

          this.chartLabels = data.map((a) => {
            const monthNum = a._id.month;
            const monthMatch = this.monthNames.find(b => b.num === monthNum);
            return monthMatch.name;
          });

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
    await this.getAllYears();
    await this.configureChart(this.mostRecentYear);
    this.isLoading = false;
  }
}
</script>

