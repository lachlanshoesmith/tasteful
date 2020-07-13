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
      <div class="modal-content-left">
        <div class="flex-container">
          <close-icon :class="colourMode" class="large-close-icon" title="Close" @click="closeModal" />
          <slot name="heading" />
        </div>
        <slot name="left" />
      </div>
      <div class="divider" :class="[colourMode]" />
      <div class="modal-content-right">
        <close-icon :class="colourMode" class="large-close-icon" title="Close" @click="closeModal" />
        <div class="right-heading">
          <slot name="heading" />
        </div>
        <slot name="right" />
      </div>
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
    redBorder: Boolean
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

// OLD MODAL
// .modal {
//   background: hsl(0, 0%, 100%);
//   box-shadow: 0px 0px 50px hsl(0, 0%, 95%);
//   width: 50vw;
//   min-height: 50vh;
//   max-height: 80vh;
//   border-radius: 50px;
//   transition: all 0.2s linear;
//   display: flex;
//   padding-bottom: 20px;
//   &:before {
//     position: absolute;
//     transform: translateY(-10px);
//     z-index: -1;
//     content: " ";
//     background: linear-gradient(270deg, #f14f4f, #5f40dd);
//     width: 50vw;
//     height: 50vh;
//     border-radius: 50px;
//     transition: all 0.2s linear;
//   }
//   &.dark {
//     background: hsl(0, 0%, 10%);
//     box-shadow: 0px 0px 20px hsl(0, 0%, 12%);
//   }
//   &.greenBackground {
//     background: $green-gradient;
//     background-size: 400% 400%;
//     animation: GradientAnimation 2s ease infinite;
//   }
// }

.modal {
  background: $quite-white;
  display: flex;
  width: 40vw;
  min-height: 30vh;
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

.modal-content {
  height: 100%;
  padding-left: 5%;
  padding-top: 5%;
}

.modal-content-left {
  margin-right: 15px;
  text-align: left;
  width: 35%;
}

.modal-content-right {
  width: 65%;
}

.subheading-content {
  margin-top: 0;
}

.large-close-icon {
  width: 24px;
  height: 24px;
  svg {
    color: hsl(222, 5%, 20%);
    width: 24px;
    height: 24px;
    &:hover {
      cursor: pointer;
    }
  }
  &.dark {
    svg {
      color: hsl(222, 10%, 55%);
    }
  }
}

.scrollable {
  overflow-y: auto;
}

.flex-container {
  display: flex;
}

.right-side-mobile-header {
  display: none;
}

@media (max-width: 1000px) {
  .modal {
    width: 90vw;
    padding-left: 0;
    padding-right: 0;
    &:before {
      transform: translateX(0px) translateY(-35px);
      width: 90vw;
    }
  }
  .right-heading {
    width: 100%;
  }
  .large-close-icon {
    position: absolute;
    left: 5vw;
  }
  .modal-content {
    padding-left: 0;
  }
  .modal-content-left {
    position: relative;
    width: 0%;
    z-index: 5;
    margin-top: 20px;
    display: none;
    .subheading, .paragraph {
      display: none;
    }
    &.scrollable {
      overflow-y: auto;
    }
  }
  .modal-content-right {
    overflow: none;
    width: 100%;
    text-align: center;
    .text-input-container {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
    &.scrollable {
      overflow-y: auto;
    }
  }
}

@keyframes GradientAnimation {
  0%{background-position:82% 0%}
  50%{background-position:19% 100%}
  100%{background-position:82% 0%}
}

</style>
