<script setup>
    import { onMounted, ref } from 'vue';
    import { confirmation } from '@/functions';
    import { useAuthStore } from '@/stores/auth';
    
    const authStore = useAuthStore()
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken
    onMounted( () => { getDepartments() })
    const departments = ref([])
    const load = ref(false)
    const getDepartments = async () => {
        await axios.get('/api/departments').then(response => {
            departments.value = response.data
        })
        load.value = true;
    }
    const deleteDepartment = (id, name) => {
        console.log(id)
        confirmation(name, '/api/departments/'+id, '/departments')
    }
</script>

<template>
    <div class="row">
        <div class="col-md-4 offset-md-4">
            <div class="d-grid col-10 mx-auto">
                <router-link :to="{ path:'create'}" class="btn btn-dark">
                    <i class="fa-solid fa-circle-plus"></i>Add
                </router-link>
            </div>
        </div>
    </div>
    
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card border border-white text-center" v-if="!load">
                <div class="card-body">
                    <img src="/loading.gif" class="img-fluid">
                </div>
            </div>

            <div class="table-response">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Department</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dep,i in departments" :key="dep.id">
                            <td>{{ (i+1) }}</td>
                            <td>{{ dep.name }}</td>
                            <td>
                                <router-link :to="{path:'edit/'+dep.id}" class="btn btn-warning">
                                    <i class="fa-solid fa-edit"></i>
                                </router-link>
                            </td>
                            <td>
                                <button class="btn btn-danger" 
                                @click="deleteDepartment(dep.id,dep.name)">
                                <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>