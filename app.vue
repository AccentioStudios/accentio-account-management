<script setup lang="ts">
import { useAuthStore } from './stores/auth';
useHead({
  htmlAttrs: {
    class: 'dark',
  },
});

const authStore = useAuthStore();
authStore.setLoadingState(true);
const user = useLogtoUser();
authStore.storeUserData(user);
authStore.setLoadingState(false);

</script>

<template>
  <div class="app flex flex-col items-center md:justify-center h-full w-full md:p-5">
    <div class="page md:bg-material-metal-24 rounded-xl text-on-surface-high md:w-[690px] w-full">
      <!-- if is loading we show a spinner -->
      <div v-if="authStore.loading" class="flex items-center justify-center h-[50px] w-[50px] justify-self-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.83a1 1 0 00-1.7-.7l-4.5 4.5a1 1 0 000 1.42l4.5 4.5a1 1 0 001.7-.7V12a4 4 0 104 4h-8a1 1 0 00-1 1v1.17a1 1 0 001.7.7l4.5-4.5a1 1 0 000-1.42l-4.5-4.5a1 1 0 00-1.7.7V12a8 8 0 01-8 8z"></path>
        </svg>
      </div>
      <!-- if is not loading we show the page -->
      <div v-else>
        <NuxtPage />
      </div>
    </div>

    <a v-if="Boolean(user)" href="/sign-out" class="mt-5">
        <button class="text-red-400 text-sm font-semibold">Cerrar sesión</button>
      </a>

      <a v-if="Boolean(user)" href="https://accentiostudios.com/company/privacy.html" class="mt-1 mb-5" target="_blank">
        <button class="text-blue-200 text-sm font-semibold">Politica de Privacidad</button>
      </a>
  </div>  
</template> 

<style>
  body {
    background: var(--background-color);
  }

.slide-leave-active,
.slide-enter-active {
  transition: 0.3s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}




.page-enter-active,
.page-leave-active {
  transition: all 0.5s;
}

.page-enter {
  transform: translate(-100%, 0);
}
.page-leave-to {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate(-100%, 0);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  /* filter: blur(1rem); */
}


.back-icon {
  background-image: url('/img/chevron-left-icon.svg');
  background-size: 100%;
  background-repeat: no-repeat;
  width: 24px;
  height: 24px;
  display: block;
}
.logo {
  margin-left: 15px;
  width: 181.51px;
  height: 27.62px;
  transform: translateY(-2px);
}
.app {
  transition: all 0.4s;
}
.page {
  height: auto;
  overflow: hidden;
  position: relative;
  transition: all 0.4s;
}
</style>


<!-- <script setup lang="ts">

import { useLogtoClient, useLogtoUser, useState, callOnce } from '#imports';

const client = useLogtoClient();
const accessToken = useState<string | undefined>('access-token');

await callOnce(async () => {
  if (!client) {
    throw new Error('Logto client is not available');
  }

  if (!(await client.isAuthenticated())) {
    return;
  }

  try {
    accessToken.value = await client.getAccessToken();
  } catch (error) {
    console.error('Failed to get access token', error);
  }
});

const user = useLogtoUser();

</script>
<template>
  <div>
    <p>Logto Nuxt 3 sample</p>
    <p v-if="Boolean(user)">Authenticated</p>
    <ul v-if="Boolean(user)">
      <li v-for="(value, key) in user">
        <b>{{ key }}:</b> {{ value }}
      </li>
    </ul>
    <p v-if="Boolean(user)">Access token: {{ accessToken }}</p>
    <a :href="`/sign-${ user ? 'out' : 'in' }`">
      Sign {{ user ? 'out' : 'in' }}
    </a>
  </div>
</template> -->