<template>
    <div class="text-center m-4">
        <router-link :to="{ name: 'home' }">
            <button type="button" class="btn btn-info">Visit Home Page</button>
        </router-link>
    </div>
    <br/>
    <img src="@/assets/images/PageNotFound.jpg" alt="" class="rounded mx-auto d-block h400">
</template>

<script>
export default {
    name: 'ErrorPageView'
}
</script>

<style>
.h400 {
    height: 400px;
}
</style>