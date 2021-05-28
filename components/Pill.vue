:<template>
  <div class="pill" :class="{alt, smaller}">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Pill',
  props: {
    alt: Boolean,
    smaller: Boolean
  }
}
</script>

<style lang="scss" scoped>
  .pill {
    background: $lighter-purple;
    border-radius: 10px;
    padding: 32px;
    &.alt {
      background: $lightest-purple;
    }
    &.smaller {
      padding: 16px;
    }
  }
</style>
