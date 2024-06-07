import Swal from "sweetalert2";
import { nextTick } from "vue";
import { useAuthStore } from "./stores/auth";

export function showAlert(msj, icon, focus){
    if(focus !== ''){
        nextTick( () => focus.value.focus());
    }

    Swal.fire({
        title: msj,
        icon: icon,
        buttonsStyling: true,
    });
}


export function confirmation(name, url, redirect){
    const alert = Swal.mixin({buttonsStyling:true})
    alert.fire({
        title:'¿Estas seguro de eliminar ' + name + ' ?',
        icon:'question', showCloseButton:true,
        confirmButtonText:'<i class="fa-solid fa-check"></i> Sí, elimina',
        cancelButtonText:'<i class="fa-solid fa-ban"></i> Cancela',
    }).then(result => {
        if(result.isConfirmed){
            senRequest('DELETE', {}, url, redirect)
        }
    })
}


export async function senRequest(method, params, url, redirect=''){
    const authStore = useAuthStore()
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken
    let res
    await axios({method:method, url:url, data:params}).then(
        response => {
            res = response.data.status,
            showAlert(response.data.message, 'success', ''),
            setTimeout(
                () => (redirect !== '') ? window.location.href = redirect:''
                ,2000)
        }  
    ).catch(errors => {
        let desc = ''
        res = errors.response.data.status;
        errors.response.data.errors.map( (e) => {desc = desc + ' ' + e})
        showAlert(desc, 'error', '')
    })
    return res;
}