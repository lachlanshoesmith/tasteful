<template>
  <p :class="[{error, noTopMargin}, colourMode]" class="input-label">
    <slot>input-label content</slot>
  </p>
</template>

<script>
export default {
  name: 'InputLabel',
  props: {
    error: Boolean,
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
.input-label {
  font-size: 1rem;
  font-weight: 400;
  text-align: left;
  line-height: 2rem;
  max-width: 50ch;
  color: hsl(222, 5%, 20%);
  margin-top: 20px;
  margin-bottom: 5px;
  transition: all 0.2s linear;
  &.dark {
    color: hsl(222, 10%, 55%);
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
  &.error {
    max-width: 30ch;
    color: $saturated-red-dim;
    &.dark {
      color: $saturated-red;
    }
  }
  &.noTopMargin {
    margin-top: 0;
  }
}
@media (max-width: 1000px) {
  .input-label {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
}
</style>
