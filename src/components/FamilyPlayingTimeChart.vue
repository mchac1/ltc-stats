<template>
    <!-- <div> -->
    <!-- <div style = "text-align:center;"> -->
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
        <h2>{{ mapTitle }}</h2>
        <button @click="renderChart" value="">All-time</button>
        <button @click="renderChart" value="2023">2023</button>
        <button @click="renderChart" value="2022">2022</button>
        <button @click="renderChart" value="2021">2021</button>
        <button @click="renderChart" value="2020">2020</button>
      <!-- <canvas id="FamilyPlayingTimeChart" width="800" height="800"></canvas> -->
      <!-- <canvas id="FamilyPlayingTimeChart" width="1080" height="800" style="border:1px solid black; padding: 25px; margin-bottom: 50px;"></canvas> -->
      <!-- <canvas id="FamilyPlayingTimeChart" width="1080" height="600"></canvas> -->
      <canvas id="FamilyPlayingTimeChart" width="1080" height="650"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'FamilyPlayingTimeChart',
    data() {
      return {
        mapTitle: '',
        singlesData: [],
        familyBookingsData: [],
        currentChart: null,
        chartConfig: {},
      }
    },
    methods: {
        async renderChart(event) {
            this.currentChart.destroy();
            await this.configureChart(event.target._value);
        },
        async fetchFamilyBookingsData(year) {
            let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getFamilyHours`;
            // const url = new URL(`${import.meta.env.VITE_MONGODB_URI}/getReservationsByType?Type=${reservationType}`);
            if (year) {
                urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getFamilyHours?Year=${year}`;
            }
            const url = new URL(urlAddress);
            return fetch(url)
            .then((response) => {
                return response.json();
            }).then((data) => {
                console.log('CAM data')
                console.log(data)
                // Just get top 20
                // this.familyBookingsData = data.slice(0, 20);
                this.familyBookingsData = data.slice(0, 15);
            });
        },
        async configureChart(year) {
            await this.fetchFamilyBookingsData(year);

            console.log(this.familyBookingsData)

            this.mapTitle = 'Top Hours on Court by Family (All-time)';
            if (year) {
                this.mapTitle = `Top Hours on Court by Family (${year})`;
            }

            this.chartConfig = {
                type: 'bar',
                data: {
                    labels: this.familyBookingsData.map(a => a.familyName),
                    datasets: [
                        {
                            label: 'Regular Hours',
                            data: this.familyBookingsData.map((a) => {
                                return a.hours - a.primeTimeOnCourt
                            })
                        },
                        {
                            label: 'Prime Time Hours',
                            data: this.familyBookingsData.map(a => a.primeTimeOnCourt)
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    elements: {
                        bar: {
                            borderWidth: 2,
                        }
                    },
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            // text: mapTitle
                        }
                    },
                    // barThickness: 25,
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

            this.currentChart = new Chart(
                document.getElementById('FamilyPlayingTimeChart'),
                this.chartConfig
            );
        }
    },
    async mounted() {
        await this.configureChart('2023');
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
  