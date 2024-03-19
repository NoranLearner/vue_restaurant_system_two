<template>

    <div class="container">

        <Navbar />

        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <h1 class="fs-5 text-center mb-3 text-danger">Delete All Restaurants</h1>
                    <p class="text-danger fw-bolder">Are you sure you want to delete all locations?</p>
                    <span class="text-muted">It will also delete all related items and categories...., Be careful</span>
                    <hr />
                </div>
            </div>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="button" class="btn btn-info text-white" @click="goBack()">Go Back</button>
                    &nbsp;
                    <button type="button" class="btn btn-danger text-white" @click="deleteAllRestaurants()">Delete All Now</button>
                </div>
            </div>

            <br />

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage.length > 0">
                    {{ successMessage }}
                </div>
                <div class="col-auto d-block mx-auto alert alert-danger" v-if="errorMessage.length > 0">
                    {{ errorMessage }}
                </div>
            </div>

        </form>

    </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

import { mapActions } from 'vuex';

import axios from 'axios';

export default {

    name: 'DeleteAllLocations',

    data() {
        return {
            userId: "",
            allLocationsIds: [],
            successMessage: '',
            errorMessage: '',
            allCatsIdIs: [],
            allItemsIdIs: [],
        }
    },

    async mounted() {

        let user = localStorage.getItem("user_info");

        if (user) {

            this.userId = JSON.parse(user).id;

            // All Locations
            // http://localhost:3000/locations?userId=2
            let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}`);
            // console.log(result.data.length);
            let resultLength = result.data.length;
            for (let i = 0; i < resultLength; i++) {
                this.allLocationsIds.push(result.data[i].id);
            }
            // console.table(this.allLocationsIds);

            // All Categories
            // http://localhost:3000/categories?userId=2
            let resultCat = await axios.get(`http://localhost:3000/categories?userId=${this.userId}`);
            let resultCatLength = resultCat.data.length;
            for (var i = 0; i < resultCatLength; i++) {
                this.allCatsIdIs.push(resultCat.data[i].id);
            }

            // All Items
            // http://localhost:3000/items?userId=2
            let resultItems = await axios.get(`http://localhost:3000/items?userId=${this.userId}`);
            let resultItemsLength = resultItems.data.length;
            for (var i = 0; i < resultItemsLength; i++) {
                this.allItemsIdIs.push(resultItems.data[i].id);
            }

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

        // Redirect to Home Page
        goBack() {
            this.redirectTo({ val: "home" });
        },

        async deleteAllRestaurants() {

            // For Items
            let allItemsResults = [];
            for (var i = 0; i < this.allItemsIdIs.length; i++) {
                let result = await axios.delete(`http://localhost:3000/items/${this.allItemsIdIs[i]}`);

                if (result.status == 200) {
                    allItemsResults.push(true);
                } else {
                    allItemsResults.push(false);
                }
            }

            // For Categories
            let allCatsResults = [];
            for (var i = 0; i < this.allCatsIdIs.length; i++) {
                let result = await axios.delete(`http://localhost:3000/categories/${this.allCatsIdIs[i]}`);

                if (result.status == 200) {
                    allCatsResults.push(true);
                } else {
                    allCatsResults.push(false);
                }
            }

            // For Location
            // Code of location must in final

            let allResults = [];

            for (let index = 0; index < this.allLocationsIds.length; index++) {
                let result = await axios.delete(`http://localhost:3000/locations/${this.allLocationsIds[index]}`);
                if (result.status == 200) {
                    allResults.push(true);
                } else {
                    allResults.push(false);
                }
            }

            // console.table(allResults);

            if (!allResults.includes(false) && !allCatsResults.includes(false) && !allResults.includes(false)) {
                // Show Success Message
                this.successMessage = 'Delete All Locations Successfully';
                this.errorMessage = '';
                setTimeout(() => {
                    this.redirectTo({ val: "home" });
                }, 2000);
            } else {
                // Show Error Message
                this.successMessage = '';
                this.errorMessage = 'Something went wrong, Try Again';
            }

        },

    },

}

</script>

<style lang="scss" scoped></style>