<script setup>
    import { nextTick, ref } from 'vue';
    import { showAlert, senRequest } from '@/functions';
    import { useAuthStore } from '@/stores/auth';

    const authStore = useAuthStore()
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken
    const form = ref({ name:'' })
    const nameInput = ref('')
    const save = () => {
        senRequest('POST', form.value, '/api/departments', '')
        form.value.name = ''
        nextTick( () => nameInput.value.focus())
    }
</script>

<template>
    <div class="row mt-5">
        <div class="col-md-4 offset-md-4">
            <div class="card border border-success">
                <div class="card-header bg-success border border-success text-white"></div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-building"></i>
                            </span>

                            <input autofocus type="text"
                                v-model="form.name" placeholder="Department"
                                class="form-control" ref="nameInput" required>
                        </div>

                        <div class="d-grid col-10 mx-auto">
                            <button class="btn btn-dark">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>