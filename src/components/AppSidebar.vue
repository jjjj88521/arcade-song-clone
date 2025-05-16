<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import NavMain from '@/components/NavMain.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  Database,
  GalleryVerticalEnd,
  Home,
  ScrollText,
} from 'lucide-vue-next'

import GameSwitcher from '~/components/GameSwitcher.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const router = useRouter()

const games = [
  {
    name: 'Maimai',
    logo: GalleryVerticalEnd,
    url: '/maimai',
  },
]

const navMain = computed(() => [
  {
    title: '首頁',
    url: `/${router.currentRoute.value.params.game}`,
    icon: Home,
  },
  {
    title: '段位歌曲',
    url: `/${router.currentRoute.value.params.game}/rank`,
    icon: ScrollText,
  },
  {
    title: '歌曲一覽',
    url: `/${router.currentRoute.value.params.game}/songs`,
    icon: Database,
  },
])
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <GameSwitcher :games="games" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navMain" />
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
