<template>

    <Navbar />

    <h1 class="fs-5 text-center mb-3 text-info">Add New Restaurant</h1>

    <form @click.prevent>

        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="text" class="form-control" placeholder="Restaurant Name" v-model.trim="state.name">
                <span class="text-danger" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="text" class="form-control" placeholder="Phone Number" v-model.trim="state.phone">
                <span class="text-danger" v-if="v$.phone.$error">{{ v$.phone.$errors[0].$message
                    }}</span>
            </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
            <div class="col-auto d-block mx-auto">
                <input type="text" class="form-control" placeholder="Restaurant Address" v-model.trim="state.address">
                <span class="text-danger" v-if="v$.address.$error">{{ v$.address.$errors[0].$message
                    }}</span>
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
                <button type="button" class="btn btn-primary" @click="addLocation()">Add Now</button>
            </div>
        </div>

    </form>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

// For validate data
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

// For Composition Api
import { reactive, computed } from "vue";

import { mapActions } from 'vuex';

import axios from 'axios';

export default {

    name: "AddNewLocation",

    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.userId = JSON.parse(user).id;
        }
        else {
            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });
        }
    },

    setup() {
        // Data
        const state = reactive({
            name: '',
            phone: '',
            address: '',
        });
        // Validations
        const rules = computed(() => {
            return {
                name: { required, minLength: minLength(10) },
                phone: { required, minLength: minLength(11) },
                address: { required },
            };
        });
        // Write rules first
        const v$ = useValidate(rules, state);
        return { state, v$ };
    },

    data() {
        return {
            userId: "",
            successMessage: "",
            errorMessage: "",
        }
    },

    components: {
        Navbar,
    },

    methods: {
        ...mapActions(['redirectTo']),
        async addLocation() {
            // Activate Validation
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log("Form Validated Successfully");
                let result = await axios.post('http://localhost:3000/locations', {
                    name: this.state.name,
                    phone: this.state.phone,
                    address: this.state.address,
                    userId: this.userId,
                });
                if (result.status = 201) {
                    // Show Success Message
                    this.errorMessage = '';
                    this.successMessage = 'Added New Location';
                    setTimeout(() => {
                        this.redirectTo({ val: "home" });
                    }, 2000);
                } else {
                    // Show Error Message
                    this.successMessage = '';
                    this.errorMessage = 'Something went wrong, Try Again';
                }
            } else {
                this.successMessage = '';
                this.errorMessage = 'You must fill in all required fields';
            }
        },
    }

}

</script>

<style scoped lang="scss"></style>