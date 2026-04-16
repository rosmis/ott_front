<script lang="ts" setup>
const { status } = defineProps<{ status: VideoStatus }>()

const colorMapping = new Map<VideoStatus, { color: 'success' | 'neutral' | 'warning', title: string }>([
  [VideoStatus.Published, {
    color: 'success',
    title: 'Published'
  }],
  [VideoStatus.Draft, {
    color: 'neutral',
    title: 'Draft'
  }],
  [VideoStatus.Archived, {
    color: 'warning',
    title: 'Archived'
  }]
])
</script>

<template>
  <UBadge
    :color="colorMapping.get(status)?.color ?? 'neutral'"
    variant="subtle"
    class="capitalize"
  >
    {{ colorMapping.get(status)?.title ?? status }}
  </UBadge>
</template>
