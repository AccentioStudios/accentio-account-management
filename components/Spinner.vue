<script setup lang="ts">
import { defineComponent } from 'vue';
    defineComponent({
        name: 'Spinner',
    });
</script>

<template>
    <span class="loader border-4 border-solid border-primary rounded-full"></span>
</template>

<style scoped>
    .loader {
    width: 48px;
    height: 48px;
    border-bottom-color: transparent;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
</style>