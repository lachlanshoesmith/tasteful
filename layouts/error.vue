<template>
  <hero id="error" fullscreen narrow :background="release[2]">
    <header>
      <masthead>{{ release[0] + '!' }}</masthead>
      <paragraph no-bottom-margin>
        tasteful ran into a problem. Sorry about that.
      </paragraph>
      <paragraph no-top-margin soft>
        {{ error.message }}
      </paragraph>
      <regular-button type="primary" @pressed="$router.push('/')">
        Get me out of here!
      </regular-button>
    </header>
    <img
      v-if="release[2]"
      id="release-image"
      class="release-image"
      :src="release[2]"
      alt="Album artwork"
      @click="$router.push('/release/' + release[1])"
    >
  </hero>
</template>

<script>
import masthead from '~/components/Masthead.vue'
import paragraph from '~/components/Paragraph.vue'
import regularButton from '~/components/RegularButton.vue'
import hero from '~/components/Hero.vue'

export default {
  components: {
    masthead,
    paragraph,
    regularButton,
    hero
  },
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      release: {}
    }
  },
  mounted () {
    const errorAlbums = [
      ['The Queen is Dead', 'd8dde278-482c-3cc8-a530-fea70476f3a5'],
      ['You Won\'t Get What You Want', 'f276a738-90bc-4602-b14d-69754994bbc6'],
      ['We Can Be Stopped', '80cebcb2-da2a-3cc9-8f73-573b9908c5f5'],
      ['Everything\'s Fine', '31cf497b-5cf6-4663-8497-54a21fceb236'],
      ['Pain Is Beauty', '50ef8504-86ca-4f2f-b46f-006458e416f3'],
      ['Dragging a Dead Website Up a Hill', 'abcc21e4-16fc-31a3-864b-4d69ae81e2b4'],
      ['Die Lit', 'f7479a73-66a7-41be-9f77-9e70828a5809'],
      ['CrasH Talk', 'b875945a-5417-4ef5-b094-da4000bba964']
    ]
    const selectedAlbum = errorAlbums[Math.floor(Math.random() * errorAlbums.length)]
    this.release = selectedAlbum
    this.$axios
      .get(
        `https://us-central1-tasteful.cloudfunctions.net/getReleaseData?query=${selectedAlbum[1]}`
      )
      .then((res) => {
        this.release.push(res.data.image)
      })
  }
}
</script>

<style lang="scss" scoped>
.release-image {
  border-radius: 10px;
  box-shadow: 0px 0px 50px rgba($saturated-purple, 0.25);
  margin-left: auto;
  width: 300px;
  &:hover {
    cursor: pointer;
  }
}
.flex-container {
  display: flex;
}
</style>
