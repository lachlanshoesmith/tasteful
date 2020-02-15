<template>
  <main class="invite-container">
    <hero no-padding inside-padding bottom-margin smaller-image no-definitive-height>
      <template v-slot:left>
        <subheading no-top-margin>
          tasteful is slowly starting to open up to the public. If you've got an invite seed and code, you can join in!
        </subheading>
        <div id="input-container">
          <div id="text-input-container">
            <text-input v-model="inviteSeed" placeholder="Invite seed">
              <template v-slot:icon>
                <fingerprint-icon decorative title="Invite seed" />
              </template>
            </text-input>
            <text-input v-model="inviteCode" name="invite-code-input" placeholder="Invite code">
              <template v-slot:icon>
                <key-icon decorative title="Invite code" />
              </template>
            </text-input>
          </div>
          <div id="submit-input-container">
            <div class="submit-button" :class="colourMode">
              <chevron-right-icon :size="48" title="Apply for Invitation" />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:right>
        <div>Hello</div>
      </template>
    </hero>
    <div class="invite">
      <article-content>
        <paragraph-container>
          <subheading>What's an invite seed, an invite code, and an Invitation?</subheading>
          <paragraph>
            An <strong>invite seed</strong> is an eight-character set of alphanumeric characters that is used to significantly reduce the
            likelihood of a randomly-guessed invite code from being successful in developing an Invitation.
            If you're familiar with cryptography, this is a salt.
          </paragraph>
          <paragraph>
            An <strong>invite code</strong> is a code of randomly-generated words that is one of the two parts (the other being the invite seed)
            required in developing an Invitation.
          </paragraph>
          <paragraph>
            An <strong>Invitation</strong> is 'go-ahead' given by the tasteful code that offers the opportunity to sign up for the website.
            This go-ahead is generated following verification that when your invite seed and code are hashed in unison that they reach the same result
            as what is in our database.
          </paragraph>
        </paragraph-container>
        <paragraph-container>
          <subheading>How do I get an invite seed and code?</subheading>
          <paragraph>
            Invite codes are given out rarely to select members of the tasteful community.
            There is no way to get one other than to know somebody who has one and is generous enough to give it to you.
            It may only be used once.
          </paragraph>
        </paragraph-container>
        <paragraph-container>
          <subheading>Why is this all so complicated for seemingly no reason?</subheading>
          <paragraph>So losers like you don't get in.</paragraph>
        </paragraph-container>
      </article-content>
    </div>
  </main>
</template>

<script>
import FingerprintIcon from 'vue-material-design-icons/Fingerprint.vue'
import KeyIcon from 'vue-material-design-icons/Key.vue'
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue'
import ArticleContent from '~/components/ArticleContent.vue'
import ParagraphContainer from '~/components/ParagraphContainer.vue'
import Paragraph from '~/components/Paragraph.vue'
// import Masthead from '~/components/Masthead.vue'
import TextInput from '~/components/TextInput.vue'
import Subheading from '~/components/Subheading.vue'
import Hero from '~/components/Hero.vue'

export default {
  name: 'Invite',
  components: {
    FingerprintIcon,
    KeyIcon,
    ChevronRightIcon,
    TextInput,
    ArticleContent,
    ParagraphContainer,
    Paragraph,
    // Masthead,
    Subheading,
    Hero
  },
  data () {
    return {
      inviteSeed: '',
      inviteCode: ''
    }
  },
  computed: {
    colourMode () {
      return this.$store.state.theme.colourMode
    }
  },
  methods: {
    testHash () {
      // const toHash = this.inviteSeed + this.inviteCode
    }
  }
}
</script>

<style lang="scss" scoped>
.invite {
  padding-left: 3vw;
  padding-right: 3vw;
  display: flex;
  justify-content: center;
  padding-bottom: 3vh;
}

.text-input-container {
  width: 95%;
}

#input-container {
  display: flex;
  width: 80%;
}

#text-input-container {
  flex-basis: 90%;
}

#submit-input-container {
  flex-basis: 10%;
}

.submit-button {
  background: none;
  border: none;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $soft-red;
  transition: all 0.2s linear;
}
</style>
