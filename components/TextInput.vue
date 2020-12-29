<template>
  <div class="text-input-container">
    <label class="text-input-label" :for="name">
      <slot />
    </label>
    <input
      v-model="value"
      :name="name"
      :class="[{fullWidth, alternate, noMargin}, colourMode]"
      v-bind="$attrs"
      class="text-input"
      :type="checkInputType()"
      :readonly="disabled"
      @input="reportValue"
      @focus="reportFocus(true)"
      @blur="reportFocus(false)"
    >
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'TextInput',
  props: {
    password: Boolean,
    debounce: Boolean,
    disabled: Boolean,
    alternate: Boolean,
    noMargin: Boolean,
    focusManualBlurHandling: Boolean,
    defaultValue: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'unnamed'
    },
    focusHighlight: Boolean,
    fullWidth: Boolean
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
    }
  },
  created () {
    if (this.debounce) {
      this.reportValue = _.debounce(this.reportValue, 500)
    }
  },
  methods: {
    reportValue () {
      this.$emit('input', this.value)
    },
    checkInputType () {
      if (this.password) {
        return 'password'
      } else {
        return 'text'
      }
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
.text-input {
  background: $lighter-purple;
  font-size: 14px;
  border-radius: 15px;
  padding: 16px;
  margin-bottom: 16px;
  border: none;
  color: $desaturated-dimmest-purple;
  &::placeholder {
    color: $desaturated-dimmish-purple;
  }
  ::-moz-placeholder {
    opacity: 1;
  }
  &.fullWidth {
    width: calc(100% - 32px);
  }
  &.alternate {
    background: $lightest-purple;
  }
  &.noMargin {
    margin: 0;
  }
}
.text-input-label {
  display: block;
  margin-top: 16px;
  margin-bottom: 16px;
  color: $desaturated-lightest-purple;
}
.text-input-container {
  width: 100%;
}
</style>
