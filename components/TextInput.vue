<template>
  <div class="text-input-container">
    <label class="text-input-label" :for="name">
      <slot />
    </label>
    <input
      v-model="value"
      name=""
      :class="[colourMode]"
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
    focusManualBlurHandling: Boolean,
    defaultValue: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'unnamed'
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
  border: none;
  color: $desaturated-dimmest-purple;
  &::placeholder {
    color: $desaturated-dimmish-purple;
  }
}
.text-input-label {
  display: block;
  margin-bottom: 16px;
}
</style>
