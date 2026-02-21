import axios from 'axios';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

// BENEFIT PAY Network Test Utility
export const testBenefitPayConnectivity = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test domains
  const domains = [
    'www.test.benefit-gateway.bh',
    'www.benefit-gateway.bh',
    'test.benefit-gateway.bh',
    'benefit-gateway.bh'
  ];

  // Test URLs
  const urls = [
    'https://www.test.benefit-gateway.bh/payment/API/hosted.htm',
    'https://www.benefit-gateway.bh/payment/API/hosted.htm'
  ];

  console.log('🔍 Testing BENEFIT PAY Network Connectivity...\n');

  // DNS Resolution Tests
  for (const domain of domains) {
    try {
      const result = await lookup(domain);
      results.tests.push({
        type: 'DNS',
        target: domain,
        status: 'SUCCESS',
        result: result.address,
        message: `Resolved to ${result.address}`
      });
      console.log(`✅ DNS ${domain} → ${result.address}`);
    } catch (error) {
      results.tests.push({
        type: 'DNS',
        target: domain,
        status: 'FAILED',
        error: error.message,
        message: `DNS resolution failed: ${error.message}`
      });
      console.log(`❌ DNS ${domain} → ${error.message}`);
    }
  }

  console.log('');

  // HTTP Connectivity Tests
  for (const url of urls) {
    try {
      const response = await axios.head(url, { 
        timeout: 10000,
        validateStatus: () => true // Accept any status code
      });
      
      const status = response.status === 403 ? 'BLOCKED' : 
                    response.status < 400 ? 'SUCCESS' : 'ERROR';
      
      results.tests.push({
        type: 'HTTP',
        target: url,
        status: status,
        statusCode: response.status,
        message: `HTTP ${response.status} - ${status === 'BLOCKED' ? 'Cloudflare block (expected)' : 'Connection successful'}`
      });
      
      if (status === 'BLOCKED') {
        console.log(`🚫 HTTP ${url} → ${response.status} (Cloudflare blocked - need whitelisting)`);
      } else if (status === 'SUCCESS') {
        console.log(`✅ HTTP ${url} → ${response.status} (Connected successfully)`);
      } else {
        console.log(`⚠️  HTTP ${url} → ${response.status} (Unexpected response)`);
      }
    } catch (error) {
      const isTimeout = error.code === 'ECONNABORTED';
      const isNetworkError = error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED';
      
      results.tests.push({
        type: 'HTTP',
        target: url,
        status: 'FAILED',
        error: error.message,
        code: error.code,
        message: `Connection failed: ${error.message}`
      });
      
      if (isTimeout) {
        console.log(`⏱️  HTTP ${url} → Timeout (firewall/proxy blocking)`);
      } else if (isNetworkError) {
        console.log(`🌐 HTTP ${url} → Network error (${error.code})`);
      } else {
        console.log(`❌ HTTP ${url} → ${error.message}`);
      }
    }
  }

  // Summary
  console.log('\n📊 Test Summary:');
  const dnsTests = results.tests.filter(t => t.type === 'DNS');
  const httpTests = results.tests.filter(t => t.type === 'HTTP');
  
  const dnsSuccess = dnsTests.filter(t => t.status === 'SUCCESS').length;
  const httpSuccess = httpTests.filter(t => t.status === 'SUCCESS').length;
  const httpBlocked = httpTests.filter(t => t.status === 'BLOCKED').length;
  
  console.log(`DNS Resolution: ${dnsSuccess}/${dnsTests.length} successful`);
  console.log(`HTTP Connectivity: ${httpSuccess}/${httpTests.length} successful, ${httpBlocked} blocked`);
  
  if (httpBlocked > 0) {
    console.log('\n🔧 Next Steps:');
    console.log('1. Contact BENEFIT PAY support for IP whitelisting');
    console.log('2. Use development test page meanwhile');
    console.log('3. Check BENEFIT_PAY_NETWORK_SETUP.md for detailed instructions');
  }

  return results;
};

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testBenefitPayConnectivity()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Network test failed:', error);
      process.exit(1);
    });
}