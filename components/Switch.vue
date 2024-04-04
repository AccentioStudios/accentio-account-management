<script lang="ts">
export default {
    data() {
        return {
            enabled: false
        }  
    },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    onChange: {
      type: Function,
      default: (state: boolean) => {}
    }
  },
  emits: ['update:modelValue'],
  beforeMount() {
    this.enabled = this.modelValue;
  },
  computed: {
    enabledComputed: {
      get(): boolean {
        return this.modelValue;
      },
      set(value: boolean) {
        this.enabled = value;
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    change() {
        this.enabled = !this.enabled;
        this.onChange(this.enabled)
    }
  },
}

</script>

<template>
  <HeadlessSwitch
    v-model="enabledComputed"
    @click="change"
    :class="enabledComputed ? 'bg-blue-500' : 'bg-transparent border border-switch-off border-opacity-60'"
    class="relative shadow-md inline-flex h-6 w-10 items-center rounded-full">
    <span :class="enabledComputed ? 'translate-x-5 bg-switch-on' : 'translate-x-1 bg-switch-off'" 
    class="inline-block shadow-md h-4 w-4 transform rounded-full transition"></span>
  </HeadlessSwitch>
      
</template>
