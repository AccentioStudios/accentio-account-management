<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

const enabled = ref(false)

function onChange(enabled: any) {
    // if enabled, we set localStorage of color-theme to dark. We first validate if exist, if not we create it.
    if (enabled) {
        localStorage.setItem('color-theme', 'dark')
        document.documentElement.classList.add('dark');
    } else {
        localStorage.setItem('color-theme', 'light')
        document.documentElement.classList.remove('dark');
    }
}

onBeforeMount(() => {
    // we check localStorage if color-theme exist, if not we create it with dark value.
    if (localStorage.getItem('color-theme') === null) {
        localStorage.setItem('color-theme', 'dark')
        document.documentElement.classList.add('dark');
        enabled.value = true
        return;
    }
    // if color-theme exists, we check if it is dark, if so we set enabled to true.
    if (localStorage.getItem('color-theme') === 'dark') {
        enabled.value = true;
        document.documentElement.classList.add('dark');
        return;
    }
    // if color-theme exists, we check if it is light, if so we set enabled to false.
    if (localStorage.getItem('color-theme') === 'light') {
        enabled.value = false;
        document.documentElement.classList.remove('dark');
        return;
    }

})

</script>

<template>
  <Switch v-model="enabled" :onChange="onChange"/>
</template>
