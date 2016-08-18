<template>
  <div class="page">
    <div class="card" v-for="project in projects">
      {{ project.name }}
    </div>
    <div class="card add-card">
      <header class="card-header">
        <h2 class="card-title">
          <svg-icon class="card-title-icon" name="bolt"></svg-icon>
        </h2>
      </header>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  import SvgIcon from 'components/SvgIcon'

  export default {
    name: 'Home',
    computed: {
      ...mapGetters(['projects'])
    },
    components: {
      SvgIcon
    }
  }
</script>

<style>
  $yellow: #fee602;
  .svg-icon.card-title-icon {
    svg {
      width: 30px;
    }
    path {
      fill: $yellow;
    }
  }
  .card {
    background-color: white ;
  }
</style>