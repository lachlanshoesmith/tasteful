<template>
  <div
    class="text-input-container"
    :class="colourMode"
  >
    <div class="icon-container">
      <slot name="icon" />
    </div>
    <input
      :class="colourMode"
      v-bind="$attrs"
      class="text-input"
      :type="checkInputType()"
    >
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  props: { password: Boolean },
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
  &.dark {
    border: 1px hsl(252, 10%, 15%) solid;
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
  &.dark {
    color: hsl(252, 15%, 70%);
  }
}

.icon-container {
  height: 30px;
  padding-left: 5px;
  padding-top: 2.5px;
  padding-bottom: 2.5px;
  color: hsl(252, 5%, 40%);
}
</style>
