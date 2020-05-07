<template>
  <div :class="[{ smaller, noShadow, fitWidth, noLeftMarginOnLargeScreens, smallBottomMargin, fullWidth }, colourMode]" class="masthead">
    <h1 :class="[{ centred, fitWidth }, colourMode]" class="masthead-content">
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
    noShadow: Boolean
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
  padding: 20px;
  margin-bottom: 40px;
  border-radius: 100px;
  max-width: 40vw;
  transition: all 0.2s linear;

  &.light, &.solarised-light {
    background: $masthead-gradient;
    box-shadow: 0px 4px 20px hsla(252, 67%, 45%, 0.5);
  }
  &.dark, &.solarised-dark {
    background: $dim-masthead-gradient;
    box-shadow: 0px 4px 20px hsla(252, 67%, 45%, 0.2);
  }
  &.black {
    background: $dim-masthead-gradient;
    box-shadow: 0px 4px 20px hsla(252, 67%, 45%, 0.2);
  }
  &.noShadow {
    box-shadow: none;
  }
}
.fitWidth {
  margin-left: auto;
  margin-right: auto;
  display: table;
  padding: 20px;
  min-width: 150px;
}
.masthead-content {
  color: hsl(253, 100%, 94%);
  font-size: 1.8rem;
  font-weight: 900;
  text-align: left;
  margin-left: 5%;
  margin-right: 5%;
  line-height: 2rem;
  &.fitWidth {
    padding: 0;
    margin-left: 0;
    margin-right: 0;
    white-space: nowrap;
  }
}
.centred {
  text-align: center;
}
.smaller {
  padding: 5px;
}
.fullWidth {
  max-width: 50vw;
}
.smallBottomMargin {
  margin-bottom: 15px;
}
@media (max-width: 1000px) {
  .masthead {
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .masthead-content {
    font-size: 1.5rem;
    line-height: 1.6rem;
    text-align: center;
  }
  .fullWidth {
    max-width: 100vw;
  }
}
@media (min-width: 1000px) {
  .fitWidth {
    &.noLeftMarginOnLargeScreens {
      margin-left: 0;
    }
  }
}
</style>
