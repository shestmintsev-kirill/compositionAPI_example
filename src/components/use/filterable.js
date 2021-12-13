import { watch, reactive, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router'

export function useFilterable({ loadItems, initialFilters }) {
  const router = useRouter();

  const page = ref(1);
  const filters = reactive({
    ...initialFilters,
  });
  const items = ref([]);

  const updateHash = () => {
    if (page.value !== 1) {
      router.push({
        query: { page: page.value }
      })
    }
    Object.entries(filters).forEach((filter) => {
      if (filter[1]) {
        router.push({
          query: { page: page.value, categories: filter[1] }
        })
      }
    });
  };

  const load = () => {
    return loadItems({
      page: page.value,
      filters,
    }).then((result) => {
      items.value = result;
    });
  }

  watch(() => page.value, () => {
    updateHash();
    load();
  }
  );

  watch(() => filters, () => {
    updateHash();
    load();
  },
    { deep: true, }
  );

  load();
  onBeforeUnmount(() => {
    router.push({ query: {} })
  });

  return {
    nextPage: () => {
      page.value += 1;
    },
    prevPage: () => {
      page.value -= 1;
    },
    page,
    filters,
    items,
  };
}
