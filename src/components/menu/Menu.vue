<template>

    <div class="container">

        <Navbar />

        <div>

            <button type="button" class="btn btn-secondary float-start">View/Add Categories</button>

            <button type="button" class="btn btn-secondary float-end" v-if="numOfCategories > 0">Add New Items</button>

        </div>

        <div class="clearfix"></div>

        <div>
            Is User Logged In? {{ isUserLoggedIn }}
            <br />
            Num Of Categories: {{ numOfCategories }}
            <br />
            User Id Is: {{ LoggedInUserId }}
            <br />
            Categories Array: {{ listOfCategories }}
        </div>

    </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

import { mapState, mapActions, mapMutations } from 'vuex';

export default {

    name: "Menu",

    data() {
        return {
            userId: "",
            userName: "",
        }
    },

    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.isLoggedInUser();
            this.displayAllCategories({ userIdIs: this.userId });
        }
        else {
            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });
        }
    },

    components: {
        Navbar,
    },

    computed: {
        ...mapState(['isUserLoggedIn', 'LoggedInUserId', 'numOfCategories', 'listOfCategories']),
    },

    methods: {
        ...mapActions(['redirectTo']),
        ...mapMutations(['isLoggedInUser', 'displayAllCategories']),
    },

}

</script>

<style lang="scss" scoped></style>