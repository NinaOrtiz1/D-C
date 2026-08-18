import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../database.js';
import { User } from '../models.js';

dotenv.config();

const API_BASE = process.env.VITE_API_URL ?? 'http://localhost:4000';

const knownCredentials: Record<string, string> = {
  [process.env.SEED_ADMIN_EMAIL ?? '']: process.env.SEED_ADMIN_PASSWORD ?? '',
  [process.env.SEED_EDITOR_EMAIL ?? '']: process.env.SEED_EDITOR_PASSWORD ?? '',
  [process.env.SEED_CLIENT_EMAIL ?? '']: process.env.SEED_CLIENT_PASSWORD ?? '',
};

function fmt(v: any) {
  return v === undefined || v === null ? '' : String(v);
}

async function testLogin(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: email, password }),
    });

    const body = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, body };
  } catch (error) {
    return { ok: false, status: 0, body: { error: String(error) } };
  }
}

async function callMe(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, body };
  } catch (error) {
    return { ok: false, status: 0, body: { error: String(error) } };
  }
}

async function callDashboard(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/dashboard`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, body };
  } catch (error) {
    return { ok: false, status: 0, body: { error: String(error) } };
  }
}

(async () => {
  await connectDatabase();
  try {
    const users = await User.find({}).select('nombre correo email rol role activo').lean();
    console.log('Total users in DB:', users.length);

    const rows: Array<any> = [];

    for (const u of users) {
      const email = fmt(u.correo || u.email).toLowerCase();
      const nombre = fmt(u.nombre);
      const role = fmt(u.rol || u.role || 'cliente');
      const activo = u.activo === false ? 'inactivo' : 'activo';

      let loginResult = 'Credenciales no disponibles para prueba';
      let jwtOk = '';
      let meOk = '';
      let roleAccess = '';

      const pwd = knownCredentials[email];
      if (pwd) {
        const res = await testLogin(email, pwd);
        loginResult = res.ok ? 'OK' : `ERROR ${res.status}`;

        if (res.ok && res.body?.data?.token) {
          jwtOk = 'OK';
          const token = res.body.data.token;
          const me = await callMe(token);
          meOk = me.ok ? 'OK' : `ERROR ${me.status}`;

          // Test role access: dashboard requires admin/editor
          const dash = await callDashboard(token);
          if (role === 'admin' || role === 'editor') {
            roleAccess = dash.ok ? 'OK' : `ERROR ${dash.status}`;
          } else {
            // Expect 403
            roleAccess = dash.status === 403 ? 'RECHAZADO(403)' : (dash.ok ? 'OK' : `ERROR ${dash.status}`);
          }
        } else {
          jwtOk = 'ERROR';
          meOk = 'ERROR';
          roleAccess = 'ERROR';
        }
      }

      rows.push({ email, nombre, role, activo, loginResult, jwtOk, meOk, roleAccess });
    }

    // Print table header
    console.log('\nUsuario | Existe en MongoDB | Login | JWT | /auth/me | Rol access');
    console.log('---|---|---|---|---|---');
    for (const r of rows) {
      console.log(`${r.email} | Sí | ${r.loginResult} | ${r.jwtOk || '-'} | ${r.meOk || '-'} | ${r.roleAccess || '-'} (${r.role})`);
    }

    const total = rows.length;
    const verified = rows.filter((x) => x.loginResult === 'OK').length;
    const errors = rows.filter((x) => x.loginResult !== 'OK' && x.loginResult !== 'Credenciales no disponibles para prueba').length;
    const noCred = rows.filter((x) => x.loginResult === 'Credenciales no disponibles para prueba').length;

    console.log('\nSummary:');
    console.log(`USUARIOS VERIFICADOS: ${verified}`);
    console.log(`LOGIN FUNCIONANDO: ${verified}`);
    console.log(`LOGIN CON ERROR: ${errors}`);
    console.log(`CREDENCIALES NO DISPONIBLES: ${noCred}`);

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
})();
