require('dotenv').config();
const { callClaude } = require('./utils/claude');

async function test() {
  console.log('🔍 Testing API connection...');
  console.log('API Key:', process.env.ANTHROPIC_API_KEY?.substring(0, 20) + '...');
  console.log('Base URL:', process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com');
  console.log('');

  try {
    const response = await callClaude(
      'You are a helpful assistant.',
      'Say "Hello, API is working!" in Chinese.',
      100
    );
    console.log('✅ Success! API is working correctly.');
    console.log('📝 Response:', response);
    console.log('');
    console.log('🎉 You can now start the server with: npm start');
  } catch (error) {
    console.error('❌ API Test Failed!');
    console.error('Error:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('1. Check if ANTHROPIC_API_KEY is correct in .env file');
    console.log('2. Check if ANTHROPIC_BASE_URL is correct (for i7Relay: https://relay.i7.io/v1)');
    console.log('3. Check your network connection');
    console.log('4. Check if your API key has sufficient credits');
  }
}

test();
