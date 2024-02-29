<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
        <h2>{{ mapTitle }}</h2>
        <button @click="renderChart" value="">All-time</button>
        <button @click="renderChart" value="2023">2023</button>
        <button @click="renderChart" value="2022">2022</button>
        <button @click="renderChart" value="2021">2021</button>
        <button @click="renderChart" value="2020">2020</button>
      <!-- <canvas id="MemberPlayingTimeChart" width="800" height="800"></canvas> -->
      <canvas id="MemberPlayingTimeChart" width="1080" height="650"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'MemberPlayingTimeChart',
    data() {
      return {
        mapTitle: '',
        singlesData: [],
        memberBookingsData: [],
        currentChart: null,
        chartConfig: {},
      }
    },
    methods: {
        async renderChart(event) {
            this.currentChart.destroy();
            await this.configureChart(event.target._value);
        },
        // async renderChart(event) {
        //     this.currentChart.destroy();

        //     await this.fetchMemberBookingsData(event.target._value);

        //     this.mapTitle = 'Top Court Reservers (All-time)';
        //     if (event.target._value) {
        //         this.mapTitle = `Top Court Reservers (${event.target._value})`;
        //     }
            
        //     this.chartConfig = {
        //         type: 'bar',
        //         data: {
        //             labels: this.memberBookingsData.map(a => a._id.member),
        //             datasets: [
        //                 {
        //                     label: 'Bookings Created',
        //                     data: this.memberBookingsData.map(a => a.totalQuantity)
        //                 }
        //             ]
        //         },
        //         options: {
        //             indexAxis: 'y',
        //             elements: {
        //                 bar: {
        //                     borderWidth: 2,
        //                 }
        //             },
        //             responsive: true,
        //             plugins: {
        //                 title: {
        //                     display: true,
        //                     // text: mapTitle
        //                 }
        //             }
        //         },
        //     }

        //     let myChart = new Chart(
        //         document.getElementById('MemberPlayingTimeChart'),
        //         this.chartConfig
        //     );

        //     this.currentChart = myChart;
        // },
        async fetchMemberBookingsData(year) {
            // let urlAddress = `http://localhost:3000/api/players/getReservationCountByMember`;
            // let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getReservationCountByMember`;
            let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMemberHours`;
            if (year) {
                // urlAddress = `http://localhost:3000/api/players/getReservationCountByMember?Year=${year}`;
                // urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getReservationCountByMember?Year=${year}`;
                urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMemberHours?Year=${year}`;
            }
            const url = new URL(urlAddress);
            return fetch(url)
            .then((response) => {
                return response.json();
            }).then((data) => {
                // Sort by amount so biggest ones are at the top
                data.sort((a, b) => b.totalQuantity - a.totalQuantity);
                // Just get top 20
                this.memberBookingsData = data.slice(0, 15);
                console.log('CAM members data')
                console.log(this.memberBookingsData)
            });
        },
        async configureChart(year) {
            await this.fetchMemberBookingsData(year);

            // console.log(this.familyBookingsData)

            // this.mapTitle = 'Top Court Reservers (All-time)';
            this.mapTitle = 'Top Individual Hours on Court (All-time)';
            if (year) {
                this.mapTitle = `Top Individual Hours on Court (${year})`;
            }

            this.chartConfig = {
                type: 'bar',
                data: {
                    // labels: this.memberBookingsData.map(a => a.familyName),
                    labels: this.memberBookingsData.map(a => a.name),
                    datasets: [
                        {
                            label: 'Regular Hours',
                            data: this.memberBookingsData.map((a) => {
                                return a.hoursOnCourt - a.primeTimeOnCourt
                            })
                        },
                        {
                            label: 'Prime Time Hours',
                            data: this.memberBookingsData.map(a => a.primeTimeOnCourt)
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
                // document.getElementById('FamilyPlayingTimeChart'),
                document.getElementById('MemberPlayingTimeChart'),
                this.chartConfig
            );
        }
    },
    async mounted() {
        await this.configureChart('2023');
    }
    // async mounted() {
    //     // Initially get all-time bookings
    //     await this.fetchMemberBookingsData();

    //     this.chartConfig = {
    //         type: 'bar',
    //         data: {
    //             labels: this.memberBookingsData.map(a => a._id.member),
    //             datasets: [
    //                 {
    //                     label: 'Bookings Created',
    //                     data: this.memberBookingsData.map(a => a.totalQuantity)
    //                 }
    //             ]
    //         },
    //         options: {
    //             indexAxis: 'y',
    //             elements: {
    //                 bar: {
    //                     borderWidth: 2,
    //                 }
    //             },
    //             responsive: true,
    //             plugins: {
    //                 title: {
    //                     display: true,
    //                     text: 'Top Court Reservers (All-time)'
    //                 }
    //             }
    //         },
    //     }
  
    //   let myChart = new Chart(
    //     document.getElementById('MemberPlayingTimeChart'),
    //     this.chartConfig
    //   );

    //   this.currentChart = myChart;
    // }
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
  