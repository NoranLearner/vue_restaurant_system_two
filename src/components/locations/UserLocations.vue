<template>

    <table class="table caption-top" v-if="allLocations.length>0">
        <caption>
            <span>
                List Of Locations ({{ allLocations.length }})
            </span>
        </caption>
        <thead class="table-light">
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Address</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>  
            <tr v-for="(loc, i) in allLocations" :key="i">
                <th scope="row">{{ loc.name }}</th>
                <td>{{ loc.phone }}</td>
                <td>{{ loc.address }}</td>
                <td>
                    Delete | Update | View
                </td>
            </tr>
        </tbody>
    </table>

    <div role="alert" class="alert alert-warning mt15" v-else>
        No Locations Added Yet
    </div> 

</template>

<script>
export default {
    name: 'UserLocations',
    props: ["allLocations"],
}
</script>

<style scoped>
.mt15{
    margin-top: 15px;
}
</style>