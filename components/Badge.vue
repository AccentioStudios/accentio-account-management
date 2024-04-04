<script lang="ts">
export default {
    name: 'Badge',
    props: {
        size: {
            type: String,
            required: false,
            default: 'xs'
        },
        text: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: false,
            default: 'bg-utility-success-50'
        },
        borderColor: {
            type: String,
            required: false,
            default: 'border-utility-success-200'
        },
        withDot: {
            type: Boolean,
            required: false,
            default: false
        },
        dotColor: {
            type: String,
            required: false,
            default: 'bg-utility-success-700'
        },
        textColor: {
            type: String,
            required: false,
            default: 'text-utility-success-700'
        }
    },
    computed: {
        sizeComputed: function() {
         switch(this.size) {
             case 'xs':
                 return 'text-xs'
             case 'sm':
                 return 'text-sm'
             case 'md':
                 return 'text-md'
             case 'lg':
                 return 'text-base'
             case 'lg':
                 return 'text-lg'
             default:
                 return 'text-xs'
         }
        }
    }
}
</script>
<template>

<span :class="`inline-flex items-center rounded-full ${color} px-2 py-1 ${sizeComputed} font-medium ${textColor} ring-1 ring-inset ${borderColor}`">
    <span v-if="withDot" :class="`inline-block h-2 w-2 rounded-full ${dotColor} mr-1`"></span>
    {{ text }}
</span>
</template>
