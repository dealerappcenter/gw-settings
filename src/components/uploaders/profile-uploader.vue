<template>
    <div class="profile-upload">
        <div class="profile-image">
            <img
                v-if="imgUrl"
                id="logo"
                :src="imgUrl"
                class="gw-img-fluid"
            >
            <img
                v-else
                id="logo"
                src="../../assets/default-avatar.png"
                class="gw-img-fluid"
            >
        </div>
        <div class="upload-profile-image">
            <dashboard-uploader
                ref="fileUploader"
                :xhr-config="uppyXhrConfig"
                :uppy-config="uppyConfig"
                modal-button
                @uploaded="uploaded"
                @upload-error="onError"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import isURL from "is-url";
import DashboardUploader from "./dashboard-file-uploader";

export default {
    name: "ProfileUploader",
    components: {
        DashboardUploader
    },
    props: {
        defaultAvatar: {
            type: String,
            default: ""
        },
        avatarUrl: {
            type: String,
            default: ""
        },
        endpoint: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            file: null,
            uppyConfig: {
                debug: process.env.NODE_ENV !== "production",
                restrictions: {
                    maxNumberOfFiles: 1,
                    allowedFileTypes: ["image/*"],
                    meta: {
                        atributes: JSON.stringify({
                            type: "profile"
                        })
                    }
                }
            }
        }
    },
    computed: {
        ...mapState({
            userToken: state => state.User.token
        }),
        imgUrl() {
            return this.avatarUrl.length && isURL(this.avatarUrl) ? this.avatarUrl : this.defaultAvatar;
        },
        uppyXhrConfig() {
            return {
                formData: true,
                fieldName: "file",
                endpoint: `${axios.defaults.baseURL}${this.endpoint}`,
                headers: {
                    Authorization: this.userToken
                }
            };
        },
        fileInputConfig() {
            return {
                locale: {
                    strings: {
                        chooseFiles: "Select Files"
                    }
                }
            };
        }
    },
    methods: {
        onError(file, error) {
            this.$notify({
                title: "Error:",
                text: error,
                type: "error"
            });
        },
        uploaded(file, data) {
            this.$emit("uploaded", file, data);
        }
    }
}
</script>

<style lang="scss" scoped>
.gw-img-fluid {
    max-height: 100%;
    max-width: 100%;
}
</style>
