<template>
    <nav>
        <router-link :to="{ name: 'home' }" aria-current="page" exact>
            Home
        </router-link>
        <router-link :to="{name:'about'}">About</router-link>
        <router-link to="" @click="logMeOut()">Logout</router-link>
    </nav>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: 'Navbar',
    methods: {
        ...mapActions(['redirectTo']),
        logMeOut(){
            // Delete Data From Local Storage
            localStorage.clear();
            // Redirect to Login page
            this.redirectTo({val: 'login'});
        },
    },
}
</script>

<style lang="scss" scoped>
$fontColor: darkcyan;
$navColor: #525a5a;

nav {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;

    a {
        text-decoration: none;
        font-weight: bold;
        color: $fontColor;
        padding: 20px;
    }

    a.router-link-exact-active,
    a:hover {
        color: $navColor;
        box-shadow: 2px 2px 4px 0 $navColor;
    }
}
</style>