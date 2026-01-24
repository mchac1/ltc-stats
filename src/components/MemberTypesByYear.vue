<template>
  <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
      <div v-else>
      </div>
      <canvas id="MembersTypesByYear" width="1080" height="650" :style="chartVisibility"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'MembersTypesByYear',
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

        this.mapTitle = `Membership Totals by Year`;

        // Different membership types should be displayed depending
        // on the metric selected, as some types bring in no revenue
        const memberTypes = {
            "Quantity": [
                "Adult Membership",
                "Junior Membership",
                "Family Membership",
                // "Staff Membership",
                // "Ace Sponsorship",
                // "Smash Sponsorship",
                "Student Membership",
                "Sponsor Membership",
                // "End of Season 'Stragglers'",
                // "Honorary Membership",
                "Instant Tennis Graduate",
                // "LTC Supporter"
            ],
            "Revenue": [
                "Adult Membership",
                "Junior Membership",
                "Family Membership",
                // "Ace Sponsorship",
                // "Smash Sponsorship",
                "Sponsor Membership",
                "Student Membership",
                // "End of Season 'Stragglers'",
                "Instant Tennis Graduate",
                // "LTC Supporter"
            ],
        }

        let datasets = []

        memberTypes[metric].forEach((b) => {
            datasets.push({
                label: b,
                data: this.memberTotalsData.map(a => a[metric][b]),
                tension: 0.3
            })
        })

        const allLabels = this.memberTotalsData.map(a => a.Year)

        // Get totals for each year to add to the chart
        const totalMembershipsPerYear = allLabels.map((_, index) => {
            return datasets.reduce((sum, ds) => {
                const value = ds.data[index];
                return sum + (typeof value === "number" ? value : 0);
            }, 0);
        });

        datasets.push({
            label: "Total",
            data: totalMembershipsPerYear,
            borderWidth: 3,
            borderDash: [6, 4],
            pointRadius: 4,
            tension: 0.3
        });

      this.chartConfig = {
          type: 'line',
          data: {
              labels: allLabels,
              datasets: datasets
          },
          options: {
              elements: {
                  bar: {
                      borderWidth: 1,
                  }
              },
              responsive: true,
              plugins: {
                  title: {
                      display: true,
                  }
              },
          },
      }

      if (this.currentChart) {
          this.currentChart.destroy();
      }

      this.currentChart = new Chart(
          document.getElementById('MembersTypesByYear'),
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
