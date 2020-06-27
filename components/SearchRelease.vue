<template>
  <div class="release">
    <img class="release-image" :src="release.image" @click="redirectToRelease(release.id)">
    <paragraph>{{ release['artist-credit'][0].artist.name }} - {{ release.title }}</paragraph>
  </div>
</template>

<script>
import paragraph from '@/components/Paragraph.vue'

export default {
  name: 'SearchResult',
  components: {
    paragraph
  },
  props: {
    release: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    redirectToRelease (mbid) {
      this.$router.push({ path: '/release/' + mbid })
      this.$emit('changeSearching', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.release-image {
  max-width: 150px;
  border-radius: 15px;
  opacity: 1;
  transition: all 0.2s linear;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
}
</style>
