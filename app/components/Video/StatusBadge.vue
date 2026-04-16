<script lang="ts" setup>
const { status } = defineProps<{ status: VideoStatus }>()
</script>

<template>
  <UBadge
    :color="videoStatusMapping.get(status)?.color ?? 'neutral'"
    variant="subtle"
    class="capitalize"
  >
    {{ videoStatusMapping.get(status)?.title ?? status }}
  </UBadge>
</template>
