<template>
  <main>
    <hero
      no-padding
      inside-padding
      bottom-margin
      smaller-image
      no-definitive-height
      dont-show-right-on-mobile
    >
      <template v-slot:left>
        <subheading no-top-margin>
          The best online music community is getting closer to launch by the day.
        </subheading>
      </template>
      <template v-slot:right>
        <div>
          <img id="screenshot" src="@/assets/images/screenshot-index.png" alt="Screenshot of tasteful code.">
          <paragraph>
            I can see myself from here!
          </paragraph>
        </div>
      </template>
    </hero>
    <div class="index">
      <article-content>
        <paragraph-container>
          <subheading>When will tasteful open to the public?</subheading>
          <paragraph>
            I have <strong>no idea.</strong> tasteful is a very real product,
            however, and is open source - you can view the code
            <a target="_blank" href="https://github.com/lachlantula/tasteful">here</a>
            and track my progress. The vast majority of the stuff that is not yet
            available on the public website is still in development locally, and
            will be committed to the repository once tasteful is closer to launch.
            Contributions are greatly appreciated, however, and you will be
            rewarded accordingly with a 'Contributor' badge.
          </paragraph>
        </paragraph-container>
      </article-content>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import Subheading from '~/components/Subheading.vue'
import Paragraph from '~/components/Paragraph.vue'
import Hero from '~/components/Hero.vue'
import ArticleContent from '~/components/ArticleContent.vue'
import ParagraphContainer from '~/components/ParagraphContainer.vue'

export default {
  name: 'Index',
  components: {
    Subheading,
    Paragraph,
    Hero,
    ArticleContent,
    ParagraphContainer
  },
  data () {
    return {
      isFullWidth: false
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}

#screenshot {
  width: 70%;
}
</style>
