<template>
  <div class="dropdown-container">
    <label class="dropdown-label" :for="name">
      <slot />
    </label>
    <select
      v-model="value"
      :name="name"
      :class="[{placeholder}, colourMode]"
      v-bind="$attrs"
      class="dropdown"
      @change="reportValue"
    >
      <option disabled>
        {{ descriptionValue }}
      </option>
      <option v-for="option in options" :key="option.id">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    defaultValue: {
      type: String,
      default: ''
    },
    descriptionValue: {
      type: String,
      default: ''
    },
    name: {
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
    },
    placeholder () {
      if (this.value === this.descriptionValue) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    if (this.descriptionValue) {
      this.value = this.descriptionValue
    } else if (this.defaultValue) {
      this.value = this.defaultValue
    } else {
      this.value = this.options[0]
    }
  },
  methods: {
    reportValue () {
      this.$emit('change', this.currentValue)
    }
  }
}
</script>

<style lang="scss" scoped>

.dropdown {
  appearance: none;
  background: $lighter-purple;
  color: $desaturated-dimmest-purple;
  font-size: 14px;
  width: 100%;
  border-radius: 10px;
  border: none;
  padding: 16px;
  &.placeholder {
    color: rgba($desaturated-dimmish-purple, 0.5); // opacity accounts for placeholder effect seen in some browsers
  }
}

.dropdown-label {
  display: block;
  margin-top: 16px;
  margin-bottom: 16px;
  color: $desaturated-lightest-purple;
}
</style>
