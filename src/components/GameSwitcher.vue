<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { ChevronsUpDown } from 'lucide-vue-next'

export interface Game {
  name: string
  logo: Component
  url: string
}

const props = defineProps<{
  games: Game[]
}>()

const { isMobile } = useSidebar()

const activeGame = ref<Game | null>(null)

const { path } = useRoute()

watch(
  () => path,
  (path) => {
    activeGame.value = props.games.find(game => game.url === path) || null
  },
  { immediate: true },
)
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <component :is="activeGame?.logo || 'div'" class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {{ activeGame?.name || '請選擇遊戲' }}
              </span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            音樂遊戲
          </DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(game) in games"
            :key="game.name"
            class="gap-2 p-2"
            as-child
            @click="activeGame = game"
          >
            <NuxtLink :to="game.url" class="flex gap-2 size-full items-center">
              <div class="flex size-6 items-center justify-center rounded-sm border">
                <component :is="game.logo" class="size-3.5 shrink-0" />
              </div>
              {{ game.name }}
            </NuxtLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
