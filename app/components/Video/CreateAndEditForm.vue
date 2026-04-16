<script lang="ts" setup>
import { useRegleSchema } from '@regle/schemas'
import { z } from 'zod'

type VideoForm = z.infer<typeof videoSchema>

const { video } = defineProps<{
  video?: Video
}>()

const isEditMode = computed(() => !!video)

const router = useRouter()
const toast = useToast()
const { $api } = useNuxtApp()

const isLoading = ref<boolean>(false)
const statusOptions = Array.from(videoStatusMapping.entries()).map(([key, val]) => ({
  label: val.title,
  value: key
}))
const categoryOptions = computed(() =>
  (categoriesData.value?.data ?? []).map(c => ({ label: c.name, value: c.id }))
)

const fileSchema = (label: string) =>
  z.instanceof(File, { message: `${label} is required` })
    .refine(f => f.size > 0, `${label} file cannot be empty`)

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  thumbnail: isEditMode.value ? fileSchema('Thumbnail').optional() : fileSchema('Thumbnail'),
  video: isEditMode.value ? fileSchema('Video').optional() : fileSchema('Video'),
  status: z.enum(VideoStatus, { error: 'Status is required' }),
  category_id: z.number({ error: 'Category is required' }),
  slug: z.string()
})

const state = reactive<Partial<VideoForm>>({
  title: video?.title ?? '',
  description: video?.description ?? '',
  thumbnail: undefined,
  video: undefined,
  status: video?.status ?? undefined,
  category_id: video?.category_id ?? undefined,
  slug: video?.slug ?? ''
})

const { r$ } = useRegleSchema(state, videoSchema)

const onSubmit = async () => {
  const { valid, data } = await r$.$validate()
  if (!valid) return

  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('status', data.status)
  formData.append('category_id', String(data.category_id))
  formData.append('slug', data.slug)
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail)
  if (data.video) formData.append('video', data.video)

  if (video) {
    formData.append('_method', 'patch')
  }

  isLoading.value = true

  await $api('sanctum/csrf-cookie')

  try {
    await $api(`api/videos/${video?.id ?? ''}`, {
      method: 'POST',
      body: formData
    })
  } catch (err: any) {
    const error = err.response as ApiError

    toast.add({
      title: 'Error',
      description: error?._data.message || `An error occurred while ${video ? 'updating' : 'creating'} the video. Please try again.`,
      icon: 'i-lucide-x',
      color: 'error'
    })
    return
  } finally {
    isLoading.value = false
  }

  toast.add({
    title: 'Success',
    description: video ? 'Video updated successfully.' : 'Video created successfully.',
    icon: 'i-lucide-check',
    color: 'success'
  })

  router.push({ name: 'index' })
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
      :error="r$.thumbnail?.$errors[0]"
    >
      <div class="space-y-2">
        <img
          v-if="video?.thumbnail_url && !r$.$value.thumbnail"
          :src="video.thumbnail_url"
          alt="Current thumbnail"
          class="h-32 w-auto rounded-md object-cover border border-default"
        >
        <UFileUpload
          v-model="r$.$value.thumbnail"
          accept="image/*"
          :label="video?.thumbnail_url ? 'Replace thumbnail' : 'Drop your thumbnail here'"
          description="PNG, JPG, WEBP"
          icon="i-lucide-image"
          class="w-full"
          @update:model-value="r$.thumbnail?.$touch()"
        />
      </div>
    </UFormField>

    <UFormField
      label="Video"
      :error="r$.video?.$errors[0]"
    >
      <div class="space-y-2">
        <div
          v-if="video?.video_url && !r$.$value.video"
          class="flex items-center gap-2 text-sm text-muted"
        >
          <UIcon
            name="i-lucide-video"
            class="shrink-0"
          />
          <span class="truncate">Current video on file</span>
          <UButton
            :to="video.video_url"
            target="_blank"
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-external-link"
          />
        </div>
        <UFileUpload
          v-model="r$.$value.video"
          accept="video/*"
          :label="video?.video_url ? 'Replace video' : 'Drop your video here'"
          description="MP4, MOV, AVI, MKV"
          icon="i-lucide-video"
          class="w-full"
          @update:model-value="r$.video?.$touch()"
        />
      </div>
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
        :loading="isLoading"
        :disabled="isLoading"
      >
        {{ video ? 'Update Video' : 'Create Video' }}
      </UButton>
    </div>
  </form>
</template>
