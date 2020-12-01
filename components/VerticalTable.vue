<template>
  <div class="vertical-table">
    <div class="header">
      <subheading smaller>
        <slot name="header" />
      </subheading>
    </div>
    <div class="table-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import subheading from '~/components/Subheading.vue'

export default {
  name: 'VerticalTable',
  components: {
    subheading
  }
}
</script>

<style lang="scss" scoped>
  .vertical-table {
    background: $lighter-purple;
    color: black;
    border-radius: 10px;
  }
  .header {
    padding: 32px;
    padding-bottom: 16px;
  }
  .table-content {
    .row {
      padding-left: 32px;
      padding-bottom: 16px;
      padding-top: 16px;
      &:nth-child(even) {
        background: $lightest-purple;
      }
    }
  }
</style>
