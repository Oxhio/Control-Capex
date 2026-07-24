// Datos de ejemplo (simulando una base de datos)
let movimientos = [
    {
        id: 1,
        fecha: '2026-01-15',
        concepto: 'Compra de servidores',
        categoria: 'Infraestructura',
        monto: 45000,
        estado: 'completado'
    },
    {
        id: 2,
        fecha: '2026-01-20',
        concepto: 'Licencias de software',
        categoria: 'Software',
        monto: 12500,
        estado: 'pendiente'
    },
    {
        id: 3,
        fecha: '2026-01-25',
        concepto: 'Mobiliario de oficina',
        categoria: 'Mobiliario',
        monto: 8700,
        estado: 'completado'
    },
    {
        id: 4,
        fecha: '2026-02-01',
        concepto: 'Capacitación del equipo',
        categoria: 'Capacitación',
        monto: 3500,
        estado: 'pendiente'
    }
];

// Función para formatear moneda
function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(monto);
}

// Función para obtener el texto del estado en español
function obtenerEstadoTexto(estado) {
    const estados = {
        'completado': 'Completado',
        'pendiente': 'Pendiente',
        'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
}

// Función para renderizar la tabla
function renderizarTabla() {
    const tbody = document.getElementById('movimientosTable');
    tbody.innerHTML = '';
    
    movimientos.forEach(mov => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${mov.fecha}</td>
            <td>${mov.concepto}</td>
            <td>${mov.categoria}</td>
            <td>${formatearMoneda(mov.monto)}</td>
            <td><span class="status ${mov.estado}">${obtenerEstadoTexto(mov.estado)}</span></td>
            <td>
                <button class="btn-action" onclick="editarMovimiento(${mov.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action" onclick="eliminarMovimiento(${mov.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para agregar un movimiento (ejemplo)
function agregarMovimiento() {
    const concepto = prompt('Ingrese el concepto del movimiento:');
    if (!concepto) return;
    
    const monto = parseFloat(prompt('Ingrese el monto:'));
    if (isNaN(monto)) return;
    
    const categoria = prompt('Ingrese la categoría:');
    if (!categoria) return;
    
    const nuevoMov = {
        id: movimientos.length + 1,
        fecha: new Date().toISOString().split('T')[0],
        concepto: concepto,
        categoria: categoria,
        monto: monto,
        estado: 'pendiente'
    };
    
    movimientos.push(nuevoMov);
    renderizarTabla();
    actualizarDashboard();
    alert('✅ Movimiento agregado correctamente');
}

// Función para editar movimiento
function editarMovimiento(id) {
    const mov = movimientos.find(m => m.id === id);
    if (!mov) return;
    
    const nuevoConcepto = prompt('Concepto:', mov.concepto);
    if (nuevoConcepto) mov.concepto = nuevoConcepto;
    
    const nuevoMonto = parseFloat(prompt('Monto:', mov.monto));
    if (!isNaN(nuevoMonto)) mov.monto = nuevoMonto;
    
    renderizarTabla();
    actualizarDashboard();
}

// Función para eliminar movimiento
function eliminarMovimiento(id) {
    if (!confirm('¿Estás seguro de eliminar este movimiento?')) return;
    
    movimientos = movimientos.filter(m => m.id !== id);
    renderizarTabla();
    actualizarDashboard();
}

// Función para actualizar las tarjetas del dashboard
function actualizarDashboard() {
    // Calcular totales
    const totalInversiones = movimientos.reduce((sum, m) => sum + m.monto, 0);
    const proyectosActivos = movimientos.filter(m => m.estado === 'completado').length;
    const presupuestoRestante = 1234567 - totalInversiones; // Simulación
    
    // Actualizar los valores en las tarjetas (por simplicidad, se actualiza el DOM)
    const cards = document.querySelectorAll('.card-value');
    if (cards.length >= 3) {
        cards[0].textContent = formatearMoneda(totalInversiones);
        cards[1].textContent = proyectosActivos;
        cards[2].textContent = formatearMoneda(presupuestoRestante);
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    renderizarTabla();
    actualizarDashboard();
    console.log('📊 Control-Capex iniciado correctamente');
    console.log('📋 Total de movimientos:', movimientos.length);
});

// Exportar funciones para uso global
window.agregarMovimiento = agregarMovimiento;
window.editarMovimiento = editarMovimiento;
window.eliminarMovimiento = eliminarMovimiento;
/* ===== GRÁFICOS ===== */
.charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
}

.chart-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    border: 1px solid #e9edf4;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.chart-card h3 {
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.chart-card h3 i {
    color: #2d6a9f;
}

.chart-container {
    position: relative;
    height: 250px;
}

@media (max-width: 1024px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 700px) {
    .header { flex-direction: column; align-items: stretch; }
    .project-selector { flex-wrap: wrap; justify-content: center; }
    .project-selector select { min-width: 100%; }
    .metrics-grid { grid-template-columns: 1fr 1fr; }
    .table-header { flex-direction: column; align-items: stretch; }
    .table-actions { justify-content: flex-start; flex-wrap: wrap; }
    table { font-size: 12px; }
    th, td { padding: 10px 12px; }
}

@media (max-width: 480px) {
    .metrics-grid { grid-template-columns: 1fr; }
}
