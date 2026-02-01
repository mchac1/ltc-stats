<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ chartTitle }}</h4>
      <canvas id="CourtUsageByYear" width="1080" height="650"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'CourtUsageByYear',
  data() {
    return {
      chartTitle: 'Court Usage by Year',
      chartConfig: {},
    }
  },
  methods: {
    async fetchChartData() {
      const url = new URL(`${import.meta.env.VITE_MONGODB_URI}/getTotalCourtUsage`);
      return fetch(url)
        .then((response) => {
          return response.json();
        }).then((data) => {
          this.chartConfig = data;
        });
    },
  },
  async mounted() {

    await this.fetchChartData();

    new Chart(
      document.getElementById('CourtUsageByYear'),
      this.chartConfig
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
