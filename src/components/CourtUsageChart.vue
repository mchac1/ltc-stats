<template>
  <div class="hello">
    <!-- <canvas id="myChart" width="400" height="150"></canvas> -->
    <canvas id="myChart" width="800"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'CourtUsageChart',
  data() {
    return {
      singlesData: [],
      doublesData: [],
    }
  },
  methods: {
    async fetchSinglesData() {
      const url = new URL(`http://localhost:3000/api/players/getReservationsByType?Type=Singles`);
      return fetch(url)
        .then((response) => {
          return response.json();
        }).then((data) => {
          // Filter for 2023 reservations
          this.singlesData = data.filter((a) =>{
            return a['Start Date / Time'].startsWith('2023')
          });
        });
    },
    async fetchDoublesData() {
      const url = new URL(`http://localhost:3000/api/players/getReservationsByType?Type=Doubles`);
      return fetch(url)
        .then((response) => {
          return response.json();
        }).then((data) => {
          // Filter for 2023 reservations
          this.doublesData = data.filter((a) =>{
            return a['Start Date / Time'].startsWith('2023')
          });
        });
    },
  },
  async mounted() {
    await this.fetchDoublesData();

    // Assemble array with number of bookings by court number
    const doublesByCourt = [];
    this.doublesData.forEach((booking) => {
      const courtMatch = doublesByCourt.find(a => a.court === booking.Courts)
      if (!courtMatch) {
        const temp = {
          court: booking.Courts,
          count: 1
        }
        doublesByCourt.push(temp);
      } else {
        courtMatch.count = courtMatch.count + 1;
      }
    });
    
    // Sort by court number so they display in order
    doublesByCourt.sort((a, b) => {
      if (a.court < b.court) {
        return -1;
      }
      if (a.court > b.court) {
        return 1;
      }
      return 0;
    });

    await this.fetchSinglesData();

    // Assemble array with number of bookings by court number
    const singlesByCourt = [];
    this.singlesData.forEach((booking) => {
      const courtMatch = singlesByCourt.find(a => a.court === booking.Courts)
      if (!courtMatch) {
        const temp = {
          court: booking.Courts,
          count: 1
        }
        singlesByCourt.push(temp);
      } else {
        courtMatch.count++;
      }
    });
    
    // Sort by court number so they display in order
    singlesByCourt.sort((a, b) => {
      if (a.court < b.court) {
        return -1;
      }
      if (a.court > b.court) {
        return 1;
      }
      return 0;
    });

    new Chart(
      document.getElementById('myChart'),
      {
        type: 'bar',
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Reservations by Court (2023)'
                }
            }
        },
        data: {
          labels: singlesByCourt.map(row => row.court),
          datasets: [
            {
              label: 'Singles',
              data: singlesByCourt.map(row => row.count)
            },
            {
              label: 'Doubles',
              data: doublesByCourt.map(row => row.count)
            }
          ]
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
