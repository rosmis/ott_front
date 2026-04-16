<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

const toast = useToast()
const { $api } = useNuxtApp()

const filters = reactive<VideoFilters>({
  status: undefined,
  category_id: undefined
})

const PAGE_SIZE = 10
const statusOptions: { label: string, value: VideoStatus }[] = Array.from(videoStatusMapping.entries())
  .map(([key, value]) => ({ label: value.title, value: key }))

const page = ref<number>(1)
const selectedVideoToDelete = ref<IndexVideo>()
const isDeleteModalOpen = ref<boolean>(false)
const isDeleting = ref<boolean>(false)

const filterParams = computed((): VideoFiltersParams => ({
  ...(filters.status && { 'status[value]': filters.status }),
  ...(filters.category_id && { 'whereCategoryId[value]': filters.category_id }),
  page: page.value,
  limit: PAGE_SIZE
}))

const categories = computed((): Category[] => categoriesData.value?.data ?? [])
const videos = computed((): IndexVideo[] => data.value?.data ?? [])
const total = computed(() => data.value?.meta.total ?? 0)
const categoryOptions = computed((): { label: string, value: number }[] => categories.value.map(c => ({ label: c.name, value: c.id })))

const columns: TableColumn<IndexVideo>[] = [
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

const confirmDelete = (video: IndexVideo) => {
  selectedVideoToDelete.value = video
  isDeleteModalOpen.value = true
}

const deleteVideo = async () => {
  if (!selectedVideoToDelete.value) return
  isDeleting.value = true

  try {
    await $api(`sanctum/csrf-cookie`)
    await $api(`api/videos/${selectedVideoToDelete.value.id}`, { method: 'DELETE' })
    toast.add({
      title: 'Deleted',
      description: `"${selectedVideoToDelete.value.title}" has been deleted.`,
      icon: 'i-lucide-trash-2',
      color: 'success'
    })
    isDeleteModalOpen.value = false
    selectedVideoToDelete.value = undefined

    await refresh()
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to delete the video. Please try again.',
      icon: 'i-lucide-x',
      color: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}

const { data: categoriesData } = useFetchApi<ApiResponse<Category[]>>('api/categories', {
  immediate: true
})

const { data, status, refresh } = useFetchApi<ApiResponsePaginated<IndexVideo[]>>('api/videos', {
  immediate: true,
  query: filterParams
})

watch(filters, () => {
  page.value = 1
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
        <div class="flex items-center justify-end gap-1">
          <UButton
            :to="{ name: 'videos-id-edit', params: { id: row.original.id } }"
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            @click="confirmDelete(row.original)"
          />
        </div>
      </template>
    </UTable>

    <div class="flex justify-end border-t border-default pt-4">
      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="PAGE_SIZE"
      />
    </div>

    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete Video"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <p class="text-sm text-muted">
          Are you sure you want to delete
          <span class="font-semibold text-highlighted">"{{ selectedVideoToDelete?.title }}"</span> ?
          This action cannot be undone.
        </p>
      </template>
      <template #footer>
        <UButton
          color="neutral"
          variant="outline"
          :disabled="isDeleting"
          @click="isDeleteModalOpen = false"
        >
          Cancel
        </UButton>
        <UButton
          color="error"
          :loading="isDeleting"
          @click="deleteVideo()"
        >
          Delete
        </UButton>
      </template>
    </UModal>
  </div>
</template>
