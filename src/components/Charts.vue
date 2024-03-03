<template>
  <div>
    <MemberPlayingTimeChart />
    <FamilyPlayingTimeChart />
    <CourtUsageChart />
    <YearlyBookings />
  </div>
</template>

<script>
import MemberPlayingTimeChart from './MemberPlayingTimeChart.vue'
import CourtUsageChart from './CourtUsageChart.vue'
import FamilyPlayingTimeChart from './FamilyPlayingTimeChart.vue'
import YearlyBookings from './YearlyBookings.vue'
// import { useAuthUserStore } from "@/stores/AuthUserStore";
// import { mapState, mapActions } from "pinia";

export default {
  name: 'Charts',
  components: {
    MemberPlayingTimeChart,
    CourtUsageChart,
    FamilyPlayingTimeChart,
    YearlyBookings,
  },
}

</script>

