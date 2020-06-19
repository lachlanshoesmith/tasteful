<template>
  <div :class="{noRightMargin}" class="checkbox-container-container-container-container-container">
    <label :class="[colourMode]" class="checkbox-container">
      <input :checked="checked" class="checkbox" type="checkbox" @change="emitCheckboxValue">
      <span class="checkmark" />
      <div class="content"><slot /></div>
    </label>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    noRightMargin: Boolean,
    checked: Boolean
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  methods: {
    emitCheckboxValue (event) {
      this.$emit('change', event.target.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-container-container-container-container-container {
  padding-left: 5px;
  margin-right: 15px;
  &.noRightMargin {
    margin-right: 0;
  }
}
.checkbox-container {
  &.light {
    color: $greyer-blue-dim;
  }
  &.dark {
    color: $greyer-blue;
  }
}
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.checkbox-container, .content {
  height: 25px;
}

.content {
  display: flex;
  align-items: center;
}

/* Hide the browser's default checkbox */
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background: $greyish-blue-dim;
  border-radius: 50%;
  transition: all 0.1s linear;
}
/* On mouse-over, add a grey background color */
.checkbox-container:hover input ~ .checkmark {
  background: $greyish-blue;
}

/* When the checkbox is checked, add a blue background */
.checkbox-container input:checked ~ .checkmark {
  background: $muted-green-dim;
}

/* On mouse-over, add a grey background color */
.checkbox-container:hover input:checked ~ .checkmark {
  background: $muted-green;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
</style>
