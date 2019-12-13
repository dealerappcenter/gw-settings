<template>
    <div class="row">
        <div class="col">
            <transition name="fade" mode="out-in">
                <component
                    :is="currentComponent"
                    @changeView="changeView"
                />
            </transition>
        </div>
    </div>
</template>

<script>
import TeamsCRUD from "./crud";
import TeamsList from "./list";

export default {
    components: {
        TeamsCRUD,
        TeamsList
    },
    data() {
        return {
            currentComponent: "TeamsList"
        }
    },
    methods: {
        changeView(view) {
            this.currentComponent = view;
        }
    }
};
</script>
