<script lang="ts" setup>
const { isAuthenticated, logout } = useSanctumAuth()
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <template #right>
      <template v-if="isAuthenticated">
        <UButton
          label="Logout"
          icon="i-lucide-log-out"
          color="neutral"
          variant="ghost"
          @click="logout()"
        />
      </template>
    </template>
  </UHeader>
</template>
