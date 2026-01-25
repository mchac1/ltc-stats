<template>
    <div style="border:1px solid black; padding: 25px; margin-bottom: 50px; text-align:center;">
        <h4>{{ mapTitle }}</h4>
        <div v-if="isLoading" class="spinner-border m-5" role="status"></div>
        <div v-else>
            <button
                v-for="btn in yearButtons"
                :key="btn.label"
                @click="renderChart(btn.value)"
            >
                {{ btn.label }}
            </button>
        </div>
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
                                } else if (a.name === 'Tin Pon') {
                                    return "orange"
                                } else if (a.name === 'Ethel Koh') {
                                    return "#90A437"
                                } else if (a.name === 'Harmony McMillan') {
                                    return "blue"
                                } else if (a.name === 'Irene Pelletier') {
                                    return "red"
                                }
                                return "pink"
                            }),
                        },
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                },
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

<style scoped>

.MyContainer div {
    margin: 10px auto;
    width: 100%;
}

.centered {
  text-align: center;
}

</style>