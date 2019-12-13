<template>
    <container-template>
        <tabs-menu slot="tab-menu" />
        <div slot="tab-content">
            <h5>
                Users
                <router-link :to="{ name: 'settingsCompaniesUsersForm' }" class="btn btn-primary">
                    New User Invite
                </router-link>
            </h5>
            <ul class="nav nav-tabs nav-horizontal">
                <li class="nav-item">
                    <a
                        :class="{ active: listToShow == 'usersList' }"
                        @click.prevent="listToShow = 'usersList'"
                    >
                        Users
                    </a>
                </li>
                <li class="nav-item">
                    <a
                        :class="{ active: listToShow == 'newUsersList' }"
                        @click.prevent="listToShow = 'newUsersList'"
                    >
                        Invites
                    </a>
                </li>
            </ul>
            <div v-if="listToShow == 'usersList'" class="table-responsive">
                <vuetable
                    ref="Vuetable"
                    :append-params="appendParams.users"
                    :fields="usersFields"
                    :http-fetch="getTableData"
                    api-url="/users"
                    class="table table-hover table-condensed"
                    pagination-path=""
                >
                    <template slot="fullname" slot-scope="props">
                        <span>{{ props.rowData.firstname }} {{ props.rowData.lastname }}</span>
                    </template>

                    <template slot="actions" slot-scope="props">
                        <div class="d-flex align-items-center justify-content-end">
                            <button class="btn btn-primary m-l-5" @click="editUser(props.rowData.id)">
                                <i class="fa fa-edit" aria-hidden="true" />
                            </button>
                            <button
                                :class="{ 'disable-element': isCurrentUser(props.rowData.id) }"
                                :disabled="isCurrentUser(props.rowData.id)"
                                class="btn btn-danger m-l-5"
                                @click="deleteConfirm(props.rowData.id)"
                            >
                                <i class="fa fa-trash" aria-hidden="true" />
                            </button>
                        </div>
                    </template>
                </vuetable>
            </div>
            <div v-else class="table-responsive">
                <vuetable
                    ref="Vuetable"
                    :append-params="appendParams.invites"
                    :fields="usersInviteFields"
                    :http-fetch="getTableData"
                    api-url="/users-invite"
                    class="table table-hover table-condensed"
                    pagination-path=""
                >
                    <template slot="actions" slot-scope="props">
                        <div class="d-flex align-items-center justify-content-end">
                            <button
                                class="btn btn-danger m-l-5"
                                @click="deleteConfirm(props.rowData.id)"
                            >
                                <i class="fa fa-trash" aria-hidden="true" />
                            </button>
                        </div>
                    </template>
                </vuetable>
            </div>
        </div>
    </container-template>
</template>

<script>
import { mapState } from "vuex";
import generalMixins from "../../../mixins/general";
import listMixins from "../../../mixins/listMixins";
import ContainerTemplate from "../../../container";
import TabsMenu from "../tabs";

export default {
    name: "UsersList",
    components: {
        ContainerTemplate,
        TabsMenu
    },
    mixins: [
        generalMixins,
        listMixins
    ],
    data() {
        return {
            appendParams: {
                invites: {
                    format: "true",
                    relationships: "companies,roles",
                    q: "(is_deleted:0)"
                },
                users: {
                    format: "true",
                    relationships: "roles"
                }
            },
            usersFields: [{
                name: "fullname",
                sortField: "firstname",
                title: "Name"
            }, {
                name: "roles.0.name",
                title:"Role",
                sortField: "roles_id",
                width: "30%"
            }, {
                name: "lastvisit",
                title: "Last Visit",
                sortField: "lastvisit",
                width: "30%"
            }, {
                name: "status",
                sortField: "status",
                width: "30%",
                formatter(value) {
                    return value ? "Active" : "Inactive";
                }
            }, {
                name: "actions",
                title: "Actions",
                titleClass: "table-actions",
                dataClass: "table-actions"
            }],
            usersInviteFields:[
                {
                    name: "email",
                    sortField: "email",
                    title: "Email"
                }, {
                    name: "roles.0.name",
                    title:"Role",
                    sortField: "roles_id",
                    width: "30%"
                }, {
                    name: "actions",
                    title: "Actions",
                    titleClass: "table-actions",
                    dataClass: "table-actions"
                }
            ],
            listToShow:"usersList"
        }
    },
    computed: {
        ...mapState({
            userData: state => state.User.data
        })
    },
    methods: {
        deleteConfirm(usersId) {
            this.basicActionsModal({
                title: "Delete User",
                message: "Are you sure you want to delete this user?",
                handler: this.deleteUser,
                params: usersId
            });
        },
        deleteUser(usersId) {
            if (this.isCurrentUser(usersId)) {
                return;
            }

            axios({
                url: `/users/${usersId}`,
                method: "DELETE"
            }).then(() => {
                this.$notify({
                    group: null,
                    title: "Deleted",
                    text: "The user has been deleted",
                    type: "success"
                });
            }).catch((error) => {
                this.$notify({
                    group: null,
                    title: "Error",
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {

            })
        },
        editUser(usersId) {
            this.$router.push({
                name: "settingsCompaniesUsersFormEdit",
                params:{
                    id: usersId
                }
            });
        },
        getTableData(apiUrl, options) {
            return axios({
                url: apiUrl,
                params: options.params
            });
        },
        isCurrentUser(usersId) {
            return usersId == this.userData.id;
        }
    }
};
</script>

<style lang="scss" scoped>
.nav-item {
    cursor: pointer;
}
</style>
