<template>
  <div
    class="dropdown-input-container"
    :class="[{ noBottomMargin, fullWidth, rightMargin }, colourMode]"
  >
    <div class="icon-container" :class="[{noIcon}, colourMode]">
      <slot name="icon" />
    </div>
    <select
      v-model="value"
      :class="[{noIcon}, colourMode]"
      v-bind="$attrs"
      class="dropdown-input"
      @input="reportValue"
      @change="reportChange"
      @animationend="reportAnimationEnd"
    >
      <option disabled value="">
        {{ defaultValue }}
      </option>
      <option v-for="option in options" :key="option.id">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'DropdownInput',
  props: {
    noBottomMargin: Boolean,
    rightMargin: Boolean,
    fullWidth: Boolean,
    noIcon: Boolean,
    defaultValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
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
    reportValue () {
      this.$emit('input', this.value)
    },
    reportAnimationEnd () {
      this.$emit('animation-over')
    },
    reportChange () {
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-input-container {
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
    .dropdown-input {
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
}

.dropdown-input {
  color: hsl(252, 15%, 10%);
  background: none;
  border: none;
  padding: 5px;
  padding-left: 10px;
  width: 100%;
  font-size: 1rem;
  transition: all 0.2s linear;
  border-left: 1px hsl(252, 15%, 90%) solid;
  &.dark {
    color: hsl(252, 15%, 70%);
    border-left: 1px hsl(252, 10%, 15%) solid;
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
