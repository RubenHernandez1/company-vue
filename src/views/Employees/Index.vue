<script setup>
    import { onMounted, ref, nextTick } from 'vue';
    import { confirmation, senRequest } from '@/functions';
    import { useAuthStore } from '@/stores/auth';
    import Modal from '@/components/Modal.vue';
    import SelectInput from '../../components/SelectInput.vue'
    import Paginate from 'vuejs-paginate-next'

    const authStore = useAuthStore()
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken

    onMounted( () => { getDepartments(), getEmployees(1) })
    const employees = ref([])
    const departments = ref([])
    const load = ref(false)
    const rows = ref(0)
    const form = ref({
        name:'', email:'', phone:'', department_id:''
    })
    const title = ref('')
    const nameInput = ref('')
    const operation = ref(1)
    const id = ref('')
    const close = ref([])

    const getDepartments = async () => {
        await axios.get('/api/departments').then(response => {
            departments.value = response.data
        })
    }

    const getEmployees = async (page) => {
        await axios.get('/api/employees?page='+page).then(response => {
            employees.value = response.data
            rows.value = response.data.last_page
        })
        load.value = true;
    }

    const deleteEmployees = (id, name) => {
        confirmation(name, '/api/employees/'+id, '/employees')
    }

    const openModal = (op, name, email, phone, department, employee) =>{
        clear()
        // setTimeout( ()=> nextTick( ()=> nameInput.value.focus()),600)
        operation.value = op
        id.value = employee
        if(op == 1){
            title.value = 'Create employee'
        }else{
            title.value = 'Edit employee'
            form.value.name = name
            form.value.email = email
            form.value.phone = phone
            form.value.department_id = department
        }
    }

    const clear = () =>{
        form.value.name = ''
        form.value.email = ''
        form.value.phone = ''
        form.value.department_id = ''
    }

    const save = async () => {
        if(operation.value == 1){
            let res = await senRequest('POST', form.value, '/api/employees', '')
            if(response == true){
                clear()
                nextTick( () => nameInput.value.focus())
                getEmployees(1)
            }
        }else{
            let res = await senRequest('PUT', form.value, '/api/employees/'+ id.value, '')
                
            if(res == true){
                nextTick( () => close.value.click())
                getEmployees(1)
            }
        }
    }
</script>

<template>
    <div class="row">
        <div class="col-md-4 offset-md-4">
            <div class="d-grid col-10 mx-auto">
                <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modal" @click="$event => openModal(1)">
                    <i class="fa-solid fa-circle-plus"></i>Add
                </button>
                <!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal" @click="openModal(1)">
                    Launch demo modal
                </button> -->
                <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="$event => openModal(1)">
                    <i class="fa-solid fa-circle-plus"></i> Add
                </button> -->
            </div>
        </div>
    </div>
    
    <div class="row mt-3">
        <div class="col-md-10 offset-md-1">
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
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="emp,i in employees.data" :key="emp.id">
                            <td>{{ (i+1) }}</td>
                            <td>{{ emp.name }}</td>
                            <td>{{ emp.email }}</td>
                            <td>{{ emp.phone }}</td>
                            <td>{{ emp.department }}</td>
                            <td>
                                <button class="btn btn-warning" data-bs-toggle="modal"
                                    data-bs-target="#modal" 
                                    @click="openModal(2, emp.name, emp.email, emp.phone, emp.department_id, emp.id)">
                                    <i class="fa-solid fa-edit"></i>
                                </button>

                            </td>
                            <td>
                                <button class="btn btn-danger" 
                                @click="deleteEmployees(emp.id,emp.name)">
                                <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <Paginate
                    :page-count = "rows"
                    :click-handler="getEmployees"
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :container-class="'pagination'"
                    >
                </Paginate>
            </div>
        </div>
    </div>

    <Modal :id="'modal'" :title="title">
        <div class="modal-body">
            <form @submit.prevent="save">
                <div class="input-group mb-3">
                    <span class="input-group-text">
                        <i class="fa-solid fa-user"></i>
                    </span>

                    <input autofocus type="text"
                        v-model="form.name" placeholder="Name"
                        class="form-control" ref="nameInput" required>
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text">
                        <i class="fa-solid fa-at"></i>
                    </span>

                    <input type="email"
                        v-model="form.email" placeholder="Email"
                        class="form-control"  required>
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text">
                        <i class="fa-solid fa-phone"></i>
                    </span>

                    <input type="text"
                        v-model="form.phone" placeholder="Phone"
                        class="form-control"  required>
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text">
                        <i class="fa-solid fa-building"></i>
                    </span>

                    <SelectInput v-model="form.department_id" :options="departments" class="form-select" required></SelectInput>
                </div>

                <div class="d-grid col-10 mx-auto">
                    <button class="btn btn-dark">
                        Save
                    </button>
                </div>
            </form>
        </div>

        <div class="modal-footer">
            <button class="btn btn-dark" ref="close" data-bs-dismiss="modal">close</button>
        </div>
    </Modal>
</template>