<script setup lang="ts">
import { NuxtLink } from '#components'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { ChevronRight, type LucideIcon } from 'lucide-vue-next'

export interface NavItem {
  title: string
  url?: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

defineProps<{
  items: NavItem[]
}>()

const router = useRouter()

const { state } = useSidebar()
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <Collapsible
        v-for="item in items"
        :key="item.title"
        as-child
        :default-open="item.isActive"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger as-child class="cursor-pointer">
            <SidebarMenuButton :tooltip="item.title" size="lg" as-child>
              <component
                :is="item.url ? NuxtLink : 'div'"
                :to="item.url"
                :class="cn(item.url === router.currentRoute.value.path && '!font-bold', 'flex justify-center items-center gap-2')"
              >
                <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                <span v-show="state === 'expanded'" class="flex-1">{{ item.title }}</span>
              </component>
              <ChevronRight
                v-show="state === 'expanded'"
                v-if="item.items"
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent v-if="item.items">
            <SidebarMenuSub>
              <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                <SidebarMenuSubButton as-child>
                  <component :is="subItem.url ? NuxtLink : 'div'" :to="subItem.url">
                    <span>{{ subItem.title }}</span>
                  </component>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
