<template>
  <div :class="colourMode" class="modal-container">
    <!-- The old modal design. Nice, but too curvy. Not to body shame or anything.
      <div :class="[colourMode]" class="modal">
      <div id="modal-content-left" class="modal-content">
        <close-icon :class="colourMode" class="large-close-icon" title="Close" @click="closeModal" />
        <div :class="[{scrollable}]">
          <slot name="left" />
        </div>
      </div>
      <div id="modal-content-right" class="modal-content" :class="[{scrollable}]">
        <slot name="right" />
      </div>
    </div> -->

    <!-- The new modal design is a slightly modified DividedContainer, essentially. -->
    <div :class="[{redBorder, shadow}, colourMode]" class="modal">
      <div class="modal-content-left" :class="{largerLeftSide}">
        <div class="flex-container">
          <close-icon :class="colourMode" class="large-close-icon" title="Close" @click="closeModal" />
          <slot name="heading" />
        </div>
        <slot name="left" />
      </div>
      <div class="divider" :class="[colourMode]" />
      <div class="modal-content-right" :style=" { 'background-image': `url(${imageForRightSide})`} " />
    </div>
  </div>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close.vue'

export default {
  name: 'Modal',
  components: {
    CloseIcon
  },
  props: {
    scrollable: Boolean,
    greenBackground: Boolean,
    shadow: Boolean,
    redBorder: Boolean,
    imageForRightSide: {
      type: String,
      default: ''
    },
    largerLeftSide: Boolean
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  methods: {
    closeModal () {
      this.$emit('closeModal')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.modal-container {
  backdrop-filter: blur(5px);
  width: 100vw;
  height: 100vh;
  transition: all 0.2s linear;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 997;
  display: flex;
  justify-content: center;
  align-items: center;
  &.dark, &.black, &.solarised-dark {
    background: rgba($deep-black, 0.8);
  }
  &.light, &.solarised-light {
    background: rgba($light-grey, 0.8);
  }
}

.modal {
  background: $lightest-purple;
  display: flex;
  width: 50vw;
  min-height: 50vh;
  border-radius: 10px;
  transition: all 0.2s linear;
  z-index: 1;
  position: relative;
  box-shadow: 0px 0px 50px $desaturated-dimmest-purple;
}

.modal-content {
  height: 100%;
}

.modal-content-left {
  margin-right: 128px;
  text-align: left;
  width: calc(50% - 176px);
  padding-left: 48px;
  padding-top: 48px;
  padding-bottom: 48px;
  &.largerLeftSide {
    margin-right: 64px;
    width: calc(50% - 48px);
  }
}

.modal-content-right {
  width: 50%;
  background-size: cover;
  border-radius: 0px 10px 10px 0px;
}

.subheading-content {
  margin-top: 0;
}

.large-close-icon {
  width: 24px;
  height: 24px;
  position: absolute;
  left: 16px;
  top: 16px;
  svg {
    color: $desaturated-dimmest-purple;
    width: 24px;
    height: 24px;
    transition: color 0.2s linear;
    &:hover {
      color: $desaturated-dimmish-purple;
      cursor: pointer;
    }
  }
}

.scrollable {
  overflow-y: auto;
}

.flex-container {
  display: flex;
}

</style>
