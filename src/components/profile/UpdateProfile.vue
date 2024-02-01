<template>
    <Navbar />
    <div class="container">
        <form @click.prevent>
            <div class="row g-3 align-items-center">
                <h1 class="text-center pt-2">Update Profile</h1>
                <div class="col-auto d-block mx-auto">
                    <input type="text" class="form-control" placeholder="Enter Your Name" v-model="name">
                    <span class="error-feedback" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="email" class="form-control" placeholder="Enter Your Email" v-model="email">
                    <span class="error-feedback" v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</span>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="password" class="form-control" placeholder="Enter Your Password" v-model="pass">
                    <span class="error-feedback" v-if="v$.pass.$error">{{ v$.pass.$errors[0].$message }}</span>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="submit" class="btn btn-primary" @click="UpdateProfileNow()"> Update Profile Now </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Navbar from '@/components/header/Navbar.vue';
import { mapActions } from 'vuex';
// For Validation
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import axios from "axios";
export default {
    name:'UpdateProfile',
    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.name = JSON.parse(user).name;
            this.email = JSON.parse(user).email;
            this.pass = JSON.parse(user).password;
            this.userId = JSON.parse(user).id;
        } else{
            this.redirectTo({val: 'signup'});
        }
    },
    data() {
        return {
            v$: useValidate(),
            name: "",
            email: "",
            pass: "",
            userId: "",
        }
    },
    validations() {
        return {
            name: {required, minLength: minLength(10)},
            email: {required, email},
            pass: { required, minLength: minLength(10) },
        }
    },
    components: {
        Navbar,
    },
    methods: {
        ...mapActions(['redirectTo']),
        async UpdateProfileNow() {
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log('Form Validated Successfully');
                // Update Data
                let result = await axios.put(`http://localhost:3000/users/${this.userId}`, {
                    name : this.name,
                    email : this.email,
                    password : this.pass,
                });
                if (result.status == 200) {
                    console.log('Profile Updated Successfully');
                    // Save user data in local storage
                    localStorage.setItem("user_info", JSON.stringify(result.data));
                    // Redirect to Profile page
                    this.redirectTo({val: 'profile'});
                } else {
                    console.warn('Error on Profile Updating');
                }

            } else {
                console.log('Form Validation Failed');
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.error-feedback {
    color: red;
    font-size: 0.85em;
}
</style>