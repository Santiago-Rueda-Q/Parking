
**Technologies:**  
- Vue 3  
- Vite  
- TailwindCSS  
- PrimeVue  
- Flowbite  

---

System Purpose
--------------

ParkControl is a parking facility management application that enables real-time tracking of vehicle entries and exits, automated billing, client management, and operational reporting. The system handles:

*   Registration of vehicle entries with capacity validation
    
*   Processing of vehicle exits with automated invoice generation
    
*   Management of parking slots by vehicle category (car, motorcycle, bicycle) and special categories (VIP, disability)
    
*   Configuration of hourly rates and parking map layout
    
*   Generation of movement reports and revenue analytics
    

The application runs entirely in the browser and uses for data persistence. The architecture is designed to support future migration from to a REST API without requiring changes to business logic or presentation layers.**localStoragelocalStorage**

---

Architectural Approach
----------------------

ParkControl implements a clean architecture pattern with strict layer separation and dependency inversion. The system is organized into four distinct layers:

| **Layer**          | **Responsibility**                              | **Example Components**                                         |
|--------------------|--------------------------------------------------|----------------------------------------------------------------|
| **Presentation**   | User interface and interaction handling          | `EntriesView`, `ExitView`, `VehicleForm`, `ParkedTable`        |
| **Application**    | Business logic orchestration and use cases       | `entries.service.js`, `exits.service.js`, `reports.service.js`  |
| **Domain**         | Repository contracts and domain utilities        | `EntriesRepository.js`, `plate.utils.js`, `categories.js`       |
| **Infrastructure** | Data persistence implementations                 | `LocalEntriesRepository.js`, `LocalExitsRepository.js`          |


Dependencies flow inward: Presentation depends on Application, Application depends on Domain interfaces, and Infrastructure implements Domain contracts. The dependency injection container ([src/services/di.js] wires concrete implementations to interfaces at runtime.  

---
System Architecture Diagram
---------------------------

The following diagram maps the clean architecture layers to actual code entities in the codebase:
<img width="1665" height="742" alt="image" src="https://github.com/user-attachments/assets/9c905767-a4ee-48e5-b17b-33044f24dbd8" />

Core Business Workflows
-----------------------

ParkControl supports four primary business workflows, each managed by dedicated service classes:

### Entry Registration

The entry workflow validates vehicle information, checks slot availability, and registers the entry. Key steps:

1.  User submits vehicle data via **VehicleForm.vue**
    
2.  **entries.service.js** validates that the license plate is not already active
    
3.  System checks available capacity using **slots.service.js**
    
4.  Entry is persisted to with key **localStorageparkingEntries**
    
5.  Slot occupancy is updated
    

### Exit Processing

The exit workflow locates active entries, calculates fees, and processes checkout:

1.  User searches for vehicle via **ExitSearch.vue**
    
2.  **exits.service.js** retrieves active entry from **entries.service.js**
    
3.  **fees.service.js** calculates billable hours and total amount based on rates
    
4.  Invoice is generated and exit record is persisted to with key **localStorageparkingExits**
    
5.  Entry is marked as completed and slot is released
    

### Client Management

CRUD operations for client records with VIP status tracking:

*   Create, read, update, delete operations via **clients.service.js**
    
*   Real-time search functionality in **ClientSearch.vue**
    
*   Data stored in with key **localStorageparkingClients**
    

### Reporting and Analytics

Aggregation of historical movement data:

*   **reports.service.js** loads entries and exits
    
*   Computes statistics: total revenue, vehicle counts by type, average daily movements
    
*   Exports data to CSV format

Technology Stack
----------------

The application is built with modern frontend technologies:
<img width="1667" height="895" alt="image" src="https://github.com/user-attachments/assets/565a0529-ad40-4ed6-9c20-bce9916ea4f9" />


---
### Key Dependencies

| 📦 **Package**                   | 🧮 **Version** | ⚙️ **Purpose**                                            |
| -------------------------------- | -------------- | --------------------------------------------------------- |
| **vue**                          | 3.5.18         | Core reactive framework                                   |
| **vite**                         | 7.1.2          | Build tool and dev server with HMR                        |
| **vue-router**                   | 4.5.1          | Client-side routing                                       |
| **primevue**                     | 4.3.7          | UI component library (DataTable, Dialog, InputText, etc.) |
| **flowbite**                     | 3.1.2          | Additional Tailwind-based UI components                   |
| **tailwindcss**                  | 4.1.12         | Utility-first CSS framework                               |
| **@fortawesome/vue-fontawesome** | 3.1.2          | Font Awesome Vue integration for scalable icons           |
| **@primeuix/themes**             | 1.2.3          | Official PrimeVue themes                                  |
| **@tailwindcss/vite**            | 4.1.12         | Tailwind integration with Vite build pipeline             |

---

## 🧪 Test & Build Tooling

| 🧰 **Package**                             | 🧮 **Version** | ⚙️ **Purpose**                                                         |
| ------------------------------------------ | -------------- | ---------------------------------------------------------------------- |
| **vitest**                                 | 3.2.4          | Test runner for Vue and JS modules                                     |
| **@vitest/coverage-v8**                    | 3.2.4          | Code coverage using V8 engine                                          |
| **@vue/test-utils**                        | 2.4.6          | Vue component testing utilities                                        |
| **jsdom**                                  | 27.0.0         | Simulated DOM environment for tests                                    |
| **@vitejs/plugin-vue**                     | 6.0.1          | Vite plugin to compile Vue SFCs                                        |

---
Data Model and Storage
----------------------

ParkControl persists five primary entity types to , each managed by a dedicated repository:**localStorage**

<img width="1629" height="874" alt="image" src="https://github.com/user-attachments/assets/5a8c4e97-0562-45df-8d2d-dfbde115d7e3" />

Each repository serializes its entities to JSON before writing to . Reads deserialize JSON back to JavaScript objects. The separation between repository interfaces (Domain layer) and localStorage implementations (Infrastructure layer) enables future migration to HTTP-based APIs without changing service or view code.**localStorage**

Component Organization
----------------------

The presentation layer organizes Vue components into two categories:

### View Components (Containers)

Located in [src/views/](https://github.com/Santiago-Rueda-Q/ParkControl/blob/5ea0e175/src/views/) Each view corresponds to a route and orchestrates child components:

---

## Application Views

| **View**          | **Route** | **Purpose**                    |
| -------------------- | ------------- | --------------------------------- |
| **EntriesView.vue**  | `/entries`    | Vehicle entry registration        |
| **ExitsView.vue**    | `/exits`      | Vehicle exit processing           |
| **ClientsView.vue**  | `/clients`    | Client CRUD operations            |
| **SlotsView.vue**    | `/slots`      | Slot capacity configuration       |
| **MapView.vue**      | `/map`        | Parking map layout design         |
| **RatesView.vue**    | `/rates`      | Rate configuration                |
| **ReportsView.vue**  | `/reports`    | Movement analytics and CSV export |
| **SettingsView.vue** | `/settings`   | System settings                   |

---

### Reusable Components

Located in [src/components/](https://github.com/Santiago-Rueda-Q/ParkControl/blob/5ea0e175/src/components/) Domain-specific components organized by feature:

*   **entries/**: , , , **VehicleForm.vueLocationCard.vueParkedTable.vueEntriesHeaderStats.vue**
    
*   **exits/**: **ExitSearch.vue**
    
*   **clients/**: , , **ClientForm.vueClientSearch.vueClientTable.vue**
    
*   **map/**: , **MapConfig.vueParkingMap.vue**
    
*   **Shared**: , , , **SlotCard.vueSlotsConfig.vueSidebarNav.vueNavItem.vue**
    

The root component renders , which provides the persistent navigation shell and a outlet for dynamic view components.**App.vueAppLayout.vue**
Development Workflow
--------------------

The application uses Vite for development and build processes:

##  NPM Commands

| **Command**                | **Purpose**                                        |
| ----------------------------- | ----------------------------------------------------- |
| `bash<br>npm run dev<br>`     | Starts development server with hot module replacement |
| `bash<br>npm run build<br>`   | Produces optimized production bundle                  |
| `bash<br>npm run preview<br>` | Serves production build locally for testing           |

---

##  Test Commands

| **Command**                   | **Purpose**                                         |
| -------------------------------- | ------------------------------------------------------ |
| `bash<br>npm run test<br>`       | Launches Vitest in watch mode for active development   |
| `bash<br>npm run test:run<br>`   | Runs all tests once in headless mode                   |
| `bash<br>npm run test:watch<br>` | Watches for file changes and reruns relevant tests     |
| `bash<br>npm run coverage<br>`   | Generates coverage report (HTML + text + lcov)         |
| `bash<br>npm run test:ui<br>`    | Opens the Vitest UI for interactive test visualization |

---

Entry point: [index.html](https://github.com/Santiago-Rueda-Q/ParkControl/blob/5ea0e175/index.html) → [src/main.js](https://github.com/Santiago-Rueda-Q/ParkControl/blob/5ea0e175/src/main.js) → [src/App.vue](https://github.com/Santiago-Rueda-Q/ParkControl/blob/5ea0e175/src/App.vue)

The dependency injection container [src/services/di.js](https://github.com/Santiago-Rueda-Q/ParkControl/blob/5ea0e175/src/services/di.js) initializes during application bootstrap, wiring all repository implementations to service constructors. This occurs before the Vue application mounts, ensuring services are available to all components.
 
## 📂 Project Structure  

```bash
├── 📁 .git/             🚫 (hidden)
├── 📁 .vscode/          🚫 (local config)
├── 📁 ParkControl/
│   ├── 🌐 index.html
│   ├── 📄 script.js
│   └── 🎨 styles.css
├── 📁 node_modules/     🚫 (auto-generated)
├── 📁 public/
│   └── 🖼 vite.svg
├── 📁 src/
│   ├── 📁 Domain/       # Contracts (interfaces)
│   │   ├── 📁 Clients/
│   │   │   └── 📄 ClientsRepository.js
│   │   ├── 📁 Entries/
│   │   │   └── 📄 EntriesRepository.js
│   │   ├── 📁 Exits/
│   │   │   └── 📄 ExitsRepository.js
│   │   ├── 📁 Map/
│   │   │   └── 📄 MapRepository.js
│   │   └── 📁 Slots/
│   │       ├── 📄 SlotsRepository.js
│   │       └── 📄 categories.js
│   ├── 📁 Infrastructure/   # Concrete implementations (localStorage)
│   │   ├── 📁 Clients/
│   │   │   └── 📄 LocalClientsRepository.js
│   │   ├── 📁 Entries/
│   │   │   └── 📄 LocalEntriesRepository.js
│   │   ├── 📁 Exits/
│   │   │   └── 📄 LocalExitsRepository.js
│   │   ├── 📁 Map/
│   │   │   └── 📄 LocalMapRepository.js
│   │   └── 📁 Slots/
│   │       └── 📄 LocalSlotsRepository.js
│   ├── 📁 assets/
│   │   └── 🖼 vue.svg
│   ├── 📁 components/   # Reusable Vue components
│   │   ├── 📁 clients/
│   │   │   ├── 🟢 ClientForm.vue
│   │   │   ├── 🟢 ClientSearch.vue
│   │   │   └── 🟢 ClientTable.vue
│   │   ├── 📁 entries/
│   │   │   ├── 🟢 EntriesHeaderStats.vue
│   │   │   ├── 🟢 LocationCard.vue
│   │   │   ├── 🟢 ParkedTable.vue
│   │   │   └── 🟢 VehicleForm.vue
│   │   ├── 📁 exits/
│   │   │   └── 🟢 ExitSearch.vue
│   │   ├── 📁 map/
│   │   │   ├── 🟢 MapConfig.vue
│   │   │   └── 🟢 ParkingMap.vue
│   │   ├── 🟢 NavItem.vue
│   │   ├── 🟢 SidebarNav.vue
│   │   ├── 🟢 SlotCard.vue
│   │   └── 🟢 SlotsConfig.vue
│   ├── 📁 layouts/
│   │   └── 🟢 AppLayout.vue
│   ├── 📁 router/
│   │   └── 📄 index.js
│   ├── 📁 services/     # Use cases / business logic
│   │   ├── 📄 clients.service.js
│   │   ├── 📄 di.js
│   │   ├── 📄 entries.service.js
│   │   ├── 📄 exits.service.js
│   │   ├── 📄 fees.service.js
│   │   ├── 📄 map.service.js
│   │   ├── 📄 navigation.service.js
│   │   └── 📄 slots.service.js
│   ├── 📁 store/
│   ├── 📁 test/
│   ├── 📁 views/        # Main views (screens)
│   │   ├── 📁 Client/
│   │   │   └── 🟢 ClientsView.vue
│   │   ├── 📁 Entries/
│   │   │   └── 🟢 EntriesView.vue
│   │   ├── 📁 Exits/
│   │   │   └── 🟢 ExitsView.vue
│   │   ├── 📁 Map/
│   │   │   └── 🟢 MapView.vue
│   │   ├── 📁 Rates/
│   │   │   └── 🟢 RatesView.vue
│   │   ├── 📁 Reports/
│   │   │   └── 🟢 ReportsView.vue
│   │   ├── 📁 Settings/
│   │   │   └── 🟢 SettingsView.vue
│   │   └── 📁 Slots/
│   │       └── 🟢 SlotsView.vue
│   ├── 🟢 App.vue
│   ├── 📄 main.js
│   └── 🎨 style.css
├── 🚫 .gitignore
├── 📖 README.md
├── 🌐 index.html
├── 📄 package-lock.json
├── 📄 package.json
└── 📄 vite.config.js
git clone https://github.com/usuario/ParkControl.git
cd ParkControl
npm install
npm run dev
👥 Authors

Santiago Rueda Quintero

Eliecer Guevara Fuentes

Lisandro Rueda Thomas
