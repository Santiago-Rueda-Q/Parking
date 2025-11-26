import { LocalSlotsRepository }   from '@/Infrastructure/Slots/LocalSlotsRepository'
import { SlotsService }           from '@/services/slots.service'

import { LocalEntriesRepository } from '@/Infrastructure/Entries/LocalEntriesRepository'
import { EntriesService }         from '@/services/entries.service'

import { LocalClientsRepository } from '@/Infrastructure/Clients/LocalClientsRepository'
import { ClientsService }         from '@/services/clients.service'

import { LocalExitsRepository }   from '@/Infrastructure/Exits/LocalExitsRepository'
import { ExitsService }           from '@/services/exits.service'

import LocalRatesRepository       from '@/Infrastructure/Rates/LocalRatesRepository'
import { RatesService }           from '@/services/rates.service'

import { LocalMapRepository }     from '@/Infrastructure/Map/LocalMapRepository'
import { MapService }             from '@/services/map.service'

import { LocalSettingsRepository } from '@/Infrastructure/Settings/LocalSettingsRepository'
import { SettingsService } from '@/services/settings.service.js'

import { ReportsService } from './reports.service'

const di = {
    slotsRepository:   new LocalSlotsRepository(),
    entriesRepository: new LocalEntriesRepository(),
    clientsRepository: new LocalClientsRepository(),
    exitsRepository:   new LocalExitsRepository(),
    mapRepository:     new LocalMapRepository(),
    ratesRepository:   new LocalRatesRepository(),
    settingsRepository: new LocalSettingsRepository(),
}

di.slotsService   = new SlotsService(di.slotsRepository)
di.ratesService     = new RatesService(di.ratesRepository)
di.entriesService = new EntriesService(di.entriesRepository)
di.clientsService = new ClientsService(di.clientsRepository)
di.mapService     = new MapService(di.mapRepository, di.entriesService)
di.exitsService   = new ExitsService(di.exitsRepository, di.entriesService, di.ratesService)
di.settingsService = new SettingsService(di.settingsRepository)
di.reportsService = new ReportsService(di.entriesService, di.ratesService)

export default di
