<template>
  <main class="about">
    <article-content>
      <masthead centred smaller full-width>
        About tasteful
      </masthead>
      <paragraph-container>
        <subheading>What is tasteful?</subheading>
        <paragraph>
          tasteful is a platform that allows you to rate, review, and catalog
          your music collection. Although the platform is comparable to the
          (fantastic!) websites
          <a href="https://rateyourmusic.com">Rate Your Music</a> and
          <a href="https://albumoftheyear.org">Album of the Year</a>, it
          differentiates itself through its comprehensive array of additional
          features, including blogging.
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <subheading>Why should I choose tasteful?</subheading>
        <paragraph>
          You don't have to; there's nothing stopping you from using multiple
          services! tasteful is, at this stage, a passion project.
        </paragraph>
        <paragraph>
          Having said that, here's some reasons as to why you
          <em>should</em> consider trying us out:
        </paragraph>
        <list>
          <li>🦉 Dark mode.</li>
          <li>📝 Blog-like profiles.</li>
          <li>👨‍👩‍👧 A tight-knit, small community.</li>
          <li>🎨 An intuitive, vibrant interface.</li>
          <li>🕵️‍♀️ An easy-to-use but powerful search engine.</li>
          <li>
            📊 Built-in chart making, akin to 'topsters'.
            <list>
              <li>
                🤖 This process can be automated, and may use data from your
                ratings.
              </li>
            </list>
          </li>
          <li>
            🎼 Comprehensive databases.
            <list>
              <li>
                👩‍🏫 tasteful's music database stems from pre-existing sources,
                unlike similar solutions.
              </li>
            </list>
          </li>
        </list>
      </paragraph-container>
      <paragraph-container>
        <subheading>
          How can I import my ratings/reviews from AOTY or RYM?
        </subheading>
        <paragraph>
          At one point, the answer to this was a resounding no, but following some research, importing both ratings and reviews from RYM will be possible without violating their terms of service. tasteful can't guarantee migration from AOTY, but we're still looking into it.
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <subheading>When does it open?</subheading>
        <paragraph>
          I have <strong>no idea.</strong> tasteful is a very real product,
          however, and is open source - you can view the code
          <a href="https://github.com/lachlantula/tasteful">here</a>
          and track my progress. The vast majority of the stuff that is not yet
          available on the public website is still in development locally, and
          will be committed to the repository once tasteful is closer to launch.
          Contributions are greatly appreciated, however, and you will be
          rewarded accordingly with a 'Contributor' badge.
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <subheading>How much does it cost?</subheading>
        <paragraph>
          tasteful will be largely free. Users may pay more for some additional
          features, but they are mostly customisation-based. We will be
          publishing more information regarding pricing in the near future, but
          there will be three tiers, ranging from a $1 to $3 subscription,
          renewed on a monthly basis. Lower-tier benefits may include an ad-free
          interface, while higher tiers may get additional promotion for their
          reviews.
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <subheading>
          If tasteful is open-source, couldn't somebody fork it and make a free
          version?
        </subheading>
        <paragraph>
          Yes, and this is something I've considered. If tasteful does take
          off, this is incredibly likely to occur but I will not be changing my
          stance as I believe in open-source software, in addition to the
          goodness of the community in that those who think tasteful is a good
          product will be willing to donate - a very generous act, mind you!
          Again, I'm not expecting tasteful to be popular - let alone for anyone
          to be willing to pay, frankly - but this website is not free to run,
          and it takes up a lot of my time to develop. Your interest alone in
          this service means the world to me, and I am eternally grateful.
          💜
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <subheading>Does tasteful have a crowdfunding campaign?</subheading>
        <paragraph>
          No, and it never will. tasteful is something that I - Lachlan - am
          trying to consistently work on, but I simply cannot guarantee release
          dates and certain content; I am in my final year of schooling and,
          frankly, I shouldn't have time to work on this. Alas, I do, but that
          time is fragile. I also don't believe that it's fair that you should
          pay for a non-tangible product, especially one that will be that way
          for quite some time.
        </paragraph>
      </paragraph-container>
      <paragraph-container>
        <subheading>Who worked on tasteful?</subheading>
        <paragraph>
          tasteful is the work of a community who are looking for the perfect
          place to discuss music. A place which is friendly and welcoming to
          both those knowledgeable or the people looking to listen to more
          music. Here are some of the main people involved in the
          project:
        </paragraph>
        <list>
          <li>
            👩‍💻 <a href="https://twitter.com/lachlantula">Lachlan</a> -
            development, designing
          </li>
          <li>
            👩‍🎨 <a href="https://twitter.com/kolbbbbb">Kol</a> - icon design
          </li>
          <li>
            🤗 Everyone who used to follow
            <a
              href="https://twitter.com/tastefulreviews"
            >our Twitter account</a>. RIP.
          </li>
        </list>
        <paragraph>
          tasteful's database is powered by <a href="https://musicbrainz.org">MusicBrainz</a> as well as <a href="https://www.wikidata.org">Wikidata</a>.
        </paragraph>
        <paragraph>
          tasteful was developed on the land of the Darug people of modern-day Sydney, who are the traditional custodians and the Traditional Owners of the land on which we
          developed this software, who we acknowledge with great respect. We also pay our respects to Elders past and present, and acknowledge the Aboriginal people for their custodianship of this land,
          who have long before us lived, loved, and raised their children on this land.
          <br>
          Please be aware that tasteful may feature the names, images, and voices of deceased people.
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
import list from '~/components/List.vue'

export default {
  name: 'About',
  components: {
    masthead,
    subheading,
    articleContent,
    paragraph,
    paragraphContainer,
    list
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  }
}
</script>

<style lang="scss" scoped>
.about {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}
</style>
