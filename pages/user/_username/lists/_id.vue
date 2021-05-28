<template>
  <div class="list-page" style="width: 50%; padding-left: 25%; padding-right: 25%;">
    <masthead>{{ list.name }}</masthead>
    <subheading smaller>
      By {{ listCreator.username }}
    </subheading>
    <paragraph>{{ list.description }}</paragraph>
    <release-list show-descriptions :list-items="list.releases" />
  </div>
</template>

<script>
import masthead from '~/components/Masthead'
import subheading from '~/components/Subheading'
import paragraph from '~/components/Paragraph'
import releaseList from '~/components/ReleaseList'

export default {
  name: 'List',
  components: {
    masthead,
    subheading,
    paragraph,
    releaseList
  },
  data () {
    return {
      list: {},
      listCreator: {
        username: ''
      }
    }
  },
  mounted () {
    const username = this.$route.params.username
    this.listCreator.username = username
    const usernames = this.$fire.firestore.collection('usernames')
    // get list creator uid
    usernames.doc(username)
      .get()
      .then((doc) => {
        const listCreatorID = doc.data().uid
        this.getListCreatorInformation(listCreatorID)
      })
  },
  methods: {
    getListCreatorInformation (listCreatorID) {
      const users = this.$fire.firestore.collection('users')
      const listID = this.$route.params.id
      const list = users.doc(listCreatorID).collection('lists').doc(listID)
      list
        .get()
        .then((doc) => {
          this.list = doc.data()
        })
    }
  }
}
</script>
