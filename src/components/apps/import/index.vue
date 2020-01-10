<template>
    <container-template>
        <tabs-menu slot="tab-menu" />
        <div slot="tab-content" class="row import-section">
            <div class="col">
                <h5>Import</h5>
                <wizard-form class="wizard-component import-wizard" shape="tab" color="var(--base-color)">
                    <span slot="title" />
                    <wizard-tab-content title="Upload" icon="fa fa-file-upload">
                        <vue-dropzone id="fileUpload" :options="dropzoneOptions" />
                    </wizard-tab-content>
                    <wizard-tab-content title="Field Mapping" icon="fa fa-map-signs">
                        <fields-mapping />
                    </wizard-tab-content>
                    <wizard-tab-content title="Finish" icon="fa fa-check">
                        <h1>Finish</h1>
                    </wizard-tab-content>
                    <template slot="footer" slot-scope="props">
                        <div class="wizard-footer-left">
                            <wizard-button
                                v-if="props.activeTabIndex"
                                :style="props.fillButtonStyle"
                                @click.native="props.prevTab()"
                            >
                                Previous
                            </wizard-button>
                        </div>
                        <div class="wizard-footer-right">
                            <wizard-button
                                v-if="!props.isLastStep"
                                :style="props.fillButtonStyle"
                                class="wizard-footer-right"
                                @click.native="props.nextTab()"
                            >
                                Next
                            </wizard-button>
                            <wizard-button
                                v-else
                                :style="props.fillButtonStyle"
                                class="wizard-footer-right finish-button"
                                @click.native="$modal.hide('after-signup-wizard')"
                            >
                                {{ props.isLastStep ? 'Done' : 'Next' }}
                            </wizard-button>
                        </div>
                    </template>
                </wizard-form>
            </div>
        </div>
    </container-template>
</template>

<script>
import ContainerTemplate from "../../../container";
import TabsMenu from "../tabs";
import FieldsMapping from "./fields-mapping";
import VueDropzone from "vue2-dropzone";

import {
    FormWizard as WizardForm,
    TabContent as WizardTabContent,
    WizardButton
} from "vue-form-wizard";

export default {
    name: "ImportWizard",
    components: {
        ContainerTemplate,
        FieldsMapping,
        TabsMenu,
        VueDropzone,
        WizardForm,
        WizardTabContent,
        WizardButton
    },
    data() {
        return {
            dropzoneOptions: {
                url: "#"
            }
        };
    }
}
</script>

<style lang="scss">
.import-wizard {
    .wizard-header,
    .wizard-card-footer {
        padding: 0;
    }

    .wizard-tab-content {
        padding: 30px 0 10px;
        min-height: 400px;

        .dropzone {
            min-height: 400px;
        }

        .table.table-condensed {
            tbody {
                 tr {
                    td {
                        overflow: visible;
                    }
                 }
            }
        }
    }
}
</style>
