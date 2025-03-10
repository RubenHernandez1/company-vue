import { defineStore } from "pinia";
import { showAlert } from "../functions";

export const useAuthStore = defineStore('auth',{
    state: () => ({ authUser: null, authToken:null }),
    getters:{ 
        user:(state) => state.authUser,
        token:(state) => state.authToken
    },
    actions:{
        async getToket(){
            await axios.get('/sanctum/csrf-cookie',  { withCredentials: true }).then( response =>{
                console.log(response)
            })
        },

        async login(form){
            // console.log(form)
            await this.getToket()
            await axios.post('/api/auth/login', form).then(
                (res) => {
                    this.authToken = res.data.token
                    this.authUser  = res.data.data
                    this.router.push('/departments')
                }
            ).catch(errors => {
                console.log(errors.response.data)
                let desc = ''

                errors.response.data.errors.map(
                    (e) => { desc = desc + ' ' + e }
                )
                showAlert(desc, 'error', '')
            })
        },

        async register(form){
            // console.log(form)
            await this.getToket()
            await axios.post('/api/auth/register', form).then(
                (res) => {
                    showAlert(res.data.message, 'success', '')
                    setTimeout( () => this.router.push('/login'), 2000)
                }
            ).catch(errors => {
                // console.log(errors)
                let desc = ''

                errors.response.data.errors.map(
                    (e) => { desc = desc + ' ' + e }
                )
                showAlert(desc, 'error', '')
            })
        },

        async logout(form){
            await axios.get('/api/auth/logout', this.authToken)

            this.authToken = null
            this.authUser  = null
            this.router.push('/login')
        },
    },
    persist:true,
})