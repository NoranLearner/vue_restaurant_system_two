<template>

    <div class="container">

        <Navbar />

        <router-link :to="{ name: 'AddNewCategory', params: { locationId: locationId } }">
            <button type="button" class="btn btn-secondary float-start">Add Category</button>
        </router-link>

        <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
            <button type="button" class="btn btn-light float-end">Back To Menu</button>
        </router-link>

    </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

import { mapActions, mapMutations } from 'vuex';

export default {

    name: 'ViewCategories',

    data() {
        return {
            userId: '',
            userName: '',
            locationId: this.$route.params.locationId,
        }
    },

    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.CanUserAccessThisLocation({ userIdIs: this.userId, locationIdIs: this.locationId, redirectToPage: "home" });
        }
        else {
            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });
        }
    },

    components: {
        Navbar,
    },

    methods: {
        ...mapActions(['redirectTo']),
        ...mapMutations(['CanUserAccessThisLocation']),
    },

}

</script>

<style lang="scss" scoped></style>