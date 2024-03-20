<template>

    <div class="container">

        <Navbar />

        <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
            <button type="button" class="btn btn-secondary float-end">Back To Menu</button>
        </router-link>

        <div class="clearfix"></div>

        <div class="text-center">
            <h1>{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
        </div>

        <hr />

        <form @click.prevent>

            <h1 class="text-center mb-3">Add New Item</h1>

            <!-- Item Name -->
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.itemName.$error }">
                        <input type="text" class="form-control" id="floatingItemName" placeholder="Enter Item Name"
                            v-model.trim="itemName">
                        <label for="floatingItemName">Enter Item Name</label>
                        <span class="text-danger" v-if="v$.itemName.$error"> {{ v$.itemName.$errors[0].$message }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Item Price -->
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.itemPrice.$error }">
                        <input type="number" class="form-control" id="floatingItemPrice" placeholder="Enter Item Price"
                            v-model.trim="itemPrice">
                        <label for="floatingItemPrice">Enter Item Price</label>
                        <span class="text-danger" v-if="v$.itemPrice.$error"> {{ v$.itemPrice.$errors[0].$message }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Item Quantity -->
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.itemsQty.$error }">
                        <input type="number" class="form-control" id="floatingItemQty"
                            placeholder="Enter Item Quantities" v-model.trim="itemsQty">
                        <label for="floatingItemQty">Enter Item Quantities</label>
                        <span class="text-danger" v-if="v$.itemsQty.$error"> {{ v$.itemsQty.$errors[0].$message }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Item Description -->
            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating mb-3" :class="{ 'form-group--error': v$.description.$error }">
                        <textarea class="form-control" placeholder="Enter Item Description" id="floatingItemDesc"
                            v-model.trim="description" style="min-height: 150px;"></textarea>
                        <label for="floatingItemDesc">Enter Item Description</label>
                        <span class="text-danger" v-if="v$.description.$error"> {{ v$.description.$errors[0].$message }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Select Category -->

            <div class="row g-3 align-items-center">
                <div class="col-auto d-block mx-auto">
                    <div class="form-floating" :class="{ 'form-group--error': v$.pickedCategory.$error }">
                        <select class="form-select" id="floatingSelectCat" v-model.trim="pickedCategory"
                            aria-label="Floating label select example" style="min-width: 240px;">
                            <!-- listOfCategories From mapState -->
                            <option v-for="(cat, i) in listOfCategories" :key="i" :value="cat.id"> {{ cat.name }}
                            </option>
                        </select>
                        <label for="floatingSelectCat">Select Category Name</label>
                        <span class="text-danger" v-if="v$.pickedCategory.$error">{{
            v$.pickedCategory.$errors[0].$message }}</span>
                    </div>
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

            <br />

            <div class="row g-3 align-items-center mb-3">
                <div class="col-auto d-block mx-auto">
                    <button type="button" class="btn btn-success" @click="addNewItem()">Add Now</button>
                </div>
            </div>

        </form>

    </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

// For redirect to links
import { mapActions, mapState, mapMutations } from "vuex";

// To Use HTTP Request
import axios from "axios";

// For validate data
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength, between } from "@vuelidate/validators";

export default {

    name: 'AddNewItem',

    data() {
        return {
            locationId: this.$route.params.locationId,
            userId: "",
            userName: '',
            locName: "",
            locAddress: "",
            itemName: "",
            itemPrice: "",
            itemsQty: 1,
            description: "",
            pickedCategory: "",
            successMessage: "",
            errorMessage: "",
            v$: useValidate(),
        }
    },

    validations() {
        return {
            itemName: { required, minLength: minLength(6) },
            itemPrice: { required, between: between(0, 1000000) },
            itemsQty: { required, between: between(1, 100000) },
            description: { required, minLength: minLength(6), maxLength: maxLength(120) },
            pickedCategory: { required },
        }
    },

    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.getLocationInfo(this.userId, this.locationId);
            this.displayAllCategories({ userIdIs: this.userId, locationIdIs: this.locationId });
            this.canUserAccessThisLocation({ userIdIs: this.userId, locationIdIs: this.locationId, redirectToPage: "home" });
        } else {
            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });
        }
    },

    components: {
        Navbar,
    },

    computed: {
        ...mapState(["numOfCategories", "listOfCategories"]),
    },

    methods: {

        ...mapActions(['redirectTo']),

        ...mapMutations(["displayAllCategories", "canUserAccessThisLocation"]),

        async getLocationInfo(userId, locationId) {
            let result = await axios.get(`http://localhost:3000/locations?userId=${userId}&id=${locationId}`);
            let locDetails = [];
            if (result.status == 200) {
                locDetails = result.data;
                if (locDetails.length > 0) {
                    this.locName = locDetails[0].name;
                    this.locAddress = locDetails[0].address;
                }
            }
        },

        async addNewItem() {

            // Activate Validation
            this.v$.$validate();

            if (!this.v$.$error) {

                let result = await axios.post(`http://localhost:3000/items`, {
                    name: this.itemName,
                    // "17.00"
                    price: parseFloat(this.itemPrice).toFixed(2),
                    qty: parseInt(this.itemsQty),
                    description: this.description,
                    catId: this.pickedCategory,
                    locationId: this.locationId,
                    userId: this.userId,
                });

                if (result.status == 201) {

                    this.errorMessage = '';

                    this.successMessage = 'Added New Item';

                    setTimeout(() => {
                        this.$router.push({ name: "Menu", params: { locationId: this.locationId } });
                    }, 2000);

                } else {

                    this.successMessage = '';

                    this.errorMessage = 'Something went wrong, Try Again';

                }

            } else {

                this.successMessage = '';

                this.errorMessage = 'You must fill in all required fields';

            }

        },

    },

}

</script>

<style lang="scss" scoped>
.form-group--error {
    color: red;
    font-size: 0.85em;
}

.form-group--error input,
.form-group--error textarea,
.form-group--error select {
    border-color: red;
}
</style>