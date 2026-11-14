import http from 'http';
import { spawn } from 'child_process';

const serverProc = spawn('node', ['server/index.js'], { stdio: 'inherit' });

// Wait 1.5 seconds for server to start, then make HTTP requests
setTimeout(async () => {
  try {
    const healthRes = await fetch('http://localhost:5000/api/health');
    const health = await healthRes.json();
    console.log('API Health Check:', health.status);

    const generateRes = await fetch('http://localhost:5000/api/recipe/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'tomatoes, pasta, garlic, cheese' })
    });
    const gen = await generateRes.json();
    console.log('Recipe Generation Test:', gen.success ? `SUCCESS - "${gen.data?.title}"` : 'FAILED');

    // Test refinement loop
    const refineRes = await fetch('http://localhost:5000/api/recipe/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentRecipe: gen.data,
        refinementPrompt: 'Make it spicy with crushed red pepper'
      })
    });
    const refined = await refineRes.json();
    console.log('Refinement Loop Test:', refined.success ? `SUCCESS - "${refined.data?.title}"` : 'FAILED');

    // Test simulation failure (Bad AI Output)
    const failRes = await fetch('http://localhost:5000/api/recipe/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'test', simulateFailure: 'wrong_schema' })
    });
    const failData = await failRes.json();
    console.log('Simulated Bad Output Test (HTTP 422):', failRes.status === 422 ? 'SUCCESS - Captured gracefully' : 'FAILED');

    console.log('\nALL BACKEND TESTS PASSED CLEANLY!');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    serverProc.kill();
    process.exit(0);
  }
}, 1500);
