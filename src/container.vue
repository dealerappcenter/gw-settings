<template>
    <div class="apps-settings">
        <h4 class="section-title p-l-10">
            Settings
        </h4>
        <div class="card flex-md-row p-0">
            <slot name="tab-menu" />
            <div class="tab-content bg-white">
                <div class="tab-pane active">
                    <slot name="tab-content" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SettingsContainer"
};
</script>

<style lang="scss" scoped>
.apps-settings {
    .card.flex-md-row {
        min-height: 400px;
    }

    /deep/ .disable-element {
        pointer-events: none;
    }
}
</style>
