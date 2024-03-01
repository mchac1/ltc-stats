<template>
  <div>
    <MemberPlayingTimeChart />
    <CourtUsageChart />
    <FamilyPlayingTimeChart />
    <YearlyBookings />
  </div>
</template>

<script>
import MemberPlayingTimeChart from './MemberPlayingTimeChart.vue'
import CourtUsageChart from './CourtUsageChart.vue'
import FamilyPlayingTimeChart from './FamilyPlayingTimeChart.vue'
import YearlyBookings from './YearlyBookings.vue'

export default {
  name: 'Charts',
  components: {
    MemberPlayingTimeChart,
    CourtUsageChart,
    FamilyPlayingTimeChart,
    YearlyBookings,
  },
  // data() {
  //   return {
  //     mapTitle: '',
  //     courtTotalsData: []
  //   }
  // },
}


</script>

