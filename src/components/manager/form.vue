<template>
    <container-template>
        <div slot="tab-content" class="row company-general-information">
            <div class="col-12 m-b-20">
                <h5>{{ title }}</h5>
                <div class="row">
                    <div class="col-12 col-md">
                        <div class="form-group form-group-default required">
                            <label>Name</label>
                            <input
                                v-model="companyData.name"
                                v-validate="'required:true|min:2|alpha_spaces'"
                                class="form-control"
                                type="text"
                                name="name"
                            >
                            <span class="text-danger"> {{ errors.first('name') }}</span>
                        </div>
                        <div class="form-group form-group-default required">
                            <label>Address</label>
                            <input
                                v-model="companyData.address"
                                v-validate="'required:true|min:2'"
                                class="form-control"
                                type="text"
                                data-vv-as="company address"
                                name="company-address"
                            >
                            <span class="text-danger"> {{ errors.first('company-address') }}</span>
                        </div>
                        <div class="form-group form-group-default required">
                            <label>Zip Code</label>
                            <input
                                v-model="companyData.zipcode"
                                v-validate="'required:true|numeric|min:2'"
                                class="form-control"
                                type="text"
                                data-vv-as="zip code"
                                name="zipcode"
                            >
                            <span class="text-danger"> {{ errors.first('zipcode') }}</span>
                        </div>
                        <div class="form-group form-group-default">
                            <label>Email</label>
                            <input
                                v-model="companyData.email"
                                v-validate="'required|email'"
                                class="form-control"
                                name="email"
                                type="email"
                            >
                            <span class="text-danger"> {{ errors.first('email') }}</span>
                        </div>
                        <div class="form-group form-group-default required">
                            <label>Phone</label>
                            <input
                                v-model="companyData.phone"
                                v-validate="'required|numeric'"
                                class="form-control"
                                data-vv-as="phone number"
                                name="phone"
                                type="tel"
                            >
                            <span class="text-danger"> {{ errors.first('phone') }}</span>
                        </div>
                    </div>
                    <div class="col-12 col-md m-b-20">
                        <div class="col-12 col-md">
                            <label>Language </label>
                            <multiselect
                                v-if="initializeComplete"
                                v-model="selectedLanguage"
                                :options="languages"
                                :show-labels="false"
                                label="name"
                                track-by="id"
                                @input="setLanguage"
                            />
                        </div>
                        <div class="col-12 col-md">
                            <label>Timezone</label>
                            <multiselect
                                v-if="initializeComplete"
                                v-model="companyData.timezone"
                                :max-height="175"
                                :options="timezones"
                                :show-labels="false"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-xl d-flex justify-content-end mt-2">
                <button :disabled="isLoading" class="btn btn-danger mr-2" @click="cancel()">
                    Cancel
                </button>
                <button :disabled="isLoading || !hasChanged" class="btn btn-primary" @click="save()">
                    Save
                </button>
            </div>
        </div>
    </container-template>
</template>

<script>
import { mapState } from "vuex";
import generalMixins from "../../mixins/general";
import vueRouterMixins from "../../mixins/vueRouterMixins";
import ContainerTemplate from "../../container";

export default {
    name: "CompanyCrud",
    components: {
        ContainerTemplate
    },
    mixins: [
        generalMixins,
        vueRouterMixins
    ],
    data() {
        return {
            initializeComplete: false,
            isLoading: false,
            companyData: {},
            selectedLanguage: null
        }
    },

    computed:{
        ...mapState({
            timezones: state => state.Application.timezones,
            languages: state => state.Application.languages
        }),
        isEditing() {
            return !!this.$route.params.id;
        },
        title() {
            return this.isEditing ? "Editing company" : "Add company";
        }
    },
    async created() {
        await this.$store.dispatch("Application/getSettingsLists");

        if (this.isEditing) {
            await this.getCompanyData();
            this.selectedLanguage = this.languages.find(language => language.id == this.companyData.language);
        }

        this.initializeComplete = true;
    },
    methods: {
        async cancel() {
            await this.$validator.reset();
            this.$router.push({ name: "settingsManagerList" });
        },
        async getCompanyData() {
            await axios({
                url: `/companies/${this.$route.params.id}`
            }).then(({ data }) => {
                this.companyData = data;
            });
        },
        setLanguage(value) {
            this.companyData.language = value.id;
        },
        async save() {
            const isValid = await this.$validator.validateAll();

            if (this.isLoading || !isValid) {
                return;
            }

            const url = this.isEditing ? `/companies/${this.companyData.id}` : "/companies";
            const method = this.isEditing ? "PUT" : "POST";

            this.isLoading = true;
            this.sendRequest(url, method);
        },
        sendRequest(url, method) {
            axios({
                url,
                method,
                data: this.companyData
            }).then(() => {
                this.$notify({
                    group: null,
                    title: "Confirmation",
                    text: "The company information has been updated!",
                    type: "success"
                });
                this.cancel();
            }).catch((error) => {
                this.$notify({
                    group: null,
                    title: "Error",
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.isLoading = false;
            });
        }
    }
};
</script>

<style lang="scss">
.company-general-information {
    .profile-image-container {
        display: flex;
        flex-direction: column;
        width: 160px;
        margin: 0 auto;
        margin-bottom: 15px;

        .profile-image {
            width: 160px;
            height: 160px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(230, 230, 230, 0.7);
        }

        label {
            width: 100%;
            border-radius: 0;
        }

        input[type='file'] {
            display: none;
        }
    }
}
</style>
