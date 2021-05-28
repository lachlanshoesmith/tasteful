<template>
  <div class="profile-picture" :class="[{noClick}, size]" :style="{'background-image': `url(${url}`}" @click="sendToDestination" />
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
    },
    username: {
      type: String,
      default: ''
    },
    noClick: Boolean,
    release: {
      type: String,
      default: ''
    }
  },
  methods: {
    sendToDestination () {
      if (this.noClick) {
        return false
      } else if (this.release) {
        this.$router.push({ path: `/release/${this.release}` })
      } else {
        this.$router.push({ path: `/user/${this.username}` })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-picture {
  background-size: cover;
  border-radius: 10px;
  transition: opacity 0.2s linear;
  &.small {
    width: 32px;
    height: 32px;
  }
  &.medium {
    width: 64px;
    height: 64px;
  }
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &.noClick {
    &:hover {
      cursor: default;
      opacity: 1;
    }
  }
}
</style>
