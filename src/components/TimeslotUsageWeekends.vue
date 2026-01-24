<template>
  <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
      <div v-else>
        <!-- <button @click="renderChart" value="Quantity">Quantity</button>
        <button @click="renderChart" value="Revenue">Revenue</button> -->
        <button @click="renderChart" value="">All-time</button>
        <button @click="renderChart" value="2025">2025</button>
        <button @click="renderChart" value="2024">2024</button>
        <button @click="renderChart" value="2023">2023</button>
        <button @click="renderChart" value="2022">2022</button>
        <button @click="renderChart" value="2021">2021</button>
        <button @click="renderChart" value="2020">2020</button>
      </div>
      <canvas id="TimeslotUsageWeekendsChart" width="1080" height="650" :style="chartVisibility"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'TimeslotUsageWeekendsChart',
  data() {
    return {
      mapTitle: '',
      courtTotalsData: [],
      allData: [],
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
      let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/?DayType=Weekends`;
      if (year) {
          urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getTimeslotCount?DayType=Weekends&Year=${year}`;
      }
      const url = new URL(urlAddress);
      return fetch(url)
      .then((response) => {
          return response.json();
      }).then((data) => {
          this.allData = data;
      });
    },
    async configureChart(year) {

        // await this.fetchData();
        await this.fetchData(year);

        this.mapTitle = 'Weekend Timeslot Usage (All-time)';
        if (year) {
            this.mapTitle = `Weekend Timeslot Usage (${year})`;
        }

        const barColors = this.allData.map((chunk, index) => {
            const hour = parseInt(chunk.timeSlot.split(':')[0], 10);
            const isPM = chunk.timeSlot.includes("PM");
            const normalizedHour = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);

            // Set a different color for time range 4 PM to 9 PM
            // return normalizedHour >= 16 && normalizedHour < 21
            return normalizedHour >= 8 && normalizedHour < 12
                ? "rgba(255, 99, 132, 0.6)" // Red for 4 PM to 9 PM
                : "rgba(75, 192, 192, 0.6)"; // Turquoise for other times
        });

        // this.mapTitle = `Timeslot Usage`;

        let datasets = []


      this.chartConfig = {
          type: 'bar',
          data: {
              labels: this.allData.map(a => a.timeSlot),
              // Maybe separate into two objects in below array, one for primetime, one for regular
              datasets: [
                {

                    // label: 'Court Usage',
                    label: '',
                    data: this.allData.map(a => a.count),
                    backgroundColor: barColors,
                    borderColor: barColors.map(color => color.replace('0.6', '1')),
                    borderWidth: 1
                }
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
          document.getElementById('TimeslotUsageWeekendsChart'),
          this.chartConfig
      );
    },
  },
  async mounted() {
    this.isLoading = true;
    // await this.configureChart('Quantity');
    await this.configureChart('2024');
    this.isLoading = false;
  }
}
</script>
