<template>
  <label :class="[{includeRightMargin}, colourMode]" class="box-label">
    <slot>box-label content</slot>
  </label>
</template>

<script>
export default {
  name: 'BoxLabel',
  props: {
    includeRightMargin: Boolean
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.box-label {
  font-size: 1rem;
  font-weight: 400;
  text-align: left;
  line-height: 1.4rem;
  max-width: 50ch;
  margin-left: 5px;
  color: $quite-dark-grey;
  transition: all 0.2s linear;
  &.dark {
    color: $quite-light-grey;
  }
  &.solarised-light {
    color: $solarised-light-strong-content;
  }
  &.solarised-dark {
    color: $solarised-dark-strong-content;
  }
  &.black {
    color: $quite-dark-grey;
  }
  &.includeRightMargin {
    margin-right: 15px;
  }
}
@media (max-width: 1000px) {
  .box-label {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
}
</style>
