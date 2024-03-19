<template>

    <div class="container">

        <Navbar />

        <!-- ---------------------------- -->

        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto text-center">
                    <h1>Delete Category #{{ catId }}</h1>
                    <h4>Category Name: {{ name }}</h4>
                    <hr>
                    <p class="text-danger">
                        Are you sure you want to delete this category ?
                    </p>
                </div>
            </div>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button class="btn btn-info text-white" @click="goBack()">Go Back</button>
                    &nbsp;&nbsp;&nbsp;
                    <button class="btn btn-danger text-white" @click="deleteCategory()">Delete Now</button>
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

import axios from "axios";

import { mapActions, mapMutations } from "vuex";

export default {

    name: 'DeleteCategory',

    data() {
        return {
            userId: '',
            locationId: this.$route.params.locationId,
            catId: this.$route.params.catId,
            name: "",
            successMessage: '',
            errorMessage: '',
            allItemsIdIs: [],
            // locationData: '',
        }
    },

    components: {
        Navbar,
    },

    async mounted() {

        let user = localStorage.getItem("user_info");

        if (user) {

            this.userId = JSON.parse(user).id;

            this.getCategoryName(this.userId, this.locationId, this.catId);

            // this.canCurrentUserAccessThisLocation();

            this.canUserAccessThisCategory({
                userIdIs: this.userId,
                locationIdIs: this.locationId,
                catIdIs: this.catId,
                redirectToPage: "home",
            });

            // this.deleteLocation = this.$route.params.locationId;

            // http://localhost:3000/items?catId=5
            let result = await axios.get(`http://localhost:3000/items?catId=${this.catId}`);
            let resultLength = result.data.length;
            for (var i = 0; i < resultLength; i++) {
                this.allItemsIdIs.push(result.data[i].id);
                // console.log(this.allItemsIdIs);
            }

        } else {

            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });

        }

    },

    methods: {

        ...mapActions(['redirectTo']),

        ...mapMutations(["canUserAccessThisCategory",]),

        goBack() {
            // redirect to view-categories page
            this.$router.push({ name: "ViewCategories", params: { locationId: this.locationId } });
        },

        /* async canCurrentUserAccessThisLocation() {
            let result = await axios.get(`
            http://localhost:3000/locations?id=${this.deleteLocation}&userId=${this.userId}
            `);
            if (result.status == 200 && result.data.length > 0) {
                this.locationData = result.data;
                this.name = this.locationData[0].name;
                this.phone = this.locationData[0].phone;
                this.address = this.locationData[0].address;
            } else {
                this.redirectTo({ val: 'home' });
            }
        }, */

        async getCategoryName(userId, locationId, catId) {
            let result = await axios.get(`
            http://localhost:3000/categories?userId=${userId}&locationId=${locationId}&id=${catId}
            `);
            if (result.status == 200) {
                this.categoryName = result.data;
                if (this.categoryName.length > 0) {
                    this.name = this.categoryName[0].name;
                }
            }
        },

        async deleteCategory() {
            let result = await axios.delete(`http://localhost:3000/categories/${this.catId}`);
            let allResults = [];
            for (var i = 0; i < this.allItemsIdIs.length; i++) {
                let result = await axios.delete(`http://localhost:3000/items/${this.allItemsIdIs[i]}`);
                if (result.status == 200) {
                    allResults.push(true);
                } else {
                    allResults.push(false);
                }
            }
            if (result.status == 200 && !allResults.includes(false)) {
                this.successMessage = 'Delete Category and Related Items Successfully';
                this.errorMessage = '';
                setTimeout(() => {
                    this.$router.push({ name: "ViewCategories", params: { locationId: this.locationId } });
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