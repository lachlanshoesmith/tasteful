<template>
  <div class="hero-container" :class="[{bottomMargin, noPadding, insidePadding}, colourMode]">
    <div :class="[{insidePadding, noDefinitiveHeight}, colourMode]" class="hero">
      <div class="hero-content" :class="[(dontShowLeftOnMobile)]">
        <div>
          <slot name="left" />
        </div>
      </div>
      <div class="image-container hero-content" :class="[{smallerImage, dontShowRightOnMobile}]">
        <div :class="[{forceImageContainerHeight}]">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hero',
  props: {
    noPadding: Boolean,
    bottomMargin: Boolean,
    insidePadding: Boolean,
    smallerImage: Boolean,
    noDefinitiveHeight: Boolean,
    dontShowLeftOnMobile: Boolean,
    dontShowRightOnMobile: Boolean,
    forceImageContainerHeight: Boolean
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
  transition: all 0.2s linear;
  box-shadow: 0px -30px 50px hsl(0, 0%, 95%);
  display: flex;
  align-items: center;
  padding-top: 10vh;
  padding-bottom: 10vh;
  padding-left: 3vw;
  padding-right: 3vw;
  &.dark {
    box-shadow: 0px -30px 50px hsl(0, 0%, 10%);
  }
  &.solarised-light {
    box-shadow: 0px -30px 50px $solarised-light-main-background;
  }
  &.solarised-dark {
    box-shadow: 0px -30px 50px $solarised-dark-main-background;
  }
  &.black {
    box-shadow: none;
  }
  &.noPadding {
    padding: 0;
  }
  &.bottomMargin {
    margin-bottom: 3%;
  }
}

.hero {
  box-shadow: 3px 4px 50px hsla(252, 20%, 20%, 0.3);
  border-radius: 20px;
  height: fit-content;
  padding-bottom: 20px;
  background: $nav-background;
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  transition: all 0.2s linear;
  .paragraph {
    &.dark {
      color: hsl(222, 10%, 80%);
    }
  }
  &.insidePadding {
    padding: 8vh 3vw 8vh 3vw;
  }
  &.noDefinitiveHeight {
    height: fit-content;
  }
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  &.smallerImage {
    display: flex;
    justify-content: initial;
    align-items: initial;
  }
}

.hero-content {
  width: 80%;
}

.forceImageContainerHeight {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

@media (max-width: 1000px) {
  .hero-content {
    display: flex;
    justify-content: center;
    text-align: center;
    &.dontShowLeftOnMobile, &.dontShowRightOnMobile {
      display: none;
      padding: 0;
    }
  }
}
</style>
