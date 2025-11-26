import { createRouter, createWebHistory } from 'vue-router'

const EntriesView = () => import('@/views/Entries/EntriesView.vue')
const ExitsView = () => import('@/views/Exits/ExitsView.vue')
const MapView = () => import('@/views/Map/MapView.vue')
const ClientsView = () => import('@/views/Client/ClientsView.vue')
const ReportsView = () => import('@/views/Reports/ReportsView.vue')
const RatesView = () => import('@/views/Rates/RatesView.vue')
const SlotsView = () => import('@/views/Slots/SlotsView.vue')
const SettingsView = () => import('@/views/Settings/SettingsView.vue')

const routes = [
{ path: '/', redirect: '/entries' },
{ path: '/entries', name: 'entries', component: EntriesView, meta: { labelEs: 'Ingresos' } },
{ path: '/exits', name: 'exits', component: ExitsView, meta: { labelEs: 'Salidas' } },
{ path: '/map', name: 'map', component: MapView, meta: { labelEs: 'Mapa' } },
{ path: '/clients', name: 'clients', component: ClientsView, meta: { labelEs: 'Clientes' } },
{ path: '/reports', name: 'reports', component: ReportsView, meta: { labelEs: 'Reportes' } },
{ path: '/rates', name: 'rates', component: RatesView, meta: { labelEs: 'Tarifas' } },
{ path: '/slots', name: 'slots', component: SlotsView, meta: { labelEs: 'Cupos' } },
{ path: '/settings', name: 'settings', component: SettingsView, meta: { labelEs: 'Ajustes' } },
]

const router = createRouter({
history: createWebHistory(),
routes,
})

export default router