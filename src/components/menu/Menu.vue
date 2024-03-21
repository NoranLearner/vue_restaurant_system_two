<template>

    <div class="container">

        <Navbar />

        <!-- ---------------------------------------- -->

        <div>

            <router-link :to="{ name: 'ViewCategories', params: { locationId: locationId } }">
                <button type="button" class="btn btn-secondary float-start">View/Add Categories</button>
            </router-link>

            <router-link :to="{ name: 'AddNewItem', params: { locationId: locationId } }">
                <button type="button" class="btn btn-secondary float-end" v-if="numOfCategories > 0"> Add New Items
                </button>
            </router-link>

        </div>

        <div class="clearfix"></div>

        <!-- ---------------------------------------- -->

        <div class="text-center">
            <h1>{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
        </div>

        <!-- ---------------------------------------- -->

        <!-- <div class="mb-3" v-if="listOfUserCategories.length>0">
            <router-link :to="{ name: 'delete-all-items', params: { locId: locationId } }">
                <button type="button" class="btn btn-danger">
                    Delete All Items
                </button>
            </router-link>
        </div> -->

        <!-- ---------------------------------------- -->

        <div class="each-category">

            <div v-for="(cat, i) in listOfUserCategories" :key="i">

                <div class="row">

                    <div class="catName col-12">
                        <h5 class="text-center bg-light p-1">{{ cat.name }}</h5>
                    </div>

                    <!-- Give Class If the condition is true -->
                    <div :class="{ 'col-xs-12 col-sm-4 p-4 m-sm-3 bg-secondary-subtle': cat.id == item.catId }"
                        v-for="(item, x) in listOfUserItems" :key="x" v-show="cat.id == item.catId">

                        <div :class="{ 'each-item': cat.id == item.catId }" v-if="cat.id == item.catId">

                            <h6 class="itemName text-center">Item: {{ item.name }}</h6>

                            <p class="text-muted text-center"> "Description: {{ item.description }}" </p>

                            <div>
                                <span class="float-start">Available Quantity: {{ numberWithCommas(item.qty) }}</span>
                                <span class="itemPrice float-end">Price: ${{ numberWithCommas(item.price) }} </span>
                            </div>

                            <div class="clearfix"></div>

                            <div class="text-white mt-4">

                                <router-link :to="{name: 'UpdateItem',params: { locationId: locationId, itemId: item.id }}">
                                    <button class="btn btn-success float-start">Update</button>
                                </router-link>

                            </div>

                        </div>

                    </div>

                    <hr />

                </div>

            </div>

        </div>

        <!-- 
            
                    <div >
                        <div :class="{ 'each-item': cat.id == item.catId }" >
                            
                            
                                <router-link :to="{
                name: 'delete-item',
                params: { locationId: locationId, itemId: item.id }
            }
                ">
                                    <button class="btn btn-danger float-end">Delete</button>
                                </router-link>
                            </div>
                            <div class="clearfix"></div>
                            <br />
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        -->

        <!-- ---------------------------------------- -->

    </div>

</template>

<script>

import Navbar from '@/components/header/Navbar.vue';

import { mapState, mapActions, mapMutations } from 'vuex';

import axios from 'axios';

export default {

    name: "Menu",

    data() {
        return {
            userId: "",
            userName: "",
            locationId: this.$route.params.locationId,
            locName: '',
            locAddress: '',
            listOfUserCategories: [],
            listOfUserItems: [],
        }
    },

    mounted() {
        let user = localStorage.getItem("user_info");
        if (user) {
            this.userId = JSON.parse(user).id;
            this.userName = JSON.parse(user).name;
            this.isLoggedInUser();
            this.displayAllCategories({ userIdIs: this.userId, locationIdIs: this.locationId });
            this.CanUserAccessThisLocation({ userIdIs: this.userId, locationIdIs: this.locationId, redirectToPage: "home" });
            this.getLocationInfo(this.userId, this.locationId);
            this.getCurrentUserCategories(this.userId, this.locationId);
            this.getCurrentUserItems(this.userId, this.locationId);
        }
        else {
            // Redirect to Sign Up page
            this.redirectTo({ val: 'signup' });
        }
    },

    components: {
        Navbar,
    },

    computed: {
        ...mapState(['isUserLoggedIn', 'LoggedInUserId', 'numOfCategories', 'listOfCategories']),
    },

    methods: {
        ...mapActions(['redirectTo']),
        ...mapMutations(['isLoggedInUser', 'displayAllCategories', 'CanUserAccessThisLocation']),
        async getLocationInfo(userId, locationId) {
            let result = await axios.get(`http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`);
            let locDetails = [];
            if (result.status == 200 && result.data.length > 0) {
                locDetails = result.data;
                this.locName = locDetails[0].name;
                this.locAddress = locDetails[0].address;
            }
        },
        async getCurrentUserCategories(userId, locationId) {
            let result = await axios.get(
                `http://localhost:3000/categories?userId=${userId}&locationId=${locationId}`
            );
            if (result.status == 200) {
                this.listOfUserCategories = result.data;
                // console.table(this.listOfUserCategories);
            }
        },
        async getCurrentUserItems(userId, locationId) {
            let result = await axios.get(
                `http://localhost:3000/items?userId=${userId}&locationId=${locationId}`
            );
            if (result.status == 200) {
                this.listOfUserItems = result.data;
                // console.table(this.listOfUserItems);
            }
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
    },

}

</script>

<style lang="scss" scoped>
.catName {
    color: teal;
}

.itemName {
    color: darkgoldenrod;
}

.itemPrice {
    color: firebrick;
}
</style>