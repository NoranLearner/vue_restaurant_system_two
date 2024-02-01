<template>
    <Navbar />
    <div class="container">
        <form @click.prevent>
            <div class="row g-3 align-items-center">
                <h1 class="text-center pt-2">Profile</h1>
                <div class="col-auto d-block mx-auto">
                    <input type="text" class="form-control" placeholder="Enter Your Name" v-model="name" disabled>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="email" class="form-control" placeholder="Enter Your Email" v-model="email" disabled>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <input type="password" class="form-control" placeholder="Enter Your Password" v-model="pass" disabled>
                </div>
            </div>
            <br />
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <button type="submit" class="btn btn-primary" @click="UpdateProfile()"> Update Profile Now </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Navbar from '@/components/header/Navbar.vue'
import { mapActions } from 'vuex';
export default {
    name: 'Profile',
    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.name = JSON.parse(user).name;
            this.email = JSON.parse(user).email;
            this.pass = JSON.parse(user).password;
        } else {
            this.redirectTo({val: 'signup'});
        }
    },
    data() {
        return {
            name: "",
            email: "",
            pass: "",
        }
    },
    components: {
        Navbar,
    },
    methods: {
        ...mapActions(['redirectTo']),
        UpdateProfile() {
            // Redirect to Home page
            this.redirectTo({ val: 'update-profile' });
        }
    },
}
</script>

<style lang="scss" scoped></style>