<template>
  <div>
    <MembersByType />
    <MonthlyReservationsCount />
    <MonthlyLeagueAttendance />
    <YearlyLeagueAttendance />
    <!-- <MensLeagueAttendance /> -->
    <MemberLessonTimeChart />
    <InstructorHoursChart />
    <MemberPlayingTimeChart />
    <FamilyPlayingTimeChart />
    <CourtUsageChart />
    <YearlyBookings />
    <IndividualPlayingTime />
  </div>
</template>

<script>
import InstructorHoursChart from './InstructorHoursChart.vue'
import MemberPlayingTimeChart from './MemberPlayingTimeChart.vue'
import MemberLessonTimeChart from './MemberLessonTimeChart.vue'
import CourtUsageChart from './CourtUsageChart.vue'
import FamilyPlayingTimeChart from './FamilyPlayingTimeChart.vue'
import YearlyBookings from './YearlyBookings.vue'
import MensLeagueAttendance from './MensLeagueAttendance.vue'
import YearlyLeagueAttendance from './YearlyLeagueAttendance.vue'
import MonthlyLeagueAttendance from './MonthlyLeagueAttendance.vue'
import IndividualPlayingTime from './IndividualPlayingTime.vue'
import MonthlyReservationsCount from './MonthlyReservationsCount.vue'
import MembersByType from './MembersByType.vue'
// import { useAuthUserStore } from "@/stores/AuthUserStore";
// import { mapState, mapActions } from "pinia";

export default {
  name: 'Charts',
  components: {
    InstructorHoursChart,
    MemberPlayingTimeChart,
    MemberLessonTimeChart,
    CourtUsageChart,
    FamilyPlayingTimeChart,
    YearlyBookings,
    MensLeagueAttendance,
    YearlyLeagueAttendance,
    MonthlyLeagueAttendance,
    IndividualPlayingTime,
    MonthlyReservationsCount,
    MembersByType,
  },
}

</script>

