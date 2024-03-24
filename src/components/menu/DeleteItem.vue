<template>

    <div class="container">

        <Navbar />

        <form @click.prevent>

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto text-center">

                    <div class="text-center">
                        <h1 class="mb0"> Delete Item #{{ itemId }} </h1>
                        <h4 class="text-muted"> Item Name: {{itemName}} </h4>
                    </div>

                    <hr>

                    <p class="text-danger">
                        Are you sure you want to delete this item ?
                    </p>

                </div>
            </div>

            <br />

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
                        <button type="button" class="btn btn-secondary">Back To Menu</button>
                    </router-link>
                    &nbsp;
                    <button class="btn btn-danger text-white" @click="deleteItem()">Delete Now</button>
                </div>
            </div>

            <br />

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage.length > 0">
                    {{ successMessage }}
                </div>
                <div class="col-auto d-block mx-auto alert alert-warning" v-if="errorMessage.length > 0">
                    {{ errorMessage }}
                </div>
            </div>

        </form>

    </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

import { mapActions, mapMutations } from "vuex";

import axios from "axios";

export default {

    name: 'DeleteItem',

    data() {
        return {
            locationId: this.$route.params.locationId,
            itemId: this.$route.params.itemId,
            userId: '',
            itemName: "",
            itemPrice: "",
            itemsQty: 1,
            description: "",
            pickedCategory: "",
            successMessage: '',
            errorMessage: '',
        }
    },

    components: {
        Navbar,
    },

    async mounted() {

        let user = localStorage.getItem("user_info");

        if (user) {

            this.userId = JSON.parse(user).id;

            this.getItemInfo(this.userId, this.locationId, this.itemId);

            this.canUserAccessThisItem({
                userIdIs: this.userId,
                locationIdIs: this.locationId,
                itemIdIs: this.itemId,
                redirectToPage: "home",
            });


        } else {

            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });

        }

    },

    methods: {

        ...mapActions(['redirectTo']),

        async getItemInfo(userId, locationId, itemId) {
            let result = await axios.get(`http://localhost:3000/items?userId=${userId}&locationId=${locationId}&id=${itemId}`);
            let itemDetails = result.data[0];
            // console.log(itemDetails);
            if (result.status == 200) {
                this.itemName = itemDetails.name;
                this.itemPrice = itemDetails.price;
                this.itemsQty = itemDetails.qty;
                this.description = itemDetails.description;
                this.pickedCategory = itemDetails.catId;
            }
        },

        ...mapMutations(["canUserAccessThisItem"]),

        async deleteItem() {
            let result = await axios.delete(`http://localhost:3000/items/${this.itemId}`);

            if (result.status == 200) {
                this.successMessage = 'Item is deleted Successfully';
                this.errorMessage = '';
                setTimeout(() => {
                    this.$router.push({ name: "Menu", params: { locationId: this.locationId } });
                }, 2000);
            } else {
                this.successMessage = '';
                this.errorMessage = 'Something went wrong, Try again';
            }
        },

    },

}

</script>

<style lang="scss" scoped></style>