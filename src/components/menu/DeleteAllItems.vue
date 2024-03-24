<template>

    <div class="container">

        <Navbar />

        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto text-center">

                    <h5 class="text-danger">
                        Are you sure you want to delete all items for this location ?
                    </h5>

                    <div class="text-center">
                        <h1 class="mb-0">{{ locName }}</h1>
                        <p class="text-muted">{{ locAddress }}</p>
                    </div>

                    <p class="text-danger">
                        When deleting this items, You will no longer see them ...
                    </p>

                </div>
            </div>

            <hr />

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
                        <button type="button" class="btn btn-secondary">Back To Menu</button>
                    </router-link>
                    &nbsp;
                    <button class="btn btn-danger text-white" @click="deleteAllItems()">Delete All Now</button>
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

import { mapActions, mapMutations } from "vuex";

import axios from "axios";


export default {

    name: 'DeleteAllItems',

    data() {
        return {
            locationId: this.$route.params.locationId,
            userId: '',
            locationData: [],
            locName: "",
            locAddress: "",
            successMessage: '',
            errorMessage: '',
            myResult: '',
            allItemsIdIs: [],
        }
    },

    async mounted() {

        let user = localStorage.getItem("user_info");

        if (user) {

            this.userId = JSON.parse(user).id;

            this.canCurrentUserAccessThisLocation();

            // http://localhost:3000/items?userId=2&locId=3
            let result = await axios.get(`http://localhost:3000/items?userId=${this.userId}&locationId=${this.locationId}`);
            this.myResult = result.data;
            let resultLength = this.myResult.length;
            for (var i = 0; i < resultLength; i++) {
                this.allItemsIdIs.push(result.data[i].id);
            }
            // console.table(this.allItemsIdIs);


        } else {

            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });

        }

    },

    components: {
        Navbar,
    },

    methods: {

        ...mapActions(['redirectTo']),

        async canCurrentUserAccessThisLocation() {
            let result = await axios.get(`http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`);
            if (result.status == 200 && result.data.length > 0) {
                this.locationData = result.data;
                this.locName = this.locationData[0].name;
                this.locAddress = this.locationData[0].address;
            } else {
                this.redirectTo({ val: 'home' });
            }
        },

        async deleteAllItems() {

            let allResults = [];

            for (var i = 0; i < this.allItemsIdIs.length; i++) {
                let result = await axios.delete(`http://localhost:3000/items/${this.allItemsIdIs[i]}`);
                if (result.status == 200) {
                    allResults.push(true);
                } else {
                    allResults.push(false);
                }
            }

            if (!allResults.includes(false)) {
                this.successMessage = 'All Items are deleted Successfully';
                this.errorMessage = '';
                setTimeout(() => {
                    this.$router.push({ name: "Menu", params: { locationId: this.locationId } });
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