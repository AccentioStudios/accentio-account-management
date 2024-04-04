<script lang="ts">
import type { PropType } from 'vue';

export enum MaterialType {
    topaz='topaz',
    metal='metal',
    crystal='crystal',
}

 export default {
    name: 'Material',
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
        }
    },
    computed: {
        materialClass() {
            return `bg-material-${this.type}-${this.elevation}`
        }
    }
 }
</script>

<template>
    <div :class="`${materialClass} text-on-surface-high`">
        <slot></slot>
    </div>
</template>
