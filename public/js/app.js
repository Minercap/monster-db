const API_URL = '';

let allClientes = [];
let currentPage = 1;
const PAGE_SIZE = 10; // page size used for server-side requests
let totalItems = 0;
let authToken = localStorage.getItem('authToken') || null;

function setAuth(token) {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
        const logoutBtn = document.getElementById('logout');
        const showLoginBtn = document.getElementById('show-login');
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (showLoginBtn) showLoginBtn.style.display = 'none';
    } else {
        localStorage.removeItem('authToken');
        const logoutBtn = document.getElementById('logout');
        const showLoginBtn = document.getElementById('show-login');
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (showLoginBtn) showLoginBtn.style.display = 'inline-block';
    }
}

async function fetchClientes(page = 1) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
        const response = await fetch(`${API_URL}/clientes?page=${page}&limit=${PAGE_SIZE}`, { headers });
        if (response.status === 401 || response.status === 403) {
            const loginSection = document.getElementById('login-section');
            if (loginSection) loginSection.style.display = 'flex';
            return;
        }
        const data = await response.json();
        // If backend returns paginated object -> { rows, total, page, limit }
        if (Array.isArray(data)) {
            // legacy behavior: full array
            allClientes = data;
            totalItems = allClientes.length;
            currentPage = 1;
        } else if (data && data.rows) {
            allClientes = data.rows;
            totalItems = data.total || (data.rows ? data.rows.length : 0);
            currentPage = data.page || page;
        } else {
            allClientes = [];
            totalItems = 0;
            currentPage = 1;
        }
        renderPage();
    } catch (error) {
        console.error('Error al obtener clientes:', error);
    }
}

function renderPage() {
    const tbody = document.querySelector('#clientes-table tbody');
    tbody.innerHTML = '';
    // If the backend provided only the current page, `allClientes` already contains page items
    let pageItems = allClientes;
    // If backend returned full list (legacy), slice locally
    if (totalItems > allClientes.length) {
        const start = (currentPage - 1) * PAGE_SIZE;
        pageItems = allClientes.slice(start, start + PAGE_SIZE);
    }
    pageItems.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.id || ''}</td>
            <td>${cliente.optimizador || ''}</td>
            <td>${cliente.nombre || ''}</td>
            <td>${cliente.usuario_discord || ''}</td>
            <td>${cliente.telefono || ''}</td>
            <td>$${cliente.monto_pagado || '0.00'}</td>
            <td>${cliente.descripcion_trabajo || ''}</td>
            <td>${cliente.notas || ''}</td>
            <td>${cliente.fecha_creacion ? new Date(cliente.fecha_creacion).toLocaleString() : ''}</td>
            <td><button class="edit-btn" data-id="${cliente.id}">Editar</button></td>
            <td><button class="delete-btn" data-id="${cliente.id}">Borrar</button></td>
        `;
        tbody.appendChild(tr);
    });
    // Agregar listeners a los botones
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const cliente = pageItems.find(c => c.id == id) || allClientes.find(c => c.id == id);
            if (cliente) {
                document.getElementById('edit-id').value = cliente.id;
                document.getElementById('edit-nombre').value = cliente.nombre || '';
                document.getElementById('edit-optimizador').value = cliente.optimizador || '';
                document.getElementById('edit-usuario_discord').value = cliente.usuario_discord || '';
                document.getElementById('edit-telefono').value = cliente.telefono || '';
                document.getElementById('edit-monto_pagado').value = cliente.monto_pagado || 0;
                document.getElementById('edit-descripcion_trabajo').value = cliente.descripcion_trabajo || '';
                document.getElementById('edit-notas').value = cliente.notas || '';
                document.getElementById('edit-form').style.display = 'grid';
            }
        });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Seguro que quieres borrar el cliente ID: ' + id + '?')) {
                try {
                    const headers = {};
                    if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
                    const response = await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE', headers });
                    if (response.ok) {
                        fetchClientes(currentPage);
                    } else {
                        alert('Error al borrar el cliente');
                    }
                } catch (error) {
                    alert('Error al borrar: ' + error);
                }
            }
        });
    });
    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    const prev = document.getElementById('prev-page');
    const next = document.getElementById('next-page');
    if (prev) prev.disabled = currentPage <= 1;
    if (next) next.disabled = currentPage >= totalPages;
}

function nextPage() {
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    if (currentPage < totalPages) {
        currentPage++;
        fetchClientes(currentPage);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchClientes(currentPage);
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const nuevoCliente = {
        optimizador: document.getElementById('optimizador').value,
        nombre: document.getElementById('nombre').value,
        usuario_discord: document.getElementById('usuario_discord').value,
        telefono: document.getElementById('telefono').value,
        monto_pagado: parseFloat(document.getElementById('monto_pagado').value) || 0,
        descripcion_trabajo: document.getElementById('descripcion_trabajo').value,
        notas: document.getElementById('notas').value
    };

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
        const response = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers,
            body: JSON.stringify(nuevoCliente)
        });

        if (response.ok) {
            document.getElementById('cliente-form').reset();
            fetchClientes(1);
        } else {
            console.error('Error al agregar el cliente', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const clienteForm = document.getElementById('cliente-form');
    if (clienteForm) clienteForm.addEventListener('submit', handleSubmit);
    const nextBtn = document.getElementById('next-page');
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    const prevBtn = document.getElementById('prev-page');
    if (prevBtn) prevBtn.addEventListener('click', prevPage);

    const editForm = document.getElementById('edit-form');
    if (editForm) editForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const id = document.getElementById('edit-id').value;
        const updatedCliente = {
            optimizador: document.getElementById('edit-optimizador').value,
            nombre: document.getElementById('edit-nombre').value,
            usuario_discord: document.getElementById('edit-usuario_discord').value,
            telefono: document.getElementById('edit-telefono').value,
            monto_pagado: parseFloat(document.getElementById('edit-monto_pagado').value) || 0,
            descripcion_trabajo: document.getElementById('edit-descripcion_trabajo').value,
            notas: document.getElementById('edit-notas').value
        };
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
            const response = await fetch(`${API_URL}/clientes/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(updatedCliente)
            });
            if (response.ok) {
                editForm.reset();
                editForm.style.display = 'none';
                fetchClientes(currentPage);
            } else {
                let errorMsg = 'Error al editar el cliente';
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.error) errorMsg += ': ' + errorData.error;
                } catch {}
                alert(errorMsg);
            }
        } catch (error) {
            alert('Error al editar: ' + error);
        }
    });

    const cancelEdit = document.getElementById('cancel-edit');
    if (cancelEdit) cancelEdit.addEventListener('click', function() {
        if (editForm) editForm.reset();
        if (editForm) editForm.style.display = 'none';
    });

    // Auth UI handlers
    const showLoginBtn = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout');
    if (showLoginBtn) showLoginBtn.addEventListener('click', () => {
        const loginSection = document.getElementById('login-section');
        if (loginSection) loginSection.style.display = 'flex';
    });
    const cancelLogin = document.getElementById('cancel-login');
    if (cancelLogin) cancelLogin.addEventListener('click', () => {
        const loginSection = document.getElementById('login-section');
        if (loginSection) loginSection.style.display = 'none';
    });
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        setAuth(null);
        fetchClientes(1);
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        try {
            const resp = await fetch(`${API_URL}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
            if (resp.ok) {
                const data = await resp.json();
                setAuth(data.token);
                const loginSection = document.getElementById('login-section');
                if (loginSection) loginSection.style.display = 'none';
                fetchClientes(1);
            } else {
                alert('Login falló');
            }
        } catch (err) {
            alert('Error en login: ' + err);
        }
    });

    // Apply auth UI based on existing token
    setAuth(authToken);
    fetchClientes(1);
});