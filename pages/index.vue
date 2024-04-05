<script setup lang="ts">
import { definePageMeta } from '#imports';
const authStore = useAuthStore();

const userData = authStore.userData;  
// const sesion = await getSession();

// const userData = computed(() => {
//   return sesion?.user ?? null;
// });
</script>

<template>

      <div class="flex mt-3 flex-col w-[100%]">
        <div class="flex row-auto items-center w-[100%]  p-5 ">
          <a href="/" alt="Back" class="back-icon"></a>
          <img src="/img/logo.svg" alt="Accentio Account Logo" class="logo">
        </div>

        <div class="flex items-center w-[100%] flex-col"> 
           <div v-if="userData?.picture != null && userData?.picture != '' && userData?.picture != undefined" id="avatar-image" class="
            bg-on-surface-high
            rounded-full
            w-[76px] h-[76px]
            flex items-center justify-center
            overflow-hidden
            mt-5">
            <img :src="userData!.picture" alt="User Avatar" class="w-[76px] h-[76px]">
          </div>
          <Gravatar v-else alt="User Avatar" :email="authStore.userData.primaryEmail" class="bg-on-surface-high rounded-full w-[76px] h-[76px] mt-2 mb-4"/>
          <h3 class="text-wrap text-lg mt-3 font-medium">
            {{userData?.name}}
          </h3>
          <!-- divider -->
          <div class="w-[100%] h-[1px] mt-3 bg-divider"></div>

          <div class="content p-5">
            <div class="flex flex-col items-center justify-between w-[100%]">
              <h3 class="text-wrap text-lg mt-3 font-light text-on-surface-high ">
                ¿Que quieres hacer?
              </h3>
            </div>

            <div class="grid md:grid-cols-2 mt-4 sm:grid-cols-1 gap-4">
              <NuxtLink tabindex=1 to="/changeinfo">
                <CardGroupItem
                elevation="32"
                mobileElevation="4" 
                title="Alterar información personal." 
                icon="/img/user-icon.svg"
                subtitle=" Altera tu nombre, apellido y nombre de usuario."/>
              </NuxtLink>
              <NuxtLink tabindex=2 to="/changePassword">
              <CardGroupItem
                elevation="32"
                mobileElevation="4"
                title="Cambiar contraseña"
                icon="/img/pass-icon.svg"
                subtitle="Restaura tu contraseña para una nueva."/>
              </NuxtLink>
              <NuxtLink tabindex=3 to="/deleteAccount">
                <CardGroupItem
                  accentColorClass="bg-red-200"
                  borderColorClass="border-red-200"
                  elevation="32"
                  mobileElevation="4"
                  title="Borrar cuenta"
                  icon="/img/trash-icon.svg"
                  subtitle="Borra tu cuenta junto con todos tus datos."/>
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>
</template>

<style>

</style>
