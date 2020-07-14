<template>
  <div class="blur" :class="[{applyBlur}, colourMode]">
    <div v-if="loading" class="loading">
      <img class="loading-icon" src="~/assets/images/tasteful-icon.svg">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Blur',
  props: {
    applyBlur: Boolean,
    loading: Boolean
  },
  computed: mapGetters({
    colourMode: 'theme/colourMode'
  })
}
</script>

<style lang="scss" scoped>
.blur {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  content: '';
  opacity: 0;
  pointer-events: none; // click through div without using display: none
  transition: all 0.2s linear;
  &.applyBlur {
    &.dark, &.black, &.solarised-dark {
      background: rgba($deep-black, 0.8);
    }
    &.light, &.solarised-light {
      background: rgba($light-grey, 0.8);
    }
    pointer-events: initial;
    opacity: 1;
  }
}

.loading {
  box-shadow: 0px 0px 500px $saturated-purple-dim;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  width: 10vw;
  height: 10vw;
  background: linear-gradient(45deg, $saturated-purple, $saturated-red, $saturated-blue, $saturated-green);
  background-size: 800% 800%;

  -webkit-animation: gradient 9s ease infinite;
  -moz-animation: gradient 9s ease infinite;
  animation: gradient 9s ease infinite;
}

@-webkit-keyframes gradient {
    0%{background-position:0% 96%}
    50%{background-position:100% 5%}
    100%{background-position:0% 96%}
}
@-moz-keyframes gradient {
    0%{background-position:0% 96%}
    50%{background-position:100% 5%}
    100%{background-position:0% 96%}
}
@keyframes gradient {
    0%{background-position:0% 96%}
    50%{background-position:100% 5%}
    100%{background-position:0% 96%}
}

.loading-icon {
  filter: invert(100%) sepia(100%) saturate(0%) brightness(200%) contrast(100%);
  width: 50%;
  height: 50%;
}

@supports ((-webkit-backdrop-filter: blur(10px)) or (backdrop-filter: blur(10px))) {
  .blur {
    &.applyBlur {
      backdrop-filter: blur(10px);
      &.light, &.dark, &.black, &.solarised-light, &.solarised-dark {
        background: none;
      }
    }
  }
}
</style>
