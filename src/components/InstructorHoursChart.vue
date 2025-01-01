<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
        <h4>{{ mapTitle }}</h4>
        <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
        <div v-else>
            <button @click="renderChart" value="">All-time</button>
            <button @click="renderChart" value="2024">2024</button>
            <button @click="renderChart" value="2023">2023</button>
            <button @click="renderChart" value="2022">2022</button>
            <button @click="renderChart" value="2021">2021</button>
            <button @click="renderChart" value="2020">2020</button>
        </div>
        <!-- <div style="margin-top: 30px"> -->
        <div style="margin-top: 3%">
            <div class="row">
                <div class="col">
                    <canvas id="InstructorHoursChart" :style="chartVisibility"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'InstructorHoursChart',
    data() {
      return {
        mapTitle: '',
        memberBookingsData: [],
        currentChart: null,
        chartConfig: {},
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
        async fetchMemberBookingsData(year) {
            let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getInstructorHours`;
            if (year) {
                urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getInstructorHours?Year=${year}`;
            }
            const url = new URL(urlAddress);
            return fetch(url)
            .then((response) => {
                return response.json();
            }).then((data) => {
                // Filter out oddballs where staff/board created a lesson in the system
                this.memberBookingsData = data.filter(item => item.name !== "Corey Huber" && item.name !== "Josh Hornoi");
            });
        },
        async configureChart(year) {

            await this.fetchMemberBookingsData(year);

            this.mapTitle = 'Top Private Lesson Instructor Hours (All-time)';
            if (year) {
                this.mapTitle = `Top Private Lesson Instructor Hours (${year})`;
            }

            this.chartConfig = {
                // type: 'bar',
                type: 'doughnut',
                data: {
                    labels: this.memberBookingsData.map(a => a.name),
                    datasets: [
                        {
                            label: 'Regular Hours',
                            data: this.memberBookingsData.map(a => a.hoursOnCourt),
                            backgroundColor: this.memberBookingsData.map((a) => {
                                if (a.name === 'Denise Fernandez') {
                                    return "#262F00"
                                } else if (a.name === 'Marek Nehasil') {
                                    return "#576905"
                                } else if (a.name === 'Morgan Waller') {
                                    return "#CFDE8A"
                                } else if (a.name === 'Boomer Quangtakoune') {
                                    return "#F6FAE3"
                                } else if (a.name === 'Ethel Koh') {
                                    return "#90A437"
                                }
                                return "pink"
                            }),
                        },
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    // elements: {
                    //     bar: {
                    //         borderWidth: 2,
                    //     }
                    // },
                    // responsive: true,
                    // plugins: {
                    //     title: {
                    //         display: true,
                    //     }
                    // },
                    // scales: {
                    //     x: {
                    //         stacked: true,
                    //     },
                    //     y: {
                    //         stacked: true,
                    //     }
                    // }
                },
                // options: {
                //     indexAxis: 'y',
                //     elements: {
                //         bar: {
                //             borderWidth: 2,
                //         }
                //     },
                //     responsive: true,
                //     plugins: {
                //         title: {
                //             display: true,
                //         }
                //     },
                //     scales: {
                //         x: {
                //             stacked: true,
                //         },
                //         y: {
                //             stacked: true,
                //         }
                //     }
                // },
            }

            if (this.currentChart) {
                this.currentChart.destroy();
            }

            this.currentChart = new Chart(
                document.getElementById('InstructorHoursChart'),
                this.chartConfig
            );

            this.currentChart.canvas.parentNode.style.height = '400px';
            this.currentChart.canvas.parentNode.style.width = '400px';
            // this.currentChart.canvas.parentNode.style.height = '500px';
            // this.currentChart.canvas.parentNode.style.width = '500px';
        }
    },
    async mounted() {
        this.isLoading = true;
        await this.configureChart('2024');
        this.isLoading = false;
    }
  }
</script>

<style scoped>
/* .chart-container {
  display: flex;
  justify-content: center;
} */

.MyContainer div {
    margin: 10px auto;
    width: 100%;
}

.centered {
  text-align: center;
}

/* canvas {
  max-width: 400px;
  max-height: 400px;
} */
</style>