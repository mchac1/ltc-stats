<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <canvas id="YearlyLeagueAttendance" width="1080" height="650"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'YearlyLeagueAttendance',
  data() {
    return {
      mapTitle: 'Average League Attendance by Year',
      chartDatasets: [],
      chartLabels: []
    }
  },
  methods: {
    async fetchLeagueAttendanceData(eventName) {
        let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getAverageAttendance`;
        const url = new URL(urlAddress);
        url.searchParams.append('EventName', eventName);

        return fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {

          this.chartLabels = data.map(row => row.year);

          const oneDataset = {
            label: eventName,
            data: data.map(row => row.total / row.count),
            borderWidth: 5
          }
          this.chartDatasets.push(oneDataset);

        });
    },
  },
  async mounted() {

    const proms = [];

    proms.push(this.fetchLeagueAttendanceData("Men's League"));
    proms.push(this.fetchLeagueAttendanceData("Women's League"));
    proms.push(this.fetchLeagueAttendanceData("Novice League"));

    await Promise.all(proms);

    new Chart(
      document.getElementById('YearlyLeagueAttendance'),
      {
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
