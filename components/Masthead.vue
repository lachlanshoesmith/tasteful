<template>
  <div :class="[{ noShadow, fitWidth, noLeftMarginOnLargeScreens, smallBottomMargin, fullWidth }, colourMode]" class="masthead">
    <h1 :class="[{ centred, fitWidth, smaller }, colourMode]" class="masthead-content" :contenteditable="editable">
      <slot>Masthead content</slot>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Masthead',
  props: {
    centred: Boolean,
    smaller: Boolean,
    fullWidth: Boolean,
    fitWidth: Boolean,
    noLeftMarginOnLargeScreens: Boolean,
    smallBottomMargin: Boolean,
    noShadow: Boolean,
    editable: Boolean
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
.masthead {
  margin-top: 8px;
  margin-bottom: 8px;
}
.masthead-content {
  font-size: 36px;
  color: $dimmest-purple;
  font-weight: 900;
  max-width: 50vw;
  margin: 0;
  &.smaller {
    font-size: 24px;
  }
}
</style>
