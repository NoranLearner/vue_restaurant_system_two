<template>

    <div class="container">

        <Navbar />

        <router-link :to="{ name: 'AddNewCategory', params: { locationId: locationId } }">
            <button type="button" class="btn btn-secondary float-start">Add Category</button>
        </router-link>

        <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
            <button type="button" class="btn btn-light float-end">Back To Menu</button>
        </router-link>

        <div class="clearfix"></div>

        <!-- ----------------------------------- -->

        <div class="text-center">
            <h1>{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
        </div>

        <!-- ----------------------------------- -->

        <table class="table caption-top" v-if="numOfCategories > 0">
            <caption>
                <span>
                    List Of Categories ({{ numOfCategories }})
                </span>
                <span class="float-end">
                    <router-link :to="{ name: 'DeleteAllCategories', params: { locationId: locationId } }">
                        <button class="btn btn-danger text-white">Delete All Categories</button>
                    </router-link>
                </span>
            </caption>
            <thead class="table-light">
                <tr>
                    <th scope="col">Category Name</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(cat, i) in listOfCategories" :key="i">
                    <th scope="row">{{ cat.name }}</th>
                    <td>
                        <router-link
                            :to="{ name: 'UpdateCategory', params: { catId: cat.id, locationId: cat.locationId } }">
                            <button class="btn btn-success text-white">Update</button>
                        </router-link>
                        &nbsp;
                        <router-link
                            :to="{ name: 'DeleteCategory', params: { catId: cat.id, locationId: cat.locationId } }">
                            <button class="btn btn-danger text-white">Delete</button>
                        </router-link>
                        &nbsp;
                    </td>
                </tr>
            </tbody>
        </table>

        <div role="alert" class="alert alert-warning mt15" v-else>
            No Categories Added Yet
        </div>

    </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

import { mapActions, mapState, mapMutations } from "vuex";

import axios from 'axios';

export default {

    name: 'ViewCategories',

    data() {
        return {
            userId: '',
            userName: '',
            locationId: this.$route.params.locationId,
            locName: '',
            locAddress: '',
        }
    },

    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.CanUserAccessThisLocation({ userIdIs: this.userId, locationIdIs: this.locationId, redirectToPage: "home" });
            this.getLocationInfo(this.userId, this.locationId);
            this.displayAllCategories({ userIdIs: this.userId, locationIdIs: this.locationId });
        }
        else {
            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });
        }
    },

    computed: {
        ...mapState([
            "numOfCategories",
            "listOfCategories"
        ]),
    },

    components: {
        Navbar,
    },

    methods: {
        ...mapActions(['redirectTo']),
        ...mapMutations(['CanUserAccessThisLocation', 'displayAllCategories']),
        async getLocationInfo(userId, locationId) {
            let result = await axios.get(`http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`);
            let locDetails = [];
            if (result.status == 200 && result.data.length > 0) {
                locDetails = result.data;
                this.locName = locDetails[0].name;
                this.locAddress = locDetails[0].address;
            }
        },
    },

}

</script>

<style lang="scss" scoped></style>