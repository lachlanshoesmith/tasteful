<template>
  <div :class="[{redBorder, shadow, conservativeMobileView}, colourMode]" class="divided-container">
    <div class="container-content-left" :class="[{hideLeftColumn}]">
      <slot name="left" />
    </div>
    <div class="divider" :class="[{hideLeftColumn}, colourMode]" />
    <div class="container-content-right" :class="[{hideLeftColumn, conservativeMobileView}]">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DividedContainer',
  props: {
    redBorder: Boolean,
    shadow: Boolean,
    hideLeftColumn: Boolean,
    conservativeMobileView: Boolean
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
  &.shadow {
    box-shadow: 0px 0px 50px;
    &.light {
      color: $quite-light-grey;
    }
    &.dark {
      color: $dark-grey;
    }
    &.black {
      color: $black;
    }
    &.solarised-light {
      color: $solarised-light-main-background;
    }
    &.solarised-dark {
      color: $solarised-dark-main-background;
    }
  }
}
.container-content-left {
  margin-right: 15px;
  text-align: left;
  width: 35%;
  &.hideLeftColumn {
    width: 0%;
    margin-right: 0;
    .paragraph {
      display: none;
    }
    .subheading {
      display: none;
    }
  }
}
.container-content-right {
  width: 65%;
  &.hideLeftColumn {
    width: 100%;
  }
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
  &.hideLeftColumn {
    display: none;
  }
}

@media (max-width: 1000px) {
  .divided-container {
    display: block;
    &.conservativeMobileView {
      width: 90%;
      padding: 10px;
      margin-bottom: 0;
      &:before {
        transform: translateX(-10px) translateY(-15px);
      }
      .divider {
        display: none;
      }
    }
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
    &.conservativeMobileView {
      overflow-y: auto;
      height: 100%;
    }
  }
}
</style>
