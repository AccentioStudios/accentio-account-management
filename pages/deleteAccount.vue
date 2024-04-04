
<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  middleware: "verify-password"
});

const authStore = useAuthStore();
let loading = ref(false);
const accountConfirmation = ref("");
const confirmationText = ref("");

onMounted(() => {
  authStore.setLoadingState(false);
  if(authStore.userData.email) {
    confirmationText.value = authStore.userData.email;
  } else {
    confirmationText.value = authStore.userData.username;
  }
});

const formIsValid = computed(() => {
  // If the account confirmation is equal confirmation text, then the form is valid
  if(accountConfirmation.value === confirmationText.value && accountConfirmation.value.length > 0) {
    return true;
  }
});

async function saveChanges(e: any) {
  e.preventDefault();
  loading.value = true;

  try {
    const deleteRequest = await authStore.deleteAccount(
      accountConfirmation.value
    );
    if (deleteRequest) {
      navigateTo('/sign-out', {external: true});
    } else {
      console.error("Error deleting account");
      loading.value = false;
    }
      
  } catch (error) {
    console.error(error);
  } finally {
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

          <h3 class="text-wrap text-lg text-on-surface-high font-semibold text-red-200">
              Borrar Cuenta
          </h3>
        </div>
        <div class="w-[100%] h-[1px] mt-3 bg-divider"></div>

        <!-- divider -->
        <form @submit.prevent="saveChanges" class="flex items-center w-[100%] flex-col">
          <div class="content p-5 w-full max-w-[520px]">   

                <p class="text-on-surface-high mt-6 text-2xl font-medium">
                  ¿Estas seguro que quieres borrar tu cuenta?
                </p>

                
                  <p class="text-on-surface-medium mt-2 text-sm">
                    Esta acción es irreversible.
                  </p>

                <p class="text-on-surface-medium mt-6 font-normal text-sm">
                  Para confirmar, escribe <span class="text-sm font-semibold text-on-surface-high">{{ confirmationText }}</span> en el siguiente campo.
                </p>


                <Input tabindex=1 :disabled="loading" type="TEXT" class="mt-2" elevation="32" placeholder="Confirmación" 
                v-model="accountConfirmation"
                
                ></Input>

                <p class="error-message mt-2 text-sm text-utility-error-200">
                  {{ !formIsValid ? "Verifica que que sea el mismo texto que el solicitado" : "" }}
                </p>

                <div class="mt-4">
                  <p class="text-sm text-on-surface-medium mt-8 mb-5">
                    <p class="text-sm text-on-surface-high mb-2">¿Que pasa con mis datos una vez borre mi cuenta?  </p>
                    Todas tus informaciones personales serán borradas de nuestros sistemas. Cualquier otro tipo de información adicional no apuntará a tu identidad en ninguna parte.   
                    <a tabindex=-1 href="https://accentiostudios.com/company/privacy.html" target="_blank">
                      Leer más.
                    </a>
                  </p>
                </div>

   

                <div class="flex flex-row w-full justify-end mt-6">
                    <Button :tabIndex=2 color="secondary" tabindex=-3 :disabled="!formIsValid" class="mt-2 justify-self-end" @click="saveChanges" :loading="loading" loadingText="Adiós :( ...">
                      Borrar cuenta definitivamente
                    </Button>      
                </div>
            
          </div>
        </form>
      </div>
</template>

<style>

</style>
