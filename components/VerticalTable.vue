<template>
  <div class="vertical-table">
    <div v-if="!noHeader" class="header">
      <subheading smaller>
        <slot name="header" />
      </subheading>
    </div>
    <div class="table-content" :class="{ 'table-content-curved': noHeader, lessLeftPadding, smallRows }">
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
  },
  props: {
    noHeader: Boolean,
    smallRows: Boolean,
    lessLeftPadding: Boolean
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
  // CAVEAT: unless i distinguish row as its own component and do some conditional class trickery,
  //         rows will have to be styled in both ReleaseList under the sortable-list class as well
  //         as the VerticalTable components.
  .row {
    padding-left: 32px;
    padding-bottom: 16px;
    padding-top: 16px;
    &:nth-child(even) {
      background: $lightest-purple;
    }
  }
  &.lessLeftPadding {
    .row {
      padding-left: 16px;
    }
  }
  &.smallRows {
    .row {
      padding-top: 8px;
      padding-bottom: 8px;
    }
  }
  &.table-content-curved {
    border-radius: 10px;
  }
}
</style>
