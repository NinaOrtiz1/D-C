const base = "http://localhost:4000";
const tests = [];

// TEST 1: Login Diego
console.log("\n========== TEST 1: LOGIN DIEGO ==========");
try {
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: "DiegoReyes@gmail.com", password: "M@el89" }),
  });
  const loginData = await loginRes.json();
  const diegoToken = loginData.data?.token;
  
  console.log(`Status: ${loginRes.status}`);
  console.log(`Success: ${loginData.success}`);
  console.log(`Role: ${loginData.data?.role}`);
  console.log(`Active: ${loginData.data?.active}`);
  console.log(`Token generated: ${!!diegoToken}`);
  
  tests.push({ test: "Diego Login", status: loginRes.status === 200 ? "✓" : "✗", code: loginRes.status });

  // TEST 2: Dashboard Diego (should be 200)
  console.log("\n========== TEST 2: DASHBOARD DIEGO ==========");
  if (diegoToken) {
    const dashRes = await fetch(`${base}/api/dashboard`, {
      headers: { Authorization: `Bearer ${diegoToken}` },
    });
    const dashData = await dashRes.json();
    console.log(`Status: ${dashRes.status}`);
    console.log(`Success: ${dashData.success}`);
    console.log(`Has totals: ${!!dashData.data?.totals}`);
    console.log(`Users count: ${dashData.data?.totals?.usuarios}`);
    console.log(`Products count: ${dashData.data?.totals?.productos}`);
    
    tests.push({ test: "Diego Dashboard", status: dashRes.status === 200 ? "✓" : "✗", code: dashRes.status });
  }

  // TEST 3: Login Celeste
  console.log("\n========== TEST 3: LOGIN CELESTE ==========");
  const loginRes2 = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: "CelesteJimenez@gmail.com", password: "K@to45" }),
  });
  const loginData2 = await loginRes2.json();
  const celesteToken = loginData2.data?.token;
  
  console.log(`Status: ${loginRes2.status}`);
  console.log(`Success: ${loginData2.success}`);
  console.log(`Role: ${loginData2.data?.role}`);
  console.log(`Active: ${loginData2.data?.active}`);
  console.log(`Token generated: ${!!celesteToken}`);
  
  tests.push({ test: "Celeste Login", status: loginRes2.status === 200 ? "✓" : "✗", code: loginRes2.status });

  // TEST 4: Dashboard Celeste (should be 403)
  console.log("\n========== TEST 4: DASHBOARD CELESTE (SHOULD BE 403) ==========");
  if (celesteToken) {
    const dashRes2 = await fetch(`${base}/api/dashboard`, {
      headers: { Authorization: `Bearer ${celesteToken}` },
    });
    const dashData2 = await dashRes2.json();
    console.log(`Status: ${dashRes2.status}`);
    console.log(`Message: ${dashData2.message}`);
    
    tests.push({ test: "Celeste Dashboard (403)", status: dashRes2.status === 403 ? "✓" : "✗", code: dashRes2.status });
  }

  // TEST 5: Health check
  console.log("\n========== TEST 5: HEALTH CHECK ==========");
  const healthRes = await fetch(`${base}/health`);
  console.log(`Status: ${healthRes.status}`);
  tests.push({ test: "Health", status: healthRes.status === 200 ? "✓" : "✗", code: healthRes.status });

  // SUMMARY
  console.log("\n========== SUMMARY ==========");
  tests.forEach(t => console.log(`${t.status} ${t.test}: ${t.code}`));

} catch (err) {
  console.error("ERROR:", err.message);
}
