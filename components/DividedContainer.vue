<template>
  <div :class="[{redBorder}, colourMode]" class="divided-container">
    <div class="container-content-left">
      <slot name="left" />
    </div>
    <div class="divider" :class="[colourMode]" />
    <div class="container-content-right">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DividedContainer',
  props: {
    redBorder: Boolean
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
.divided-container {
  background: $quite-white;
  display: flex;
  width: calc(100% - 80px);
  padding: 30px;
  padding-left: 40px;
  padding-right: 40px;
  margin-bottom: 40px;
  border-radius: 0px 0px 10px 10px;
  transition: all 0.2s linear;
  z-index: 1;
  position: relative;
  &.dark {
    background: $quite-deep-black;
  }
  &:before {
    transform: translateX(-40px) translateY(-35px);
    content: " ";
    position: absolute;
    background: $tasteful-gradient;
    width: 100%;
    height: 5px;
    border-radius: 10px 10px 0px 0px;
    transition: all 0.2s linear;
  }
  &.solarised-light, &.solarised-dark {
    &:before {
      background: $solarised-tasteful-gradient;
    }
  }
  &.solarised-light {
    background: $solarised-light-secondary-background;
    &:before {
      opacity: 0.5;
    }
  }
  &.solarised-dark {
    background: $solarised-dark-secondary-background;
  }
  &.black {
    background: $deep-black;
    &:before {
      background: $quite-deep-black;
    }
  }
  &.redBorder {
    &:before {
      background: $red-gradient;
    }
  }
}
.container-content-left {
  margin-right: 15px;
  text-align: left;
  width: 35%;
}
.container-content-right {
  width: 65%;
}
.divider {
  width: 3px;
  min-height: 100%;
  margin-right: 15px;
  background: $very-light-grey;
  transition: all 0.2s linear;
  &.dark, &.black {
    background: $dark-grey;
  }
  &.solarised-light {
    background: $solarised-light-main-background;
  }
  &.solarised-dark {
    background: $solarised-dark-main-background;
  }
}

@media (max-width: 1000px) {
  .divided-container {
    display: block;
  }
  .container-content-left {
    width: 100%;
    margin-right: 0;
    .paragraph {
      display: none;
    }
  }
  .container-content-right {
    width: 100%;
  }
}
</style>
