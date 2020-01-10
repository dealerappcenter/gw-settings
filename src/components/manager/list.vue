<template>
    <container-template>
        <div slot="tab-content">
            <h5>
                Companies
                <router-link :to="{ name: 'settingsManagerForm' }" class="btn btn-primary">
                    New Company
                </router-link>
            </h5>
            <div class="table-responsive">
                <vuetable
                    ref="Vuetable"
                    :append-params="appendParams"
                    :fields="companiesFields"
                    :http-fetch="getTableData"
                    api-url="/companies"
                    class="table table-hover table-condensed"
                    pagination-path=""
                >
                    <img
                        slot="profile-image"
                        slot-scope="props"
                        :src="props.rowData.logo && props.rowData.logo.url"
                        height="25px"
                    >
                    <template slot="actions" slot-scope="props">
                        <div class="d-flex align-items-center justify-content-end">
                            <button class="btn btn-primary m-l-5" @click="editCompany(props.rowData.id)">
                                <i class="fa fa-edit" aria-hidden="true" />
                            </button>
                            <button
                                :class="{ 'disable-element': isCurrentCompany(props.rowData.id) }"
                                :disabled="isCurrentCompany(props.rowData.id)"
                                class="btn btn-danger m-l-5"
                                @click="confirmDelete(props.rowData.id)"
                            >
                                <i class="fa fa-trash" aria-hidden="true" />
                            </button>
                        </div>
                    </template>
                </vuetable>
            </div>

            <modal
                :draggable="true"
                :adaptive="true"
                :scrollable="true"
                name="company-modal"
                height="auto"
                @closed="selectedCompany = null"
            />
        </div>
    </container-template>
</template>

<script>
import { mapState } from "vuex";
import generalMixins from "../../mixins/general";
import ContainerTemplate from "../../container";

export default {
    name: "CompaniesManager",
    components: {
        ContainerTemplate
    },
    mixins: [
        generalMixins
    ],
    data() {
        return {
            companiesFields: [{
                name: "profile-image",
                title: "Logo",
                width: "30%"
            }, {
                name: "name",
                sortField: "name",
                width: "30%"
            }, {
                name: "actions",
                title: "Actions",
                titleClass: "table-actions",
                dataClass: "table-actions"
            }],
            appendParams:{
                format: "true",
                relationships: "hasActivities,logo",
                q: "(is_deleted:0)"
            },
            isEditable: true,
            isLoading: false,
            selectedCompany: null
        }
    },
    computed: {
        ...mapState({
            company: state => state.Company.data
        })
    },
    methods: {
        checkActivities(companyId) {
            if (company.has_activities == 1) {
                this.$modal.show("basic-modal", {
                    title: "Delete Company",
                    message: "You cannot delete companies that have activities registered in the system.",
                    buttons: [{
                        title: "Accept",
                        class: "btn-success",
                        handler: () => {
                            this.$modal.hide("basic-modal");
                        }
                    }]
                });
            } else {
                this.deleteCompany(companyId);
            }
        },
        confirmDelete(companyId) {
            if (this.isLoading) {
                return;
            }

            this.basicActionsModal({
                title: "Delete Company",
                message: "Are you sure you want to delete this company?",
                handler: this.checkActivities,
                params: companyId
            });
        },
        deleteCompany(companyId) {
            this.isLoading = true;

            axios({
                url: `/companies/${companyId}`,
                method: "DELETE"
            }).then(() => {
                this.$notify({
                    title: "Deleted",
                    text: "The company has been deleted",
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
            });
        },
        editCompany(companyId) {
            this.$router.push({
                name: "settingsManagerFormEdit",
                params: {
                    id: companyId
                }
            });
        },
        getTableData(apiUrl, options) {
            return axios({
                url: apiUrl,
                params: options.params
            });
        },
        isCurrentCompany(companyId) {
            return companyId == this.company.id;
        }
    }
};
</script>
