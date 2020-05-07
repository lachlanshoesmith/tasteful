<template>
  <div :class="[{smaller}]" class="subheading">
    <h1 :class="[colourMode, { smaller, noTopMargin }]" class="subheading-content">
      <slot>Subheading content</slot>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Subheading',
  props: {
    smaller: Boolean,
    noTopMargin: Boolean
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
.subheading {
  padding: 0;
  border-radius: 100px;
  max-width: 50ch;
}
.subheading-content {
  margin-top: 30px;
  color: hsl(253, 100%, 94%);
  font-size: 1.8rem;
  font-weight: 500;
  text-align: left;
  line-height: 2rem;
  color: $saturated-blue-dim;
  transition: all 0.2s linear;
  &.dark {
    color: $saturated-blue;
  }
  &.solarised-light {
    color: $solarised-light-strong-content;
  }
  &.solarised-dark {
    color: $solarised-dark-strong-content;
  }
  &.black {
    color: $quite-light-grey;
  }
  &.smaller {
    font-size: 1rem;
    line-height: 1.5rem;
    text-transform: uppercase;
  }
  &.noTopMargin {
    margin-top: 0;
  }
}
@media (max-width: 1000px) {
  .subheading {
    &.smaller {
      // to fill small screens
      min-width: 100%;
    }
  }
  .subheading-content {
    text-align: center;
  }
}
</style>
