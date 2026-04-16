<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const { isAuthenticated, logout } = useSanctumAuth()
const user = useSanctumUser<User>()

const open = useCookie<boolean>('sidebar-open', { default: () => true })

const navItems: NavigationMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/'
  }
]
</script>

<template>
  <USidebar
    v-model:open="open"
    collapsible="icon"
    rail
    :ui="{ container: 'h-full' }"
  >
    <template #header>
      <p>OTT CMS assessment</p>
    </template>

    <template #default>
      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        :ui="{ link: 'p-1.5 overflow-hidden' }"
      />
    </template>

    <template #footer="{ state }">
      <template v-if="isAuthenticated">
        <UAvatar
          :alt="user?.name"
          size="sm"
          class="shrink-0"
        />
        <span
          v-if="state === 'expanded'"
          class="flex-1 min-w-0 text-sm font-medium text-highlighted truncate"
        >
          {{ user?.name }}
        </span>
        <UButton
          v-if="state === 'expanded'"
          icon="i-lucide-log-out"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Logout"
          class="shrink-0"
          @click="logout()"
        />
      </template>
    </template>
  </USidebar>
</template>
