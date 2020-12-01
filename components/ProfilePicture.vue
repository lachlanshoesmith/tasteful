<template>
  <div class="profile-picture" :class="[size]" :style="{'background-image': `url(${url}`}" />
</template>

<script>
export default {
  name: 'ProfilePicture',
  props: {
    url: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-picture {
  background-size: cover;
  border-radius: 10px;
  &.small {
    width: 32px;
    height: 32px;
  }
  &.medium {
    width: 64px;
    height: 64px;
  }
}
</style>
