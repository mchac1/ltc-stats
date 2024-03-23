<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
      <h4>{{ mapTitle }}</h4>
      <canvas id="MensLeagueAttendance" width="1080" height="650"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'MensLeagueAttendance',
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
    async fetchLeagueAttendanceData(year) {
        let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getLeagueAttendance?EventName=Men%27s%20League`;
        // let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getLeagueAttendance?EventName=Women%27s%20League`;
        if (year) {
            urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getLeagueAttendance?EventName=Men%27s%20League&Year=${year}`;
            // urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getLeagueAttendance?EventName=Women%27s%20League&Year=${year}`;
        }
        const url = new URL(urlAddress);
        return fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {

          data.sort((a, b) => {
            return Date.parse(a["Start Date / Time"]) - Date.parse(b["Start Date / Time"])
          });

          console.log('CAM attendance data')
          console.log(data)

          const massagedData = data.map((a) => {
            return {
              memberCount: a["Members Count"],
              eventDate: Date.parse(a["Start Date / Time"]),
              label: a["Start Date / Time"].substring(0, 10)
            }
          })

          console.log('CAM massagedData')
          console.log(massagedData)

          this.chartLabels = massagedData.map(row => row.label);

          const oneDataset = {
            label: "Men's Night",
            data: massagedData.map(row => row.memberCount)
          }
          this.chartDatasets.push(oneDataset);

        });
    },
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
            data: typeByYear.map(row => row.count)
          }
          this.chartDatasets.push(oneDataset);
        });
    },
  },
  async mounted() {

    

    const proms = [];

    // proms.push(this.fetchTypeData('Singles'));
    // proms.push(this.fetchTypeData('Doubles'));
    // proms.push(this.fetchTypeData('Ball Machine'));
    // proms.push(this.fetchTypeData('Backboard (only court 8)'));
    // proms.push(this.fetchTypeData('Private Lesson'));
    proms.push(this.fetchLeagueAttendanceData('2023'));

    await Promise.all(proms);

    console.log('CAM this.chartDatasets')
    console.log(this.chartDatasets)

    new Chart(
      document.getElementById('MensLeagueAttendance'),
      {
        type: 'line',
        options: {
            plugins: {
                title: {
                    display: true,
                    // text: 'Reservations by Year'
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
