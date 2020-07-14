<template>
  <div class="release">
    <img v-if="release.image !== 'no-artwork'" class="release-image" :src="release.image" @click="redirectToRelease(release.id)">
    <div v-else class="release-image no-artwork" @click="redirectToRelease(release.id)">
      <span class="release-title-artworkless">{{ release.title }}</span>
    </div>
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
      this.$store.commit('search/setRelease', this.release)
      this.$router.push({ path: '/release/' + mbid })
      this.$emit('changeSearching', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.release-image {
  width: 150px;
  height: 150px;
  border-radius: 15px;
  opacity: 1;
  transition: all 0.2s linear;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
}
.no-artwork {
  background: $tasteful-gradient;
  display: flex;
  justify-content: center;
  align-items: center;
}
.release-title-artworkless {
  color: $snow-white;
  font-size: 1.5rem;
  max-width: 100px;
  max-height: 100px;
  word-wrap: break-word;
  text-align: center;
}
</style>
