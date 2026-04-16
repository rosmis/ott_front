<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

const filters = reactive<{ status: VideoStatus | undefined, category_id: number | undefined }>({
  status: undefined,
  category_id: undefined
})

const filterParams = computed((): VideoFilters => ({
  'status[value]': filters.status ?? undefined,
  'whereCategoryId[value]': filters.category_id ?? undefined
}))

const videos = computed((): Video[] => data.value?.data ?? [])
const categories = computed((): Category[] => categoriesData.value?.data ?? [])

const statusOptions: { label: string, value: VideoStatus }[] = Array.from(videoStatusMapping.entries())
  .map(([key, value]) => ({ label: value.title, value: key }))
const categoryOptions = computed((): { label: string, value: number }[] => categories.value.map(c => ({ label: c.name, value: c.id })))

const columns: TableColumn<Video>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'duration', header: 'Duration' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'user', header: 'Published by' },
  { accessorKey: 'published_at', header: 'Published at' }
]

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

const { data: categoriesData } = useFetchApi<ApiResponse<Category[]>>('api/categories', {
  immediate: true
})

const { data, status } = useFetchApi<ApiResponse<Video[]>>('api/videos', {
  immediate: true,
  query: filterParams
})
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold text-highlighted">
      Videos
    </h1>

    <div class="flex items-center gap-3">
      <USelectMenu
        v-model="filters.status"
        :items="statusOptions"
        value-key="value"
        placeholder="All statuses"
        class="w-48"
        clear
      />
      <USelectMenu
        v-model="filters.category_id"
        :items="categoryOptions"
        value-key="value"
        placeholder="All categories"
        class="w-48"
        clear
      />
    </div>

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
