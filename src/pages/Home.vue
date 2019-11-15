<template>
  <div>
    <div class="row">

      <div class="col-md-6 col-12">
        <card class="card" title="For Users">
          <div v-if="!walletUploaded">
            <p>
              To get your unique <strong>arweave login phrase</strong>, simply upload your arweave wallet below. 
            </p>
            <p>
              Once the wallet has been <strong>safely stored and encrypted in the arweave blockchain</strong>, the phrase will be displayed to you :).
            </p>
            <div class="text-center" v-if="!savingWallet && !walletUploaded">
                <p-button type="info"
                          round
                          @click.native.prevent="$refs.file.click()">
                  Upload Arweave Wallet
                </p-button>
                <input type="file" ref="file" style="display: none" @change="fileSelected"/>
            </div>
          
            <div class="saving-wallet w-100" v-if="savingWallet">
              
              <span>Encrypting & Saving Arweave Wallet</span> &nbsp; &nbsp;
              <self-building-square-spinner
                :animation-duration="6000"
                :size="60"
                color="#ff1d5e"
              />
            </div>
          </div>
          <div v-if="walletUploaded">
            <p>
              Awesome 😃, your <strong>arweave pass phrase </strong> is, 
              <h2>
                {{ passPhrase }}
              </h2>
            </p>
            <p>
              Your wallet has been encrypted successfully and is being mined. Please give it <strong>atmost 10 minutes</strong> to finish mining on the arweave blockchain
            </p>
            <p class="wallet-warn">
              Also please copy or write down the above phrase & save it securely. If it gets lost, it <strong class="wallet-warn">can't be recovered</strong> and if hacker or malicious users get hold of it they <strong class="wallet-warn">will be able </strong>  to access your arweave account and transfer your AR tokens.
            </p>
            <div class="text-center">
                <p-button type="info"
                          round
                          @click.native.prevent="closeInfo">
                  Ok, Got It
                </p-button>
            </div>
           
     
          </div>
        </card>
      </div>

      <div class="col-md-6 col-12">
        <card class="card" title="For Developers">
          <div>
            <p>
              For developers, you can easily in-corporate <strong>Ar Auth</strong> into your dApp by following the simple instructions <a href="https://github.com/mul1sh/ar-auth#developers">in the repo</a>
            </p>
            <p>
              In case of any issues, kindly create an issue in the repo and i'll sort it in good timing.
            </p>
            <p>
              Last but not least, this dApp will constantly be undergoing improvements, so expect breaking changes.
            </p>
            
          </div>
        </card>
      </div>

    </div>

  </div>
</template>
<script>

import { SelfBuildingSquareSpinner  } from 'epic-spinners'
import { saveWallet, getTransactionDetails, getEncryptedWallet  } from "@/helpers/arweave/index";

export default {
  components: {
    SelfBuildingSquareSpinner
  },
  methods: {

      closeInfo() {
        this.walletUploaded = false;
      },
      async fileSelected(e){
        const filereader = new FileReader();

        const vm = this;

        filereader.addEventListener('loadend', async e => {
            try {
              const userWallet = await JSON.parse(e.target.result);

              if (userWallet) {
                vm.savingWallet = true;
                 const saved = await saveWallet(userWallet);

                 if (saved) {
                  vm.savingWallet = false;
                  console.log(saved);
                  vm.passPhrase = saved.phrase;
                  vm.walletUploaded = true;
                 }
              }

            }
            catch(error){
              console.log(error);
            }
        });
        filereader.readAsText(e.target.files[0]);
      },
  },
  data() {
    return {
      savingWallet: false,
      walletUploaded: false,
      passPhrase: "",
    };
  },
  mounted() {
   // console.log(testAuth());

  }
};
</script>
<style scoped>
.saving-wallet {
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.wallet-warn {
  color: #cc0000;
}
</style>
