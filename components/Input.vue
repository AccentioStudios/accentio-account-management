<template>
  <div>
    <label v-if="label" tabindex=-1 :for="label.toLocaleLowerCase().trim().replaceAll(' ', '-')" class="mt-3 block mb-2 text-sm font-medium text-on-surface-high">{{ label }}</label>
                    <input :tabindex="tabIndex" v-if="type !== 'password'" :type="type" :id="label ? label.toLocaleLowerCase().trim().replaceAll(' ', '-'): ''" :class="`
                    ${materialClass}
                    border-divider
                    text-on-surface-high
                    text-sm rounded-lg
                    ${focusClass}
                    block w-full p-2.5
                    `"
                    :placeholder="placeholder"
                    :required="required" 
                    :value="modelValue"
                    :disabled="disabled"
                    @input="updateInput"
                    >
                    <div v-else :class="`
                    password-parent
                    flex flex-row items-center

                    ${materialClass}
                    border 
                    border-divider
                    text-on-surface-high
                    text-sm rounded-lg
                    ${focusClass}
                    block w-full p-2.5
                    `">
                    
                    <input :tabindex="tabIndex" :type="showPassword ? 'text' : 'password'" :id="label ? label.toLocaleLowerCase().trim().replaceAll(' ', '-'): ''" class="
                    password-child 
                    p-0 m-0 border-none text-on-surface-high text-sm block w-full 
                    bg-transparent ring-0 border-transparent focus:border-none 
                    decoration-transparent focus:ring-transparent"
                    :placeholder="placeholder"
                    :required="required"
                    :value="modelValue"
                    :disabled="disabled"
                    @input="updateInput"
                    >
                    <!-- icon for show and hide password -->

                    <button type="button" tabindex=-1 @click="showAndHidePassword" class="focus:outline-none">
                        <IconEye :onOff="showPassword"></IconEye>
                    </button>
                    </div>

  </div>
</template>

<script lang="ts">
import { MaterialType } from './Material.vue';

export default defineComponent({
  name: 'Input',
  data() {
    return {
      showPassword: false
    }
  },
  props: {
    tabIndex: {
      type: Number,
      required: false,
      default: 0
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      required: false,
      default: "text"
    },
    materialType: {
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
    label: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      required: false,
      default: "Placeholder"
    },
    // icon: {
    //     type: String,
    //     required: false,
    //     default: "/img/user-icon.svg"
    // },
    accentColorClass: {
      type: String,
      required: false,
      default: "primary-color"
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    materialClass() {
        if(this.elevation != this.mobileElevation && this.mobileElevation) {
            return `md:bg-material-${this.materialType}-${this.elevation} bg-material-${this.materialType}-${this.mobileElevation}`
        }
        return `bg-material-${this.materialType}-${this.elevation}`
    },
    focusClass() {
      return `focus:ring-${this.accentColorClass} focus:border-${this.accentColorClass}`
    },
  }, 
  methods: {
    showAndHidePassword(e: any)
    {
      e.preventDefault();
      this.showPassword = !this.showPassword;
    },
    updateInput(event: any) {
      this.$emit("update:modelValue", event.target.value);
    }
  }
});
</script>

<style>

.password-parent {
  position: relative;
}

.password-child {
  top: 0;
  left: 0;
}


/* when password-child is focused, we apply some styling to his parent */
.password-parent:focus-within {
  border: 1px solid var(--blue-600);
  outline: 2px solid var(--blue-600);
}


</style>