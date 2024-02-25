<script setup>
import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
// import OptionsTry from './components/OptionsTry.vue'
// import OptionsChart from './components/OptionsChart.vue'
// import CourtUsageChart from './components/CourtUsageChart.vue'
import YearlyBookings from './components/YearlyBookings.vue'
// import IndividualBookingCountsChart from './components/IndividualBookingCountsChart.vue'
// import FamilyPlayingTimeChart from './components/FamilyPlayingTimeChart.vue'
</script>

<template>
  <!-- <header> -->
    <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->

    <!-- <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div> -->
    <!-- <OptionsTry msg="Welcome to Your Vue.js App"/> -->
  <!-- </header> -->

  <main>
    <!-- <TheWelcome /> -->
    <!-- <OptionsTry msg="Welcome to Your Vue.js App"/> -->
    <!-- <OptionsChart msg="Welcome to Your Vue.js App"/> -->
    <!-- <FamilyPlayingTimeChart /> -->
    <!-- <IndividualBookingCountsChart /> -->
    <!-- <CourtUsageChart /> -->
    <YearlyBookings />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
