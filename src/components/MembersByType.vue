<template>
  <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
      <div v-else>
        <button @click="renderChart" value="Quantity">Quantity</button>
        <button @click="renderChart" value="Revenue">Revenue</button>
      </div>
      <canvas id="MembersByTypeChart" width="1080" height="650" :style="chartVisibility"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'MembersByTypeChart',
  data() {
    return {
      mapTitle: '',
      courtTotalsData: [],
      memberTotalsData: [],
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
    async fetchMemberTypeData(year) {
      let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMembersBreakdown`;
      if (year) {
          urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMembersBreakdown?Year=${year}`;
      }
      const url = new URL(urlAddress);
      return fetch(url)
      .then((response) => {
          return response.json();
      }).then((data) => {
          this.memberTotalsData = data;
      });
    },
    async configureChart(metric) {

        await this.fetchMemberTypeData();

        this.mapTitle = `Membership Totals (${metric})`;

        // Different membership types should be displayed depending
        // on the metric selected, as some types bring in no revenue
        const memberTypes = {
            "Quantity": [
                "Adult Membership",
                "Junior Membership",
                "Family Membership",
                "Staff Membership",
                "Ace Sponsorship",
                "Smash Sponsorship",
                "Student Membership",
                "End of Season 'Stragglers'",
                "Honorary Membership",
                "Instant Tennis Graduate",
                "LTC Supporter"
            ],
            "Revenue": [
                "Adult Membership",
                "Junior Membership",
                "Family Membership",
                "Ace Sponsorship",
                "Smash Sponsorship",
                "Student Membership",
                "End of Season 'Stragglers'",
                "Instant Tennis Graduate",
                "LTC Supporter"
            ],
        }

        let datasets = []

        memberTypes[metric].forEach((b) => {
            datasets.push({
                label: b,
                data: this.memberTotalsData.map(a => a[metric][b])
            })
        })

        // console.log(theDatasets)
        // console.log(this.courtTotalsData)
        // console.log(this.courtTotalsData.map(a => a.Singles))
        // console.log(this.memberTotalsData.map(a => a.Quantity["Adult Membership"]))
        // console.log(this.memberTotalsData.map(a => a.Year))
        // console.log('datasets')
        // console.log(datasets)

      this.chartConfig = {
          type: 'bar',
          data: {
              labels: this.memberTotalsData.map(a => a.Year),
              datasets: datasets
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
          document.getElementById('MembersByTypeChart'),
          this.chartConfig
      );
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.configureChart('Quantity');
    this.isLoading = false;
  }
}
</script>
