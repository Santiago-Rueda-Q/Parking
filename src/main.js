// --- Core & App ---
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// --- UI / Estilos ---
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'flowbite'
import './style.css'

// --- FontAwesome ---
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMotorcycle,
  faBicycle,
  faCar,
  faCrown,
  faParking
} from '@fortawesome/free-solid-svg-icons'
import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons'

// Registrar íconos en la librería
library.add(
  faMotorcycle,
  faBicycle,
  faCar,
  faCrown,
  faParking,
  faAccessibleIcon
)

// --- PrimeVue Services ---
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'

// --- PrimeVue Components (registro global) ---
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import ConfirmDialog from 'primevue/confirmdialog'

// --- Servicios propios ---
import di from './services/di.js'
import { applyTheme } from './services/settings.service.js'

// Crear App (una sola vez)
const app = createApp(App)

// Plugins
app.use(router)
app.use(PrimeVue, {
  theme: { preset: Aura },
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)

// Componentes globales
app.component('ConfirmDialog', ConfirmDialog)
app.component('Paginator', Paginator)
app.component('PButton', Button)
app.component('InputNumber', InputNumber)
app.component('InputText', InputText)
app.component('Select', Select)
app.component('Checkbox', Checkbox)
app.component('DataTable', DataTable)
app.component('Column', Column)


app.component('font-awesome-icon', FontAwesomeIcon)

di.settingsService.load().then((s) => {
  applyTheme(s?.theme)
  app.mount('#app')
})