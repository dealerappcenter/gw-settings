<template>
    <div class="row">
        <div
            v-for="plan in plans"
            :key="plan.stripe_plan"
            class="col-12 col-lg-6"
        >
            <plan
                :plan="plan"
                :selected-frecuency="selectedFrecuency"
                :is-selected="selectedPlan == plan.stripe_plan"
                :class="{ 'is-not-selected': (selectedPlan != '') && (selectedPlan != plan.stripe_plan) }"
                @cancel-plan="(plan) => $emit('cancel-subscription', plan)"
                @change-plan="changePlan"
            />
        </div>
    </div>
</template>

<script>
import Plan from "./plan";

export default {
    name: "Plans",
    components:{
        Plan
    },
    props: {
        plans: {
            type: Array,
            default() {
                return [];
            }
        },
        selectedPlan: {
            type: String,
            default: ""
        },
        selectedFrecuency: {
            required:true,
            type: Object
        },
        showModal: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        changePlan(plan) {
            if (this.showModal) {
                this.changeSubscription(plan)
            } else {
                this.$emit("change-subscription", plan);
            }
        },
        changeSubscription(plan) {
            this.$modal.show("basic-modal", {
                title:"Change Subcription!",
                message:`Did you want to Update your Subcription?`,
                buttons: [{
                    title: "Accept",
                    class: "btn-primary",
                    handler: () => {
                        this.$modal.hide("basic-modal");
                        this.$emit("change-subscription", plan);
                    }
                }, {
                    title: "Cancel",
                    class: "btn-danger",
                    handler: () => {
                        this.$modal.hide("basic-modal");
                    }
                }]
            });
        }
    }
}
</script>
