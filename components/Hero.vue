<template>
  <div class="hero" :class="[{bottomMargin, noPadding, insidePadding}, colourMode]">
    <div id="care-package" :class="[{insidePadding}, colourMode]" class="tier">
      <div class="tier-content">
        <slot name="left" />
      </div>
      <div id="care-package-image-container" class="tier-content">
        <div>
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
    insidePadding: Boolean
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
.hero {
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
  &.noPadding {
    padding: 0;
  }
  &.bottomMargin {
    margin-bottom: 3%;
  }
}

#care-package {
  box-shadow: 3px 4px 50px hsla(252, 20%, 20%, 0.3);
  border-radius: 20px;
  height: fit-content;
  padding-bottom: 20px;
  &.insidePadding {
    padding: 8vh 3vw 8vh 3vw;
  }
}

#care-package-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tier {
  background: #fff;
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  transition: all 0.2s linear;
  &.dark {
    background: $nav-background;
  }
  .paragraph {
    &.dark {
      color: hsl(222, 10%, 80%);
    }
  }
}

.tier-content {
  width: 80%;
}

#care-package-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

#screenshot {
  width: 70%;
  border-radius: 40px;
}
</style>
