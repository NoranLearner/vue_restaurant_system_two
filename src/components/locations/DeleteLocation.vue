<template>

    <div class="container">

        <Navbar />

        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <h1 class="fs-5 text-center mb-3 text-danger">Delete Restaurant #{{ deleteLocation }}</h1>
                    <p class="text-danger fw-bolder">Are you sure you want to delete this location?</p>
                    <div class="text-center">
                        {{ name }}
                        <br />
                        {{ phone }}
                        <br />
                        {{ address }}
                    </div>
                    <hr />
                </div>
            </div>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="button" class="btn btn-info text-white" @click="goBack()">Go Back</button>
                    &nbsp;
                    <button type="button" class="btn btn-danger text-white" @click="deleteRestaurant()">Delete
                        Now</button>
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

    name: 'DeleteLocation',

    data() {
        return {
            deleteLocation: '',
            userId: "",
            name: '',
            phone: '',
            address: '',
            locationData: [],
            successMessage: '',
            errorMessage: '',
            allItemsIdIs: [],
            allCatsIdIs: [],
        }
    },

    async mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.deleteLocation = this.$route.params.locationId;
            this.userId = JSON.parse(user).id;
            this.canCurrentUserAccessThisLocation();
            // All Items in This Location
            // http://localhost:3000/items?locId=3
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
        async canCurrentUserAccessThisLocation() {
            let result = await axios.get(`http://localhost:3000/locations?id=${this.deleteLocation}&userId=${this.userId}`);
            if (result.status == 200 && result.data.length > 0) {
                this.locationData = result.data;
                this.name = this.locationData[0].name;
                this.phone = this.locationData[0].phone;
                this.address = this.locationData[0].address;
            } else {
                this.redirectTo({ val: "home" });
            }
        },
        async deleteRestaurant() {

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

            let result = await axios.delete(`http://localhost:3000/locations/${this.deleteLocation}`);
            if (result.status == 200 && !allCatsResults.includes(false) && !allItemsResults.includes(false)) {
                // Show Success Message
                this.successMessage = 'Delete Location Successfully';
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

<style scoped lang="scss"></style>