<template>
    <container-template>
        <tabs-menu slot="tab-menu" />
        <div slot="tab-content" class="row branch-general-information">
            <div class="col-12 m-b-20">
                <h5> {{ title }}</h5>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="form-group form-group-default required">
                            <label>Name</label>
                            <input
                                v-model="branchData.name"
                                v-validate="'required:true|min:2'"
                                class="form-control"
                                type="text"
                                name="name"
                            >
                            <span class="text-danger">
                                {{ errors.first("name") }}
                            </span>
                        </div>
                        <div class="form-group form-group-default required">
                            <label>Address</label>
                            <input
                                v-model="branchData.address"
                                v-validate="'required:true|min:2'"
                                class="form-control"
                                type="text"
                                data-vv-as="branch address"
                                name="branch-address"
                            >
                            <span class="text-danger">
                                {{ errors.first("branch-address") }}
                            </span>
                        </div>
                        <div class="form-group form-group-default required">
                            <label>Zip Code</label>
                            <input
                                v-model="branchData.zipcode"
                                v-validate="'required:true|numeric|min:2'"
                                class="form-control"
                                type="text"
                                data-vv-as="zip code"
                                name="zipcode"
                            >
                            <span class="text-danger">
                                {{ errors.first("zipcode") }}
                            </span>
                        </div>
                        <div class="form-group form-group-default required">
                            <label>Email</label>
                            <input
                                v-model="branchData.email"
                                v-validate="'required|email'"
                                class="form-control"
                                name="email"
                                type="email"
                            >
                            <span class="text-danger">
                                {{ errors.first("email") }}
                            </span>
                        </div>
                        <div class="form-group form-group-default required">
                            <label>Phone</label>
                            <input
                                v-model="branchData.phone"
                                v-validate="'required|numeric'"
                                class="form-control"
                                data-vv-as="phone number"
                                name="phone"
                                type="tel"
                            >
                            <span class="text-danger">
                                {{ errors.first("phone") }}
                            </span>
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
import vueRouterMixins from "../../../mixins/vueRouterMixins";
import ContainerTemplate from "../../../container";
import TabsMenu from "../tabs";

export default {
    name: "Form",
    components: {
        ContainerTemplate,
        TabsMenu
    },
    mixins: [
        vueRouterMixins
    ],
    data() {
        return {
            isLoading: false,
            branchData: {}
        }
    },
    computed:{
        isEditing() {
            return !!this.$route.params.id;
        },
        title() {
            return this.isEditing ? "Editing branch" : "Add branch";
        }
    },
    created() {
        this.getBranchData();
    },
    methods: {
        cancel() {
            this.$router.push({ name: "settingsCompaniesBranchesList" });
        },
        getBranchData() {
            this.isEditing && axios({
                url: `/companies-branches/${this.$route.params.id}`
            }).then(({ data }) => {
                this.branchData = data;
            });
        },
        async save() {
            const isValid = await this.$validator.validateAll();

            if (isValid) {
                const method = this.isEditing ? "PUT" : "POST";
                const url = "/companies-branches" + (this.isEditing ? `/${this.branchData.id}` : "");

                this.sendRequest(url, method);
            }
        },
        async sendRequest(url, method) {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true;

            axios({
                url,
                method,
                data: this.branchData
            }).then(async() => {
                this.$notify({
                    group: null,
                    title: "Confirmation",
                    text: "The Branch information has been changed",
                    type: "success"
                });

                await this.$validator.reset();
                this.$router.push({ name: "settingsCompaniesBranchesList" });
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
.branch-general-information {
    margin: 20px 15px;
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
