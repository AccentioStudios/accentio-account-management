
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();

let loading = ref(false);
const passwordIsCorrect = ref(true);
const password = ref("");

onMounted(() => {
  authStore.setLoadingState(false);
});

function navigateToNext(route) {
  navigateTo(route, { external: true }); 
}
async function submit(e: any) {
  // get query params
  e.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const to = params.get("to");

  loading.value = true;
  try {
    const request = await authStore.verifyPassword(password.value);
      if(request.body.valid) {
        passwordIsCorrect.value = true;
        console.log("Password is correct.. Redirecting to: ", to ?? "/");

        return navigateToNext(to ?? "/");
      } else {
        passwordIsCorrect.value = false;
      }
      loading.value = false;
  } catch(e) {
    passwordIsCorrect.value = false;
    console.error(e);
    loading.value = false;
  }
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
              Verificar Contraseña
          </h3>
        </div>
        <div class="w-[100%] h-[1px] mt-3 bg-divider"></div>

        <!-- divider -->
        <form v-on:submit.prevent="submit">
        <div class="flex items-center w-[100%] flex-col">
          <div class="content p-5 w-full max-w-[520px]">   

            <div class="flex flex-row w-full">
                <div class="flex flex-col w-full">
                  <div class="flex flex-row items-center">
                    <div v-if="authStore.userData?.picture != null && authStore.userData?.picture != '' && authStore.userData?.picture != undefined" id="avatar-image" class="
                      bg-on-surface-high
                      rounded-full
                      w-[36px] h-[36px]
                      flex items-center justify-center
                      overflow-hidden
                    mt-5">
                      <img :src="authStore.userData!.picture" alt="User Avatar" class="w-[36px] h-[36px]">
                    </div>
                    <Gravatar v-else alt="User Avatar" :email="authStore.userData.email" class="bg-on-surface-high rounded-full w-[36p] h-[36px] mt-2 mb-4"/>
                    <p class="text-on-surface-high text-lg font-semibold ml-4">Hola, {{ authStore.userData.name }}</p>
                  </div>

                  </div>  
                  </div>
            
                <p class="text-sm text-on-surface-high mt-2 font-semibold">
                  Para continuar, por favor verifica tu contraseña.
                </p>

                <Input :disabled="loading" type="password" class="mt-9" elevation="32" label="Contraseña" placeholder="Contraseña" 
                v-model="password"
                ></Input>

                <p class="error-message mt-2 text-sm text-utility-error-200">
                  {{ passwordIsCorrect === false ? "Tu contraseña es inválida." : "" }}
                </p>

                <div class="text-sm text-on-surface-medium mb-5 mt-6">
                    <p class="text-sm text-on-surface-high">¿Por que me piden mi contraseña de nuevo?</p>
                    Por cuestiones de seguridad, es bueno hacer doble verificación de que seas realmente tú.
                </div>

                
                <div class="flex flex-row w-full justify-end mt-6 p-2">
                    <Button :disabled="password.length === 0" class="mt-2 justify-self-end" @click="submit" :loading="loading" loadingText="Validando...">
                      Continuar
                    </Button>      
                </div>
            
          </div>
        </div>
      </form>
      </div>
</template>

<style>

</style>
