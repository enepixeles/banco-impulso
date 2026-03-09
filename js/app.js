/* 
LÓGICA DE PENSAMIENTO:
1. Datos: Tengo guardada la info de Andrés y Estefanía con sus propios logos de la carpeta img.
2. Control de llaves: Uso v-cloak en el HTML para que no se vean las llaves antes de cargar.
3. Inicio: Busco los indicadores de la API y los datos del usuario logueado.
4. Sesión: Si no hay usuario, pregunto el nombre. Al cerrar sesión, limpio todo para que el sistema se resetee.
*/

const baseDeDatos = {
    "Andrés": {
        ingresos: 20000, gastos: 18000, saldo: 2000,
        movimientos: [
            { fecha: "Feb 13, 2025", desc: "Disney+", cat: "Subscripción", monto: "$3.500", status: "Completada", img: "img/logo-disney.jpg" },
            { fecha: "Feb 12, 2025", desc: "Estefanía Silva", cat: "Familia", monto: "$5.000", status: "Completada", img: "img/avatar-estefania.jpg" }
        ]
    },
    "Estefanía": {
        ingresos: 85000, gastos: 33000, saldo: 52000,
        movimientos: [
            { fecha: "Feb 14, 2025", desc: "Supermercado", cat: "Comida", monto: "$25.000", status: "Completada", img: "img/logo-super.jpg" },
            { fecha: "Feb 10, 2025", desc: "Netflix", cat: "Entretenimiento", monto: "$8.000", status: "Completada", img: "img/logo-netflix.jpg" }
        ]
    }
};

const Inicio = {
    template: `
        <div>
            <section class="mb-5">
                <h2 class="hero-title">Transforma tus impulsos en decisiones positivas.</h2>
            </section>

            <section class="row g-4 mb-4">
                <div class="col-12 col-md-6">
                    <div class="card p-4 border-0 shadow-sm">
                        <span class="text-muted small fw-bold">Dólar Observado (API)</span>
                        <h2 class="fw-bold mt-2">{{ indicadores.dolar }}</h2>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="card p-4 border-0 shadow-sm">
                        <span class="text-muted small fw-bold">Valor UF (API)</span>
                        <h2 class="fw-bold mt-2">{{ indicadores.uf }}</h2>
                    </div>
                </div>
            </section>

            <section class="row g-4 mb-5">
                <div class="col-12 col-md-4">
                    <div class="card p-4 border-0 shadow-sm">
                        <span class="text-muted small fw-bold">Ingresos</span>
                        <h2 class="fw-bold mt-2">$ {{ info.ingresos.toLocaleString('es-CL') }}</h2>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="card p-4 border-0 shadow-sm">
                        <span class="text-muted small fw-bold">Gastos Totales</span>
                        <h2 class="fw-bold mt-2">$ {{ info.gastos.toLocaleString('es-CL') }}</h2>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="card p-4 border-0 shadow-sm bg-dark text-white">
                        <span class="small opacity-75">Saldo</span>
                        <h2 class="fw-bold mt-2">$ {{ info.saldo.toLocaleString('es-CL') }}</h2>
                    </div>
                </div>
            </section>

            <section class="transaction-section mb-5">
                <h4 class="fw-bold mb-4">Movimientos que te hacen avanzar</h4>
                <div class="table-responsive bg-white rounded-4 shadow-sm">
                    <table class="table align-middle m-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4">Fecha</th>
                                <th>Descripción</th>
                                <th>Cuenta</th>
                                <th>Categoría</th>
                                <th>Monto</th>
                                <th>Status</th>
                                <th class="pe-4">Exportar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in info.movimientos">
                                <td class="ps-4">{{ item.fecha }}</td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <img :src="item.img" class="rounded-circle me-2" style="width: 32px; height: 32px; object-fit: cover;">
                                        <strong>{{ item.desc }}</strong>
                                    </div>
                                </td>
                                <td>Cuenta Principal</td>
                                <td>{{ item.cat }}</td>
                                <td><strong>{{ item.monto }}</strong></td>
                                <td>{{ item.status }}</td>
                                <td class="pe-4">
                                    <a href="#" class="text-muted small border p-1 px-2 rounded">PDF</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
    data() {
        return {
            indicadores: { dolar: 'Cargando...', uf: 'Cargando...' },
            info: { ingresos: 0, gastos: 0, saldo: 0, movimientos: [] }
        }
    },
    mounted() {
        const user = localStorage.getItem('usuarioActivo');
        this.info = baseDeDatos[user] || { ingresos: 0, gastos: 0, saldo: 0, movimientos: [] };
        this.obtenerValoresAPI();
    },
    methods: {
        async obtenerValoresAPI() {
            try {
                const res = await fetch('https://mindicador.cl/api');
                const d = await res.json();
                this.indicadores.dolar = '$' + d.dolar.valor.toLocaleString('es-CL');
                this.indicadores.uf = '$' + d.uf.valor.toLocaleString('es-CL');
            } catch (e) {
                this.indicadores.dolar = 'Error';
                this.indicadores.uf = 'Error';
            }
        }
    }
};

const routes = [{ path: '/', component: Inicio }];
const router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes });

const app = Vue.createApp({
    data() { return { nombreUsuario: '' } },
    created() {
        let user = localStorage.getItem('usuarioActivo');
        if (!user) {
            user = prompt("¿Cuál es tu nombre? (Andrés o Estefanía)");
            if (!user) user = "Invitado";
            localStorage.setItem('usuarioActivo', user);
        }
        this.nombreUsuario = user;
    },
    methods: {
        cerrarSesion() {
            localStorage.removeItem('usuarioActivo');
            location.reload();
        }
    }
});
app.use(router);
app.mount('#app');