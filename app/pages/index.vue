<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

const filterParams = computed((): VideoFilters => ({
  'status[value]': filters.status,
  'whereCategoryId[value]': filters.category_id
}))

const filters = reactive<{ status: VideoStatus | undefined, category_id: number | undefined }>({
  status: undefined,
  category_id: undefined
})

const videos = computed((): Video[] => data.value?.data ?? [])

const formatDuration = (seconds: number | null): string => {
  if (seconds === null) return '—'

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const formatDate = (date: Date | null): string => {
  if (!date) return '—'

  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(date))
}

const columns: TableColumn<Video>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'duration', header: 'Duration' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'user', header: 'Published by' },
  { accessorKey: 'published_at', header: 'Published at' }
]

const { data: categories, status: statusCategories } = useFetchApi<ApiResponse<Category[]>>('api/categories', {
  immediate: true,
  query: filterParams.value
})

const { data, status } = useFetchApi<ApiResponse<Video[]>>('api/videos', {
  immediate: true
})
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold text-highlighted">
      Videos
    </h1>

    <UTable
      :data="videos"
      :columns="columns"
      :loading="status === 'pending'"
    >
      <template #status-cell="{ row }">
        <VideoStatusBadge :status="row.original.status" />
      </template>

      <template #duration-cell="{ row }">
        {{ formatDuration(row.original.duration) }}
      </template>

      <template #category-cell="{ row }">
        {{ row.original.category?.name ?? '—' }}
      </template>

      <template #user-cell="{ row }">
        {{ row.original.user?.name ?? '—' }}
      </template>

      <template #published_at-cell="{ row }">
        {{ formatDate(row.original.published_at) }}
      </template>
    </UTable>
  </div>
</template>
