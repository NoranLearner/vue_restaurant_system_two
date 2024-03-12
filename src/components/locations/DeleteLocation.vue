<template>

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
                <button type="button" class="btn btn-danger text-white" @click="deleteRestaurant()">Delete Now</button>
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
        }
    },

    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.deleteLocation = this.$route.params.locationId;
            this.userId = JSON.parse(user).id;
            this.canCurrentUserAccessThisLocation();
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
            let result = await axios.delete(`http://localhost:3000/locations/${this.deleteLocation}`);
            if (result.status == 200) {
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