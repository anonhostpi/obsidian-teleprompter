import { useControlFeature } from '@/features/control'
import {
  computed,
  type ComputedRef,
  type UnwrapNestedRefs,
  watch,
  type WritableComputedRef,
} from 'vue'
import type { ControlState, PluggableControl } from '@/features/control/types'
import type { Modify } from '@/utils/utility-types'
import { createInjectionState } from '@/utils/createInjectionState'
import { unref } from 'vue'
import { useControlComponents } from '@/features/control/hooks/useControlComponents'

type TypedSettingItemStore<State> = Modify<
  ReturnType<typeof useDefaultControlStore>,
  {
    state: WritableComputedRef<UnwrapNestedRefs<State>>
    defaults: ComputedRef<UnwrapNestedRefs<State>>
  }
>

const [useProvideControlStore, useDefaultControlStore] = createInjectionState(
  (idOrControl: string | PluggableControl) => {
    const store = useControlFeature().useStore()
    const control = computed(() =>
      typeof idOrControl === 'string'
        ? store.plugins[idOrControl]
        : idOrControl,
    )

    const state = computed({
      get: () => control.value?.state,
      set: (value) => {
        control.value.state = value
      },
    })

    return {
      control,
      id: control.value.id,
      icon: computed(() => control.value?.icon),
      type: computed(() => control.value.type),
      defaults: computed(() => control.value.defaults),
      state,
      components: useControlComponents(control),
    }
  },
)

function useControlStore<State = ControlState>() {
  return useDefaultControlStore() as TypedSettingItemStore<State>
}

export { useProvideControlStore, useControlStore }