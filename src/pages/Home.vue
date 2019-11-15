<template>
  <div>
    <div class="row">

      <div class="col-md-6 col-12">
        <card class="card" title="For Users">
          <div v-if="!savingWallet">
            <p>
              To get your unique <strong>arweave login phrase</strong>, simply upload your arweave wallet below. 
            </p>
            <p>
              Once the wallet has been <strong>safely stored and encrypted in the arweave blockchain</strong>, the phrase will be displayed to you :).
            </p>
            <div class="text-center">
                <p-button type="info"
                          round
                          @click.native.prevent="$refs.file.click()">
                  Upload Arweave Wallet
                </p-button>
            </div>
            <input type="file" ref="file" style="display: none" @change="fileSelected"/>
          </div>
        </card>
      </div>

      <div class="col-md-6 col-12">
        <card class="card" title="For Developers">
          <div>
            <form @submit.prevent>
              <div class="row">
                <div class="col-md-5">
                  <fg-input type="text"
                            label="Company"
                            :disabled="true"
                            placeholder="Paper dashboard"
                            v-model="user.company">
                  </fg-input>
                </div>
                <div class="col-md-3">

                  <fg-input type="text"
                            label="Username"
                            placeholder="Username"
                            v-model="user.username">
                  </fg-input>
                </div>
                <div class="col-md-4">
                  <fg-input type="email"
                            label="Username"
                            placeholder="Email"
                            v-model="user.email">
                  </fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <fg-input type="text"
                            label="First Name"
                            placeholder="First Name"
                            v-model="user.firstName">
                  </fg-input>
                </div>
                <div class="col-md-6">
                  <fg-input type="text"
                            label="Last Name"
                            placeholder="Last Name"
                            v-model="user.lastName">
                  </fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <fg-input type="text"
                            label="Address"
                            placeholder="Home Address"
                            v-model="user.address">
                  </fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <fg-input type="text"
                            label="City"
                            placeholder="City"
                            v-model="user.city">
                  </fg-input>
                </div>
                <div class="col-md-4">
                  <fg-input type="text"
                            label="Country"
                            placeholder="Country"
                            v-model="user.country">
                  </fg-input>
                </div>
                <div class="col-md-4">
                  <fg-input type="number"
                            label="Postal Code"
                            placeholder="ZIP Code"
                            v-model="user.postalCode">
                  </fg-input>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label>About Me</label>
                    <textarea rows="5" class="form-control border-input"
                              placeholder="Here can be your description"
                              v-model="user.aboutMe">

                    </textarea>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <p-button type="info"
                          round
                          @click.native.prevent="updateProfile">
                  Update Profile
                </p-button>
              </div>
              <div class="clearfix"></div>
            </form>
          </div>
        </card>
      </div>

    </div>

  </div>
</template>
<script>

import { SelfBuildingSquareSpinner  } from 'epic-spinners'
import { testAuth, encryptAndSaveWallet  } from "@/helpers/arweave/index";

export default {
  components: {
    SelfBuildingSquareSpinner
  },
  methods: {
      fileSelected(e){
        const filereader = new FileReader();

        filereader.addEventListener('loadend', async e => {
            try {
              const userWallet = await JSON.parse(e.target.result);

              if (userWallet) {
                 await encryptAndSaveWallet(userWallet);
              }

             // console.log(userWallet);
              /*const userArweaveAddress = await getWalletAddress(userWallet);
              let userArweaveBalance = '';
              if (userArweaveAddress) {
                  // first of all get the user's details/info
                  const username = await this.getUserInfo(userArweaveAddress);
                  userArweaveBalance = await getWalletBalance(userArweaveAddress);
                  // save the login state locally
                  localStorage.setItem('loggedIn', true);
                  localStorage.setItem('userArweaveAddress', userArweaveAddress);
                  localStorage.setItem('userArweaveBalance', userArweaveBalance);
                  localStorage.setItem('userWallet', JSON.stringify(userWallet));
                  localStorage.setItem('userName', username);
                  router.push({ name: 'reminders'});
              } else {
                  throw new Error("Unable to get wallet address!!")
              }*/
              
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
      user: {
            company: "Paper Dashboard",
            username: "michael23",
            email: "",
            firstName: "Chet",
            lastName: "Faker",
            address: "Melbourne, Australia",
            city: "Melbourne",
            postalCode: "",
            aboutMe: `We must accept finite disappointment, but hold on to infinite hope.`
          }
    };
  },
  mounted() {
   // console.log(testAuth());

  }
};
</script>
<style>
</style>
