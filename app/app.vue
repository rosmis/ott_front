<script setup lang="ts">
useHead({
  title: 'OTT CMS assessment'
})

const open = useCookie<boolean>('sidebar-open', { default: () => true })
</script>

<template>
  <UApp>
    <div class="flex h-svh overflow-hidden">
      <AppSidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="h-(--ui-header-height) shrink-0 flex items-center px-4 border-b border-default">
          <UButton
            icon="i-lucide-panel-left"
            color="neutral"
            variant="ghost"
            aria-label="Toggle sidebar"
            @click="open = !open"
          />
        </div>
        <main class="flex-1 overflow-y-auto">
          <NuxtPage />
        </main>
      </div>
    </div>
  </UApp>
</template>
