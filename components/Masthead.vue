<template>
  <div :class="[{ noShadow, fitWidth, noLeftMarginOnLargeScreens, smallBottomMargin, fullWidth, noMargin }, colourMode]" class="masthead">
    <h1 :class="[{ centred, fitWidth, smaller, bigger }, colourMode]" class="masthead-content" :contenteditable="editable" @keydown.enter.prevent @input="emitValue">
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
    editable: Boolean,
    bigger: Boolean,
    noMargin: Boolean
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  methods: {
    emitValue (element) {
      this.$emit('change', element.target.textContent)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.masthead {
  margin-top: 8px;
  margin-bottom: 8px;
  &.noMargin {
    margin: 0;
  }
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
  &.bigger {
    font-size: 96px;
  }
  &.centred {
    text-align: center;
  }
}
</style>
