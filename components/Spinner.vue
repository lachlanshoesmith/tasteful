<template>
  <div class="spinner" />
</template>

<script>
export default {
  name: 'Spinner'
}
</script>

<style lang="scss" scoped>
.spinner {
  border: 2px solid $saturated-purple-dim;
  border-top: 2px solid $saturated-purple;
  border-radius: 50%;
  width: 1vw;
  height: 1vw;
  animation: spin 1s linear infinite;
  margin: auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
