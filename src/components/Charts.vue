<template>
  <div>
    <CourtUsageByYear />
    <MemberTypesByYear />
    <InstructorsByYear />
    <TimeslotUsageWeekdays />
    <TimeslotUsageWeekends />
    <MembersByType />
    <BookingsByMonth />
    <MonthlyLeagueAttendance />
    <YearlyLeagueAttendance />
    <MemberLessonTimeChart />
    <InstructorHoursChart />
    <MemberPlayingTimeChart />
    <FamilyPlayingTimeChart />
    <CourtUsageChart />
    <ReservationTypeByYear />
    <IndividualBreakdown />
    <!-- <IndividualMemberSummary /> -->
  </div>
</template>

<script>
import CourtUsageByYear from './CourtUsageByYear.vue'
import MemberTypesByYear from './MemberTypesByYear.vue'
import InstructorsByYear from './InstructorsByYear.vue'
import InstructorHoursChart from './InstructorHoursChart.vue'
import MemberPlayingTimeChart from './MemberPlayingTimeChart.vue'
import MemberLessonTimeChart from './MemberLessonTimeChart.vue'
import CourtUsageChart from './CourtUsageChart.vue'
import FamilyPlayingTimeChart from './FamilyPlayingTimeChart.vue'
import ReservationTypeByYear from './ReservationTypeByYear.vue'
import YearlyLeagueAttendance from './YearlyLeagueAttendance.vue'
import MonthlyLeagueAttendance from './MonthlyLeagueAttendance.vue'
import IndividualBreakdown from './IndividualBreakdown.vue'
import BookingsByMonth from './BookingsByMonth.vue'
import MembersByType from './MembersByType.vue'
import TimeslotUsageWeekdays from './TimeslotUsageWeekdays.vue'
import TimeslotUsageWeekends from './TimeslotUsageWeekends.vue'
// import IndividualMemberSummary from './IndividualMemberSummary.vue'
// import { useAuthUserStore } from "@/stores/AuthUserStore";
// import { mapState, mapActions } from "pinia";

export default {
  name: 'Charts',
  components: {
    CourtUsageByYear,
    MemberTypesByYear,
    InstructorsByYear,
    InstructorHoursChart,
    MemberPlayingTimeChart,
    MemberLessonTimeChart,
    CourtUsageChart,
    FamilyPlayingTimeChart,
    ReservationTypeByYear,
    YearlyLeagueAttendance,
    MonthlyLeagueAttendance,
    IndividualBreakdown,
    BookingsByMonth,
    MembersByType,
    TimeslotUsageWeekdays,
    TimeslotUsageWeekends,
    // IndividualMemberSummary,
  },
}

</script>

