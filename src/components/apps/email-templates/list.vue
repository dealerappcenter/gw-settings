<template>
    <container-template>
        <tabs-menu slot="tab-menu" />
        <div slot="tab-content" class="row email-templates-section">
            <div class="col">
                <h5>
                    Email Templates
                    <!-- <router-link :to="{ name: 'settingsAppsEmailTemplatesForm' }" class="btn btn-primary">Create</router-link> -->
                </h5>
                <div class="table-responsive">
                    <vuetable
                        ref="Vuetable"
                        :append-params="appendParams"
                        :fields="templatesFields"
                        :http-fetch="getTableData"
                        api-url="/email-templates"
                        class="table table-hover table-condensed"
                        pagination-path=""
                    >
                        <template slot="actions" slot-scope="props">
                            <div class="d-flex align-items-center justify-content-end">
                                <button
                                    v-if="props.rowData.companies_id == defaultCompany.id"
                                    class="btn btn-complete m-l-5"
                                    title="edit template"
                                    @click="editTemplate(props.rowData)"
                                >
                                    <i
                                        class="fa fa-edit"
                                        aria-hidden="true"
                                    />
                                </button>
                                <button
                                    v-if="props.rowData.companies_id == defaultCompany.id"
                                    class="btn btn-danger m-l-5"
                                    title="delete template"
                                    @click="confirmDeleteTemplate(props.rowData)"
                                >
                                    <i class="fa fa-trash" aria-hidden="true" />
                                </button>
                                <button class="btn btn-complete m-l-5" title="clone template" @click="cloneTemplate(props.rowData)">
                                    <i class="fa fa-copy" aria-hidden="true" />
                                </button>
                            </div>
                        </template>
                    </vuetable>
                </div>
            </div>
        </div>
    </container-template>
</template>

<script>
import { mapState } from "vuex";
import ContainerTemplate from "../../../container";
import TabsMenu from "../tabs";

export default {
    name: "List",
    components: {
        ContainerTemplate,
        TabsMenu
    },
    data() {
        return {
            appendParams: {
                format: "true",
                q: "(is_deleted:0)"
            },
            templatesFields: [{
                name: "name",
                title: "Name",
                sortField: "name",
                width: "50%"

            }, {
                name: "actions",
                title: "Actions",
                titleClass: "table-actions",
                dataClass: "table-actions"
            }]
        }
    },
    computed:{
        ...mapState({
            defaultCompany: state => state.Company.data
        })
    },
    methods: {
        editTemplate(template) {
            this.$router.push({
                name: "settingsAppsEmailTemplatesFormEdit",
                params: {
                    id: template.id
                }
            });
        },
        confirmDeleteTemplate(template) {
            this.$modal.show("basic-modal", {
                title: "Delete Email Template",
                message: `Did you want to delete the Email Template ?`,
                buttons: [{
                    title: "Accept",
                    class: "btn-success",
                    handler: () => {
                        this.$modal.hide("basic-modal");
                        this.disableTemplate(template);
                    }
                }, {
                    title: "Cancel",
                    class: "btn-danger",
                    handler: () => {
                        this.$modal.hide("basic-modal");
                    }
                }]
            });
        },
        disableTemplate(template) {
            axios({
                url: `/email-templates/${template.id}`,
                method: "DELETE"
            }).then(() => {
                this.$notify({
                    group: null,
                    title: "Deleted",
                    text: "The email template has been deleted",
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
                this.$refs.Vuetable.reload();
            })
        },
        cloneTemplate(template) {
            axios({
                url: `/email-templates/${template.id}/copy`,
                method: "POST"
            }).then(() => {
                this.$notify({
                    group: null,
                    title: "Deleted",
                    text: "The email template has clone deleted",
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
                this.$refs.Vuetable.reload();
            })
        }
    }
}
</script>
