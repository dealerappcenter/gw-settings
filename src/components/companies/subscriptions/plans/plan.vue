<template>
    <div class="plan">
        <div :class="['generic_content', isSelected ? 'active' : '', 'clearfix']">
            <!--HEAD PRICE DETAIL START-->
            <div class="generic_head_price clearfix">
                <!--HEAD CONTENT START-->
                <div class="generic_head_content clearfix">
                    <!--HEAD START-->
                    <div class="head_bg" />
                    <div class="head">
                        <span>{{ plan.name }}</span>
                    </div>
                    <!--//HEAD END-->
                </div>
                <!--//HEAD CONTENT END-->
                <!--PRICE START-->
                <div class="generic_price_tag clearfix">
                    <span class="price">
                        <span class="sign">$</span>
                        <span class="currency">{{ plan[selectedFrecuency.type] | getPrice }} </span>
                        <span class="cent">.00</span>
                        <span class="month">/{{ selectedFrecuency.frecuency }}</span>
                    </span>
                </div>
                <!--//PRICE END-->
            </div>
            <!--//HEAD PRICE DETAIL END-->
            <!--FEATURE LIST START-->
            <div class="generic_feature_list">
                <ul v-if="plan.settings.length">
                    <li
                        v-for="planSetting in plan.settings"
                        :key="planSetting.key"
                    >
                        <span> {{ planSetting.value }}</span>
                        {{ planSetting.key | formatSetting }}
                    </li>
                </ul>
            </div>
            <!--//FEATURE LIST END-->

            <!--BUTTON START-->
            <template v-if="isSelected">
                <div v-if="!isActive || isCancelled" class="generic_price_btn re-subscribe clearfix">
                    <a href="#" @click.prevent.stop="() => $emit('change-plan', plan)">Re-Subscribe</a>
                </div>
                <div v-else class="generic_price_btn cancel clearfix">
                    <a href="#" @click.prevent.stop="() => $emit('cancel-plan', plan)">Cancel</a>
                </div>
            </template>
            <template v-else>
                <div class="generic_price_btn clearfix">
                    <a @click.prevent.stop="() => $emit('change-plan', plan)">Try {{ plan.name }}</a>
                </div>
            </template>
            <!--//BUTTON END-->
        </div>
        <div :style="{ opacity : isSelected ? '1' : '0' }" class="selected-plan-details">
            <h5>This is your current plan</h5>
            <p v-if="isPaid">
                Your membership will automatically renew on 06/28/20
            </p>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "Plan",
    filters: {
        getPrice(value) {
            const isNumber = _.isNumber(Number(value));
            let data = 0;
            if (value && isNumber) {
                data = value.split(".")[0];
            }
            return data;
        },
        formatSetting(value) {
            return _.startCase(value);
        }
    },
    props: {
        plan: {
            required:true,
            type: Object
        },
        isSelected: {
            type: Boolean,
            default: false
        },
        selectedFrecuency: {
            required: true,
            type: Object
        }
    },
    computed: {
        ...mapGetters({
            isActive: "Subscription/isActive",
            isCancelled: "Subscription/isCancelled",
            isPaid: "Subscription/isPaid"
        })
    }
}
</script>

<style lang="scss">
.plan {
    background-color: white;

    &.is-not-selected {
        opacity: .5;
    }

    .selected-plan-details {
        background-color: var(--base-color);
        padding: 20px;

        h5 {
            border-bottom: none;
            color: white;
            justify-content: center;
            padding-bottom: 0;
            margin-bottom: 0;
            margin-top: 0;
        }

        p {
            border-top: 1px solid rgba(230, 230, 230, 0.7);
            color: white;
            font-size: 16px;
            margin-bottom: 0;
            margin-top: 10px;
            padding-top: 10px;
            text-align: center;
        }
    }
}
</style>
