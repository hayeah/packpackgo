<template>
  <span class="svg-icon" v-html="icon"></span>
</template>

<script>
  import bolt from 'svg/bolt.svg'

  const icons = {
    bolt
  }

  export default {
    props: {
      name: {
        type: String,
        required: true
      }
    },
    computed: {
      icon() {
        return icons[this.name]
      }
    }
  }
</script>

<style>
  .svg-icon {
    svg {
      width: 14px;
    }
  }
</style>