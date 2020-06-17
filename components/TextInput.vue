<template>
  <div
    class="text-input-container"
    :class="[{ noBottomMargin, fullWidth, rightMargin, focusHighlight }, colourMode]"
  >
    <div class="icon-container" :class="[{noIcon}, colourMode]">
      <slot name="icon" />
    </div>
    <input
      v-model="value"
      :class="[{noIcon}, colourMode]"
      v-bind="$attrs"
      class="text-input"
      :type="checkInputType()"
      :readonly="disabled"
      @input="isTyping = true"
      @focus="reportFocus(true)"
      @blur="reportFocus(false)"
      @animationend="reportAnimationEnd"
    >
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'TextInput',
  props: {
    password: Boolean,
    noBottomMargin: Boolean,
    rightMargin: Boolean,
    fullWidth: Boolean,
    noIcon: Boolean,
    disabled: Boolean,
    focusManualBlurHandling: Boolean,
    defaultValue: {
      type: String,
      default: ''
    },
    focusHighlight: Boolean
  },
  data () {
    return {
      value: this.defaultValue,
      isTyping: false
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  watch: {
    defaultValue (val) {
      this.value = val
    },
    value: _.debounce(function () {
      this.isTyping = false
    }, 500),
    isTyping (val) {
      if (!val) {
        // if not typing
        this.$emit('input', this.value)
      }
    }
  },
  methods: {
    checkInputType () {
      if (this.password) {
        return 'password'
      } else {
        return 'text'
      }
    },
    reportAnimationEnd () {
      this.$emit('animation-over')
    },
    reportFocus (focused) {
      if (!this.focusManualBlurHandling) {
        this.$emit('focus', focused)
      } else if (this.focusManualBlurHandling && focused) {
        this.$emit('focus', focused)
      }
      // If focusManualBlurHandling is enabled and the user unfocuses from the input, nothing happens automatically.
    }
  }
}
</script>

<style lang="scss" scoped>
.text-input-container {
  display: flex;
  height: 30px;
  border-radius: 5px;
  padding: 5px;
  border: 1px hsl(252, 15%, 90%) solid;
  width: 60%;
  margin-bottom: 5px;
  transition: all 0.2s linear;
  &.dark {
    border: 1px hsl(252, 10%, 15%) solid;
  }
  &.solarised-light {
    border: 1px rgba($solarised-light-main-background, 1) solid;
  }
  &.solarised-dark {
    border: 1px $solarised-dark-main-background solid;
  }
  &.black {
    border: 1px $dark-grey solid;
  }
  &.flashRed {
    animation: backgroundFlashRed 1s 1;
    .icon-container {
      animation: iconFlashRed 1s 1;
    }
    .text-input {
      animation: textInputFlashRedLight 1s 1;
      &.dark {
        animation: textInputFlashRedDark 1s 1;
      }
    }
  }
  &.noBottomMargin {
    margin-bottom: 0;
  }
  &.rightMargin {
    margin-right: 10px;
  }
  &.fullWidth {
    width: 100%;
  }
  &.focusHighlight {
    border: 1px $saturated-purple-quite-dim solid;
  }
}

.text-input {
  color: hsl(252, 15%, 10%);
  background: none;
  border: none;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 1rem;
  width: 100%;
  overflow: auto;
  transition: all 0.2s linear;
  border-left: 1px hsl(252, 15%, 90%) solid;
  &.dark {
    color: hsl(252, 15%, 70%);
    border-left: 1px hsl(252, 10%, 15%) solid;
  }
  &.solarised-light {
    color: $solarised-light-main-content;
    border-left: 1px $solarised-light-main-background solid;
  }
  &.solarised-dark {
    color: $solarised-dark-main-content;
    border-left: 1px $solarised-dark-main-background;
  }
  &.black {
    color: $quite-light-grey;
    border-left: 1px $dark-grey solid;
  }
  &.noIcon {
    border-left: none;
  }
}

.icon-container {
  height: 30px;
  padding-left: 5px;
  padding-right: 10px; // to make even with the additional 5px padding imposed by .text-input-container
  padding-top: 2.5px;
  padding-bottom: 2.5px;
  color: hsl(252, 5%, 40%);
  &.noIcon {
    display: none;
  }
  &.solarised-light {
    color: $solarised-light-strong-content;
  }
  &.solarised-dark {
    color: $solarised-dark-strong-content;
  }
  &.black {
    color: $quite-light-grey;
  }
}

@keyframes backgroundFlashRed {
  0% {
    background: none;
  }
  50% {
    background: $saturated-red;
  }
  100% {
    background: none;
  }
}

@keyframes iconFlashRed {
  0% {
    color: hsl(252, 5%, 40%)
  }
  50% {
    color: $saturated-red-dim;
  }
  100% {
    color: hsl(252, 5%, 40%)
  }
}

@keyframes textInputFlashRedLight {
  0% {
    color: hsl(252, 15%, 10%);
    border-left: 1px hsl(252, 15%, 90%) solid;
  }
  50% {
    color: $saturated-red-dim;
    border-left: 1px $saturated-red-dim solid;
  }
  100% {
    color: hsl(252, 15%, 10%);
    border-left: 1px hsl(252, 15%, 90%) solid;
  }
}

@keyframes textInputFlashRedDark {
  0% {
    color: hsl(252, 15%, 70%);
    border-left: 1px hsl(252, 10%, 15%) solid;
  }
  50% {
    color: $saturated-red-dim;
    border-left: 1px $saturated-red-dim solid;
  }
  100% {
    color: hsl(252, 15%, 70%);
    border-left: 1px hsl(252, 10%, 15%) solid;
  }
}
</style>
