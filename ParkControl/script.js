// Variables globales
let espaciosEstacionamiento = [];
let vehiculosEstacionados = [];
let usuarios = [];
let historialMovimientos = [];
let tarifas = {
    carro: 5,
    moto: 3,
    bicicleta: 1,
    descuentoVIP: 20
};
let cupos = {
    carros: 10,
    motos: 15,
    bicis: 5,
    vip: 3,
    discapacidad: 2
};
let ajustes = {
    nombreNegocio: "ParkControl",
    direccion: "Av. Principal 123",
    telefono: "555-123-4567",
    temaColor: "blue"
};
let vehiculoSeleccionado = null;

// Inicialización cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos desde localStorage si existen
    cargarDatos();
    
    // Inicializar el mapa de estacionamiento
    inicializarMapa();
    
    // Configurar eventos para los botones del menú
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            cambiarSeccion(this.getAttribute('data-section'));
        });
    });
    
    // Configurar evento para el botón de menú en móviles
    document.querySelector('.toggle-menu').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('open');
    });
    
    // Configurar evento para cerrar modal
    document.querySelector('.modal-close').addEventListener('click', cerrarModal);
    
    // Configurar fechas en el reporte
    const hoy = new Date();
    const fechaHoy = formatDate(hoy);
    const unMesAtras = new Date(hoy.setMonth(hoy.getMonth() - 1));
    
    document.getElementById('reporte-fecha-inicio').value = formatDate(unMesAtras);
    document.getElementById('reporte-fecha-fin').value = fechaHoy;
    
    // Cargar lista de clientes en el selector
    actualizarListaClientes();
    
    // Actualizar elementos dinámicos
    actualizarEspaciosDisponibles();
    actualizarTablaIngresos();
    cargarReporte();
    cargarDatosFormularios();
    
    // Configurar tema de color
    aplicarTema(ajustes.temaColor || 'blue');
});

// Función para formatear fecha (YYYY-MM-DD)
function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// Función para cargar datos desde localStorage
function cargarDatos() {
    if (localStorage.getItem('espaciosEstacionamiento')) {
        espaciosEstacionamiento = JSON.parse(localStorage.getItem('espaciosEstacionamiento'));
    } else {
        generarEspaciosEstacionamiento();
    }
    
    if (localStorage.getItem('vehiculosEstacionados')) {
        vehiculosEstacionados = JSON.parse(localStorage.getItem('vehiculosEstacionados'));
    }
    
    if (localStorage.getItem('usuarios')) {
        usuarios = JSON.parse(localStorage.getItem('usuarios'));
    } else {
        // Agregar algunos usuarios de ejemplo
        usuarios = [
            { id: 1, nombre: 'Juan Pérez', telefono: '555-111-2222', email: 'juan@ejemplo.com', vip: true },
            { id: 2, nombre: 'María López', telefono: '555-333-4444', email: 'maria@ejemplo.com', vip: false },
            { id: 3, nombre: 'Carlos Gómez', telefono: '555-555-6666', email: 'carlos@ejemplo.com', vip: true }
        ];
        guardarDatos();
    }
    
    if (localStorage.getItem('historialMovimientos')) {
        historialMovimientos = JSON.parse(localStorage.getItem('historialMovimientos'));
    }
    
    if (localStorage.getItem('tarifas')) {
        tarifas = JSON.parse(localStorage.getItem('tarifas'));
    }
    
    if (localStorage.getItem('cupos')) {
        cupos = JSON.parse(localStorage.getItem('cupos'));
    }
    
    if (localStorage.getItem('ajustes')) {
        ajustes = JSON.parse(localStorage.getItem('ajustes'));
    }
}

// Función para guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('espaciosEstacionamiento', JSON.stringify(espaciosEstacionamiento));
    localStorage.setItem('vehiculosEstacionados', JSON.stringify(vehiculosEstacionados));
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('historialMovimientos', JSON.stringify(historialMovimientos));
    localStorage.setItem('tarifas', JSON.stringify(tarifas));
    localStorage.setItem('cupos', JSON.stringify(cupos));
    localStorage.setItem('ajustes', JSON.stringify(ajustes));
}

// Función para generar espacios de estacionamiento
function generarEspaciosEstacionamiento() {
    espaciosEstacionamiento = [];
    
    // Generar espacios para autos
    for (let i = 1; i <= cupos.carros; i++) {
        espaciosEstacionamiento.push({
            id: `A${i}`,
            tipo: 'carro',
            ocupado: false,
            vip: i <= cupos.vip,
            discapacidad: false
        });
    }
    
    // Generar espacios para motos
    for (let i = 1; i <= cupos.motos; i++) {
        espaciosEstacionamiento.push({
            id: `M${i}`,
            tipo: 'moto',
            ocupado: false,
            vip: false,
            discapacidad: false
        });
    }
    
    // Generar espacios para bicicletas
    for (let i = 1; i <= cupos.bicis; i++) {
        espaciosEstacionamiento.push({
            id: `B${i}`,
            tipo: 'bicicleta',
            ocupado: false,
            vip: false,
            discapacidad: false
        });
    }
    
    // Asignar espacios para discapacidad
    for (let i = 0; i < cupos.discapacidad; i++) {
        if (i < espaciosEstacionamiento.length) {
            espaciosEstacionamiento[i].discapacidad = true;
        }
    }
    
    guardarDatos();
}

// Función para inicializar el mapa de estacionamiento
function inicializarMapa() {
    const filasMapaInput = document.getElementById('filas-mapa');
    const columnasMapaInput = document.getElementById('columnas-mapa');
    
    if (filasMapaInput && columnasMapaInput) {
        const filas = parseInt(filasMapaInput.value) || 3;
        const columnas = parseInt(columnasMapaInput.value) || 5;
        
        renderizarMapa(filas, columnas);
        renderizarMiniMapa();
        actualizarListaEspacios();
    }
}

// Función para renderizar el mapa principal
function renderizarMapa(filas, columnas) {
    const parkingMap = document.getElementById('parking-map');
    if (!parkingMap) return;
    
    parkingMap.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;
    parkingMap.innerHTML = '';
    
    for (let i = 0; i < espaciosEstacionamiento.length; i++) {
        const espacio = espaciosEstacionamiento[i];
        const div = document.createElement('div');
        
        div.className = `parking-space ${espacio.ocupado ? 'occupied' : 'available'}`;
        if (espacio.vip) div.classList.add('vip');
        if (espacio.discapacidad) div.classList.add('disabled');
        
        div.textContent = espacio.id;
        div.dataset.id = espacio.id;
        div.dataset.index = i;
        
        div.addEventListener('click', function() {
            mostrarDetallesEspacio(espacio);
        });
        
        parkingMap.appendChild(div);
    }
}

// Función para renderizar el mini mapa en la sección de ingresos
function renderizarMiniMapa() {
    const miniMap = document.getElementById('mini-map');
    if (!miniMap) return;
    
    miniMap.innerHTML = '';
    
    // Mostrar solo los primeros 9 espacios en el mini mapa
    const espaciosAMostrar = espaciosEstacionamiento.slice(0, 9);
    
    for (let i = 0; i < espaciosAMostrar.length; i++) {
        const espacio = espaciosAMostrar[i];
        const div = document.createElement('div');
        
        div.className = `parking-space ${espacio.ocupado ? 'occupied' : 'available'}`;
        if (espacio.vip) div.classList.add('vip');
        if (espacio.discapacidad) div.classList.add('disabled');
        
        div.textContent = espacio.id;
        div.dataset.id = espacio.id;
        
        div.addEventListener('click', function() {
            // Seleccionar este espacio en el dropdown
            document.getElementById('espacio-numero').value = espacio.id;
        });
        
        miniMap.appendChild(div);
    }
}

// Función para actualizar la lista de espacios disponibles en el select
function actualizarListaEspacios() {
    const espacioSelect = document.getElementById('espacio-numero');
    if (!espacioSelect) return;
    
    const tipoVehiculo = document.getElementById('tipo-vehiculo').value;
    const esDiscapacidad = document.getElementById('discapacidad').checked;
    const esVIP = document.getElementById('vip').checked;
    
    espacioSelect.innerHTML = '<option value="">Seleccionar espacio</option>';
    
    const espaciosDisponibles = espaciosEstacionamiento.filter(espacio => {
        // Filtrar por tipo de vehículo
        if (espacio.tipo !== tipoVehiculo) return false;
        
        // Verificar si está ocupado
        if (espacio.ocupado) return false;
        
        // Verificar si necesita ser espacio para discapacidad
        if (esDiscapacidad && !espacio.discapacidad) return false;
        
        // Verificar si necesita ser espacio VIP
        if (esVIP && !espacio.vip) return false;
        
        return true;
    });
    
    for (const espacio of espaciosDisponibles) {
        const option = document.createElement('option');
        option.value = espacio.id;
        option.textContent = espacio.id;
        espacioSelect.appendChild(option);
    }
}

// Función para cambiar de sección
function cambiarSeccion(seccion) {
    // Desactivar todas las secciones y botones
    document.querySelectorAll('.section').forEach(elem => {
        elem.classList.remove('active');
    });
    
    document.querySelectorAll('.menu-btn').forEach(elem => {
        elem.classList.remove('active');
    });
    
    // Activar la sección solicitada
    document.getElementById(seccion).classList.add('active');
    document.querySelector(`.menu-btn[data-section="${seccion}"]`).classList.add('active');
    
    // Acciones específicas por sección
    if (seccion === 'mapa') {
        inicializarMapa();
    } else if (seccion === 'usuarios') {
        actualizarTablaUsuarios();
    } else if (seccion === 'reporte') {
        cargarReporte();
    }
}

// Función para registrar ingreso de vehículo
function registrarIngreso() {
    const placa = document.getElementById('placa').value.trim().toUpperCase();
    const tipoVehiculo = document.getElementById('tipo-vehiculo').value;
    const esVIP = document.getElementById('vip').checked;
    const esDiscapacidad = document.getElementById('discapacidad').checked;
    const espacioId = document.getElementById('espacio-numero').value;
    const clienteId = document.getElementById('cliente-select').value;
    
    // Validaciones
    if (!placa) {
        mostrarModal('Error', 'Debe ingresar la placa del vehículo.');
        return;
    }
    
    if (!espacioId) {
        mostrarModal('Error', 'Debe seleccionar un espacio de estacionamiento.');
        return;
    }
    
    // Validar formato de placa (ejemplo básico)
    if (!/^[A-Z0-9]{3,10}$/.test(placa)) {
        mostrarModal('Error', 'Formato de placa inválido. Use solo letras y números (3-10 caracteres).');
        return;
    }
    
    // Verificar si ya existe un vehículo con esa placa
    const vehiculoExistente = vehiculosEstacionados.find(v => v.placa === placa);
    if (vehiculoExistente) {
        mostrarModal('Error', `Ya existe un vehículo con la placa ${placa} en el espacio ${vehiculoExistente.espacio}.`);
        return;
    }
    
    // Buscar el espacio seleccionado
    const espacioIndex = espaciosEstacionamiento.findIndex(e => e.id === espacioId);
    if (espacioIndex === -1) {
        mostrarModal('Error', 'El espacio seleccionado no existe.');
        return;
    }
    
    // Verificar si el espacio está realmente disponible
    if (espaciosEstacionamiento[espacioIndex].ocupado) {
        mostrarModal('Error', 'El espacio seleccionado ya está ocupado.');
        return;
    }
    
    // Marcar el espacio como ocupado
    espaciosEstacionamiento[espacioIndex].ocupado = true;
    
    // Crear el registro del vehículo
    const fechaIngreso = new Date();
    const nuevoVehiculo = {
        placa: placa,
        tipo: tipoVehiculo,
        espacio: espacioId,
        fechaIngreso: fechaIngreso,
        clienteId: clienteId,
        vip: esVIP,
        discapacidad: esDiscapacidad
    };
    
    vehiculosEstacionados.push(nuevoVehiculo);
    
    // Registrar en historial
    historialMovimientos.push({
        placa: placa,
        tipo: tipoVehiculo,
        espacio: espacioId,
        fechaIngreso: fechaIngreso,
        movimiento: 'ingreso',
        clienteId: clienteId
    });
    
    // Guardar los cambios
    guardarDatos();
    
    // Limpiar el formulario
    document.getElementById('placa').value = '';
    document.getElementById('vip').checked = false;
    document.getElementById('discapacidad').checked = false;
    document.getElementById('cliente-select').value = '';
    document.getElementById('espacio-numero').value = '';
    
    // Actualizar interfaces
    actualizarEspaciosDisponibles();
    actualizarTablaIngresos();
    inicializarMapa();
    
    mostrarModal('Éxito', `Vehículo con placa ${placa} registrado correctamente en el espacio ${espacioId}.`);
}

// Función para buscar vehículo por placa
function buscarVehiculo() {
    const placaBusqueda = document.getElementById('placa-salida').value.trim().toUpperCase();
    const vehiculoEncontradoDiv = document.getElementById('vehiculo-encontrado');
    const btnProcesarSalida = document.getElementById('btn-procesar-salida');
    const btnImprimir = document.getElementById('btn-imprimir');
    
    if (!placaBusqueda) {
        mostrarModal('Error', 'Debe ingresar una placa para buscar el vehículo.');
        return;
    }
    
    const vehiculo = vehiculosEstacionados.find(v => v.placa === placaBusqueda);
    
    if (!vehiculo) {
        vehiculoEncontradoDiv.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i>
                No se encontró ningún vehículo con la placa ${placaBusqueda}.
            </div>
        `;
        btnProcesarSalida.disabled = true;
        btnImprimir.disabled = true;
        document.getElementById('factura-contenido').innerHTML = `
            <div class="factura-placeholder">
                <i class="fas fa-receipt factura-icon"></i>
                <p>No se encontró vehículo para generar factura</p>
            </div>
        `;
        return;
    }
    
    // Guardar vehículo seleccionado
    vehiculoSeleccionado = vehiculo;
    
    // Mostrar información del vehículo
    const cliente = vehiculo.clienteId ? usuarios.find(u => u.id == vehiculo.clienteId) : null;
    
    vehiculoEncontradoDiv.innerHTML = `
        <div class="alert" style="background-color: #e3f2fd; color: #0d47a1; border-left: 4px solid #2196f3;">
            <i class="fas fa-car"></i>
            <strong>Vehículo encontrado:</strong> ${vehiculo.placa} (${vehiculo.tipo.toUpperCase()})
            <br>
            <strong>Espacio:</strong> ${vehiculo.espacio}
            <br>
            <strong>Ingreso:</strong> ${formatearFecha(new Date(vehiculo.fechaIngreso))}
            ${cliente ? `<br><strong>Cliente:</strong> ${cliente.nombre}` : ''}
            ${vehiculo.vip ? '<br><span class="badge" style="background-color: #ffc107; color: #000; padding: 3px 8px; border-radius: 3px;"><i class="fas fa-crown"></i> VIP</span>' : ''}
        </div>
    `;
    
    // Habilitar botones
    btnProcesarSalida.disabled = false;
    btnImprimir.disabled = false;
    
    // Generar factura
    generarFactura(vehiculo);
}

// Función para formatear fecha legible
function formatearFecha(fecha) {
    const opciones = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    };
    return fecha.toLocaleString('es-ES', opciones);
}

// Función para calcular tiempo de estadía
function calcularTiempoEstadia(fechaIngreso, fechaSalida) {
    const diff = fechaSalida - fechaIngreso;
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { horas, minutos };
}

// Función para generar factura
function generarFactura(vehiculo) {
    const facturaContenido = document.getElementById('factura-contenido');
    
    if (!vehiculo) {
        facturaContenido.innerHTML = `
            <div class="factura-placeholder">
                <i class="fas fa-receipt factura-icon"></i>
                <p>Busque un vehículo para generar la factura</p>
            </div>
        `;
        return;
    }
    
    const fechaIngreso = new Date(vehiculo.fechaIngreso);
    const fechaSalida = new Date();
    const tiempoEstadia = calcularTiempoEstadia(fechaIngreso, fechaSalida);
    const horasEstadia = tiempoEstadia.horas + (tiempoEstadia.minutos / 60);
    
    // Calcular tarifa según tipo de vehículo
    let tarifaBase = 0;
    switch (vehiculo.tipo) {
        case 'carro':
            tarifaBase = tarifas.carro;
            break;
        case 'moto':
            tarifaBase = tarifas.moto;
            break;
        case 'bicicleta':
            tarifaBase = tarifas.bicicleta;
            break;
    }
    
    // Redondear horas hacia arriba
    const horasRedondeadas = Math.ceil(horasEstadia);
    
    // Calcular monto
    let montoTotal = tarifaBase * horasRedondeadas;
    let descuento = 0;
    
    // Aplicar descuento si es VIP
    if (vehiculo.vip) {
        descuento = montoTotal * (tarifas.descuentoVIP / 100);
        montoTotal -= descuento;
    }
    
    const cliente = vehiculo.clienteId ? usuarios.find(u => u.id == vehiculo.clienteId) : null;
    
    facturaContenido.innerHTML = `
        <div class="factura">
            <div class="factura-header">
                <h3>${ajustes.nombreNegocio || 'ParkControl'}</h3>
                <p>${ajustes.direccion || 'Av. Principal 123'}</p>
                <p>Tel: ${ajustes.telefono || '555-123-4567'}</p>
                <h4>COMPROBANTE DE PAGO</h4>
                <p>Fecha: ${formatearFecha(fechaSalida)}</p>
            </div>
            
            <div class="factura-detalles">
                <table style="width: 100%; margin-bottom: 20px;">
                    <tr>
                        <td><strong>Placa:</strong></td>
                        <td>${vehiculo.placa}</td>
                    </tr>
                    <tr>
                        <td><strong>Tipo:</strong></td>
                        <td>${vehiculo.tipo.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td><strong>Espacio:</strong></td>
                        <td>${vehiculo.espacio}</td>
                    </tr>
                    <tr>
                        <td><strong>Cliente:</strong></td>
                        <td>${cliente ? cliente.nombre : 'Cliente Ocasional'}</td>
                    </tr>
                    <tr>
                        <td><strong>Ingreso:</strong></td>
                        <td>${formatearFecha(fechaIngreso)}</td>
                    </tr>
                    <tr>
                        <td><strong>Salida:</strong></td>
                        <td>${formatearFecha(fechaSalida)}</td>
                    </tr>
                    <tr>
                        <td><strong>Tiempo:</strong></td>
                        <td>${tiempoEstadia.horas}h ${tiempoEstadia.minutos}m</td>
                    </tr>
                </table>
                
                <table style="width: 100%; border-top: 1px dashed #ccc; padding-top: 10px;">
                    <tr>
                        <td>Tarifa por hora:</td>
                        <td style="text-align: right;">S/. ${tarifaBase.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Horas facturadas:</td>
                        <td style="text-align: right;">${horasRedondeadas}</td>
                    </tr>
                    ${vehiculo.vip ? `
                    <tr>
                        <td>Subtotal:</td>
                        <td style="text-align: right;">S/. ${(tarifaBase * horasRedondeadas).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Descuento VIP (${tarifas.descuentoVIP}%):</td>
                        <td style="text-align: right;">- S/. ${descuento.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="font-weight: bold; font-size: 1.2em;">TOTAL A PAGAR:</td>
                        <td style="text-align: right; font-weight: bold; font-size: 1.2em;">S/. ${montoTotal.toFixed(2)}</td>
                    </tr>
                </table>
            </div>
            
            <div class="factura-footer" style="margin-top: 30px; text-align: center; font-size: 0.9em;">
                <p>¡Gracias por su preferencia!</p>
                <p>Vuelva pronto</p>
            </div>
        </div>
    `;
}

// Función para registrar salida de vehículo
function registrarSalida() {
    if (!vehiculoSeleccionado) {
        mostrarModal('Error', 'No se ha seleccionado ningún vehículo.');
        return;
    }
    
    const fechaIngreso = new Date(vehiculoSeleccionado.fechaIngreso);
    const fechaSalida = new Date();
    const tiempoEstadia = calcularTiempoEstadia(fechaIngreso, fechaSalida);
    const horasEstadia = tiempoEstadia.horas + (tiempoEstadia.minutos / 60);
    
    // Calcular tarifa según tipo de vehículo
    let tarifaBase = 0;
    switch (vehiculoSeleccionado.tipo) {
        case 'carro':
            tarifaBase = tarifas.carro;
            break;
        case 'moto':
            tarifaBase = tarifas.moto;
            break;
        case 'bicicleta':
            tarifaBase = tarifas.bicicleta;
            break;
    }
    
    // Redondear horas hacia arriba
    const horasRedondeadas = Math.ceil(horasEstadia);
    
    // Calcular monto
    let montoTotal = tarifaBase * horasRedondeadas;
    
    // Aplicar descuento si es VIP
    if (vehiculoSeleccionado.vip) {
        const descuento = montoTotal * (tarifas.descuentoVIP / 100);
        montoTotal -= descuento;
    }
    
    // Liberar el espacio
    const espacioIndex = espaciosEstacionamiento.findIndex(e => e.id === vehiculoSeleccionado.espacio);
    if (espacioIndex !== -1) {
        espaciosEstacionamiento[espacioIndex].ocupado = false;
    }
    
    // Registrar en historial
    historialMovimientos.push({
        placa: vehiculoSeleccionado.placa,
        tipo: vehiculoSeleccionado.tipo,
        espacio: vehiculoSeleccionado.espacio,
        fechaIngreso: fechaIngreso,
        fechaSalida: fechaSalida,
        tiempo: `${tiempoEstadia.horas}h ${tiempoEstadia.minutos}m`,
        monto: montoTotal,
        clienteId: vehiculoSeleccionado.clienteId,
        vip: vehiculoSeleccionado.vip,
        movimiento: 'salida'
    });
    
    // Eliminar de la lista de vehículos estacionados
    vehiculosEstacionados = vehiculosEstacionados.filter(v => v.placa !== vehiculoSeleccionado.placa);
    
    // Guardar cambios
    guardarDatos();
    
    // Limpiar formulario y selección
    document.getElementById('placa-salida').value = '';
    document.getElementById('vehiculo-encontrado').innerHTML = '';
    document.getElementById('btn-procesar-salida').disabled = true;
    document.getElementById('btn-imprimir').disabled = true;
    document.getElementById('factura-contenido').innerHTML = `
        <div class="factura-placeholder">
            <i class="fas fa-receipt factura-icon"></i>
            <p>Busque un vehículo para generar la factura</p>
        </div>
    `;
    
    vehiculoSeleccionado = null;
    
    // Actualizar interfaces
    actualizarEspaciosDisponibles();
    actualizarTablaIngresos();
    inicializarMapa();
    
    mostrarModal('Éxito', `Salida registrada correctamente. Total cobrado: S/. ${montoTotal.toFixed(2)}`);
}

// Función para actualizar el contador de espacios disponibles
function actualizarEspaciosDisponibles() {
    const totalCarros = cupos.carros;
    const carrosOcupados = vehiculosEstacionados.filter(v => v.tipo === 'carro').length;
    
    const totalMotos = cupos.motos;
    const motosOcupados = vehiculosEstacionados.filter(v => v.tipo === 'moto').length;
    
    const totalBicis = cupos.bicis;
    const bicisOcupados = vehiculosEstacionados.filter(v => v.tipo === 'bicicleta').length;
    
    // Actualizar contadores en la UI
    document.getElementById('contador-carros').textContent = `${totalCarros - carrosOcupados}/${totalCarros}`;
    document.getElementById('contador-motos').textContent = `${totalMotos - motosOcupados}/${totalMotos}`;
    document.getElementById('contador-bicis').textContent = `${totalBicis - bicisOcupados}/${totalBicis}`;
}

// Función para actualizar la tabla de vehículos estacionados
function actualizarTablaIngresos() {
    const tablaIngresos = document.getElementById('tabla-ingresos');
    
    if (!tablaIngresos) return;
    
    // Limpiar tabla
    tablaIngresos.innerHTML = '';
    
    if (vehiculosEstacionados.length === 0) {
        tablaIngresos.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No hay vehículos estacionados actualmente</td>
            </tr>
        `;
        return;
    }
    
    // Ordenar por hora de ingreso (más reciente primero)
    const vehiculosOrdenados = [...vehiculosEstacionados].sort((a, b) => {
        return new Date(b.fechaIngreso) - new Date(a.fechaIngreso);
    });
    
    // Mostrar máximo 10 vehículos
    const vehiculosMostrar = vehiculosOrdenados.slice(0, 10);
    
    for (const vehiculo of vehiculosMostrar) {
        const cliente = vehiculo.clienteId ? usuarios.find(u => u.id == vehiculo.clienteId) : null;
        const fechaIngreso = new Date(vehiculo.fechaIngreso);
        const tiempoTranscurrido = calcularTiempoEstadia(fechaIngreso, new Date());
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${vehiculo.placa}</td>
            <td>${vehiculo.tipo.charAt(0).toUpperCase() + vehiculo.tipo.slice(1)}</td>
            <td>${vehiculo.espacio}</td>
            <td>${formatearFecha(fechaIngreso)}</td>
            <td>${tiempoTranscurrido.horas}h ${tiempoTranscurrido.minutos}m</td>
            <td>
                ${cliente ? cliente.nombre : 'Cliente Ocasional'}
                ${vehiculo.vip ? '<span class="badge-small vip"><i class="fas fa-crown"></i> VIP</span>' : ''}
            </td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="registrarSalidaDesdeTabla('${vehiculo.placa}')">
                    <i class="fas fa-sign-out-alt"></i> Salida
                </button>
            </td>
        `;
        
        tablaIngresos.appendChild(fila);
    }
}

function registrarSalidaDesdeTabla(placa) {
    document.getElementById('placa-salida').value = placa;
    buscarVehiculo();
    cambiarSeccion('salidas');
}

// Función para mostrar detalles de un espacio
function mostrarDetallesEspacio(espacio) {
    let detalles = `
        <h3>Espacio ${espacio.id}</h3>
        <p><strong>Tipo:</strong> ${espacio.tipo.charAt(0).toUpperCase() + espacio.tipo.slice(1)}</p>
        <p><strong>Estado:</strong> ${espacio.ocupado ? 'Ocupado' : 'Disponible'}</p>
    `;
    
    if (espacio.vip) {
        detalles += `<p><span class="badge vip"><i class="fas fa-crown"></i> Espacio VIP</span></p>`;
    }
    
    if (espacio.discapacidad) {
        detalles += `<p><span class="badge disabled"><i class="fas fa-wheelchair"></i> Accesibilidad</span></p>`;
    }
    
    if (espacio.ocupado) {
        const vehiculo = vehiculosEstacionados.find(v => v.espacio === espacio.id);
        if (vehiculo) {
            const cliente = vehiculo.clienteId ? usuarios.find(u => u.id == vehiculo.clienteId) : null;
            const fechaIngreso = new Date(vehiculo.fechaIngreso);
            const tiempoTranscurrido = calcularTiempoEstadia(fechaIngreso, new Date());
            
            detalles += `
                <div class="linea-divisoria"></div>
                <h4>Vehículo Estacionado</h4>
                <p><strong>Placa:</strong> ${vehiculo.placa}</p>
                <p><strong>Ingreso:</strong> ${formatearFecha(fechaIngreso)}</p>
                <p><strong>Tiempo:</strong> ${tiempoTranscurrido.horas}h ${tiempoTranscurrido.minutos}m</p>
                ${cliente ? `<p><strong>Cliente:</strong> ${cliente.nombre}</p>` : ''}
            `;
        }
    }
    
    mostrarModal(`Espacio ${espacio.id}`, detalles);
}

// Función para mostrar modal
function mostrarModal(titulo, contenido) {
    const modal = document.getElementById('modal');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalContenido = document.getElementById('modal-contenido');
    
    modalTitulo.textContent = titulo;
    modalContenido.innerHTML = contenido;
    
    modal.style.display = 'block';
}

// Función para cerrar modal
function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

// Función para cargar el reporte
function cargarReporte() {
    const fechaInicio = document.getElementById('reporte-fecha-inicio').value;
    const fechaFin = document.getElementById('reporte-fecha-fin').value;
    
    if (!fechaInicio || !fechaFin) {
        mostrarModal('Error', 'Debe seleccionar un rango de fechas válido.');
        return;
    }
    
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    
    // Filtrar movimientos por rango de fechas (solo salidas)
    const movimientosFiltrados = historialMovimientos.filter(m => {
        if (!m.fechaSalida) return false;
        
        const fechaMovimiento = new Date(m.fechaSalida);
        return fechaMovimiento >= fechaInicioObj && fechaMovimiento <= fechaFinObj && m.movimiento === 'salida';
    });
    
    // Generar reportes
    generarGraficoIngresos(movimientosFiltrados);
    generarGraficoTiposVehiculo(movimientosFiltrados);
    generarTablaReporte(movimientosFiltrados);
    generarResumenReporte(movimientosFiltrados);
}

// Función para generar gráfico de ingresos por día
function generarGraficoIngresos(movimientos) {
    const graficoIngresos = document.getElementById('grafico-ingresos');
    if (!graficoIngresos) return;
    
    // Si no hay datos, mostrar mensaje
    if (movimientos.length === 0) {
        graficoIngresos.innerHTML = `
            <div class="sin-datos">
                <i class="fas fa-chart-bar"></i>
                <p>No hay datos para mostrar en el período seleccionado</p>
            </div>
        `;
        return;
    }
    
    // Agrupar movimientos por día y sumar montos
    const ingresosPorDia = {};
    
    movimientos.forEach(m => {
        const fecha = new Date(m.fechaSalida);
        const fechaStr = fecha.toISOString().split('T')[0];
        
        if (!ingresosPorDia[fechaStr]) {
            ingresosPorDia[fechaStr] = 0;
        }
        
        ingresosPorDia[fechaStr] += m.monto;
    });
    
    // Convertir a array para gráfico
    const fechas = Object.keys(ingresosPorDia).sort();
    const montos = fechas.map(f => ingresosPorDia[f]);
    
    // Formatear fechas para mostrar
    const fechasFormateadas = fechas.map(f => {
        const fecha = new Date(f);
        return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    });
    
    // Generar gráfico (versión simplificada usando divs)
    let html = `
        <div class="grafico-container">
            <div class="grafico-barras">
    `;
    
    const maxMonto = Math.max(...montos);
    
    for (let i = 0; i < fechas.length; i++) {
        const altura = (montos[i] / maxMonto) * 100;
        html += `
            <div class="barra-container">
                <div class="barra-valor">S/. ${montos[i].toFixed(2)}</div>
                <div class="barra" style="height: ${altura}%"></div>
                <div class="barra-etiqueta">${fechasFormateadas[i]}</div>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    graficoIngresos.innerHTML = html;
}

// Función para generar gráfico de tipos de vehículo
function generarGraficoTiposVehiculo(movimientos) {
    const graficoTipos = document.getElementById('grafico-tipos');
    if (!graficoTipos) return;
    
    // Si no hay datos, mostrar mensaje
    if (movimientos.length === 0) {
        graficoTipos.innerHTML = `
            <div class="sin-datos">
                <i class="fas fa-chart-pie"></i>
                <p>No hay datos para mostrar en el período seleccionado</p>
            </div>
        `;
        return;
    }
    
    // Contar por tipo de vehículo
    const conteoTipos = {
        carro: 0,
        moto: 0,
        bicicleta: 0
    };
    
    movimientos.forEach(m => {
        conteoTipos[m.tipo]++;
    });
    
    const total = movimientos.length;
    
    // Calcular porcentajes
    const porcentajes = {
        carro: (conteoTipos.carro / total) * 100,
        moto: (conteoTipos.moto / total) * 100,
        bicicleta: (conteoTipos.bicicleta / total) * 100
    };
    
    // Generar gráfico circular simple usando CSS
    graficoTipos.innerHTML = `
        <div class="grafico-circular-container">
            <div class="grafico-circular" style="--p-carro: ${porcentajes.carro}%; --p-moto: ${porcentajes.moto}%; --p-bici: ${porcentajes.bicicleta}%"></div>
            <div class="leyenda">
                <div class="leyenda-item">
                    <span class="color-muestra carro"></span>
                    <span>Carros: ${conteoTipos.carro} (${porcentajes.carro.toFixed(1)}%)</span>
                </div>
                <div class="leyenda-item">
                    <span class="color-muestra moto"></span>
                    <span>Motos: ${conteoTipos.moto} (${porcentajes.moto.toFixed(1)}%)</span>
                </div>
                <div class="leyenda-item">
                    <span class="color-muestra bici"></span>
                    <span>Bicicletas: ${conteoTipos.bicicleta} (${porcentajes.bicicleta.toFixed(1)}%)</span>
                </div>
            </div>
        </div>
    `;
}

// Función para generar tabla de reporte
function generarTablaReporte(movimientos) {
    const tablaReporte = document.getElementById('tabla-reporte');
    if (!tablaReporte) return;
    
    // Limpiar tabla
    tablaReporte.innerHTML = '';
    
    if (movimientos.length === 0) {
        tablaReporte.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay movimientos en el período seleccionado</td>
            </tr>
        `;
        return;
    }
    
    // Ordenar movimientos por fecha de salida (más reciente primero)
    const movimientosOrdenados = [...movimientos].sort((a, b) => {
        return new Date(b.fechaSalida) - new Date(a.fechaSalida);
    });
    
    // Mostrar los movimientos
    for (const movimiento of movimientosOrdenados) {
        const cliente = movimiento.clienteId ? usuarios.find(u => u.id == movimiento.clienteId) : null;
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${movimiento.placa}</td>
            <td>${movimiento.tipo.charAt(0).toUpperCase() + movimiento.tipo.slice(1)}</td>
            <td>${formatearFecha(new Date(movimiento.fechaIngreso))}</td>
            <td>${formatearFecha(new Date(movimiento.fechaSalida))}</td>
            <td>${movimiento.tiempo}</td>
            <td>${cliente ? cliente.nombre : 'Cliente Ocasional'}</td>
            <td>S/. ${movimiento.monto.toFixed(2)}</td>
        `;
        
        tablaReporte.appendChild(fila);
    }
}

// Función para generar resumen de reporte
function generarResumenReporte(movimientos) {
    const resumenReporte = document.getElementById('resumen-reporte');
    if (!resumenReporte) return;
    
    // Calcular totales
    const totalMovimientos = movimientos.length;
    const totalIngresos = movimientos.reduce((sum, m) => sum + m.monto, 0);
    
    // Contar por tipo
    const totalCarros = movimientos.filter(m => m.tipo === 'carro').length;
    const totalMotos = movimientos.filter(m => m.tipo === 'moto').length;
    const totalBicicletas = movimientos.filter(m => m.tipo === 'bicicleta').length;
    
    // Promedio de ingresos por día
    const diasUnicos = new Set();
    movimientos.forEach(m => {
        const fecha = new Date(m.fechaSalida).toISOString().split('T')[0];
        diasUnicos.add(fecha);
    });
    
    const promedioPorDia = diasUnicos.size > 0 ? totalIngresos / diasUnicos.size : 0;
    
    // Mostrar resumen
    resumenReporte.innerHTML = `
        <div class="resumen-item">
            <div class="resumen-titulo">Total Movimientos</div>
            <div class="resumen-valor">${totalMovimientos}</div>
        </div>
        <div class="resumen-item">
            <div class="resumen-titulo">Total Ingresos</div>
            <div class="resumen-valor">S/. ${totalIngresos.toFixed(2)}</div>
        </div>
        <div class="resumen-item">
            <div class="resumen-titulo">Promedio Diario</div>
            <div class="resumen-valor">S/. ${promedioPorDia.toFixed(2)}</div>
        </div>
        <div class="resumen-item">
            <div class="resumen-titulo">Carros</div>
            <div class="resumen-valor">${totalCarros}</div>
        </div>
        <div class="resumen-item">
            <div class="resumen-titulo">Motos</div>
            <div class="resumen-valor">${totalMotos}</div>
        </div>
        <div class="resumen-item">
            <div class="resumen-titulo">Bicicletas</div>
            <div class="resumen-valor">${totalBicicletas}</div>
        </div>
    `;
}

// Función para imprimir factura
function imprimirFactura() {
    if (!vehiculoSeleccionado) {
        mostrarModal('Error', 'No hay factura para imprimir.');
        return;
    }
    
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Factura - ${vehiculoSeleccionado.placa}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    font-size: 14px;
                }
                .factura {
                    max-width: 400px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                }
                .factura-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .factura-header h3 {
                    margin: 5px 0;
                    font-size: 20px;
                }
                .factura-header h4 {
                    margin: 15px 0 5px;
                }
                .factura-header p {
                    margin: 5px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                td {
                    padding: 5px 0;
                }
                .linea-puntos {
                    border-top: 1px dashed #888;
                    margin: 15px 0;
                }
                .total {
                    font-weight: bold;
                    font-size: 1.2em;
                }
                .factura-footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .factura {
                        border: none;
                    }
                }
            </style>
        </head>
        <body>
            ${document.getElementById('factura-contenido').innerHTML}
        </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
    setTimeout(() => {
        ventanaImpresion.print();
    }, 500);
}

// Función para agregar nuevo usuario
function agregarUsuario() {
    const nombre = document.getElementById('usuario-nombre').value.trim();
    const telefono = document.getElementById('usuario-telefono').value.trim();
    const email = document.getElementById('usuario-email').value.trim();
    const vip = document.getElementById('usuario-vip').checked;
    
    if (!nombre) {
        mostrarModal('Error', 'Debe ingresar el nombre del usuario.');
        return;
    }
    
    // Validar formato de email si se proporciona
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarModal('Error', 'El formato del email no es válido.');
        return;
    }
    
    // Generar nuevo ID
    const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
    
    // Crear nuevo usuario
    const nuevoUsuario = {
        id: nuevoId,
        nombre: nombre,
        telefono: telefono,
        email: email,
        vip: vip
    };
    
    usuarios.push(nuevoUsuario);
    guardarDatos();
    
    // Limpiar formulario
    document.getElementById('usuario-nombre').value = '';
    document.getElementById('usuario-telefono').value = '';
    document.getElementById('usuario-email').value = '';
    document.getElementById('usuario-vip').checked = false;
    
    // Actualizar lista de clientes
    actualizarListaClientes();
    actualizarTablaUsuarios();
    
    mostrarModal('Éxito', 'Usuario agregado correctamente.');
}

// Función para actualizar la tabla de usuarios
function actualizarTablaUsuarios() {
    const tablaUsuarios = document.getElementById('tabla-usuarios');
    if (!tablaUsuarios) return;
    
    // Limpiar tabla
    tablaUsuarios.innerHTML = '';
    
    if (usuarios.length === 0) {
        tablaUsuarios.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay usuarios registrados</td>
            </tr>
        `;
        return;
    }
    
    for (const usuario of usuarios) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.telefono || '-'}</td>
            <td>${usuario.email || '-'}</td>
            <td>${usuario.vip ? '<span class="badge vip"><i class="fas fa-crown"></i> VIP</span>' : '-'}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${usuario.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        
        tablaUsuarios.appendChild(fila);
    }
}

// Función para eliminar usuario
function eliminarUsuario(id) {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
        // Verificar si el usuario tiene vehículos estacionados
        const tieneVehiculos = vehiculosEstacionados.some(v => v.clienteId == id);
        
        if (tieneVehiculos) {
            mostrarModal('Error', 'No se puede eliminar el usuario porque tiene vehículos estacionados.');
            return;
        }
        
        // Eliminar usuario
        usuarios = usuarios.filter(u => u.id != id);
        guardarDatos();
        
        // Actualizar interfaces
        actualizarListaClientes();
        actualizarTablaUsuarios();
        
        mostrarModal('Éxito', 'Usuario eliminado correctamente.');
    }
}

// Función para actualizar la lista de clientes en el selector
function actualizarListaClientes() {
    const clienteSelect = document.getElementById('cliente-select');
    if (!clienteSelect) return;
    
    clienteSelect.innerHTML = '<option value="">Seleccionar cliente (opcional)</option>';
    
    for (const usuario of usuarios) {
        const option = document.createElement('option');
        option.value = usuario.id;
        option.textContent = usuario.nombre + (usuario.vip ? ' (VIP)' : '');
        clienteSelect.appendChild(option);
    }
}

// Función para cargar datos en formularios de ajustes
function cargarDatosFormularios() {
    // Cargar datos de tarifas
    if (document.getElementById('tarifa-carro')) {
        document.getElementById('tarifa-carro').value = tarifas.carro;
        document.getElementById('tarifa-moto').value = tarifas.moto;
        document.getElementById('tarifa-bicicleta').value = tarifas.bicicleta;
        document.getElementById('descuento-vip').value = tarifas.descuentoVIP;
    }
    
    // Cargar datos de cupos
    if (document.getElementById('cupos-carros')) {
        document.getElementById('cupos-carros').value = cupos.carros;
        document.getElementById('cupos-motos').value = cupos.motos;
        document.getElementById('cupos-bicis').value = cupos.bicis;
        document.getElementById('cupos-vip').value = cupos.vip;
        document.getElementById('cupos-discapacidad').value = cupos.discapacidad;
    }
    
    // Cargar datos de negocio
    if (document.getElementById('nombre-negocio')) {
        document.getElementById('nombre-negocio').value = ajustes.nombreNegocio;
        document.getElementById('direccion').value = ajustes.direccion;
        document.getElementById('telefono').value = ajustes.telefono;
        document.getElementById('tema-color').value = ajustes.temaColor;
    }
}

// Función para aplicar el tema de color seleccionado
function aplicarTema(color) {
    const root = document.documentElement;
    
    // Resetear todos los temas primero
    root.classList.remove('tema-blue', 'tema-green', 'tema-red', 'tema-purple', 'tema-orange');
    
    // Aplicar el tema seleccionado
    root.classList.add(`tema-${color}`);
    
    // Guardar el tema en ajustes
    ajustes.temaColor = color;
    guardarDatos();
}

// Función para guardar ajustes
function guardarAjustes() {
    // Guardar tarifas
    tarifas = {
        carro: parseFloat(document.getElementById('tarifa-carro').value) || 5,
        moto: parseFloat(document.getElementById('tarifa-moto').value) || 3,
        bicicleta: parseFloat(document.getElementById('tarifa-bicicleta').value) || 1,
        descuentoVIP: parseFloat(document.getElementById('descuento-vip').value) || 20
    };
    
    // Guardar cupos
    cupos = {
        carros: parseInt(document.getElementById('cupos-carros').value) || 10,
        motos: parseInt(document.getElementById('cupos-motos').value) || 15,
        bicis: parseInt(document.getElementById('cupos-bicis').value) || 5,
        vip: parseInt(document.getElementById('cupos-vip').value) || 3,
        discapacidad: parseInt(document.getElementById('cupos-discapacidad').value) || 2
    };
    
    // Guardar datos de negocio
    ajustes = {
        nombreNegocio: document.getElementById('nombre-negocio').value || "ParkControl",
        direccion: document.getElementById('direccion').value || "Av. Principal 123",
        telefono: document.getElementById('telefono').value || "555-123-4567",
        temaColor: document.getElementById('tema-color').value || "blue"
    };
    
    // Aplicar cambios
    guardarDatos();
    aplicarTema(ajustes.temaColor);
    generarEspaciosEstacionamiento(); // Regenerar espacios con nuevos cupos
    inicializarMapa();
    
    mostrarModal('Éxito', 'Ajustes guardados correctamente.');
}

// Event listeners para cambios en el tipo de vehículo o checkboxes
document.addEventListener('DOMContentLoaded', function() {
    const tipoVehiculo = document.getElementById('tipo-vehiculo');
    const checkDiscapacidad = document.getElementById('discapacidad');
    const checkVIP = document.getElementById('vip');
    
    if (tipoVehiculo && checkDiscapacidad && checkVIP) {
        tipoVehiculo.addEventListener('change', actualizarListaEspacios);
        checkDiscapacidad.addEventListener('change', actualizarListaEspacios);
        checkVIP.addEventListener('change', actualizarListaEspacios);
    }
    
    // Configurar eventos para el formulario de reportes
    const fechaInicio = document.getElementById('reporte-fecha-inicio');
    const fechaFin = document.getElementById('reporte-fecha-fin');
    
    if (fechaInicio && fechaFin) {
        fechaInicio.addEventListener('change', cargarReporte);
        fechaFin.addEventListener('change', cargarReporte);
    }
});