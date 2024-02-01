<template>
    <div class="container">
        <form @click.prevent>
            <div class="row g-3 align-items-center">
                <h1 class="text-center pt-2">Login</h1>
                <div class="col-auto d-block mx-auto">
                    <input type="email" class="form-control" placeholder="Enter Your Email" v-model="state.email">
                    <span class="text-danger" v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</span>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="password" class="form-control" placeholder="Enter Your Password" v-model="state.pass">
                    <span class="text-danger" v-if="v$.pass.$error">{{ v$.pass.$errors[0].$message }}</span>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="submit" class="btn btn-primary" @click="LoginNow()"> Login Now </button>
                    &nbsp;
                    <button type="button" class="btn btn-link" @click="redirectTo({ val: 'signup' })"> SignUp </button>
                </div>
            </div>
        </form>
        <br/>
        <div class="row g-3 align-items-center">
            {{ UserNotFoundError }}
        </div>
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
        const rules = computed(()=>{
            return{
                email: {required, email},
                pass: {required, minLength: minLength(10)}
            }
        });
        // Write rules first
        const v$ = useValidate(rules, state);
        return {state, v$};
    },
    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            // Redirect to Home page
            this.redirectTo({val: 'home'});
        }
    },
    data() {
        return {
            UserNotFoundError : '',
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
                if (result.status==200 && result.data.length>0 ) {
                    // Save user data in local storage
                    localStorage.setItem("user_info", JSON.stringify(result.data[0]));
                    // Redirect to Home page
                    this.redirectTo({val: 'home'});
                } else {
                    this.UserNotFoundError = 'User Not Found';
                }
            } else {
                console.log('Form Validation Failed');
            }
        }
    },
}
</script>

<style lang="scss" scoped></style>