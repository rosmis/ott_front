<script setup lang="ts">
const { login } = useSanctumAuth()

const state = reactive({
  email: '',
  password: ''
})

const loading = ref<boolean>(false)
const errorMsg = ref<string>('')

async function onSubmit() {
  errorMsg.value = ''
  loading.value = true

  try {
    await login({
      email: state.email,
      password: state.password
    })
  } catch (err: any) {
    errorMsg.value
      = err.response._data.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h2 class="text-xl font-semibold text-center">
          Login
        </h2>
      </template>

      <UForm
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div
          v-if="errorMsg"
          class="text-sm text-red-500 text-center bg-red-50 p-2 rounded"
        >
          {{ errorMsg }}
        </div>

        <UInput
          v-model="state.email"
          type="email"
          placeholder="Email"
          autocomplete="email"
          required
          class="w-full"
        />

        <UInput
          v-model="state.password"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          required
          class="w-full"
        />

        <UButton
          type="submit"
          block
          color="primary"
          :loading="loading"
          :disabled="!state.email || !state.password"
        >
          Sign In
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
