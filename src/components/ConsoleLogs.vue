<template>
  <div class="console">
    <div class="heading">console</div>
    <div class="content" ref="content">
      <div class="item" v-for="log in logs" v-html="log">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      logs: {
        type: Array,
        required: true
      }
    },
    watch: {
      logs() {
        const {content} = this.$refs
        setTimeout(() => content.scrollTop = content.scrollHeight, 0)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .console
    .content
      height: 400px
      overflow: auto
      white-space: pre
      border-bottom: 1px solid #e2e2e2
      border-top: @border-bottom
      background-color: #f9f9f9
      font-size: 12px
    .item
      padding: 10px
      &:not(:last-child)
        border-bottom: 1px solid #e2e2e2
</style>