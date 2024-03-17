<template>

    <div class="container">

        <Navbar />

        <div>

            <router-link :to="{ name: 'ViewCategories', params: { locationId: locationId } }">
                <button type="button" class="btn btn-secondary float-start">View/Add Categories</button>
            </router-link>

            <button type="button" class="btn btn-secondary float-end" v-if="numOfCategories > 0">Add New Items</button>

        </div>

        <div class="clearfix"></div>

        <!-- <div>
            Is User Logged In? {{ isUserLoggedIn }}
            <br />
            Num Of Categories: {{ numOfCategories }}
            <br />
            User Id Is: {{ LoggedInUserId }}
            <br />
            Categories Array: {{ listOfCategories }}
        </div> -->

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
            // locationId: "",
            locationId: this.$route.params.locationId,
        }
    },

    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.isLoggedInUser();
            // this.locationId = this.$route.params.locationId;
            this.displayAllCategories({ userIdIs: this.userId, locationIdIs: this.locationId });
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

    computed: {
        ...mapState(['isUserLoggedIn', 'LoggedInUserId', 'numOfCategories', 'listOfCategories']),
    },

    methods: {
        ...mapActions(['redirectTo']),
        ...mapMutations(['isLoggedInUser', 'displayAllCategories', 'CanUserAccessThisLocation']),
    },

}

</script>

<style lang="scss" scoped></style>