<template>
  <div class="bar" :class="[{visible}]">
    <span>
      <slot>Bar content</slot>
    </span>
    <div class="prompt-container">
      <div class="prompt">
        <regular-button type="primary">
          Yes
        </regular-button>
        <regular-button type="primary">
          No
        </regular-button>
        <regular-button type="primary">
          Update
        </regular-button>
      </div>
    </div>
  </div>
</template>

<script>
import regularButton from '~/components/RegularButton'

export default {
  name: 'Bar',
  components: {
    regularButton
  },
  props: {
    visible: Boolean
  }
}
</script>

<style lang="scss" scoped>
.bar {
  position: fixed;
  width: 30vw;
  bottom: -8vh;
  background: $dimmish-purple;
  color: $lighter-purple;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0px 0px 32px $dimmer-purple;
  text-align: center;
  left: calc(50vw - (30vw / 2) - 16px);
  transition: bottom 0.2s ease-in-out;
  z-index: 999; // the highest!
  &.visible {
    bottom: 4vh;
  }
  .prompt-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 8px;
  }
  .prompt {
    display: flex;
  }
}
</style>
