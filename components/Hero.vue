<template>
  <div class="hero-container">
    <div class="hero-background" :style="{ backgroundImage: `url(${background})` }" />
    <div class="hero">
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
    }
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
  width: 100vw;
}
.hero {
  width: 50vw;
  transition: all 0.2s linear;
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 2;
  padding-left: 25vw;
  padding-right: 25vw;
}
.hero-background {
  background-size: cover;
  display: block;
  filter: blur(250px);
  width: 110%;
  left: -5%;
  position: fixed;
  right: 0;
  z-index: 1;
  opacity: 0.4;
}
.hero-container, .hero, .hero-background {
  height: 400px;
}
</style>
