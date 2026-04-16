<script lang="ts" setup>
const { currentRoute } = useRouter()

const { data: currentVideo } = useFetchApi<ApiResponse<Video>>(`/api/videos/${currentRoute.value.params.id}`, {
  immediate: true
})
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold text-highlighted">
      Edit Video
    </h1>

    <VideoCreateAndEditForm
      v-if="currentVideo?.data"
      :video="currentVideo.data"
    />
  </div>
</template>
