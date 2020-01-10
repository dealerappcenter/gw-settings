<template>
    <container-template>
        <tabs-menu slot="tab-menu" />
        <div slot="tab-content" class="row custom-fields-settings">
            <div class="col">
                <div class="custom-fields">
                    <h5>
                        {{ title }}
                    </h5>
                    <div class="row custom-fields-container">
                        <div class="col-md-3">
                            <fields-text
                                ref="text"
                                :class="{ 'selected': fieldsType == 'text' }"
                                :field-data="fieldData"
                                @schema="setSchema"
                            />
                            <fields-select
                                ref="select"
                                :class="{ 'selected': fieldsType == 'select' }"
                                :field-data="fieldData"
                                @schema="setSchema"
                            />
                        </div>
                        <div class="col-md-9">
                            <custom-fields-form
                                v-if="fieldsSchema"
                                ref="customFields"
                                :emit-values-on-update="true"
                                :form-fields="fieldsSchema"
                                :form-options="formOptions"
                                class="d-flex h-100 flex-column"
                                form-name="customFields"
                                @formCancelled="formCancelled"
                                @formSubmitted="formSubmitted"
                                @formValuesUpdated="formValuesUpdated"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </container-template>
</template>

<script>
import ContainerTemplate from "../../../container";
import FieldsSelect from "./fields/select";
import FieldsText from "./fields/text";
import TabsMenu from "../tabs";

export default {
    name: "Form",
    components: {
        ContainerTemplate,
        FieldsSelect,
        FieldsText,
        TabsMenu
    },
    data() {
        return {
            formData: {
                name: ""
            },
            fieldData: null,
            fieldsSchema: [],
            fieldsType: null,
            fieldsTypeId: null,
            formOptions: {
                actionsWrapperClass: "d-flex justify-content-end mt-auto",
                buttons: {
                    cancel: {
                        class: "btn btn-danger m-r-10",
                        text: "Cancel"
                    },
                    submit: {
                        class: "btn btn-primary",
                        text: "Save"
                    }
                }
            },
            selectedCustomField: "text-field",
            selectedModule: {}
        };
    },
    computed: {
        isEditing() {
            return !!this.$route.params.id;
        },
        title() {
            return (this.isEditing ? "Editing Custom Field for: " : "Adding Custom Field for: ") + this.selectedModule.name;
        }
    },
    created() {
        this.getModules();

        if (this.isEditing) {
            this.getCustomFieldData();
        }
    },
    methods: {
        formCancelled() {
            this.$router.push({ name: "settingsAppsCustomFieldsList" });
        },
        formSubmitted({ values }) {
            const data = {
                name: Math.random().toString(36).substr(2, 4) + "_" + Math.random().toString(36).substr(2, 4),
                custom_fields_modules_id: this.selectedModule.id,
                fields_type_id: this.fieldsTypeId,
                attributes: {}
            };
            const url = "/custom-fields" + (this.isEditing ? `/${this.$route.params.id}` : "");
            const method = this.isEditing ? "PUT" : "POST";

            Object.keys(values).forEach((key) => {
                if (key.startsWith("attributes:")) {
                    data.attributes[key.split(":")[1]] = values[key];
                } else {
                    if (this.fieldsType == "select" && key == "values") {
                        data[key] = values[key].split("\n");
                    } else {
                        data[key] = values[key];
                    }
                }
            });

            axios({
                url,
                method,
                data
            }).then(() => {
                this.formCancelled();
            });
        },
        formValuesUpdated(values) {
            // While not the best solution due to design. It's something that can be worked with.
            if (this.fieldsType == "select" && values.values) {
                const options = values.values.split("\n").map(option => option.trim());

                this.$refs.customFields.$refs.control[2].$children[0].options = options;
            }
        },
        getCustomFieldData() {
            axios({
                url: `/custom-fields/${this.$route.params.id}`
            }).then(async({ data }) => {
                data.attributes = JSON.parse(data.attributes);

                if (data.type.name == "select") {
                    data.values = data.values.reduce((valuesArray, value) => {
                        valuesArray[+value.value] = value.label;
                        return valuesArray;
                    }, []).join("\n");
                }

                this.fieldsType = data.type.name;
                this.fieldsTypeId = data.fieldsTypeId;
                await (this.fieldData = data);
                this.$refs[this.fieldsType].sendSchema();
            });
        },
        getModules() {
            axios({
                url: "/custom-fields-modules"
            }).then(({ data }) => {
                let preSelectedModule = null;
                preSelectedModule = data.find(module => module.name == this.$route.params.module);

                if (preSelectedModule) {
                    this.selectedModule = preSelectedModule;
                }
            });
        },
        save() {},
        async setSchema(schema, type, typeId) {
            await (this.fieldsSchema = []);
            this.fieldsSchema = schema;
            this.fieldsType = type;
            this.fieldsTypeId = typeId;
        }
    }
};
</script>

<style lang="scss" scoped>
.custom-fields {
    .custom-fields-container /deep/ {
        padding-top: 40px;

        .selected {
            border:1px solid var(--base-color);
        }

        .col-3 {
            padding-left: 20px;
            padding-right: 20px;
        }

        .custom-field {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            margin-bottom: 20px;
            padding: 15px;

            &__image {
                width: 120px;
            }

            span {
                margin-top: 10px;
                font-size: 15px;
                font-weight: bold;
            }

            &.selected {
                outline: 1px solid #e5e5e5;
                box-shadow: 2px 2px 2px #e5e5e5;
            }
        }
    }

    .form-control {
        height: 43px;
    }
}
</style>
