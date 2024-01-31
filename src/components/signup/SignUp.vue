<template>
    <div class="container">
        <form @click.prevent>
            <div class="row g-3 align-items-center">
                <h1>Sign Up</h1>
                <div class="col-auto d-block mx-auto">
                    <input type="text" class="form-control" placeholder="Enter Your Name" v-model="name">
                    <span class="text-danger" v-if="v$.name.$error">{{ v$.name.$errors[0].$message }}</span>
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
                    <button type="submit" class="btn btn-primary" @click="SignUpNow()"> Sign Up Now </button>
                    &nbsp;
                    <button type="button" class="btn btn-link" @click="redirectTo({ val: 'login' })"> Login </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
    name: 'SignUp',
    data() {
        return {
            v$: useValidate(),
            name: "",
            email: "",
            pass: "",
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
        SignUpNow() {
            this.v$.$validate();
            if (!this.v$.$error) {
                console.log('Form Validated Successfully');
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