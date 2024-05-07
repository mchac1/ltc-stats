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
      <canvas id="MembersByTypeChart" width="1080" height="650" :style="chartVisibility"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'MembersByTypeChart',
  data() {
    return {
      mapTitle: '',
      courtTotalsData: [],
      memberTotalsData: [],
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
    async fetchData(year) {
      let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getReservationTypeCourtTotals`;
      if (year) {
          urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getReservationTypeCourtTotals?Year=${year}`;
      }
      const url = new URL(urlAddress);
      return fetch(url)
      .then((response) => {
          return response.json();
      }).then((data) => {
          this.courtTotalsData = data;
      });
    },
    async fetchMemberTypeData(year) {
      let urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMembersRevenue`;
      if (year) {
          urlAddress = `${import.meta.env.VITE_MONGODB_URI}/getMembersRevenue?Year=${year}`;
      }
      const url = new URL(urlAddress);
      return fetch(url)
      .then((response) => {
          return response.json();
      }).then((data) => {
          this.memberTotalsData = data;

        //     const temp = {
        //         year: year,
        //         results: data.filter(a => a.revenue > 0)
        //     }

        //   this.memberTotalsData.push(temp)
        //   console.log(filt)
      });
    },
    async configureChart(year) {
      await this.fetchData(year);

      this.mapTitle = 'Membership Totals';
    //   if (year) {
    //       this.mapTitle = `Total Bookings by Court (${year})`;
    //   }

      this.chartConfig = {
          type: 'bar',
          data: {
              labels: this.courtTotalsData.map(a => a.court),
              datasets: [
                  {
                      label: 'Singles',
                      data: this.courtTotalsData.map(a => a.Singles)
                  },
                  {
                      label: 'Doubles',
                      data: this.courtTotalsData.map(a => a.Doubles)
                  },
                  {
                      label: 'Ball Machine',
                      data: this.courtTotalsData.map(a => a["Ball Machine"])
                  },
                  {
                      label: 'Backboard',
                      data: this.courtTotalsData.map(a => a["Backboard (only court 8)"])
                  },
              ]
          },
          options: {
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

    //   if (this.currentChart) {
    //       this.currentChart.destroy();
    //   }

    //   this.currentChart = new Chart(
    //       document.getElementById('MembersByTypeChart'),
    //       this.chartConfig
    //   );
    },
    async configureThisChart() {
      await this.fetchMemberTypeData('2020');
    //   await this.fetchMemberTypeData('2021');

      console.log(this.memberTotalsData)

      this.mapTitle = 'Membership Totals';

        // const theDatasets = this.memberTotalsData.map((a) => {
        //     return {
        //         label: a._id.membershipType,
        //         data: [a.quantity]
        //     }
        // });

        // const theDatasets = this.memberTotalsData.map((a) => {
        //     return {
        //         // label: a.results[0]._id.membershipType,
        //         // label: a.Quantity["Adult Membership"],
        //         label: "Adult Membership",
        //         data: a.Quantity["Adult Membership"],
        //     }
        // });

        const memberTypes = [
            "Adult Membership",
            "Junior Membership (15 and under)",
            "Family Membership",
            "Staff Membership",
            "Ace Sponsorship",
            "Smash Sponsorship",
            "Full-Time Student Membership (Ages 16-17)",
            "Full-Time Student Membership (Ages 16-23) INACTIVE",
            "End of Season 'Stragglers'",
            "Honorary Membership",
            "2024 Instant Tennis Graduate Membership"
        ]

        let myRay = []

        memberTypes.forEach((b) => {
            myRay.push({
                label: b,
                data: this.memberTotalsData.map(a => a.Quantity[b])
            })
        })

        const theDatasets = this.memberTotalsData.map((a) => {
            return {
                // label: a.results[0]._id.membershipType,
                // label: a.Quantity["Adult Membership"],
                label: "Adult Membership",
                data: a.Quantity["Adult Membership"],
            }
        });

        console.log(theDatasets)
        console.log(this.courtTotalsData)
        console.log(this.courtTotalsData.map(a => a.Singles))
        console.log(this.memberTotalsData.map(a => a.Quantity["Adult Membership"]))
        console.log(this.memberTotalsData.map(a => a.Year))
        console.log('myRay')
        console.log(myRay)

      this.chartConfig = {
          type: 'bar',
          data: {
              labels: this.memberTotalsData.map(a => a.Year),
            //   labels: ['hey'],
            //   datasets: theDatasets
              datasets: myRay
            //   datasets: [
            //       {
            //           label: "Adult Membership",
            //           data: this.memberTotalsData.map(a => a.Quantity["Adult Membership"])
            //       },
            //       {
            //           label: "Junior Membership (15 and under)",
            //           data: this.memberTotalsData.map(a => a.Quantity["Junior Membership (15 and under)"])
            //       },
            //       {
            //           label: "Family Membership",
            //           data: this.memberTotalsData.map(a => a.Quantity["Family Membership"])
            //       },
            //       {
            //           label: "Staff Membership",
            //           data: this.memberTotalsData.map(a => a.Quantity["Staff Membership"])
            //       },
            //       {
            //           label: "Smash Sponsorship",
            //           data: this.memberTotalsData.map(a => a.Quantity["Smash Sponsorship"])
            //       },
            //       {
            //           label: "Full-Time Student Membership (Ages 16-17)",
            //           data: this.memberTotalsData.map(a => a.Quantity["Full-Time Student Membership (Ages 16-17)"])
            //       },
            //   ]
            //   datasets: [
            //       {
            //           label: 'Singles',
            //         //   data: this.courtTotalsData.map(a => a.Singles)
            //         //   data: this.courtTotalsData.map(a => a._id["Membership Type"])
            //       },
            //       {
            //           label: 'Doubles',
            //           data: this.courtTotalsData.map(a => a.Doubles)
            //       },
            //       {
            //           label: 'Ball Machine',
            //           data: this.courtTotalsData.map(a => a["Ball Machine"])
            //       },
            //       {
            //           label: 'Backboard',
            //           data: this.courtTotalsData.map(a => a["Backboard (only court 8)"])
            //       },
            //   ]
          },
          options: {
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
          document.getElementById('MembersByTypeChart'),
          this.chartConfig
      );
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.configureChart('2023');
    // await this.fetchMemberTypeData('2023');
    await this.configureThisChart('2023');
    // console.log('CAM here')
    // console.log(this.memberTotalsData)
    this.isLoading = false;
  }
}
</script>
