<template>
  <main>
    <div class="index">
      <article-content>
        <paragraph-container>
          <paragraph>
            kind of working. didn't intend for that to be the case (as you can probably tell) but here we are!
          </paragraph>
          <nuxt-link to="/release/aa366795-92d7-4d67-91fa-6741f82a4858">
            this page should (mostly) work if you're logged in
          </nuxt-link>
          <paragraph>things that DON'T work:</paragraph>
          <ul>
            <li>proper display of reviews to other users</li>
            <li>ratings</li>
            <li>most things on this version</li>
          </ul>
          <paragraph>have fun poking around for as long as i keep it up, though! writing reviews should work fine btw.</paragraph>
        </paragraph-container>
      </article-content>
    </div>
  </main>
</template>

<script>
// @ is an alias to /src
import Paragraph from '~/components/Paragraph.vue'
import ArticleContent from '~/components/ArticleContent.vue'
import ParagraphContainer from '~/components/ParagraphContainer.vue'

export default {
  name: 'Index',
  components: {
    Paragraph,
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
