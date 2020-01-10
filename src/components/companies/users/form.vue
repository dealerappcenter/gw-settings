<template>
    <container-template>
        <tabs-menu slot="tab-menu" />
        <div slot="tab-content">
            <h5 class="form-title">
                {{ title }}
            </h5>
            <div class="row user-general-information">
                <div class="col-12 m-b-20">
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <template v-if="isEditing">
                                <div class="form-group form-group-default required">
                                    <label>First name</label>
                                    <input
                                        v-model="userData.firstname"
                                        v-validate="'required:true|min:2|alpha_spaces'"
                                        class="form-control"
                                        type="text"
                                        name="firstname"
                                        data-vv-as="First Name"
                                    >
                                    <span class="text-danger">{{ errors.first("firstname") }}</span>
                                </div>
                                <div class="form-group form-group-default required">
                                    <label>Last name</label>
                                    <input
                                        v-model="userData.lastname"
                                        v-validate="'required:true|min:2|alpha_spaces'"
                                        data-vv-as="Last Name"
                                        name="lastname"
                                        class="form-control"
                                        type="text"
                                    >
                                    <span class="text-danger">{{ errors.first("lastname") }}</span>
                                </div>
                                <div class="form-group form-group-default">
                                    <label>Cell phone</label>
                                    <input
                                        v-model="userData.cell_phone_number"
                                        v-validate="'min:2|numeric'"
                                        data-vv-as="Cell phone"
                                        class="form-control"
                                        name="phone"
                                        type="text"
                                    >
                                    <span class="text-danger">{{ errors.first("phone") }}</span>
                                </div>
                            </template>
                            <div class="form-group form-group-default required">
                                <label>Email</label>
                                <input
                                    v-model="userData.email"
                                    v-validate="'required:true|email'"
                                    data-vv-as="Email"
                                    data-vv-name="email"
                                    class="form-control"
                                    type="text"
                                    name="email"
                                >
                                <span class="text-danger">{{ errors.first("email") }}</span>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 m-b-20">
                            <div class="col-12 col-md">
                                <template v-if="isEditing">
                                    <div class="form-group">
                                        <label>Language</label>
                                        <multiselect
                                            v-if="initializeComplete"
                                            v-model="selectedLanguage"
                                            :options="languages"
                                            :show-labels="false"
                                            label="name"
                                            name="language"
                                            track-by="id"
                                            @input="setLanguage"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label>Timezone</label>
                                        <multiselect
                                            v-if="initializeComplete"
                                            v-model="userData.timezone"
                                            :show-labels="false"
                                            :max-height="175"
                                            :options="timezones"
                                            name="timezone"
                                        />
                                    </div>
                                </template>
                                <div class="form-group">
                                    <label>Role
                                        <span class="multiseletc-required">*</span>
                                    </label>
                                    <multiselect
                                        v-if="initializeComplete"
                                        v-model="selectedRole"
                                        v-validate="'required:true'"
                                        :max-height="175"
                                        :options="roles"
                                        :show-labels="false"
                                        data-vv-as="role"
                                        data-vv-name="role"
                                        name="role"
                                        label="name"
                                        track-by="id"
                                        @input="setRole"
                                    />
                                    <span class="text-danger">{{ errors.first("role") }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-xl d-flex justify-content-end mt-2">
                    <button :disabled="isLoading" class="btn btn-danger mr-2" @click="cancel()">
                        Cancel
                    </button>
                    <button
                        :disabled="isLoading || !hasChanged"
                        class="btn btn-primary"
                        @click="confirmAction()"
                    >
                        {{ isEditing ? "Save" : "Invite" }}
                    </button>
                </div>
            </div>
        </div>
    </container-template>
</template>

<script>
import { mapState } from "vuex";
import generalMixins from "../../../mixins/general";
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
        generalMixins,
        vueRouterMixins
    ],
    data() {
        return {
            dialogProps: {
                editing: {
                    title: "Editing User!",
                    message: "Are you sure you want to update this user's information?"
                },
                inviting: {
                    title: "Invite User!",
                    message: "Are you sure you want to invite this user to your company?"
                }
            },
            initializeComplete: false,
            isLoading: false,
            selectedLanguage: null,
            selectedRole: null,
            userData: {}
        }
    },
    computed: {
        ...mapState({
            timezones: state => state.Application.timezones,
            languages: state => state.Application.languages,
            roles: state => state.Application.roles
        }),
        title() {
            return this.isEditing && "Editing User" || "Invite User";
        },
        isEditing() {
            return !!this.$route.params.id;
        }
    },
    async created() {
        await this.$store.dispatch("Application/getSettingsLists");

        if (this.isEditing) {
            await this.getUserData();
            this.selectedLanguage = this.languages.find(language => language.id == this.userData.language);
            this.selectedRole = this.roles.find(role => role.id == this.userData.roles_id);
        }

        this.initializeComplete = true;
    },
    methods: {
        async confirmAction() {
            const isValid = await this.$validator.validateAll();

            if (isValid) {
                const action = this.isEditing ? "editing" : "inviting";

                this.basicActionsModal({
                    ...this.dialogProps[action],
                    handler: this.save
                });
            }
        },
        async getUserData() {
            await axios({
                url: `/users/${this.$route.params.id}`
            }).then(({ data }) => {
                this.userData = data;
            });
        },
        setLanguage(value) {
            this.userData.language = value.id;
        },
        setRole(value) {
            this.userData.roles_id = value.id;
        },
        save() {
            if (this.isLoading) {
                return;
            }

            const url = this.isEditing ? `/users/${this.userData.id}` : "/users/invite";
            const method = this.isEditing ? "PUT" : "POST";
            let data;

            if (!this.userData.id) {
                data = new FormData();
                data.append("email", this.userData.email);
                data.append("role_id", this.selectedRole.id);
            } else {
                data = this.userData;
            }

            this.sendRequest(url, method, data);
        },
        sendRequest(url, method, data) {
            this.isLoading = true;

            axios({
                url,
                method,
                data
            }).then(() => {
                this.$notify({
                    title: "Confirmation",
                    text: "Your information has been updated!",
                    type: "success"
                });
                this.cancel();
            }).catch((error) => {
                this.$notify({
                    title: "Error",
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.isLoading = false;
            });
        },
        async cancel() {
            await this.$validator.reset();
            this.$router.push({ name: "settingsCompaniesUsersList" });
        }
    }
};
</script>

<style lang="scss">
.user-general-information {
    margin: 20px;
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

    .multiseletc-required {
        color: #f55753;
        font-family: arial;
        font-size: 20px;
    }
}
</style>
