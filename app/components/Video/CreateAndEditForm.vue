<script lang="ts" setup>
import { useRegleSchema } from '@regle/schemas'
import { z } from 'zod'

type VideoForm = z.infer<typeof videoSchema>

const statusOptions = Array.from(videoStatusMapping.entries()).map(([key, val]) => ({
  label: val.title,
  value: key
}))
const categoryOptions = computed(() =>
  (categoriesData.value?.data ?? []).map(c => ({ label: c.name, value: c.id }))
)

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  thumbnail: z
    .instanceof(File, { message: 'Thumbnail is required' })
    .refine(f => f.size > 0, 'Thumbnail file cannot be empty'),
  video: z
    .instanceof(File, { message: 'Video file is required' })
    .refine(f => f.size > 0, 'Video file cannot be empty'),
  status: z.nativeEnum(VideoStatus, { error: 'Status is required' }),
  category_id: z.number({ error: 'Category is required' }),
  slug: z.string()
})

const state = reactive<Partial<VideoForm>>({
  title: '',
  description: '',
  thumbnail: undefined,
  video: undefined,
  status: undefined,
  category_id: undefined,
  slug: ''
})

const { r$ } = useRegleSchema(state, videoSchema)

async function onSubmit() {
  const { valid, data } = await r$.$validate()
  if (!valid) return
  // TODO: HTTP call
  console.log('valid form data', data)
}

const { data: categoriesData } = useFetchApi<ApiResponse<Category[]>>('api/categories', {
  immediate: true
})

watch(
  () => state.title,
  (val) => {
    state.slug = (val ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }
)
</script>

<template>
  <form
    class="space-y-6"
    @submit.prevent="onSubmit"
  >
    <UFormField
      label="Title"
      :error="r$.title.$errors[0]"
    >
      <UInput
        v-model="r$.$value.title"
        placeholder="Enter video title"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Slug"
      help="Auto-generated from the title, not editable."
    >
      <UInput
        :model-value="r$.$value.slug"
        readonly
        disabled
        placeholder="auto-generated"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Description"
      :error="r$.description.$errors[0]"
    >
      <UTextarea
        v-model="r$.$value.description"
        placeholder="Enter video description"
        :rows="4"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Status"
      :error="r$.status.$errors[0]"
    >
      <USelectMenu
        v-model="r$.$value.status"
        :items="statusOptions"
        value-key="value"
        placeholder="Select a status"
        class="w-full"
        @update:model-value="r$.status.$touch()"
      />
    </UFormField>

    <UFormField
      label="Category"
      :error="r$.category_id.$errors[0]"
    >
      <USelectMenu
        v-model="r$.$value.category_id"
        :items="categoryOptions"
        value-key="value"
        placeholder="Select a category"
        class="w-full"
        @update:model-value="r$.category_id.$touch()"
      />
    </UFormField>

    <UFormField
      label="Thumbnail"
      :error="r$.thumbnail.$errors[0]"
    >
      <UFileUpload
        v-model="r$.$value.thumbnail"
        accept="image/*"
        label="Drop your thumbnail here"
        description="PNG, JPG, WEBP"
        icon="i-lucide-image"
        class="w-full"
        @update:model-value="r$.thumbnail.$touch()"
      />
    </UFormField>

    <UFormField
      label="Video"
      :error="r$.video.$errors[0]"
    >
      <UFileUpload
        v-model="r$.$value.video"
        accept="video/*"
        label="Drop your video here"
        description="MP4, MOV, AVI, MKV"
        icon="i-lucide-video"
        class="w-full"
        @update:model-value="r$.video.$touch()"
      />
    </UFormField>

    <div class="flex justify-end gap-3">
      <UButton
        :to="{ name: 'index' }"
        color="neutral"
        variant="outline"
      >
        Cancel
      </UButton>
      <UButton
        type="submit"
        color="primary"
      >
        Create Video
      </UButton>
    </div>
  </form>
</template>
