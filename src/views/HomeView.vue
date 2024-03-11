<template>

  <Navbar />

  <div class="home container">

    <h1>This is an home page</h1>

    <p class="text-start">
      Welcome:
      <span class="text-primary">{{ userName }}</span>
      <router-link :to="{ name: 'profile' }" class="float-end">
        <button type="button" class="btn btn-primary">Profile</button>
      </router-link>
    </p>

    <router-link :to="{ name: 'AddNewLocation' }">
      <button type="button" class="btn btn-primary">
        Add New Restaurant
      </button>
    </router-link>

    <UserLocations :allLocations="listOfLocations" />

  </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

import { mapActions } from 'vuex';

import axios from 'axios';

import UserLocations from '@/components/locations/UserLocations.vue';

export default {

  name: 'HomeView',

  data() {
    return {
      userName: '',
      listOfLocations: [],
      userId: "",
    }
  },

  async mounted() {
    let user = localStorage.getItem("user_info");
    if (!user) {
      // Redirect to Home page
      this.redirectTo({ val: 'signup' });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}`);
    if (result.status == 200 && result.data.length > 0) {
      console.log(result.data);
      this.listOfLocations = result.data;
    }
  },

  components: {
    Navbar,
    UserLocations,
  },

  methods: {
    ...mapActions(['redirectTo']),
  },

}

</script>

<style lang="scss"></style>