<template>
    <ul class="nav nav-tabs">
        <li class="nav-item">
            <router-link :to="{ name: 'settingsUsersProfile' }" :class="{active: $route.name == 'settingsUsersProfile'}">
                Profile
            </router-link>
        </li>
        <!-- <li class="nav-item">
            <router-link :to="{ name: 'settingsUsersNotifications' }" :class="{active: $route.name == 'settingsUsersNotifications'}">
                Notifications
            </router-link>
        </li> -->
        <!-- <li class="nav-item">
            <router-link :to="{ name: 'settingsUsersSocial' }" :class="{active: $route.name == 'settingsUsersSocial'}">
                Social
            </router-link>
        </li> -->
        <li class="nav-item">
            <router-link :to="{ name: 'settingsUsersSecurity' }" :class="{active: $route.name == 'settingsUsersSecurity'}">
                Security
            </router-link>
        </li>
        <li class="nav-item">
            <router-link :to="{ name: 'settingsUsersDevices' }" :class="{active: $route.name == 'settingsUsersDevices'}">
                Devices
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    name: "TabsMenu"
};
</script>
