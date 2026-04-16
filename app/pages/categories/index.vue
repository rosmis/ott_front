<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

const columns: TableColumn<Category>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'is_published', header: 'Published' },
  { accessorKey: 'videos_count', header: 'Videos' }
]

const { data, status } = useFetchApi<ApiResponse<Category[]>>('api/categories', {
  immediate: true
})

const categories = computed((): Category[] => data.value?.data ?? [])
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold text-highlighted">
      Categories
    </h1>

    <UTable
      :data="categories"
      :columns="columns"
      :loading="status === 'pending'"
      sticky
    >
      <template #name-cell="{ row }">
        {{ row.original.name }}
      </template>

      <template #is_published-cell="{ row }">
        <UBadge
          :color="row.original.is_published ? 'success' : 'neutral'"
          variant="subtle"
        >
          {{ row.original.is_published ? 'Published' : 'Unpublished' }}
        </UBadge>
      </template>

      <template #videos_count-cell="{ row }">
        {{ row.original.videos_count }}
      </template>
    </UTable>
  </div>
</template>
