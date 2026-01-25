<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <canvas id="ReservationTypeByYearChart" width="1080" height="650"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'ReservationTypeByYear',
  data() {
    return {
      mapTitle: 'Reservation Type by Year',
      singlesData: [],
      doublesData: [],
      machineData: [],
      something: [],
      typeInfo: [
        {
          name: "Singles",
          chartLabel: "Singles"
        },
        {
          name: "Doubles",
          chartLabel: "Doubles"
        },
        {
          name: "Ball Machine",
          chartLabel: "Ball Machine"
        },
      ],
      chartDatasets: [],
      chartLabels: []
    }
  },
  methods: {
    async fetchTypeData(reservationType) {
      const url = new URL(`${import.meta.env.VITE_MONGODB_URI}/getReservationsByType?Type=${reservationType}`);
      return fetch(url)
        .then((response) => {
          return response.json();
        }).then((data) => {
          // Loop through query results and get yearly count for that type
          const typeByYear = [];
          data.forEach((booking) => {
            const year = booking["Start Date / Time"].slice(0,4);
            const yearMatch = typeByYear.find(a => a.year === year)
            if (!yearMatch) {
              const temp = {
                year: year,
                count: 1
              }
              typeByYear.push(temp);
            } else {
              yearMatch.count++;
            }
          });

          this.chartLabels = typeByYear.map(row => row.year);

          const oneDataset = {
            label: reservationType,
            data: typeByYear.map(row => row.count),
            borderWidth: 5
          }
          this.chartDatasets.push(oneDataset);
        });
    },
  },
  async mounted() {

    const proms = [];

    proms.push(this.fetchTypeData('Singles'));
    proms.push(this.fetchTypeData('Doubles'));
    proms.push(this.fetchTypeData('Ball Machine'));
    proms.push(this.fetchTypeData('Backboard (only court 8)'));
    proms.push(this.fetchTypeData('Private Lesson'));

    await Promise.all(proms);

    new Chart(
      document.getElementById('ReservationTypeByYearChart'),
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
