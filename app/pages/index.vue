<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

const filters = reactive<VideoFilters>({
  status: undefined,
  category_id: undefined
})

const PAGE_SIZE = 10
const page = ref<number>(1)

const filterParams = computed((): VideoFiltersParams => ({
  ...(filters.status && { 'status[value]': filters.status }),
  ...(filters.category_id && { 'whereCategoryId[value]': filters.category_id }),
  page: page.value,
  limit: PAGE_SIZE
}))

const categories = computed((): Category[] => categoriesData.value?.data ?? [])
const videos = computed((): Video[] => data.value?.data ?? [])
const total = computed(() => data.value?.meta.total ?? 0)

const statusOptions: { label: string, value: VideoStatus }[] = Array.from(videoStatusMapping.entries())
  .map(([key, value]) => ({ label: value.title, value: key }))
const categoryOptions = computed((): { label: string, value: number }[] => categories.value.map(c => ({ label: c.name, value: c.id })))

const columns: TableColumn<Video>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'duration', header: 'Duration' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'user', header: 'Published by' },
  { accessorKey: 'published_at', header: 'Published at' },
  { id: 'actions', meta: { class: { td: 'text-right', th: 'text-right' } } }
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

watch(filters, () => {
  page.value = 1
})

const { data: categoriesData } = useFetchApi<ApiResponse<Category[]>>('api/categories', {
  immediate: true
})

const { data, status } = useFetchApi<ApiResponsePaginated<Video[]>>('api/videos', {
  immediate: true,
  query: filterParams
})
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-highlighted">
        Videos
      </h1>
      <UButton
        :to="{ name: 'videos-create' }"
        icon="i-lucide-plus"
        color="primary"
        variant="solid"
      >
        Add Video
      </UButton>
    </div>

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
      sticky
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

      <template #actions-cell="{ row }">
        <UButton
          :to="{ name: 'videos-id-edit', params: { id: row.original.id } }"
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="sm"
        />
      </template>
    </UTable>

    <div class="flex justify-end border-t border-default pt-4">
      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="PAGE_SIZE"
      />
    </div>
  </div>
</template>
