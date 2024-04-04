<script lang="ts">
import { ref } from 'vue';
import Badge from '@/components/Badge.vue';
import Button from '@/components/Button.vue';

export default {
  setup() {
    const googleStatus = ref(null as string | null)
    const authenticated = ref(false)
    return {
      googleStatus,
      authenticated
    }
  },
  components: {
    Badge,
    Button,
  },
  mounted() {
    // this.$http.get('/integration/google/health').then((response: any) => {
  
    //   if(response.status === 200) {
    //     this.googleStatus = 'Healthy'
    //   }
    // }, (error: any) => {

    //   this.googleStatus = 'Down'
    // });

    this.checkAuthentication();
  },

  methods: {
    openAuthenticate() {
      var left = (screen.width/2)-(500/2);
      var top = (screen.height/2)-(600/2) - 50;

      const apiURL = import.meta.env.VITE_API_URL;
      let googlePopUp = window.open(apiURL + '/integration/google/auth', 'redirect', `width=500,height=600,toolbar=no,menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no, top=${top}, left=${left}`);
      
      const checkPopup = setInterval(() => {
        // check if popup is closed
        if(googlePopUp?.closed) {
          clearInterval(checkPopup);
          console.log('closed');
          this.checkAuthentication();
        }
      }, 1000);
    },
    checkAuthentication() {
      this.$http.get('/integration/google/check').then((response: any) => {
     
        this.authenticated = true;
      }, (error: any) => {

        this.authenticated = false;
      });
    },
    disconnectIntegration() {
      this.$http.post('/integration/google/disconnect').then((response: any) => {
        this.authenticated = false;
        this.checkAuthentication();
      }, (error: any) => {
      });
    }
  }
}
</script>

<template>
  <main>
    <div class="bg-material-metal-1 border-solid border border-stroke-muted rounded-xl p-3 text-on-surface-high">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
              <g clip-path="url(#clip0_347_7359)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.58163 0.75C4.17102 0.75 0.605469 4.30208 0.605469 8.69649C0.605469 12.2092 2.89004 15.1826 6.05935 16.235C6.45559 16.3141 6.60073 16.064 6.60073 15.8536C6.60073 15.6694 6.58767 15.0379 6.58767 14.38C4.3689 14.8537 3.90686 13.4327 3.90686 13.4327C3.55029 12.5118 3.02196 12.2751 3.02196 12.2751C2.29575 11.7883 3.07486 11.7883 3.07486 11.7883C3.88041 11.8409 4.3031 12.6039 4.3031 12.6039C5.01608 13.8142 6.16498 13.4723 6.62718 13.2617C6.69314 12.7486 6.90457 12.3934 7.12906 12.1961C5.35943 12.0119 3.49755 11.3278 3.49755 8.27541C3.49755 7.40709 3.81429 6.69667 4.31616 6.14416C4.23698 5.94686 3.95959 5.13101 4.39551 4.03907C4.39551 4.03907 5.06898 3.82853 6.58751 4.85476C7.23765 4.68081 7.90812 4.59232 8.58163 4.59158C9.2551 4.59158 9.94163 4.68377 10.5756 4.85476C12.0943 3.82853 12.7678 4.03907 12.7678 4.03907C13.2037 5.13101 12.9261 5.94686 12.8469 6.14416C13.362 6.69667 13.6657 7.40709 13.6657 8.27541C13.6657 11.3278 11.8038 11.9986 10.021 12.1961C10.3116 12.446 10.5624 12.9196 10.5624 13.6696C10.5624 14.7352 10.5493 15.5904 10.5493 15.8535C10.5493 16.064 10.6946 16.3141 11.0907 16.2351C14.26 15.1824 16.5446 12.2092 16.5446 8.69649C16.5576 4.30208 12.979 0.75 8.58163 0.75Z" fill="#151515"/>
            </g>
          <defs>
        <clipPath id="clip0_347_7359">
            <rect width="16" height="15.5" fill="white" transform="translate(0.605469 0.75)"/>
          </clipPath>
          </defs>
        </svg>
          </div>
          <span >
            Connect Google with Dash by Accentio
          </span>
          <Badge v-if="authenticated" text="Connected" withDot></Badge>
        </div>

        <Button @click="(!authenticated) ? openAuthenticate() : disconnectIntegration()" size="sm">
          <span v-if="authenticated">
            Disconnect
          </span>
          <span v-else>
            Connect
          </span>
        </Button>
      </div>
      <div class="bg-material-metal-8 border-solid border border-stroke-muted rounded-xl p-3 mt-2" v-if="authenticated">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
          <span class="">
            Organization
          </span>
          <span class="subtext">
            Enabled by {User} on {Date}
          </span>
        </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .connector-card {
    display: flex;
    width: 100%;
    flex-direction: column;
    max-width: 736px;
    padding: var(--spacing-xl, 16px);
    align-items: flex-start;
    gap: var(--spacing-xs, 4px);
    align-self: stretch;
    border-radius: var(--radius-xl, 12px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: var(--04-materials-metal-dark-1-dp, linear-gradient(0deg, rgba(137, 212, 240, 0.05) 0%, rgba(137, 212, 240, 0.05) 100%), #0E0B1E);
    /* Text sm/Medium */
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
    color: var(--on-surface-dark-text-color);
  }
  .connector-card .content {
    display: flex;
    width: 100%;
    padding: var(--spacing-none, 0px);
    align-items: center;
    gap: var(--spacing-lg, 12px);
    flex: 1 0 0;
  }
  .icon {
    display: flex;
    padding: var(--spacing-xs, 4px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: var(--radius-full, 9999px);
    background: #BCC3F9;
  }

  .connector-details {
    margin-top: var(--spacing-md);
  }
  .information-card {
    display: flex;
    padding: var(--spacing-xl, 16px);
    align-items: flex-start;
    gap: var(--spacing-xs, 4px);
    align-self: stretch;

    border-radius: var(--radius-xl, 12px);
    border: 1px solid var(--component-colors-stroke-secundary, #3D4D71);
    background: var(--materials-metal-dark-4-dp)
  }

</style>

