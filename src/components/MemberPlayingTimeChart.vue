<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
        <h4>{{ mapTitle }}</h4>
        <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
        <div v-else>
            <button @click="renderChart" value="">All-time</button>
            <button @click="renderChart" value="2023">2023</button>
            <button @click="renderChart" value="2022">2022</button>
            <button @click="renderChart" value="2021">2021</button>
            <button @click="renderChart" value="2020">2020</button>
            <button class="m-3" @click="doubleChart" value="">Show More</button>
        </div>
        <canvas id="MemberPlayingTimeChart" width="1080" :height="canvasHeight" :style="chartVisibility"></canvas>
    </div>
</template>
  
<script>
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'MemberPlayingTimeChart',
    data() {
      return {
        mapTitle: '',
        allData: [],
        memberBookingsData: [],
        currentChart: null,
        chartConfig: {},
        isLoading: null,
        howMany: 15,
        canvasHeight: 650,
        currentYear: 2023,
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
        async doubleChart() {
            this.howMany = this.howMany * 2;
            this.canvasHeight = this.canvasHeight * 2;
            this.isLoading = true;
            await this.configureChart(this.currentYear);
            this.isLoading = false;
        },
        async renderChart(event) {
            this.isLoading = true;
            this.currentYear = event.target._value;
            await this.configureChart(this.currentYear);
            this.isLoading = false;
        },
        async fetchMemberBookingsData(year) {
            let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMemberHours`;
            if (year) {
                urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMemberHours?Year=${year}`;
            }
            const url = new URL(urlAddress);
            return fetch(url)
            .then((response) => {
                return response.json();
            }).then((data) => {
                // Sort by amount so biggest ones are at the top
                data.sort((a, b) => b.totalQuantity - a.totalQuantity);
                this.allData = data;
                // Just get top 20
                // this.memberBookingsData = data.slice(0, 15);
                this.memberBookingsData = data.slice(0, this.howMany);
                // this.memberBookingsData = data.slice(0, 60);
            });
        },
        async configureChart(year) {

            await this.fetchMemberBookingsData(year);

            this.mapTitle = 'Top Individual Hours on Court (All-time)';
            if (year) {
                this.mapTitle = `Top Individual Hours on Court (${year})`;
            }

            this.chartConfig = {
                type: 'bar',
                data: {
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

            let chartElement = document.getElementById('MemberPlayingTimeChart');
            chartElement.height = this.canvasHeight;

            this.currentChart = new Chart(
                chartElement,
                this.chartConfig
            );
        }
    },
    async mounted() {
        this.isLoading = true;
        await this.configureChart(this.currentYear);
        this.isLoading = false;
    }
  }
</script>