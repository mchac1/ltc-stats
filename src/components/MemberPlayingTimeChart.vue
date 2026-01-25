<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
        <h4>{{ chartTitle }}</h4>
        <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
        <div v-else>
            <button
                v-for="btn in yearButtons"
                :key="btn.label"
                @click="renderChart(btn.value)"
            >
                {{ btn.label }}
            </button>
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
        chartTitle: '',
        memberBookingsData: [],
        currentChart: null,
        chartConfig: {},
        isLoading: null,
        howMany: 15, // default number of players shown
        canvasHeight: 650,
        mostRecentYear: 0,
        yearButtons: [],
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
            await this.configureChart(this.mostRecentYear);
            this.isLoading = false;
        },
        async renderChart(year) {
            this.isLoading = true;
            await this.configureChart(year);
            this.isLoading = false;
        },
        async getAllYears() {
            let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getAllYears`;
            const url = new URL(urlAddress);
            return fetch(url)
            .then((response) => {
                return response.json();
            }).then((data) => {
                this.yearButtons = [
                    { label: 'All-time', value: '' },
                    ...data[0].years.map(year => ({
                        label: year,
                        value: year
                    }))
                ];
                this.mostRecentYear = data[0].years[0];
            });
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
                this.memberBookingsData = data.slice(0, this.howMany);
            });
        },
        async configureChart(year) {

            await this.fetchMemberBookingsData(year);

            this.chartTitle = 'Top Member Playing Time (All-time)';
            if (year) {
                this.chartTitle = `Top Member Playing Time (${year})`;
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
        await this.getAllYears();
        await this.configureChart(this.mostRecentYear);
        this.isLoading = false;
    }
  }
</script>