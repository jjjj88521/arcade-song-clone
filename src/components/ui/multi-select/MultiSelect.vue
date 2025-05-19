<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { filter } from 'lodash-es'
import { Check, ChevronsUpDown, X } from 'lucide-vue-next'

interface SelectItem {
  value: string
  name: string
}

interface Props {
  selectItems: SelectItem[]
  placeholder?: string
  search?: boolean
  inPortal?: boolean
  class?: string
}

const {
  selectItems,
  placeholder = '請選擇...',
  search = true,
  inPortal = false,
  class: className,
} = defineProps<Props>()

const model = defineModel<any[]>('modelValue')

const open = ref(false)

const selectedItems = computed(() => {
  return selectItems
    .filter(item => model.value?.includes(item.value))
    .map(item => item.name)
})

function handleSelect(itemValue: string) {
  const newSelected = model.value?.includes(itemValue)
    ? filter(model.value, v => v !== itemValue)
    : [...(model.value ?? []), itemValue]

  model.value = newSelected
}

function removeItem(itemValue: string) {
  const newSelected = filter(model.value, v => v !== itemValue)
  model.value = newSelected
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :class="cn(
          'flex w-full max-w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )"
      >
        <div class="flex flex-wrap gap-1">
          <template v-if="model?.length">
            <Badge
              v-for="item in selectedItems"
              :key="item"
              variant="secondary"
              class="mr-1"
            >
              {{ item }}
              <Button
                variant="ghost"
                size="icon"
                class="size-3 ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                @click.stop="removeItem(selectItems.find(i => i.name === item)?.value ?? '')"
              >
                <X class="size-3" />
              </Button>
            </Badge>
          </template>
          <span v-else class="text-muted-foreground">{{ placeholder }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Button
            v-if="model?.length"
            variant="ghost"
            size="icon"
            class="hover:bg-accent hover:text-accent-foreground rounded-full cursor-pointer size-4"
            @click.stop="model = []"
          >
            <X class="size-4" />
          </Button>
          <ChevronsUpDown class="size-4 shrink-0 opacity-50" />
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      side="top"
      :in-portal="inPortal"
      class="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 w-[var(--reka-popover-trigger-width)] overflow-hidden rounded-md border p-0 shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
    >
      <Command
        :filter="(value: string, search: string) => {
          const item = selectItems.filter(i => value?.includes(i.value))
          if (item[0]?.name.toLowerCase().includes(search.toLowerCase())) return 1
          return 0
        }"
      >
        <CommandInput v-if="search" placeholder="輸入關鍵字..." />
        <ScrollArea>
          <CommandEmpty>找不到相關選項</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="{ name, value } in selectItems"
                :key="value"
                :value="value"
                @select="handleSelect(value)"
              >
                <Check
                  :class="cn(
                    'mr-2 size-4',
                    model?.includes(value) ? 'opacity-100' : 'opacity-0',
                  )"
                />
                {{ name }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ScrollArea>
      </Command>
    </PopoverContent>
  </Popover>
</template>
