<template>
    <div class="container">
        <form @click.prevent>
            <div class="row g-3 align-items-center">
                <h1 class="text-center pt-2">Sign Up</h1>
                <div class="col-auto d-block mx-auto">
                    <!-- <input type="text" class="form-control" placeholder="Enter Your Name" v-model="name"> -->
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.email.$error }">
                        <input type="text" class="form-control" id="floatingEmail" placeholder="Enter Your Name"
                            v-model.trim="name">
                        <label for="floatingEmail">Enter Your Name</label>
                        <span class="text-danger" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <!-- <input type="email" class="form-control" placeholder="Enter Your Email" v-model="email"> -->
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.email.$error }">
                        <input type="email" class="form-control" id="floatingEmail" placeholder="Enter Your Email"
                            v-model.trim="email">
                        <label for="floatingEmail">Enter Your Email</label>
                        <span class="error-feedback" v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <!-- <input type="password" class="form-control" placeholder="Enter Your Password" v-model="pass"> -->
                    <div class="form-floating" :class="{ 'form-group--error': v$.pass.$error }">
                        <input type="password" class="form-control" id="floatingPassword"
                            placeholder="Enter Your Password" v-model.trim="pass">
                        <label for="floatingPassword">Enter Your Password</label>
                        <span class="error-feedback" v-if="v$.pass.$error">{{ v$.pass.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <!-- <button type="submit" class="btn btn-primary" @click="SignUpNow()"> Sign Up Now </button> -->
                    <button type="submit" class="btn btn-primary" @click="validateEmail()"> Sign Up Now </button>
                    &nbsp;
                    <button type="button" class="btn btn-link" @click="redirectTo({ val: 'login' })"> Have an account,
                        Login Now </button>
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
import axios from 'axios';
import { mapActions } from 'vuex';
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
    name: 'SignUp',
    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            // Redirect to Home page
            this.redirectTo({ val: 'home' });
        }
    },
    data() {
        return {
            v$: useValidate(),
            name: "",
            email: "",
            pass: "",
            successMessage: "",
            errorMessage: "",
            userEmailExists: '',
        }
    },
    validations() {
        return {
            name: { required, minLength: minLength(10) },
            email: { required, email },
            pass: { required, minLength: minLength(10) },
        }
    },
    methods: {
        ...mapActions(['redirectTo']),
        async validateEmail() {
            let res = await axios.get(`http://localhost:3000/users?email=${this.email}`);
            if (res.status == 200) {
                this.userEmailExists = res.data;
                if (this.userEmailExists.length != 1) {
                    this.successMessage = "";
                    this.errorMessage = "";
                    this.signUpNow();
                } else {
                    this.successMessage = "";
                    this.errorMessage = "This email already exists";
                }
            }
        },
        async SignUpNow() {
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log('Form Validated Successfully');
                let result = await axios.post('http://localhost:3000/users', {
                    name: this.name,
                    email: this.email,
                    password: this.pass,
                });
                if (result.status = 201) {
                    console.log('Added New User Successfully');
                    // Save user data in local storage
                    localStorage.setItem("user_info", JSON.stringify(result.data));
                    this.errorMessage = '';
                    this.successMessage = 'Loading ....';
                    // Redirect to Home page
                    setTimeout(() => {
                        // redirect to home page
                        this.redirectTo({ val: 'home' });
                    }, 2000);
                } else {
                    // console.log('Error on adding new user');
                    this.successMessage = '';
                    this.errorMessage = 'Error on Adding New User';

                }
            } else {
                // console.log('Form Validation Failed');
                this.successMessage = '';
                this.errorMessage = 'You must fill in all fields';
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