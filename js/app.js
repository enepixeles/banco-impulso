$(document).ready(function() {

    // FUNCIÓN PARA TRAER VALORES DE LA API - PORTAFOLIO MÓDULO 5
    // Con esto me conecto a Mindicador.cl para sacar los valores del día
    function obtenerIndicadores() {
        $.ajax({
            url: 'https://mindicador.cl/api',
            method: 'GET',
            dataType: 'json',
            success: function(datos) {
                // Aquí ya recibí la respuesta. Ahora saco los valores específicos que me interesan.
                const dolarHoy = datos.dolar.valor;
                const ufHoy = datos.uf.valor;

                // Actualizo el HTML con los valores reales, dándoles formato de moneda chilena.
                // Uso toLocaleString para que el punto de los miles aparezca donde corresponde.
                $('#valor-dolar').text('$' + dolarHoy.toLocaleString('es-CL'));
                $('#valor-uf').text('$' + ufHoy.toLocaleString('es-CL'));
            },
            error: function() {
                // Si el internet falla o la API se cae, puse este mensaje para no dejar el "Cargando..." eterno
                $('#valor-dolar').text('Error al cargar');
                $('#valor-uf').text('Error al cargar');
            }
        });
    }

    // Llamo a la función de inmediato para que los datos aparezcan apenas abra la página
    obtenerIndicadores();


    // --- BBDD ---PORTAFOLIO MÓDULO 4
    // Info de cada persona para que el sitio cambie
    const baseDeDatosUsuarios = {
        "Andrés": {
            ingresos: 20000,
            gastos: 18000,
            saldo: 2000,
            movimientos: [
                { fecha: "Feb 13, 2025", desc: "Disney", cat: "Subscripción", monto: "$3.500", status: "Completada", img: "img/logo-disney.jpg" },
                { fecha: "Feb 12, 2025", desc: "Estefanía Silva", cat: "Familia", monto: "$5.000", status: "Completada", img: "img/avatar-estefania.jpg" }
            ]
        },
        "Estefanía": {
            ingresos: 85000,
            gastos: 33000,
            saldo: 52000,
            movimientos: [
                { 
                    fecha: "Feb 14, 2025", 
                    desc: "Supermercado", 
                    cat: "Comida", 
                    monto: "$25.000", 
                    status: "Completada", 
                    img: "img/logo-super.jpg" 
                },
                { 
                    fecha: "Feb 10, 2025", 
                    desc: "Netflix", 
                    cat: "Entretenimiento", 
                    monto: "$8.000", 
                    status: "Completada", 
                    img: "img/logo-netflix.jpg" 
                }
            ]
        }
    };

    // GESTIÓN DE SESIÓN
    // Reviso si ya tengo un usuario guardado en el computador
    function gestionarSesion() {
        let usuarioSentece = localStorage.getItem('usuarioActivo');

        // Si no hay nadie, tiro un prompt para preguntar el nombre
        if (!usuarioSentece) {
            usuarioSentece = prompt("¡Hola! Bienvenido a Banco Impulso. ¿Cuál es tu nombre? (Prueba con Andrés o Estefanía)");
            
            // Si le dio a cancelar o no puso nada, lo dejo como invitado
            if (!usuarioSentece) usuarioSentece = "Invitado";
            
            localStorage.setItem('usuarioActivo', usuarioSentece);
        }

        // Cambio el saludo en el header
        $('#nombre-usuario-display').text("Hola, " + usuarioSentece + "!");
        
        // Cargo los datos financieros que le corresponden a este nombre
        cargarDatosFinancieros(usuarioSentece);
        
        return usuarioSentece;
    }

    const usuarioActual = gestionarSesion();

    // 3. RENDERIZADO DE DATOS FINANCIEROS 
    // Esta función dibuja los números y la tabla dependiendo del usuario
    function cargarDatosFinancieros(nombre) {
        const datos = baseDeDatosUsuarios[nombre] || {
            ingresos: 0, gastos: 0, saldo: 0, movimientos: []
        };

        // Actualizo las tarjetas de arriba con formato de lucas chilenas
        $('#user-ingresos').text('$' + datos.ingresos.toLocaleString('es-CL'));
        $('#user-gastos').text('$' + datos.gastos.toLocaleString('es-CL'));
        $('#user-saldo').text('$' + datos.saldo.toLocaleString('es-CL'));

        // Limpio la tabla antes de llenarla
        const tabla = $('#transactionBody');
        tabla.empty();

        if (datos.movimientos.length === 0) {
            tabla.append('<tr><td colspan="7" class="text-center">No tengo movimientos registrados</td></tr>');
        } else {
            // Recorro mis movimientos y voy creando las filas de la tabla
            datos.movimientos.forEach(m => {
                tabla.append(`
                    <tr>
                        <td>${m.fecha}</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <img src="${m.img}" class="rounded-circle me-2" style="width: 35px; height: 35px; object-fit: contain;">
                                <strong>${m.desc}</strong>
                            </div>
                        </td>
                        <td>Cuenta Principal</td>
                        <td>${m.cat}</td>
                        <td><strong>${m.monto}</strong></td>
                        <td><span class="status--${m.status === 'Error' ? 'failed' : 'completed'}">${m.status}</span></td>
                        <td><a href="#" class="export-pdf"><i class="bi bi-file-pdf"></i> PDF</a></td>
                    </tr>
                `);
            });
        }
    }

    // 4. HISTORIAL DE NAVEGACIÓN (USO DE ARREGLOS)
    // Uso una clave única por usuario para que no se mezclen los historiales
    const claveHistorial = "historial_" + usuarioActual;
    let historial = JSON.parse(localStorage.getItem(claveHistorial)) || [];

    function renderizarHistorial() {
        const contenedor = $('#historial-navegacion');
        contenedor.empty();

        if (historial.length === 0) {
            contenedor.append('<span class="text-muted small">Todavía no has visitado secciones.</span>');
            return;
        }

        // Muestro los últimos clics que hice
        historial.forEach(item => {
            contenedor.append(`
                <span class="badge rounded-pill bg-light text-dark border p-2 px-3">
                    <i class="bi bi-clock-history me-1"></i> ${item}
                </span>
            `);
        });
    }

    function registrarVisita(seccion) {
        // Si ya visité esta sección, la saco de la lista para que no se repita
        historial = historial.filter(i => i !== seccion);
        
        // La pongo al principio de mi arreglo
        historial.unshift(seccion);

        // Si mi lista es muy larga, saco el más antiguo (solo dejo 5)
        if (historial.length > 5) historial.pop();

        // Guardo mi lista actualizada en el computador
        localStorage.setItem(claveHistorial, JSON.stringify(historial));
        renderizarHistorial();
    }

    // EVENTOS DE LA PÁGINA

    // Cuando hago clic en cualquier opción del menú lateral
    $('.sidebar__link').on('click', function() {
        const nombreSeccion = $(this).text().trim();
        registrarVisita(nombreSeccion);
    });

    // Botón para cerrar sesión y probar con otro usuario
    $('#btn-logout').on('click', function() {
        localStorage.removeItem('usuarioActivo');
        location.reload(); // Recargo para que me vuelva a pedir el nombre
    });

    // Al partir, dibujo el historial que ya tenía guardado
    renderizarHistorial();

});