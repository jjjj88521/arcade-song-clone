<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

const table = defineModel<Table<TData>>('table', { required: true })

const { pageSize, pageIndex } = toRefs(table.value.getState().pagination)

const currentPageIndex = ref(pageIndex.value + 1)
</script>

<template>
  <div class="flex flex-col items-center justify-between gap-2 text-base lg:flex-row py-3 px-4 text-card-foreground shadow-sm bg-card/50 md:bg-white">
    <div class="hidden items-center gap-2 md:flex">
      <p class="whitespace-nowrap text-base">
        每頁筆數
      </p>
      <Select
        v-model="pageSize"
        @update:model-value="(value) => table.setPageSize(Number(value))"
      >
        <SelectTrigger>
          <SelectValue placeholder="每頁筆數" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="size in [10, 20, 30, 40, 50]"
            :key="size"
            :value="size"
          >
            {{ size }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="flex flex-col items-center lg:flex-row lg:gap-2 lg:space-x-8 mx-auto lg:mx-0">
      <Pagination
        v-slot="{ page }"
        v-model:page="currentPageIndex"
        :items-per-page="pageSize"
        :total="table.getRowCount()"
        :default-page="1"
        show-edges
        :sibling-count="1"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationFirst @click="table.setPageIndex(0)">
            <span class="sr-only">
              第一頁
            </span>
            <ChevronsLeft />
          </PaginationFirst>
          <PaginationPrevious @click="table.setPageIndex(pageIndex - 1)">
            <span class="sr-only">
              上一頁
            </span>
            <ChevronLeftIcon />
          </PaginationPrevious>

          <template v-for="(item, index) in items">
            <PaginationItem
              v-if="item.type === 'page'"
              :key="index"
              class=""
              :value="item.value"
              :is-active="item.value === page"
              @click="() => table.setPageIndex(item.value - 1)"
            >
              {{ item.value }}
            </PaginationItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext @click="() => table.setPageIndex(pageIndex + 1)">
            <span class="sr-only">
              下一頁
            </span>
            <ChevronRightIcon />
          </PaginationNext>
          <PaginationLast @click="() => table.setPageIndex(table.getPageCount() - 1)">
            <span class="sr-only">
              最後一頁
            </span>
            <ChevronsRight />
          </PaginationLast>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>

<style scoped>

</style>
