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
        <canvas id="MemberLessonTimeChart" width="1080" height="650" :style="chartVisibility"></canvas>
    </div>
</template>
  
<script>
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'MemberLessonTimeChart',
    data() {
      return {
        mapTitle: '',
        memberBookingsData: [],
        currentChart: null,
        chartConfig: {},
        isLoading: null,
        instructorsColors: [
            {
                name: 'Marek Nehasil',
                color: "#576905"
            },
            {
                name: 'Denise Fernandez',
                color: "#262F00"
            },
            {
                name: 'Morgan Waller',
                color: "#CFDE8A"
            },
            {
                name: 'Boomer Quangtakoune',
                color: "blue"
                // color: "#F6FAE3"
            },
            {
                name: 'Ethel Koh',
                color: "#90A437"
            },
            {
                name: 'Harmony McMillan',
                color: "pink"
            },
        ]
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
            let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMemberLessonHours`;
            if (year) {
                urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMemberLessonHours?Year=${year}`;
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
            });
        },
        async configureChart(year) {

            await this.fetchMemberBookingsData(year);

            this.mapTitle = 'Top Individual Private Lessons (All-time)';
            if (year) {
                this.mapTitle = `Top Individual Private Lessons (${year})`;
            }

            this.chartConfig = {
                type: 'bar',
                data: {
                    labels: this.memberBookingsData.map(a => a.name),
                    datasets: this.instructorsColors.map((instructor) => {
                        return {
                            label: instructor.name,
                            data: this.memberBookingsData.map((a) => {
                                const oneMatch = a.instructors.find(b => b.name === instructor.name)
                                if (oneMatch) {
                                    return oneMatch.hours
                                }
                                return 0
                            }),
                            // backgroundColor: instructor.color
                        }
                    })
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
                document.getElementById('MemberLessonTimeChart'),
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