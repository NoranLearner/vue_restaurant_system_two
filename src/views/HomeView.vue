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
  </div>
</template>

<script>
import Navbar from '@/components/header/Navbar.vue'
import { mapActions } from 'vuex';
export default {
  name: 'HomeView',
  data() {
    return {
      userName: '',
    }
  },
  mounted() {
    let user = localStorage.getItem("user_info");
    if (!user) {
      // Redirect to Home page
      this.redirectTo({ val: 'signup' });
    } else {
      this.userName = JSON.parse(user).name;
    }
  },
  components: {
    Navbar,
  },
  methods: {
    ...mapActions(['redirectTo']),
  }
}
</script>

<style lang="scss"></style>