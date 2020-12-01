<template>
  <div class="text-area-container" :class="{fullWidth}">
    <label class="text-area-label" :for="name">
      <slot />
    </label>
    <textarea
      v-model="value"
      :name="name"
      :class="[{fullWidth}, colourMode]"
      v-bind="$attrs"
      class="text-area"
      :readonly="disabled"
      @input="reportValue"
      @focus="reportFocus(true)"
      @blur="reportFocus(false)"
    />
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'TextArea',
  props: {
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
.text-area {
  background: $lighter-purple;
  font-size: 14px;
  border-radius: 15px;
  padding: 16px;
  margin-bottom: 16px;
  border: none;
  color: $desaturated-dimmest-purple;
  resize: none;
  line-height: 1.5;
  min-height: 128px;
  &::placeholder {
    color: $desaturated-dimmish-purple;
  }
  ::-moz-placeholder {
    opacity: 1;
  }
  &.fullWidth {
    width: 100%;
  }
}
.text-area-label {
  display: block;
  margin-top: 16px;
  margin-bottom: 16px;
  color: $desaturated-lightest-purple;
}
.text-area-container {
  &.fullWidth {
    width: 100%;
  }
}
</style>
