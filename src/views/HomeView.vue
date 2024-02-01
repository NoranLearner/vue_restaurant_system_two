<template>
  <Navbar/>
  <div class="home">
    <h1>This is an home page</h1>
  </div>
</template>

<script>
import Navbar from '@/components/header/Navbar.vue'
import { mapActions } from 'vuex';
export default {
  name: 'HomeView',
  mounted() {
        let user = localStorage.getItem("user_info");
        if (!user) {
            // Redirect to Home page
            this.redirectTo({val: 'signup'});
        }
    },
    components:{
      Navbar,
    },
    methods: {
      ...mapActions(['redirectTo']),
    }
}
</script>

<style lang="scss"></style>