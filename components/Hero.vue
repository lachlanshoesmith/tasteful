<template>
  <div class="hero-container" :class="{fullscreen}">
    <div class="hero-background" :class="{fullscreen}" :style="{ backgroundImage: `url(${background})` }" />
    <div class="hero" :class="{narrow, fullscreen}">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hero',
  props: {
    background: {
      type: String,
      default: ''
    },
    narrow: Boolean,
    fullscreen: Boolean
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
.hero-container {
  width: 100%;
}
.hero {
  width: 50vw;
  transition: all 0.2s linear;
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 2;
  padding-left: 25vw;
  padding-right: 25vw;
  &.narrow {
    width: 40vw;
    padding-left: 30vw;
    padding-right: 30vw;
  }
}
.hero-background {
  background-size: cover;
  display: block;
  filter: blur(250px);
  width: 110%;
  left: -5%;
  position: absolute;
  z-index: 1;
  opacity: 0.4;
}
.hero-container, .hero, .hero-background {
  height: 400px;
}
.fullscreen {
  height: 100vh;
}
</style>
