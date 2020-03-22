<template>
  <div
    class="text-input-container"
    :class="[{ noBottomMargin }, colourMode]"
  >
    <div class="icon-container" :class="colourMode">
      <slot name="icon" />
    </div>
    <input
      v-model="value"
      :class="colourMode"
      v-bind="$attrs"
      class="text-input"
      :type="checkInputType()"
      @input="reportValue"
      @animationend="reportAnimationEnd"
    >
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    password: Boolean,
    noBottomMargin: Boolean
  },
  data () {
    return {
      value: ''
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
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
    reportValue () {
      this.$emit('input', this.value)
    },
    reportAnimationEnd () {
      this.$emit('animation-over')
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
}

.icon-container {
  height: 30px;
  padding-left: 5px;
  padding-right: 10px; // to make even with the additional 5px padding imposed by .text-input-container
  padding-top: 2.5px;
  padding-bottom: 2.5px;
  color: hsl(252, 5%, 40%);
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
