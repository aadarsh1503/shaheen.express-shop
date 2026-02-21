# BENEFIT PAY Network Setup & Whitelisting Guide

## 🌐 Required Whitelisting

### Domain Whitelisting (Recommended)
Add these domains to your firewall/proxy whitelist:
```
https://www.test.benefit-gateway.bh
https://www.benefit-gateway.bh
```

### IP Whitelisting (Alternative)
If domain whitelisting is not supported, whitelist these IPs:
```
79.171.242.91 (ports 443 & 80)
79.171.240.91 (ports 443 & 80)
79.171.242.90 (port 443)
79.171.240.90 (port 443)
79.171.247.90 (port 443)
```

## 🔧 Network Configuration Steps

### 1. Windows Firewall (if applicable)
```powershell
# Allow outbound connections to BENEFIT PAY IPs
netsh advfirewall firewall add rule name="BENEFIT PAY Test" dir=out action=allow remoteip=79.171.242.91,79.171.240.91,79.171.242.90,79.171.240.90,79.171.247.90
```

### 2. Corporate Firewall
Contact your IT department to whitelist:
- **Domains**: `*.benefit-gateway.bh`
- **IPs**: Listed above
- **Ports**: 443 (HTTPS), 80 (HTTP)

### 3. Router/Proxy Settings
If using corporate proxy, add to bypass list:
```
*.benefit-gateway.bh
www.test.benefit-gateway.bh
www.benefit-gateway.bh
```

## 🧪 Testing Connectivity

### Test Domain Resolution
```bash
nslookup www.test.benefit-gateway.bh
nslookup www.benefit-gateway.bh
```

### Test HTTPS Connectivity
```bash
curl -I https://www.test.benefit-gateway.bh/payment/API/hosted.htm
curl -I https://www.benefit-gateway.bh/payment/API/hosted.htm
```

### Test from Browser
Visit these URLs (should show 403 Forbidden, not connection error):
- https://www.test.benefit-gateway.bh/payment/API/hosted.htm
- https://www.benefit-gateway.bh/payment/API/hosted.htm

## 🔄 Development vs Production Mode

### Development Mode (Current Setup)
- Uses local test page: `/benefit-pay-test`
- No network requirements
- All test scenarios available
- Perfect for development and testing

### Production Mode (After Whitelisting)
Set environment variable to use real BENEFIT PAY:
```env
BENEFIT_PAY_USE_TEST_PAGE=false
NODE_ENV=production
```

## 🚨 Troubleshooting

### Cloudflare Block (Current Issue)
**Error**: "Sorry, you have been blocked"
**Solution**: 
1. Contact BENEFIT PAY support
2. Provide Cloudflare Ray ID
3. Request IP whitelisting
4. Use development mode meanwhile

### DNS Resolution Issues
**Error**: "DNS_PROBE_FINISHED_NXDOMAIN"
**Solution**:
1. Check DNS settings
2. Try different DNS servers (8.8.8.8, 1.1.1.1)
3. Flush DNS cache: `ipconfig /flushdns`

### Connection Timeout
**Error**: Connection timeout or refused
**Solution**:
1. Check firewall settings
2. Verify proxy configuration
3. Test with VPN from different location

## 📞 BENEFIT PAY Support Contact

When contacting BENEFIT PAY for whitelisting:

**Subject**: IP Whitelisting Request for Merchant 705369902

**Message Template**:
```
Dear BENEFIT PAY Support,

We are integrating with BENEFIT PAY using merchant ID 705369902 and encountering Cloudflare blocking.

Please whitelist our IP address for testing access to:
- https://www.test.benefit-gateway.bh
- https://www.benefit-gateway.bh

Our details:
- Merchant ID: 705369902
- IP Address: [Your IP from Cloudflare error]
- Cloudflare Ray ID: [From error page]
- Integration Type: API Integration
- Environment: Test/Development

Thank you for your assistance.
```

## 🔐 Security Considerations

### SSL/TLS Requirements
- BENEFIT PAY requires HTTPS connections
- Ensure SSL certificates are valid
- Check TLS version compatibility (1.2+)

### Firewall Rules
- Only allow outbound connections to BENEFIT PAY IPs
- Block unnecessary inbound connections
- Monitor connection logs for security

### Development Security
- Never use production credentials in development
- Keep test credentials secure
- Use environment variables for all sensitive data

## 🎯 Quick Start Checklist

- [ ] Contact BENEFIT PAY for IP whitelisting
- [ ] Configure firewall/proxy settings
- [ ] Test network connectivity
- [ ] Verify DNS resolution
- [ ] Test with development mode first
- [ ] Switch to production mode after whitelisting
- [ ] Monitor connection logs
- [ ] Document any issues for support

## 🔄 Current Status

✅ **Encryption**: Working perfectly
✅ **Test Credentials**: Configured (705369902)
✅ **Development Mode**: Fully functional test page
⏳ **Network Access**: Pending IP whitelisting from BENEFIT PAY
⏳ **Production Mode**: Ready after whitelisting complete