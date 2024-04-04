<script lang="ts">
import { defineComponent } from 'vue'
import { MaterialType } from './Material.vue'

export default defineComponent({
  name: 'CardGroupItem',
  props: {
    type: {
        type: String as PropType<MaterialType>,
        required: false,
        default: MaterialType.metal
    },
    elevation: {
      type: String,
      required: false,
      default: "1"
    },
    mobileElevation: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    icon: {
        type: String,
        required: false,
        default: "/img/user-icon.svg"
    },
    accentColorClass: {
      type: String,
      required: false,
      default: "bg-blue-200"
    },
    borderColorClass: {
      type: String,
      required: false,
      default: "border-divider"
    }
  },
  computed: {
    materialClass() {
        if(this.elevation != this.mobileElevation && this.mobileElevation) {
            return `md:bg-material-${this.type}-${this.elevation} bg-material-${this.type}-${this.mobileElevation}`
        }
        return `bg-material-${this.type}-${this.elevation}`
    },
  }
})
</script>
<template>
  <div class="card-group-item text-on-surface-high">
    <div :class="`overlay-hover overlay-hover-crystal-1 cursor-pointer flex flex-row gap-3 text-on-surface-medium text-sm rounded-xl border border-solid ${borderColorClass} p-4 ${materialClass}`">
      <!-- icon -->
      <div :class="`rounded-full w-[32px] h-[32px] min-w-[32px] flex items-center justify-center ${accentColorClass}`">
        <img :src="icon" alt="decorative icon">
      </div>
      <div class="flex flex-col">
        <h4 class="font-medium">
            {{ title }}
        </h4>
        {{ subtitle }}
      </div>
    </div>
    </div>
</template>

