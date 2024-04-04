
<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  middleware: "verify-password"
});

const authStore = useAuthStore();

let loading = ref(false);

const currentData = ref({
  password: "",
  confirmPassword: ""
});


const passwordFieldIsValid = ref(true);
const confirmFieldIsValid = ref(true);

onMounted(() => {
  authStore.setLoadingState(false);
});

const formIsValid = computed(() => {
 // Password must be at least 8 characters long, contain at least one uppercase letter, and one special character
  const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,})/;
  if(currentData.value.password === currentData.value.confirmPassword && currentData.value.password.length > 0 && currentData.value.confirmPassword.length > 0) {
    return regex.test(currentData.value.password);
  }
});

function checkPasswordFieldIsValid() {
  console
  const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,})/;
  if(currentData.value.password.length === 0) {
    passwordFieldIsValid.value = true;
    return;
  }

  if(currentData.value.password.length < 8) {
    passwordFieldIsValid.value = false;
    return;
  }

  if(regex.test(currentData.value.password)) {
    passwordFieldIsValid.value = true;
    return;
  }
  passwordFieldIsValid.value = false;
};

function checkConfirmPasswordFieldIsValid() {
  if(currentData.value.password === currentData.value.confirmPassword) {
    confirmFieldIsValid.value = true;
    return;
  }
  confirmFieldIsValid.value = false;
}

async function saveChanges(e: any) {
  e.preventDefault();
  if(!formIsValid.value) {
    return;
  }
  loading.value = true;
  try {
    const request = await authStore.postChangePassword(currentData.value);
    if (request.status == 200) {
     navigateTo("/");
    }
  } catch(e) {
    console.error(e);
  }
  loading.value = false;
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
              Cambiar Contraseña
          </h3>
        </div>
        <div class="w-[100%] h-[1px] mt-3 bg-divider"></div>

        <!-- divider -->
        <form @submit.prevent="saveChanges" class="flex items-center w-[100%] flex-col">
          <div class="content p-5 w-full max-w-[520px]">   

                <p class="text-sm text-on-surface-high mt-6">
                  Elige una contraseña fuerte y no uses las mismas contraseñas que usas en otros lugares.
                <br>
                <br>
                  Es posible que pierdas la sesión en algunas aplicaciones de Accentio.
                </p>

                <Input tabindex=1 :disabled="loading" type="password" class="mt-9" elevation="32" label="Nueva contraseña" placeholder="Contraseña" 
                v-model="currentData.password"
                @change="() => checkPasswordFieldIsValid()"
                ></Input>

                <p class="error-message mt-2 text-sm text-utility-error-200">
                  {{ passwordFieldIsValid === false ? "Tu contraseña no cumple con los requisitos." : "" }}
                </p>

                <div class="mt-4">
                  <p class="text-sm text-on-surface-medium mt-1 mb-5">
                    Usa al menos 8 caracteres y al menos una (1) mayúscula (A-Z), y algun caracter espacial.
                    <a tabindex=-1 href="https://accentiostudios.com/company/privacy.html" target="_blank">
                      ¿Por qué?
                    </a>
                  </p>
                </div>

                <Input tabindex=-2 :disabled="loading" type="password" class="mt-6" elevation="32" label="Confirmar contraseña" placeholder="Confirmar Contraseña" 
                v-model="currentData.confirmPassword" 
                @change="() => checkConfirmPasswordFieldIsValid()"
                ></Input>

                <p class="error-message mt-2 text-sm text-utility-error-200">
                  {{ confirmFieldIsValid === false ? "Las contraseñas no coinciden." : "" }}
                </p>
                
                <div class="flex flex-row w-full justify-end mt-6">
                    <Button tabindex=-3 :disabled="!formIsValid" class="mt-2 justify-self-end" @click="saveChanges" :loading="loading" loadingText="Guardando...">
                      Guardar Cambios
                    </Button>      
                </div>
            
          </div>
        </form>
      </div>
</template>

<style>

</style>
