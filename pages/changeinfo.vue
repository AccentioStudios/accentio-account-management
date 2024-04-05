
<script setup lang="ts">
import type LogtoClient from '@logto/browser';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
let loading = ref(false);

const currentData = ref(JSON.parse(JSON.stringify(authStore.userData)));
const unchangedData = JSON.parse(JSON.stringify(authStore.userData));

const someDataHasChanged = computed(() => {
  return JSON.stringify(unchangedData) !== JSON.stringify(currentData.value);
});

onMounted(() => {
  authStore.setLoadingState(false);
});

async function saveChanges(e: any) {
  loading.value = true;
  e.preventDefault();
  const postChanges = await authStore.postUserChanges(currentData.value);
  if (postChanges) {
    const logto = useLogtoClient() as LogtoClient;
    const user = await logto?.fetchUserInfo();
    await authStore.storeUserData(user);
  }
  loading.value = false;
  window.location.reload();
}

</script>

<template>
      <div class="flex mt-3 flex-col w-[100%]">
        <div class="flex row-auto justify-between items-center w-[100%]  p-5 ">
          <div class="flex row-auto items-center">
            <a href="#" :onClick="() => $router.go(-1)" alt="Back" class="back-icon"></a>
            <img src="/img/logo.svg" alt="Accentio Account Logo" class="logo">
          </div>

          <h3 class="text-wrap text-lg text-on-surface-high font-semibold">
              Información Personal
          </h3>
        </div>
        <div class="w-[100%] h-[1px] mt-3 bg-divider"></div>

        <!-- divider -->
        <div class="flex items-center w-[100%] flex-col">
          <div class="content p-5 w-full max-w-[520px]">   
            
              <form @submit.prevent="saveChanges">
                <p class="text-sm text-on-surface-high font-medium">Avatar</p>
                <div v-if="currentData?.picture != null && currentData?.picture != '' && currentData?.picture != undefined" id="avatar-image" class="
                  bg-on-surface-high
                  rounded-full
                  w-[76px] h-[76px]
                  flex items-center justify-center
                  overflow-hidden
                  mt-2 mb-4">
            <img :src="currentData!.picture" alt="User Avatar" class="w-[76px] h-[76px]">
          </div>
          <Gravatar v-else alt="User Avatar" :email="authStore.userData.email" class="bg-on-surface-high rounded-full w-[76px] h-[76px] mt-2 mb-4"/>
                <Input tabindex=1 :disabled="loading" elevation="32" label="Nombre" placeholder="Nombre" 
                v-model="currentData.name"
                ></Input>
     
                <div class="mt-4">
                  <p class="text-sm text-on-surface-medium mt-1 mb-5">
                    <p class="text-sm text-on-surface-high">¿Quién puede ver mi nombre?</p>
                    Cualquiera puede ver esta información dentro de los servicios y productos de Accentio.
                    <a tabindex=-1 href="https://accentiostudios.com/company/privacy.html" target="_blank">
                      Leer más.
                    </a>
                  </p>
                </div>
                <Input tabindex=2 type="email" elevation="32" label="Dirección de e-mail" v-model="currentData.email" placeholder="you@example.com" :disabled="loading"></Input>
                <Input tabindex=3 v-model="currentData.username" elevation="32" label="Nombre de usuario" placeholder="nickname" :disabled="loading"></Input>
                
                <span v-if="!someDataHasChanged" class="text-sm text-on-surface-medium pt-10 block text-right">No hay alteraciones todavia en tus datos. </span>
                <span v-else class="text-sm text-on-surface-high pt-10 block text-right">Tus datos han sido alterados. Guarda antes de salir.</span>
                <div class="flex flex-row w-full justify-end">
                    <Button tabindex=4 :disabled="!someDataHasChanged" class="mt-2 justify-self-end" @click="saveChanges" :loading="loading" loadingText="Guardando...">
                      Guardar Cambios
                    </Button>      
                </div>
              </form>

          </div>
        </div>
      </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
