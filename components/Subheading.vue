<template>
  <div class="subheading">
    <h1 :class="[colourMode, { smaller, smallest }]" class="subheading-content">
      <slot>Subheading content</slot>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Subheading',
  props: {
    smaller: Boolean,
    smallest: Boolean
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
  margin-top: 8px;
  margin-bottom: 8px;
}
.subheading-content {
  color: $dimmer-purple;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin: 0;
  &.smaller, &.smallest {
    font-size: 14px;
    letter-spacing: 2px;
  }
  &.smallest {
    font-weight: 500;
    color: $muted-purple;
  }
}
</style>
