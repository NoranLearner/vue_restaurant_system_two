<template>
    <div class="container">
        <form @click.prevent>
            <div class="row g-3 align-items-center">
                <h1 class="text-center pt-2">Login</h1>
                <div class="col-auto d-block mx-auto">
                    <!-- <input type="email" class="form-control" placeholder="Enter Your Email" v-model="state.email"> -->
                    <!-- https://getbootstrap.com/docs/5.0/forms/floating-labels/ -->
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.email.$error }">
                        <input type="email" class="form-control" id="floatingEmail" placeholder="Your Email Is..."
                            v-model.trim="state.email">
                        <label for="floatingEmail">Your Email Is...</label>
                        <span class="text-danger" v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <!-- <input type="password" class="form-control" placeholder="Enter Your Password" v-model="state.pass"> -->
                    <div class="form-floating" :class="{ 'form-group--error': v$.pass.$error }">
                        <input type="password" class="form-control" id="floatingPassword"
                            placeholder="Your Password Is..." v-model="state.pass">
                        <label for="floatingPassword">Your Password Is...</label>
                        <span class="text-danger" v-if="v$.pass.$error">{{ v$.pass.$errors[0].$message }}</span>
                    </div>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="submit" class="btn btn-primary" @click="LoginNow()"> Login Now </button>
                    &nbsp;
                    <button type="button" class="btn btn-link" @click="redirectTo({ val: 'signup' })"> SignUp
                    </button>
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
        <!-- <br />
        <div class="row g-3 align-items-center">
            {{ UserNotFoundError }}
        </div> -->
    </div>
</template>

<script>
import axios from "axios";
import { mapActions } from 'vuex';
// For validate data
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
// For Composition Api
import { reactive, computed } from "vue";
export default {
    name: 'Login',
    setup() {
        // Data
        const state = reactive({
            email: "",
            pass: "",
        });
        // Validations
        const rules = computed(() => {
            return {
                email: { required, email },
                pass: { required, minLength: minLength(10) }
            }
        });
        // Write rules first
        const v$ = useValidate(rules, state);
        return { state, v$ };
    },
    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            // Redirect to Home page
            this.redirectTo({ val: 'home' });
        }
    },
    data() {
        return {
            // UserNotFoundError: '',
            successMessage: '',
            errorMessage: '',
        }
    },
    methods: {
        ...mapActions(['redirectTo']),
        async LoginNow() {
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log('Form Validated Successfully');
                let result = await axios.get(`http://localhost:3000/users?email=${this.state.email}&password=${this.state.pass}`);
                console.log(result);
                if (result.status == 200 && result.data.length > 0) {
                    // Save user data in local storage
                    localStorage.setItem("user_info", JSON.stringify(result.data[0]));
                    this.errorMessage = '';
                    this.successMessage = 'Loading....';
                    // Redirect to Home page
                    setTimeout(() => {
                        // redirect to home page
                        this.redirectTo({ val: 'home' });
                    }, 2000);
                } else {
                    // this.UserNotFoundError = 'User Not Found';
                    this.successMessage = '';
                    this.errorMessage = 'User is invalid!';
                }
            } else {
                // console.log('Form Validation Failed');
                this.successMessage = '';
                this.errorMessage = 'You Must Enter Your Email and Password';
            }
        }
    },
}
</script>

<style lang="scss" scoped></style>