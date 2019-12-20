<template>
  <main class="roadmap">
    <article-content>
      <masthead centred smaller full-width>
        Roadmap
      </masthead>
      <paragraph-container>
        <subheading>Precursor</subheading>
        <paragraph>
          tasteful is a project that is continually improving over time, and it
          does so in a somewhat non-linear manner due to my personal life. In
          spite of that, this is a rough roadmap as to what the future of
          tasteful will look like.
        </paragraph>
        <paragraph>
          ⚠️
          <strong>Note:</strong> None of this is definitive. These stages may be pushed back, rearranged, and so on.
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <subheading>Q4 2019</subheading>
        <paragraph>
          <ul>
            <li>
              ✅ ✨
              <strong>Stage 0.1&nbsp;</strong>
              <a href="https://tasteful.reviews">tasteful.reviews</a> goes live.
            </li>
            <li>
              ✅ ⌨️
              <strong>Stage 0.2</strong> Preregistration opens, permitting
              users to reserve a username and receive a special badge upon
              launch.
            </li>
            <li>
              🕵️‍♀️
              <strong>Stage 0.3</strong> Album search functionality opens to the
              public.
            </li>
            <li>
              📊
              <strong>Stage 0.4</strong> Chartmaking support will be introduced
              in an alpha stage.
            </li>
          </ul>
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <paragraph>
          <subheading>Q1 2020</subheading>
          <ul>
            <li>
              ⭐
              <strong>Stage 0.5</strong>
              Ratings are completed. Hell Yeah!
            </li>
            <li>
              📝
              <strong>Stage 0.6</strong> Reviews are completed. Hell Yeah: The
              Sequel! Importing ratings and reviews will also be implemented at this time.
            </li>
            <li>
              🥳
              <strong>Stage 0.7</strong> tasteful opens to the general public in a
              beta stage, donations open.
            </li>
          </ul>
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <subheading>Q2 2020</subheading>
        <paragraph>
          <ul>
            <li>
              ✍️
              <strong>Stage 0.8</strong> Blogs are completed and open to the public.
            </li>
            <li>
              🔥
              <strong>Stage 1.0</strong> tasteful is officially fully released. It's
              not done, but it's ready for primetime!
            </li>
          </ul>
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <subheading>Onwards</subheading>
        <paragraph>
          <ul>
            <li>
              🤔
              <strong>TBD</strong> There are a lot more features that we're
              still racking our brains about. This page will be updated with
              more information as it is decided upon.
            </li>
            <li>
              😡
              <strong>Why is development so slow?</strong> It is likely that a
              lot of these goals will be achieved earlier than what it said
              here; I just want to give plenty of redundancy in case something
              takes longer than expected. It's also worth mentioning that
              development will slow heavily throughout 2020 as I enter my final
              year of high school.
            </li>
          </ul>
        </paragraph>
      </paragraph-container>
    </article-content>
  </main>
</template>

<script>
// @ is an alias to /src
import masthead from '~/components/Masthead.vue'
import subheading from '~/components/Subheading.vue'
import articleContent from '~/components/ArticleContent.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import paragraph from '~/components/Paragraph.vue'

export default {
  name: 'Roadmap',
  components: {
    masthead,
    subheading,
    articleContent,
    paragraph,
    paragraphContainer
  }
}
</script>

<style lang="scss" scoped>
.roadmap {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}
</style>
