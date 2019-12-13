<template>
    <container-template>
        <tabs-menu slot="tab-menu" />
        <div slot="tab-content" class="row themes-section">
            <div class="col">
                <h5>
                    Themes
                </h5>
                <p>Coming Soon!</p>
            </div>
        </div>
    </container-template>
</template>

<script>
import ContainerTemplate from "../../container";
import TabsMenu from "./tabs";

export default {
    name: "List",
    components: {
        ContainerTemplate,
        TabsMenu
    }
};
</script>
