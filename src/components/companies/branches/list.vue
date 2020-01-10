<template>
    <container-template>
        <tabs-menu slot="tab-menu" />
        <div slot="tab-content">
            <h5>
                Branches
                <router-link :to="{ name: 'settingsCompaniesBranchesForm' }" class="btn btn-primary">
                    New Branch
                </router-link>
            </h5>
            <div class="table-responsive">
                <vuetable
                    ref="Vuetable"
                    :append-params="appendParams"
                    :fields="branchesFields"
                    :http-fetch="getTableData"
                    api-url="/companies-branches"
                    class="table table-hover table-condensed"
                    pagination-path=""
                >
                    <template slot="actions" slot-scope="props">
                        <div class="d-flex align-items-center justify-content-end">
                            <button class="btn btn-primary m-l-5" @click="editBranch(props.rowData.id)">
                                <i class="fa fa-edit" aria-hidden="true" />
                            </button>
                            <button
                                :class="{ 'disable-element': isCurrentBranch(props.rowData.id) }"
                                :disabled="isCurrentBranch(props.rowData.id)"
                                class="btn btn-danger m-l-5"
                                @click="confirmDelete(props.rowData.id)"
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
    name: "List",
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
            branchesFields: [{
                name: "name",
                sortField: "name"
            }, {
                name: "actions",
                title: "Actions",
                titleClass: "table-actions",
                dataClass: "table-actions"
            }],
            appendParams:{
                format: "true",
                q: "(is_deleted:0)"
            },
            isLoading: false,
            selectedBranch: null
        }
    },
    computed: {
        ...mapState({
            branch: state => state.Company.data.branch
        })
    },
    methods: {
        confirmDelete(roleId) {
            this.basicActionsModal({
                title: "Delete Branch",
                message: "Are you sure you want to delete this branch?",
                handler: this.delete,
                params: roleId
            });
        },
        delete(id) {
            if (this.isLoading || this.branch.id == id) {
                return;
            }

            this.isLoading = true;

            axios({
                url: `/companies-branches/${id}`,
                method: "DELETE"
            }).then(() => {
                this.$notify({
                    title: "Deleted",
                    text: "The branch has been deleted.",
                    type: "success"
                });
                this.$refs.Vuetable.reload();
            }).catch((error) => {
                this.$notify({
                    title: "Error",
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.isLoading = false;
            })
        },
        editBranch(branchId) {
            this.$router.push({
                name: "settingsCompaniesBranchesFormEdit",
                params: {
                    id: branchId
                }
            });
        },
        isCurrentBranch(branchId) {
            return branchId == this.branch.id;
        }
    }
};
</script>
