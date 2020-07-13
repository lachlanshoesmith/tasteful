<template>
  <div :class="[colourMode]" class="artist">
    <div>
      <div
        id="artist-image"
        class="artist-image"
        :style="generateArtistImageStyle(artist.imageURL, artist.imageURLLowRes)"
      />
      <paragraph soft smaller class="artist-release-name">
        {{ selectedRelease }}
      </paragraph>
    </div>
    <div>
      <!-- <span class="artist-name" :style="calculateDynamicColours('artist-name', artist)">{{ artist.name }}</span> -->
      <p class="artist-name">
        {{ artist.name }}
      </p>
      <div class="tags">
        <!-- <tag v-for="tag in artist.tags" :key="tag.id" :style="{ backgroundColor: artist.imagePalette.DarkVibrant, color: artist.imagePalette.Vibrant }"> -->
        <tag v-for="tag in artist.tags" :key="tag.id">
          {{ tag.name }}
        </tag>
      </div>
      <div class="artist-releases">
        <div
          v-for="(release, name) in artist.releases"
          :key="name"
          class="artist-release"
          :style="{ 'background-image': 'url(' + release.image + ')'}"
          @mouseover="selectedRelease = release.title"
          @mouseleave="selectedRelease = ''"
          @click="redirectToRelease(release, name)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import tag from '@/components/Tag.vue'
import paragraph from '@/components/Paragraph.vue'

export default {
  name: 'SearchArtist',
  components: {
    tag,
    paragraph
  },
  props: {
    artist: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      selectedRelease: ''
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  methods: {
    redirectToRelease (release, mbid) {
      this.$store.commit('search/setRelease', release)
      this.$router.push({ path: '/release/' + mbid })
      this.$emit('changeSearching', false)
    },
    generateArtistImageStyle (image, imageLowRes) {
      if (image === 'artist-icon') {
        // if the artist does not have an image, return the default icon
        return { 'background-image': 'url("~assets/images/tasteful-artist-icon.svg")' }
      } else {
        return { 'background-image': `url('${image}'), url('${imageLowRes}')` }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.artist {
  background: rgba($quite-deep-black, 0.5);
  max-width: 500px;
  padding-right: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  display: flex;
  box-shadow: 0px 0px 50px;
  &.light {
    color: $quite-light-grey;
  }
  &.dark {
    color: $dark-grey;
  }
  &.black {
    color: $black;
  }
  &.solarised-light {
    color: $solarised-light-main-background;
  }
  &.solarised-dark {
    color: $solarised-dark-main-background;
  }
  .tags {
    color: #999;
  }
}
.artist-image {
  min-width: 150px;
  max-width: 150px;
  min-height: 150px;
  max-height: 150px;
  margin-right: 20px;
  // border-radius: 15px 0px 0px 15px;
  border-radius: 15px 0px 0px 0px;
  background-size: cover, cover;
}
.artist-name {
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
  color: white;
}
.artist-releases {
  display: flex;
  max-width: 100%;
  max-height: 20vh;
  overflow-y: auto;
  margin-top: 20px;
  flex-wrap: wrap;
}
.artist-release {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: all 0.2s linear;
  background-size: cover;
  opacity: 1;
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
}
.artist-release-name {
  padding-left: 5px;
  padding-right: 5px;
  line-height: 1.5;
}
</style>
