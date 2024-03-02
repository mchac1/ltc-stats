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
        </div>
        <canvas id="FamilyPlayingTimeChart" width="1080" height="650" :style="chartVisibility"></canvas>
    </div>
</template>
  
<script>
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'FamilyPlayingTimeChart',
    data() {
      return {
        mapTitle: '',
        familyBookingsData: [],
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
        async fetchFamilyBookingsData(year) {
            let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getFamilyHours`;
            if (year) {
                urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getFamilyHours?Year=${year}`;
            }
            const url = new URL(urlAddress);
            return fetch(url)
            .then((response) => {
                return response.json();
            }).then((data) => {
                // Just get top 15
                this.familyBookingsData = data.slice(0, 15);
            });
        },
        async configureChart(year) {
            await this.fetchFamilyBookingsData(year);

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

            this.currentChart = new Chart(
                document.getElementById('FamilyPlayingTimeChart'),
                this.chartConfig
            );
        }
    },
    async mounted() {
        this.isLoading = true;
        await this.configureChart('2023');
        this.isLoading = false;
    }
  }
</script>