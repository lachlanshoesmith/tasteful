<template>
  <div :class="[{smaller, noDefinedWidth }]" class="subheading">
    <h1 :class="[colourMode, { smaller, centred, noTopMargin, noCentreOnMobile }]" class="subheading-content">
      <slot>Subheading content</slot>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Subheading',
  props: {
    smaller: Boolean,
    centred: Boolean,
    noTopMargin: Boolean,
    noCentreOnMobile: Boolean,
    noDefinedWidth: Boolean
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
  &.centred {
    text-align: center;
  }
  &.noTopMargin {
    margin-top: 0;
  }
}
@media (max-width: 1000px) {
  .subheading {
    &.mobileMinWidth {
      // to fill small screens
      min-width: 100%;
    }
    &.noDefinedWidth {
      min-width: min-content;
      max-width: 100%;
    }
  }
  .subheading-content {
    text-align: center;
  }
  .noCentreOnMobile {
    text-align: left;
  }
}
</style>
