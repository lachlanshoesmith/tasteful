<template>
  <div class="bar">
    <span>
      <slot>Bar content</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Bar'
}
</script>

<style lang="scss" scoped>
.bar {
  position: fixed;
  width: 30vw;
  bottom: 4vh;
  background: $dimmish-purple;
  color: $lighter-purple;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0px 0px 32px $dimmer-purple;
  text-align: center;
}
</style>
