// ============================================================
//  DATOS - Con CEGE, POSPRE, Presupuesto, Real, Comprometido
// ============================================================
const data = {
    nombresCEGE: {
        '0209A0Z861': 'Proyecto Sitios 200-203',
        '0209A0Z777': 'Proyecto Sitios Nuevos',
        '0209A0Z999': 'Proyectos Antiguos'
    },
    proyectos: [{
        id: 1,
        nombre: '200 Sitios 2026',
        cege: '0209A0Z861',
        pospre: 'CL-RM-IM-ISN',
        presupuesto: 1388583103,
        real: 0,
        comprometido: 0,
        disponible: 1388583103,
    }, {
        id: 2,
        nombre: '201 Sitios 2026',
        cege: '0209A0Z861',
        pospre: 'CL-RM-TR-FAC',
        presupuesto: 1228592153,
        real: 0,
        comprometido: 0,
        disponible: 1228592153,
    }, {
        id: 3,
        nombre: '202 Sitios 2026',
        cege: '0209A0Z861',
        pospre: 'CL-RM-TR-IPA',
        presupuesto: 755163906,
        real: 0,
        comprometido: 0,
        disponible: 755163906,
    }, {
        id: 4,
        nombre: '203 Sitios 2026',
        cege: '0209A0Z861',
        pospre: 'CL-RM-TR-MAC',
        presupuesto: 561038593,
        real: 0,
        comprometido: 0,
        disponible: 561038593,
    }, {
        id: 5,
        nombre: 'Sitios Nuevos 2026',
        cege: '0209A0Z777',
        pospre: 'CL-RM-EX-ELT E',
        presupuesto: 1951970577,
        real: 16404917,
        comprometido: 1792233445,
        disponible: 143332215,
    }, {
        id: 6,
        nombre: 'Sitios Nuevos 2026',
        cege: '0209A0Z777',
        pospre: 'CL-RM-IM-ISN S',
        presupuesto: 125673700,
        real: 0,
        comprometido: 93908634,
        disponible: 31765066,
    }, {
        id: 7,
        nombre: 'Sitios Nuevos 2026',
        cege: '0209A0Z777',
        pospre: 'CL-RM-SN-COC',
        presupuesto: 828839456,
        real: 135302113,
        comprometido: 468121801,
        disponible: 225415542,
    }, {
        id: 8,
        nombre: 'Sitios Nuevos 2026',
        cege: '0209A0Z777',
        pospre: 'CL-RM-TR-FAC F',
        presupuesto: 1076945572,
        real: 318984587,
        comprometido: 639717226,
        disponible: 118243759,
    }, {
        id: 9,
        nombre: 'Sitios Nuevos 2026',
        cege: '0209A0Z777',
        pospre: 'CL-RM-TR-IPA IP',
        presupuesto: 802250329,
        real: 3651384,
        comprometido: 381419567,
        disponible: 417179378,
    }, {
        id: 10,
        nombre: 'Sitios Nuevos 2026',
        cege: '0209A0Z777',
        pospre: 'CL-RM-TR-MAC',
        presupuesto: 555175751,
        real: 101854916,
        comprometido: 362718957,
        disponible: 90601878,
    }, {
        id: 11,
        nombre: 'Sitios Nuevos 2026',
        cege: '0209A0Z777',
        pospre: 'CL-RM-TR-OTX C',
        presupuesto: 824702569,
        real: 0,
        comprometido: 823193137,
        disponible: 1509432,
    }, {
        id: 12,
        nombre: 'Sitios Antiguos 2025',
        cege: '0209A0Z999',
        pospre: 'CL-RM-LEG-OLD',
        presupuesto: 500000000,
        real: 450000000,
        comprometido: 50000000,
        disponible: 0,
    }, {
        id: 13,
        nombre: 'Sitios Antiguos 2025',
        cege: '0209A0Z999',
        pospre: 'CL-RM-LEG-OLD2',
        presupuesto: 300000000,
        real: 280000000,
        comprometido: 20000000,
        disponible: 0,
    }]
};

// ============================================================
//  VARIABLES GLOBALES
// ============================================================
let chartPrincipal = null;
let chartDistribucion = null;
let chartEstado = null;

// ============================================================
//  FUNCIONES DE UTILIDAD
// ============================================================

function getCEGEs() {
    const cegeSet = new Set(data.proyectos.map(p => p.cege));
    return Array.from(cegeSet).sort();
}

function getProyectosFiltrados(cege) {
    if (cege === 'todos') return data.proyectos;
    return data.proyectos.filter(p => p.cege === cege);
}

function getNombreCEGE(cege) {
    return data.nombresCEGE[cege] || cege;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatCurrencyShort(value) {
    if (value >= 1000000000) {
        return '$' + (value / 1000000000).toFixed(1) + 'B';
    } else if (value >= 1000000) {
        return '$' + (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
        return '$' + (value / 1000).toFixed(0) + 'K';
    }
    return '$' + value;
}

function agruparPorCEGE(proyectos) {
    const grupos = {};
    proyectos.forEach(p => {
        if (!grupos[p.cege]) {
            grupos[p.cege] = {
                cege: p.cege,
                nombre: getNombreCEGE(p.cege),
                presupuesto: 0,
                real: 0,
                comprometido: 0,
                disponible: 0,
                pospres: []
            };
        }
        grupos[p.cege].presupuesto += p.presupuesto;
        grupos[p.cege].real += p.real;
        grupos[p.cege].comprometido += p.comprometido;
        grupos[p.cege].disponible += p.disponible;
        grupos[p.cege].pospres.push(p);
    });
    return Object.values(grupos);
}

// ============================================================
//  RENDERIZAR
// ============================================================

function renderResumenCEGE(proyectos) {
    const grupos = agruparPorCEGE(proyectos);
    const container = document.getElementById('cegeSummary');
    if (grupos.length === 0) {
        container.innerHTML =
            `<div style="grid-column:1/-1; text-align:center; padding:20px; color:#718096;">No hay CEGE para mostrar</div>`;
        return;
    }
    container.innerHTML = grupos.map(g => {
        const ejecutado = g.real + g.comprometido;
        const pctReal = g.presupuesto > 0 ? (g.real / g.presupuesto * 100) : 0;
        const pctComprometido = g.presupuesto > 0 ? (g.comprometido / g.presupuesto * 100) : 0;
        const pctDisponible = g.presupuesto > 0 ? (g.disponible / g.presupuesto * 100) : 0;
        const pctEjecutado = g.presupuesto > 0 ? (ejecutado / g.presupuesto * 100) : 0;
        const barraReal = Math.min(pctReal, 100);
        const barraComprometido = Math.min(pctComprometido, 100 - barraReal);
        const barraDisponible = Math.min(pctDisponible, 100 - barraReal - barraComprometido);
        let estadoEmoji = '✅',
            estadoTexto = 'En Rango';
        if (pctEjecutado > 100) { estadoEmoji = '⚠️';
            estadoTexto = 'Sobre Ejecutado'; } else if (pctEjecutado > 90) { estadoEmoji = '⚡';
            estadoTexto = 'Cerca del Límite'; }
        return `
                    <div class="cege-card">
                        <div class="cege-header">
                            <div>
                                <span class="cege-code">${g.cege}</span>
                                <span class="cege-name">${g.nombre}</span>
                            </div>
                            <span class="cege-count">${g.pospres.length} POSPRE</span>
                        </div>
                        <div class="cege-montos">
                            <span class="label">Presupuesto</span>
                            <span class="valor" style="color:#2d6a9f;">${formatCurrency(g.presupuesto)}</span>
                            <span class="label">Real</span>
                            <span class="valor" style="color:#38a169;">${formatCurrency(g.real)}</span>
                            <span class="label">Comprometido</span>
                            <span class="valor" style="color:#ed8936;">${formatCurrency(g.comprometido)}</span>
                            <span class="label">Disponible</span>
                            <span class="valor" style="color:#2d6a9f;">${formatCurrency(g.disponible)}</span>
                        </div>
                        <div class="cege-barra">
                            <div class="seg seg-real" style="width:${barraReal}%;"></div>
                            <div class="seg seg-comprometido" style="width:${barraComprometido}%;"></div>
                            <div class="seg seg-disponible" style="width:${barraDisponible}%;"></div>
                        </div>
                        <div class="cege-pct">
                            <span>${estadoEmoji} ${pctEjecutado.toFixed(1)}% ejecutado</span>
                            <span>${pctDisponible.toFixed(1)}% disponible</span>
                        </div>
                    </div>
                `;
    }).join('');
}

function actualizarMetricas(proyectos) {
    const totalPresupuesto = proyectos.reduce((sum, p) => sum + p.presupuesto, 0);
    const totalReal = proyectos.reduce((sum, p) => sum + p.real, 0);
    const totalComprometido = proyectos.reduce((sum, p) => sum + p.comprometido, 0);
    const totalDisponible = proyectos.reduce((sum, p) => sum + p.disponible, 0);
    const pctReal = totalPresupuesto > 0 ? (totalReal / totalPresupuesto * 100) : 0;
    const pctComprometido = totalPresupuesto > 0 ? (totalComprometido / totalPresupuesto * 100) : 0;
    const pctDisponible = totalPresupuesto > 0 ? (totalDisponible / totalPresupuesto * 100) : 0;
    document.getElementById('totalPresupuesto').textContent = formatCurrency(totalPresupuesto);
    document.getElementById('subPresupuesto').textContent = `${proyectos.length} POSPRE`;
    document.getElementById('totalReal').textContent = formatCurrency(totalReal);
    document.getElementById('changeReal').textContent = `${pctReal.toFixed(1)}% ejecutado`;
    document.getElementById('totalComprometido').textContent = formatCurrency(totalComprometido);
    document.getElementById('changeComprometido').textContent = `${pctComprometido.toFixed(1)}% comprometido`;
    document.getElementById('totalDisponible').textContent = formatCurrency(totalDisponible);
    document.getElementById('subDisponible').textContent = `${pctDisponible.toFixed(1)}% disponible`;
    document.getElementById('totalProyectos').textContent = `${proyectos.length} POSPRE`;
}

function renderTabla(proyectos) {
    const tbody = document.getElementById('tablaBody');
    if (proyectos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:40px; color:#718096;">
                    <i class="fas fa-inbox" style="font-size:28px; display:block; margin-bottom:8px;"></i>
                    No hay POSPRE con este filtro
                </td></tr>`;
        return;
    }
    tbody.innerHTML = proyectos.map(p => {
        const ejecutado = p.real + p.comprometido;
        const pctReal = p.presupuesto > 0 ? (p.real / p.presupuesto * 100) : 0;
        const pctComprometido = p.presupuesto > 0 ? (p.comprometido / p.presupuesto * 100) : 0;
        const pctEjecutado = p.presupuesto > 0 ? (ejecutado / p.presupuesto * 100) : 0;
        let estadoClass = 'badge-ok',
            estadoLabel = '✅ En rango';
        if (pctEjecutado > 100) { estadoClass = 'badge-sobre';
            estadoLabel = '⚠️ Sobre ejecutado'; } else if (pctEjecutado > 90) { estadoClass = 'badge-alerta';
            estadoLabel = '⚡ Cerca del límite'; }
        const nombreCEGE = getNombreCEGE(p.cege);
        return `<tr>
                    <td><span class="badge-pospre">${p.pospre}</span></td>
                    <td>
                        <span class="badge-cege">${p.cege}</span>
                        <span style="font-size:11px; color:#718096; display:block;">${nombreCEGE}</span>
                    </td>
                    <td class="monto monto-presupuesto">${formatCurrency(p.presupuesto)}</td>
                    <td class="monto monto-real">${formatCurrency(p.real)}</td>
                    <td class="monto monto-comprometido">${formatCurrency(p.comprometido)}</td>
                    <td class="monto monto-disponible">${formatCurrency(p.disponible)}</td>
                    <td>
                        <div class="barra-ejecucion">
                            <div class="segment segment-real" style="width:${Math.min(pctReal, 100)}%;"></div>
                            <div class="segment segment-comprometido" style="width:${Math.min(pctComprometido, 100)}%;"></div>
                            <span class="label-barra">${pctEjecutado.toFixed(1)}%</span>
                        </div>
                    </td>
                    <td><span class="badge-estado ${estadoClass}">${estadoLabel}</span></td>
                </tr>`;
    }).join('');
}

// ============================================================
//  GRÁFICOS
// ============================================================

function destruirGraficos() {
    if (chartPrincipal) { chartPrincipal.destroy();
        chartPrincipal = null; }
    if (chartDistribucion) { chartDistribucion.destroy();
        chartDistribucion = null; }
    if (chartEstado) { chartEstado.destroy();
        chartEstado = null; }
}

function crearGraficos(proyectos) {
    destruirGraficos();
    const grupos = agruparPorCEGE(proyectos);
    const sortedGrupos = grupos.sort((a, b) => b.presupuesto - a.presupuesto);
    const labels = sortedGrupos.map(g => {
        const nombre = g.nombre.length > 18 ? g.nombre.substring(0, 16) + '…' : g.nombre;
        return `${g.cege}\n${nombre}`;
    });
    const presupuestos = sortedGrupos.map(g => g.presupuesto);
    const reales = sortedGrupos.map(g => g.real);
    const comprometidos = sortedGrupos.map(g => g.comprometido);

    // GRÁFICO PRINCIPAL - BARRAS AGRUPADAS
    const ctx1 = document.getElementById('chartPrincipal').getContext('2d');
    chartPrincipal = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Presupuesto',
                data: presupuestos,
                backgroundColor: 'rgba(45, 106, 159, 0.85)',
                borderColor: '#2d6a9f',
                borderWidth: 2,
                borderRadius: 4,
            }, {
                label: 'Real',
                data: reales,
                backgroundColor: 'rgba(56, 161, 105, 0.85)',
                borderColor: '#38a169',
                borderWidth: 2,
                borderRadius: 4,
            }, {
                label: 'Comprometido',
                data: comprometidos,
                backgroundColor: 'rgba(237, 137, 54, 0.85)',
                borderColor: '#ed8936',
                borderWidth: 2,
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        },
                        afterBody: function(tooltipItems) {
                            const idx = tooltipItems[0].dataIndex;
                            const grupo = sortedGrupos[idx];
                            if (grupo) {
                                const ejecutado = grupo.real + grupo.comprometido;
                                const pct = grupo.presupuesto > 0 ? (ejecutado / grupo.presupuesto *
                                    100) : 0;
                                return [
                                    '📌 ' + grupo.nombre,
                                    '📦 ' + grupo.pospres.length + ' POSPRE',
                                    '📊 Ejecución: ' + pct.toFixed(1) + '%',
                                    '💵 Disponible: ' + formatCurrency(grupo.disponible)
                                ];
                            }
                            return [];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10, weight: 'bold' }, maxRotation: 0 }
                },
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => formatCurrencyShort(v), font: { size: 10 } }
                }
            }
        }
    });

    // GRÁFICO 2: Distribución por CEGE
    const cegeData = {};
    const cegeNombres = {};
    proyectos.forEach(p => {
        cegeData[p.cege] = (cegeData[p.cege] || 0) + p.presupuesto;
        cegeNombres[p.cege] = getNombreCEGE(p.cege);
    });
    const colores = ['#2d6a9f', '#48bb78', '#ed8936', '#9f7aea', '#fc8181', '#4299e1'];
    const ctx2 = document.getElementById('chartDistribucion').getContext('2d');
    chartDistribucion = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(cegeData).map(c => `${c}\n${cegeNombres[c]}`),
            datasets: [{
                data: Object.values(cegeData),
                backgroundColor: colores.slice(0, Object.keys(cegeData).length),
                borderWidth: 2,
                borderColor: 'white'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 10, usePointStyle: true, font: { size: 10 }, textAlign: 'center' }
                }
            }
        }
    });

    // GRÁFICO 3: Estado de Ejecución
    let enRango = 0,
        cercaLimite = 0,
        sobreEjecutado = 0;
    proyectos.forEach(p => {
        const ejecutado = p.real + p.comprometido;
        const pct = p.presupuesto > 0 ? (ejecutado / p.presupuesto * 100) : 0;
        if (pct > 100) sobreEjecutado++;
        else if (pct > 90) cercaLimite++;
        else enRango++;
    });
    const ctx3 = document.getElementById('chartEstado').getContext('2d');
    chartEstado = new Chart(ctx3, {
        type: 'pie',
        data: {
            labels: ['✅ En Rango', '⚡ Cerca del Límite', '⚠️ Sobre Ejecutado'],
            datasets: [{
                data: [enRango, cercaLimite, sobreEjecutado],
                backgroundColor: ['#48bb78', '#fefcbf', '#fc8181'],
                borderColor: ['#38a169', '#ecc94b', '#e53e3e'],
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 10, usePointStyle: true, font: { size: 11 } }
                }
            }
        }
    });
}

// ============================================================
//  ACTUALIZAR DASHBOARD
// ============================================================

function actualizarDashboard() {
    const cege = document.getElementById('filtroCEGE').value;
    const proyectos = getProyectosFiltrados(cege);
    actualizarMetricas(proyectos);
    renderResumenCEGE(proyectos);
    renderTabla(proyectos);
    crearGraficos(proyectos);
}

// ============================================================
//  INICIALIZAR
// ============================================================

function inicializarFiltros() {
    const selectCEGE = document.getElementById('filtroCEGE');
    const cegeList = getCEGEs();
    cegeList.forEach(cege => {
        const opt = document.createElement('option');
        opt.value = cege;
        const nombre = getNombreCEGE(cege);
        opt.textContent = `📁 ${cege} - ${nombre}`;
        selectCEGE.appendChild(opt);
    });
}

// ============================================================
//  EVENTOS
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarFiltros();
    document.getElementById('filtroCEGE').addEventListener('change', actualizarDashboard);
    document.getElementById('btnExportar').addEventListener('click', function() {
        alert('📤 Exportar datos a Excel');
    });
    actualizarDashboard();
});
Reemplazar script.js con datos correctos de CEGE y POSPRE
