:<template>
  <div class="pill">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Pill'
}
</script>

<style lang="scss" scoped>
  .pill {
    background: $lighter-purple;
    border-radius: 10px;
    padding: 32px;
  }
</style>
