<template>
  <span class="svg-icon" v-html="icon"></span>
</template>

<script>
  import bolt from 'svg/bolt.svg'
  import folderOpenO from 'svg/folder-open-o.svg'
  import circle from 'svg/circle.svg'
  import link from 'svg/link.svg'
  import folder from 'svg/folder.svg'

  const icons = {
    bolt,
    folderOpenO,
    circle,
    link,
    folder
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
    height: 14px;
  }
</style>
