<template>

    <div class="container">

        <Navbar />

        <router-link :to="{ name: 'ViewCategories', params: { locationId: locationId } }">
            <button type="button" class="btn btn-secondary float-start">Back To Category</button>
        </router-link>

        <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
            <button type="button" class="btn btn-light float-end">Back To Menu</button>
        </router-link>

        <div class="clearfix"></div>

        <div class="text-center">
            <h1>{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
        </div>

        <!-- Add New Category Form -->

        <form @click.prevent>

            <h1 class="text-center">Add New Category</h1>

            <br />

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="text" class="form-control" placeholder="Category Name" v-model.trim="name">
                    <span class="text-danger" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
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

            <br />

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="button" @click="addCategory()" class="btn btn-success">Add Now</button>
                </div>
            </div>

        </form>

    </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

import { mapActions, mapMutations } from 'vuex';

import axios from 'axios';

// For validate data

import useValidate from "@vuelidate/core";

import { required, minLength, maxLength } from "@vuelidate/validators";

export default {

    name: 'AddNewCategory',

    data() {
        return {
            userId: '',
            userName: '',
            locationId: this.$route.params.locationId,
            locName: '',
            locAddress: '',
            name: "",
            successMessage: "",
            errorMessage: "",
            v$: useValidate(),
            listOfUserCategories: [],
        }
    },

    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.CanUserAccessThisLocation({ userIdIs: this.userId, locationIdIs: this.locationId, redirectToPage: "home" });
            this.getLocationInfo(this.userId, this.locationId);
            this.displayUserCategories(this.userId, this.locationId);
        }
        else {
            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });
        }
    },

    validations() {
        return {
            name: { required, minLength: minLength(3), maxLength: maxLength(15) },
        }
    },

    components: {
        Navbar,
    },

    methods: {
        ...mapActions(['redirectTo']),
        ...mapMutations(['CanUserAccessThisLocation']),
        async getLocationInfo(userId, locationId) {
            let result = await axios.get(`http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`);
            let locDetails = [];
            if (result.status == 200 && result.data.length > 0) {
                locDetails = result.data;
                this.locName = locDetails[0].name;
                this.locAddress = locDetails[0].address;
            }
        },
        async addCategory() {
            // Activate Validation
            this.v$.$validate();
            // For Not Duplicate Category
            let filterCategoryName = this.listOfUserCategories.filter((v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase());
            if (!this.v$.$error) {
                if (filterCategoryName.length > 0) {
                    this.errorMessage = 'Category Name already exists, Try Another Name';
                    this.successMessage = '';
                } else {
                    let result = await axios.post(`http://localhost:3000/categories`, {
                        name: this.name,
                        userId: this.userId,
                        // locationId: parseInt(this.locationId),
                        locationId: this.locationId,
                    });
                    if (result.status == 201) {
                        this.errorMessage = '';
                        this.successMessage = 'Added New Category Successfully';
                        setTimeout(() => {
                            this.$router.push({ name: "ViewCategories", params: { locationId: this.locationId } });
                        }, 2000);
                    } else {
                        this.successMessage = '';
                        this.errorMessage = 'Something went wrong, Try Again';
                    }
                }
            } else {
                this.successMessage = '';
                this.errorMessage = 'You must fill in category name';
            }
        },
        async displayUserCategories(userId, locationId) {
            let result = await axios.get(`http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}`);
            // let categoryDetails = [];
            if (result.status == 200) {
                // categoryDetails = result.data;
                // console.log(categoryDetails);
                this.listOfUserCategories = result.data;
                console.log(this.listOfUserCategories);
            }
        }
    },

}

</script>

<style lang="scss" scoped></style>