<template>
  <div :class="[colourMode]" class="sidebar">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sidebar {
  background: $quite-white;
  display: flex;
  flex-direction: column;
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
}
</style>
