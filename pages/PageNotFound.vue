<template>
  <div class="index">
    <main>
      <resize-observer @notify="handleResize" />
      <masthead
        :fullWidth="isFullWidth"
      >
        There's nothing here. Sorry if you expected otherwise.
      </masthead>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import masthead from '~/components/Masthead.vue'

export default {
  name: 'Index',
  components: {
    masthead
  },
  data () {
    return {
      isFullWidth: 0
    }
  },
  mounted () {
    this.handleResize()
  },
  methods: {
    handleResize () {
      if (document.body.clientWidth < 1000) {
        this.isFullWidth = true
      } else {
        this.isFullWidth = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100vw;
  padding-left: 3vw;
  padding-right: 3vw;
}
main {
  width: 94vw;
}
</style>
