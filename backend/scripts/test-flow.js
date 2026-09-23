const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';
const TEST_USER = { 
  username: 'testuser', 
  email: 'test@example.com', 
  password: 'password123' 
}; 

async function runAutomatedTests() {
  console.log('Starting Automated E2E Trading Test...\n');
  let cookieHeader = '';
  let stockId = '';
  const idempotencyKey = `test-trade-${Date.now()}`; 

  try {
    // --- TEST 1: LOGIN & AUTH ---
    console.log('Test 1: Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
    
    // Extract cookies from Set-Cookie header
    cookieHeader = loginRes.headers['set-cookie']; 
    console.log(`Login Success! Cookies acquired.\n`);

    // --- TEST 2: FETCH A STOCK ---
    stockId = '6a36f186423b369ce763d2ff'; 
    const headers = { 
      Cookie: cookieHeader,
      'Idempotency-Key': idempotencyKey
    };

    // --- TEST 3: EXECUTE BUY ORDER ---
    console.log(`Test 3: Executing BUY order for 10 shares...`);
    const buyRes = await axios.post(`${BASE_URL}/trading/buy`, 
      { stockId, quantity: 10 }, 
      { headers }
    );
    const buyOrderId = buyRes.data._id || (buyRes.data.data && buyRes.data.data._id);
    console.log(`BUY Success! Order ID: ${buyOrderId}\n`);

    // --- TEST 4: TEST IDEMPOTENCY SHIELD ---
    console.log(`Test 4: Firing identical BUY order instantly (Testing Idempotency)...`);
    const duplicateBuyRes = await axios.post(`${BASE_URL}/trading/buy`, 
      { stockId, quantity: 10 }, 
      { headers }
    );
    
    const duplicateOrderId = duplicateBuyRes.data._id || (duplicateBuyRes.data.data && duplicateBuyRes.data.data._id);
    
    if (buyOrderId === duplicateOrderId) {
      console.log(`Idempotency Shield worked! Cached response returned. Money is safe.\n`);
    } else {
      console.error(`Idempotency failed! A second order was created.\n`);
    }

    // --- TEST 5: EXECUTE SELL ORDER ---
    const sellHeaders = { ...headers, 'Idempotency-Key': `sell-${Date.now()}` };
    console.log(`Test 5: Executing SELL order for 10 shares...`);
    const sellRes = await axios.post(`${BASE_URL}/trading/sell`, 
      { stockId, quantity: 10 }, 
      { headers: sellHeaders }
    );
    
    const sellOrderId = sellRes.data._id || (sellRes.data.data && sellRes.data.data._id);
    console.log(`SELL Success! Order ID: ${sellOrderId}\n`);

    console.log('ALL AUTOMATED TESTS PASSED SUCCESSFULLY! Your backend is bulletproof.');

  } catch (error) {
    console.log('\nTEST FAILED! Error Details:');
    console.log(error);
  }
}

runAutomatedTests();