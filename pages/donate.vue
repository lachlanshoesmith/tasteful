<template>
  <main class="about">
    <transition name="fade">
      <modal v-if="showModal" @closeModal="showModal = false">
        <template v-slot:left>
          <masthead centred>
            Donation destination
          </masthead>
          <paragraph>
            All of these are Australian organisations. We may donate to non-Australian organisations
            at some point in the future, but these are groups that we trust and usually have personal experience with,
            and as such can vouch for their quality.
          </paragraph>
        </template>
        <template v-slot:right>
          <paragraph-container>
            <subheading>November</subheading>
            <paragraph>
              In November, tasteful focuses on <strong>mental health</strong>, and why wouldn't we?  It's an incredibly
              poignant issue that deeply influences many members of the music community - both consumers and creators alike.
              <list>
                <li>
                  🦋 <a href="https://www.beyondblue.org.au/">Beyond Blue</a> - fantastic resource for seeking help for a wide variety of
                  mental illnesses.
                </li>
                <li>
                  🐕 <a href="https://www.blackdoginstitute.org.au/">Black Dog Institute</a> - pioneers research into mental health
                  and the treatment of such.
                </li>
              </list>
              If you need help urgently, please don't hesitate to contact your
              <a href="https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines">local crisis line</a>. 💜
            </paragraph>
          </paragraph-container>
        </template>
      </modal>
    </transition>
    <article-content>
      <masthead centred smaller full-width>
        Donate
      </masthead>
      <paragraph-container>
        <subheading>Thank you for even considering donating!</subheading>
        <paragraph>
          It truly means the world, and your donations will go to directly to the tasteful team,
          unless stated otherwise on the tier. Let's talk about how to unlock the full buffet of features tasteful has been cooking up over the last year or two.
        </paragraph>
      </paragraph-container>
    </article-content>
    <div id="tiers-container" :class="colourMode">
      <masthead smaller fit-width centred>
        Tiers
      </masthead>
      <div id="tiers">
        <!-- The order of the tiers changes on non-mobile screens. -->
        <div id="one-dollar-a-month" :class="colourMode" class="tier">
          <div class="tier-content">
            <subheading>$1<span :class="colourMode" class="money-amount">/mo</span> 🌙</subheading>
            <paragraph>
              The base tier has the following benefits...
              <list>
                <li>❌ Advertisements will be hidden.</li>
                <li>🌃 The infamous dark mode is available site-wide.</li>
              </list>
            </paragraph>
          </div>
        </div>
        <div id="two-dollars-a-month" :class="colourMode" class="tier">
          <div class="tier-content">
            <subheading>$2<span :class="colourMode" class="money-amount">/mo</span> 🔥</subheading>
            <paragraph>
              Get the same bonuses as the $1/mo folk, in addition to the following...
              <list>
                <li>🎨 Even more colour themes, such as Solarised.</li>
              </list>
            </paragraph>
          </div>
        </div>
        <div id="three-dollars-a-month" :class="colourMode" class="tier">
          <div class="tier-content">
            <subheading>$3<span :class="colourMode" class="money-amount">/mo</span> 🥰</subheading>
            <paragraph>
              Receive all the benefits of the other tiers, and...
              <list>
                <li>🎚️ Unlock every single customisation option for the website and make tasteful your own.</li>
                <li>✍️ More nuanced profile customisation, especially for blogs.</li>
                <li>🎤 Your posts are more likely to be promoted to other users.</li>
                <li>⭐ Receive the very special and cool Golden Supporter badge!</li>
                <li>😘 Know that you have my eternal gratitude.</li>
              </list>
            </paragraph>
            <subheading smaller>
              💸 One month free on annual plan
            </subheading>
          </div>
        </div>
      </div>
    </div>
    <hero
      no-padding
      inside-padding
      smaller-image
      no-definitive-height
      dont-show-right-on-mobile
    >
      <template v-slot:left>
        <subheading>
          The Care Package
        </subheading>
        <paragraph>
          The Care Package is, essentially, just a donation to express your gratitude.
          I know that it seems self-indulgent to put this as an option, but we really want to give the opportunity for our users to not
          only keep the doors open here, but to also unlock even more doors for the awesome open-source projects that keep tasteful
          working around-the-clock.
        </paragraph>
        <paragraph>
          In addition to those causes, every month a quarter of all Care Package donations goes to a specific cause.
          <!-- You can view our current destination <a @click="showModal = !showModal">here</a>. -->
        </paragraph>
        <paragraph>
          Donations will be split amongst the following <strong>every month</strong>:
          <list>
            <li>🙋‍♀️ The tasteful team.</li>
            <li>🧠 <a href="https://musicbrainz.org/">MusicBrainz</a></li>
            <li>👩‍💻 <a href="https://vuejs.org/">Vue.js</a></li>
          </list>
        </paragraph>
        <subheading smaller>
          💰 Starting from $5
        </subheading>
      </template>
      <template v-slot:right>
        <div>
          <img id="screenshot" src="@/assets/images/screenshot.png" alt="Screenshot of tasteful code.">
          <paragraph class="faded">
            I can see myself from here!
          </paragraph>
        </div>
      </template>
    </hero>
  </main>
</template>

<script>
// @ is an alias to /src
import masthead from '~/components/Masthead.vue'
import subheading from '~/components/Subheading.vue'
import articleContent from '~/components/ArticleContent.vue'
import paragraphContainer from '~/components/ParagraphContainer.vue'
import paragraph from '~/components/Paragraph.vue'
import modal from '~/components/Modal.vue'
import list from '~/components/List.vue'
import hero from '~/components/Hero.vue'

export default {
  name: 'Donate',
  components: {
    masthead,
    subheading,
    articleContent,
    paragraph,
    paragraphContainer,
    modal,
    list,
    hero
  },
  data () {
    return {
      showModal: false
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
.article-content {
  margin-left: auto;
  margin-right: auto;
}

#tiers-container {
  background: $quite-white;
  box-shadow: 0px -30px 50px $very-light-grey;
  padding-top: 10vh;
  padding-bottom: 10vh;
  padding-left: 3vw;
  padding-right: 3vw;
  margin-top: 6vh;
  transition: all 0.2s linear;
  .masthead {
    margin-left: auto;
    margin-right: auto;
  }
  &.dark {
    background: $quite-deep-black;
    box-shadow: 0px -30px 50px $dark-grey;
  }
  &.solarised-light {
    background: $solarised-light-secondary-background;
    box-shadow: 0px -30px 50px $solarised-light-main-background;
  }
  &.solarised-dark {
    background: $solarised-dark-secondary-background;
    box-shadow: 0px -30px 50px $solarised-dark-main-background;
  }
  &.black {
    background: $black;
    box-shadow: 0px -30px 50px $deep-black;
  }
}

#tiers {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.tier {
  background: #fff;
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  transition: all 0.2s linear;
  &.dark {
    background: hsl(249, 22%, 20%);
  }
  &.solarised-light {
    background: $solarised-light-main-background;
  }
  &.solarised-dark {
    background: $solarised-dark-main-background;
  }
  &.black {
    background: $deep-black;
  }
  .paragraph {
    &.dark {
      color: hsl(222, 10%, 80%);
    }
  }
}

.tier-content {
  padding: 3vh 3vw 3vh 3vw;
  width: 80%;
}

.money-amount {
  transition: all 0.2s linear;
  font-size: 1rem;
  margin-left: 3px;
  color: hsl(222, 28%, 45%);
  &.dark {
    color: hsl(222, 38%, 75%);
  }
}

#one-dollar-a-month {
  border-radius: 10px 0px 0px 10px;
}

#two-dollars-a-month {
  border-radius: 0px 10px 10px 0px;
}

#three-dollars-a-month {
  box-shadow: 3px 4px 50px hsla(252, 20%, 20%, 0.3);
  z-index: 1;
  border-radius: 20px;
  height: 70vh;
  &.dark {
    background: hsl(249, 22%, 30%);
  }
  &.solarised-dark,  &.solarised-light {
    outline: 1px $solarised-violet solid;
  }
  &.black {
    outline: 1px $quite-light-grey solid;
  }
}

#care-package {
  box-shadow: 3px 4px 50px hsla(252, 20%, 20%, 0.3);
  border-radius: 20px;
  height: fit-content;
  padding-bottom: 20px;
}

#care-package-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.faded {
  opacity: 0.8;
}

#screenshot {
  width: 70%;
  border-radius: 40px;
}

.fade-enter-active, .fade-leave-active {
  transition: all opacity 0.2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 1000px) {
  #tiers {
    display: block;
  }
  .tier, #three-dollars-a-month {
    height: 100%;
  }
  #one-dollar-a-month {
    border-radius: 10px 10px 0px 0px;
  }
  #two-dollars-a-month {
    background: $very-light-grey;
    border-radius: 0;
    &.dark {
      background: hsl(249, 22%, 30%);
    }
    &.solarised-light {
      background: $solarised-light-secondary-background;
    }
    &.solarised-dark {
      background: $solarised-dark-secondary-background;
    }
    &.black {
      background: $quite-deep-black;
    }
  }
  #three-dollars-a-month {
    box-shadow: none;
    z-index: 0;
    border-radius: 0px 0px 10px 10px;
    &.dark {
      background: hsl(249, 22%, 20%);
    }
    &.solarised-light {
      background: $solarised-light-secondary-background;
      outline: none;
    }
    &.solarised-dark {
      background: $solarised-dark-secondary-background;
      outline: none;
    }
    &.black {
      outline: none;
    }
  }
}

@media (min-width: 1000px) {
  // Whilst these could just be in the above, non-media-query CSS, I like doing this for clarity.
  #one-dollar-a-month {
    order: 1;
  }
  #two-dollars-a-month {
    order: 3;
  }
  #three-dollars-a-month {
    order: 2;
  }
}
</style>
