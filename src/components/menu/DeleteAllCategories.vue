<template>

    <div class="container">

        <Navbar />

        <!-- ------------------------- -->

        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto text-center">
                    <h1>Delete All Categories</h1>
                    <hr>
                    <p class="text-danger">
                        Are you sure you want to delete all categories for this location?
                    </p>
                    <div class="text-center">
                        <h1 class="mb">{{ locName }}</h1>
                        <p class="text-muted">{{ locAddress }}</p>
                    </div>
                    <p class="text-danger">
                        When deleting all categories, Their related menu items will be deleted as well ....
                    </p>
                    <hr>
                </div>
            </div>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button class="btn btn-info text-white" @click="goBack()">Go Back</button>
                    &nbsp;&nbsp;&nbsp;
                    <button class="btn btn-danger text-white" @click="deleteAllCategories()">Delete All Now</button>
                </div>
            </div>

            <br />

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage.length > 0">
                    {{ successMessage }}
                </div>
                <div class="col-auto d-block mx-auto alert alert-warning" v-if="errorMessage.length > 0">
                    {{ errorMessage }}
                </div>
            </div>

        </form>

    </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

import { mapActions } from "vuex";

import axios from "axios";

export default {

    name: 'DeleteAllCategories',

    components: {
        Navbar,
    },

    data() {
        return {
            locationId: this.$route.params.locationId,
            userId: '',
            locName: "",
            locAddress: "",
            successMessage: '',
            errorMessage: '',
            allItemsIdIs: [],
            allCatsIdIs: [],
        }
    },

    async mounted() {

        let user = localStorage.getItem("user_info");

        if (user) {

            this.userId = JSON.parse(user).id;

            this.getLocationInfo(this.userId, this.locationId);

            // All Items in This Location
            // http://localhost:3000/items?locationId=3
            let result = await axios.get(`http://localhost:3000/items?locationId=${this.locationId}`);
            let resultLength = result.data.length;
            for (var i = 0; i < resultLength; i++) {
                this.allItemsIdIs.push(result.data[i].id);
            }

            // All Categories in This Location 
            // http://localhost:3000/categories?locationId=3
            // write locId or locationId depend on db.json file (database)
            let resultCat = await axios.get(`http://localhost:3000/categories?locationId=${this.locationId}`);
            let resultCatLength = resultCat.data.length;
            for (var i = 0; i < resultCatLength; i++) {
                this.allCatsIdIs.push(resultCat.data[i].id);
            }

        } else {

            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });

        }

    },

    methods: {

        ...mapActions(['redirectTo']),

        goBack() {
            this.$router.push({ name: "ViewCategories", params: { locationId: this.locationId } });
        },

        async getLocationInfo(userId, locationId) {
            let result = await axios.get(`http://localhost:3000/locations?userId=${userId}&id=${locationId}`);
            let locDetails = [];
            if (result.status == 200) {
                locDetails = result.data;
                this.locName = locDetails[0].name;
                this.locAddress = locDetails[0].address;
            }
        },

        async deleteAllCategories() {

            let allCatsResults = [];
            for (var i = 0; i < this.allCatsIdIs.length; i++) {
                let result = await axios.delete(`http://localhost:3000/categories/${this.allCatsIdIs[i]}`);
                if (result.status == 200) {
                    allCatsResults.push(true);
                } else {
                    allCatsResults.push(false);
                }
            }

            let allItemsResults = [];
            for (var i = 0; i < this.allItemsIdIs.length; i++) {
                let result = await axios.delete(`http://localhost:3000/items/${this.allItemsIdIs[i]}`);
                if (result.status == 200) {
                    allItemsResults.push(true);
                } else {
                    allItemsResults.push(false);
                }
            }

            if (!allCatsResults.includes(false) && !allItemsResults.includes(false)) {
                this.successMessage = 'Category and Related Items are all deleted Successfully';
                this.errorMessage = '';
                setTimeout(() => {
                    this.$router.push({ name: "home" });
                }, 2000);
            } else {
                this.successMessage = '';
                this.errorMessage = 'Something went wrong, Try again';
            }

        },

    },

}
</script>

<style lang="scss" scoped></style>