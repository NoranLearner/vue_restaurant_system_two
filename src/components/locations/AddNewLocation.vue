<template>

    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Add New Restaurant
    </button>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog">

            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Add New Restaurant</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">

                    <form @click.prevent>

                        <div class="row g-3 align-items-center">
                            <div class="col-auto d-block mx-auto">
                                <input type="text" class="form-control" placeholder="Restaurant Name"
                                    v-model.trim="state.name">
                                <span class="text-danger" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
                            </div>
                        </div>
                        <br />
                        <div class="row g-3 align-items-center">
                            <div class="col-auto d-block mx-auto">
                                <input type="text" class="form-control" placeholder="Phone Number"
                                    v-model.trim="state.phone">
                                <span class="text-danger" v-if="v$.phone.$error">{{ v$.phone.$errors[0].$message
                                    }}</span>
                            </div>
                        </div>
                        <br />
                        <div class="row g-3 align-items-center">
                            <div class="col-auto d-block mx-auto">
                                <input type="text" class="form-control" placeholder="Restaurant Address"
                                    v-model.trim="state.address">
                                <span class="text-danger" v-if="v$.address.$error">{{ v$.address.$errors[0].$message
                                    }}</span>
                            </div>
                        </div>
                        <br />
                        <div class="row g-3 align-items-center">
                            <!-- {{ UserNotFoundError }} -->
                            <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage.length > 0">
                                {{ successMessage }}
                            </div>
                            <div class="col-auto d-block mx-auto alert alert-danger" v-if="errorMessage.length > 0">
                                {{ errorMessage }}
                            </div>
                        </div>

                    </form>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="addLocation()">Add Now</button>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

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
            // UserNotFoundError: "",
            successMessage: "",
            errorMessage: "",
        }
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
                    // this.UserNotFoundError = 'Good Job';
                    this.errorMessage = '';
                    this.successMessage = 'Added New Location';
                    this.redirectTo({ val: "home" });
                    setTimeout(() => {
                        this.successMessage = '';
                        this.errorMessage = '';
                        this.state.name = '';
                        this.state.phone = '';
                        this.state.address = '';
                        this.v$.name.$errors[0].$message = '';
                        this.v$.phone.$errors[0].$message = '';
                        this.v$.address.$errors[0].$message = '';
                    }, 2000);
                } else {
                    // Show Error Message
                    // this.UserNotFoundError = 'Something went wrong, try again';
                    this.successMessage = '';
                    this.errorMessage = 'Something went wrong, Try Again';
                }
            } else {
                // console.warn("Form Validation Failed");
                this.successMessage = '';
                this.errorMessage = 'You must fill in all required fields';
            }
        },
    }

}

</script>

<style scoped lang="scss"></style>