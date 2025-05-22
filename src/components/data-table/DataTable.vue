<script setup lang="ts" generic="TData">
import { cn } from '@/lib/utils'
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type SortingState,
  useVueTable,
  type VisibilityState,
} from '@tanstack/vue-table'
import { useElementSize } from '@vueuse/core'
import { keyBy, values } from 'lodash-es'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { valueUpdater } from '../ui/table/utils'
import DataTablePagination from './DataTablePagination.vue'

interface Props<TData> {
  columns: ColumnDef<TData, any>[]
  data?: TData[]
  isLoading: boolean
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
  class?: string
}

const props = defineProps<Props<any>>()

const emit = defineEmits<{
  'update:forceUpdate': []
  'update:mutate': []
}>()
const pagination = defineModel<PaginationState>('pagination', { required: true })
const sorting = defineModel<SortingState>('sorting', { required: true })
const columnFilters = defineModel<ColumnFiltersState>('columnFilters', { required: true })

const tableWrapperRef = ref<HTMLElement>()
const { width, height } = useElementSize(tableWrapperRef)
const rowSelection = ref({})
const columnVisibility = ref<VisibilityState>({})

const table = useVueTable({
  get data() {
    return props.data ?? []
  },
  get columns() {
    return props.columns
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get pagination() {
      return pagination.value
    },
    get columnFilters() {
      return columnFilters.value
    },
  },
  enableColumnFilters: true,
  onPaginationChange: updater => valueUpdater(updater, pagination),
  enableRowSelection: true,
  onRowSelectionChange: updater => valueUpdater(updater, rowSelection),
  onSortingChange: updater => valueUpdater(updater, sorting),
  onColumnFiltersChange: updater => valueUpdater(updater, columnFilters),
  onColumnVisibilityChange: updater => valueUpdater(updater, columnVisibility),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getRowId: props.getRowId,
})

watch(rowSelection, () => {
  emit('update:forceUpdate')
})

const toolbarContext = computed(() => ({
  selectedRows: table.getSelectedRowModel().rows.map(row => row.original),
  totalRows: table.getRowCount(),
  filters: columnFilters.value,
  onFilter: (field: string, value: string) => {
    const newFilter = { id: field, value }
    const filtersById = keyBy([...columnFilters.value, newFilter], 'id')
    columnFilters.value = values(filtersById)
  },
  resetFilter: () => {
    table.resetColumnFilters()
    pagination.value = { ...pagination.value, pageIndex: 0 }
  },
  refresh: async () => {
    emit('update:mutate')
  },
}))

defineExpose({
  rowSelection: computed(() => table.getSelectedRowModel().rows.map(row => row.original)),
  resetSelection: () => {
    table.resetRowSelection(false)
  },
})
</script>

<template>
  <Tabs default-value="table">
    <TabsContent value="table">
      <div class="space-y-4">
        <div
          ref="tableWrapperRef"
          class="relative overflow-hidden rounded-lg border border-card"
        >
          <slot
            v-if="$slots.default"
            :context="toolbarContext"
          />
          <Table :class="cn('h-[65vh]', props.class)">
            <TableHeader>
              <TableRow
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
              >
                <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                >
                  <div
                    v-if="!header.isPlaceholder"
                    :class="header.column.getCanSort()
                      ? 'cursor-pointer select-none flex items-center justify-center'
                      : 'flex items-center justify-center'"
                    :style="{
                      minWidth: header.getSize() !== 150 ? header.getSize() : undefined,
                    }"
                    @click="header.column.getCanSort() ? header.column.toggleSorting() : undefined"
                  >
                    <component
                      :is="header.column.columnDef.header"
                      v-bind="header.getContext()"
                    />
                    <span
                      v-if="header.column.getCanSort()"
                      class="ml-2"
                    >
                      <ChevronUp
                        v-if="header.column.getIsSorted() === 'asc'"
                        class="h-4 w-4"
                      />
                      <ChevronDown
                        v-else-if="header.column.getIsSorted() === 'desc'"
                        class="h-4 w-4"
                      />
                      <ChevronUp
                        v-else
                        class="h-4 w-4 opacity-0"
                      />
                    </span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() && 'selected'"
              >
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                >
                  <component
                    :is="cell.column.columnDef.cell"
                    v-bind="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
            <tbody v-else>
              <tr>
                <td
                  class="absolute left-1/2 top-1/2 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                  :style="{ width, height: height - (56 + 56 + 73 + 20) }"
                >
                  <p>{{ isLoading ? '正在載入中...' : '查無相關資料。' }}</p>
                </td>
              </tr>
            </tbody>
          </Table>
          <DataTablePagination
            v-model:table="table"
          />
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
