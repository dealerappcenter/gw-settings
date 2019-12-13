<template>
    <container-template>
        <tabs-menu slot="tab-menu" />
        <div slot="tab-content">
            <h5>Company Profile</h5>
            <div class="row company-general-information">
                <div class="col-12 col-xl">
                    <div class="row">
                        <div class="col-12 col-md-auto">
                            <div class="profile-image-container">
                                <profile-uploader
                                    :avatar-url="avatarUrl"
                                    endpoint="/filesystem"
                                    @uploaded="updateProfile"
                                />
                            </div>
                        </div>
                        <div class="col-12 col-md">
                            <div class="form-group form-group-default required">
                                <label>Name</label>
                                <input
                                    v-model="companyData.name"
                                    v-validate="'required'"
                                    name="name"
                                    type="text"
                                    class="form-control"
                                >
                                <span class="text-danger">{{ errors.first("name") }}</span>
                            </div>
                            <div class="form-group form-group-default required">
                                <label>Address</label>
                                <input
                                    v-model="companyData.address"
                                    v-validate="'required'"
                                    data-vv-as="company address"
                                    name="company-address"
                                    type="text"
                                    class="form-control"
                                >
                                <span class="text-danger">{{ errors.first("company-address") }}</span>
                            </div>
                            <div class="form-group form-group-default required">
                                <label>Zip Code</label>
                                <input
                                    v-model="companyData.zipcode"
                                    v-validate="'required|numeric'"
                                    class="form-control"
                                    type="number"
                                    data-vv-as="zip code"
                                    name="zipcode"
                                >
                                <span class="text-danger">{{ errors.first("zipcode") }}</span>
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
                                <span class="text-danger">{{ errors.first("email") }}</span>
                            </div>
                            <div class="form-group form-group-default required">
                                <label>Phone</label>
                                <input
                                    v-model="companyData.phone"
                                    v-validate="'required|numeric'"
                                    data-vv-as="phone number"
                                    name="phone"
                                    type="phone"
                                    class="form-control"
                                >
                                <span class="text-danger">{{ errors.first("phone") }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-xl">
                    <div class="row">
                        <div class="col-12 col-md">
                            <div class="form-group">
                                <label>Language</label>
                                <multiselect
                                    v-if="initializeComplete"
                                    v-model="selectedLanguage"
                                    v-validate="'required'"
                                    :allow-empty="false"
                                    :options="languages"
                                    :show-labels="false"
                                    name="language"
                                    label="name"
                                    track-by="id"
                                    @input="setSelectValue($event, 'language')"
                                />
                                <span class="text-danger">{{ errors.first("language") }}</span>
                            </div>

                            <div class="form-group">
                                <label>Timezone</label>
                                <multiselect
                                    v-if="initializeComplete"
                                    v-model="companyData.timezone"
                                    v-validate="'required'"
                                    :max-height="175"
                                    :options="timezones"
                                    :show-labels="false"
                                    name="timezone"
                                />
                                <span class="text-danger">{{ errors.first("timezone") }}</span>
                            </div>

                            <div class="form-group">
                                <label>Currency</label>
                                <multiselect
                                    v-if="initializeComplete"
                                    v-model="selectedCurrency"
                                    v-validate="'required'"
                                    :allow-empty="false"
                                    :max-height="175"
                                    :custom-label="currencyLabel"
                                    :options="currencies"
                                    :show-labels="false"
                                    label="currency"
                                    track-by="code"
                                    name="currency"
                                    @input="setSelectValue($event, 'currency_id')"
                                >
                                    <template slot="singleLabel" slot-scope="{ option }">
                                        {{ option.currency }} ({{ option.code }})
                                    </template>
                                </multiselect>
                                <span class="text-danger">{{ errors.first("currency") }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end mt-2">
                <button :disabled="isLoading || !hasChanged" class="btn btn-primary" @click="update()">
                    Save
                </button>
            </div>
        </div>
    </container-template>
</template>

<script>
import { mapState } from "vuex";
import vueRouterMixins from "../../mixins/vueRouterMixins";
import clone from "lodash/clone";
import ContainerTemplate from "../../container";
import TabsMenu from "./tabs";
import ProfileUploader from "../uploaders/profile-uploader";

export default {
    name: "CompanyProfile",
    components: {
        ProfileUploader,
        ContainerTemplate,
        TabsMenu
    },
    mixins: [
        vueRouterMixins
    ],
    data() {
        return {
            initializeComplete: false,
            isLoading: false,
            companyData: {
                language: null,
                filesystem_files: []
            },
            avatarUrl: "",
            selectedLanguage: null,
            selectedCurrency: null,
            uppyConfig: {
                debug: process.env.NODE_ENV !== "production",
                restrictions: {
                    maxNumberOfFiles: 2,
                    allowedFileTypes: ["image/*", ".docx", ".doc", ".pdf", "audio/*"]
                },
                meta: {
                    atributes: JSON.stringify({
                        type: "profile"
                    })
                }
            },
            dashboardConfig: {
                height: 300
            }
        }
    },
    computed:{
        ...mapState({
            company: state => state.Company.data,
            languages: state => state.Application.languages,
            timezones: state => state.Application.timezones,
            currencies: state => state.Application.currencies,
            userToken: state => state.User.token
        }),
        uppyXhrConfig() {
            return {
                formData: true,
                fieldName: "file",
                endpoint: `${axios.defaults.baseURL}/filesystem`,
                headers: {
                    Authorization: this.userToken
                }
            };
        }
    },
    watch: {
        company(company) {
            this.companyData = _.clone(company);
        }
    },
    created() {
        this.initialize();
    },
    methods: {
        async initialize() {
            await this.$store.dispatch("Application/getSettingsLists");
            this.companyData = clone(this.company);
            await this.setInitialSelects();
            this.avatarUrl = this.companyData.logo && this.companyData.logo.url || "";
            this.initializeComplete = true;
        },
        setSelectValue(value, formField, idName = "id") {
            this.companyData[formField] = value[idName];
        },
        currencyLabel({ currency, code }) {
            return `${currency} (${code})`
        },
        setInitialSelects() {
            this.selectedLanguage = this.languages.find(language => language.id == this.companyData.language);
            this.selectedCurrency = this.currencies.find(currency => currency.id == this.companyData.currency_id);
        },
        updateProfile(profile) {
            const formData = {
                files: [{
                    id: this.companyData.logo && this.companyData.logo.id || null,
                    filesystem_id: profile[0].id,
                    field_name: "logo"
                }]
            };

            this.avatarUrl = profile[0].url;
            this.update(formData);
        },
        async processUpdate() {
            await this.$validator.validateAll();

            if (!this.isLoading && !this.errors.any()) {
                this.isLoading = true;
                this.update();
            }
        },
        async update(formData) {
            formData = formData || this.companyData;

            axios({
                url: `/companies/${this.companyData.id}`,
                method: "PUT",
                data: formData
            }).then(({ data }) => {
                this.$store.dispatch("Company/updateData", data.id);
                this.$notify({
                    title: "Confirmation",
                    text: "Company information has been updated successfully!",
                    type: "success"
                });
            }).catch((error) => {
                this.$notify({
                    title: "Error",
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.isLoading = false;
            })
        }
    }
};
</script>

<style lang="scss" scoped>
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
