# Dropshipping Setup & Configuration Guide

This guide describes how to configure and deploy the **AliExpress Dropshipper MCP Server** and **CJ Dropshipping Backend Integration** for your e-commerce platform.

---

## 1. Environment Variables Configuration

Create or append the following keys to your Express.js backend environment file ([backend/.env](file:///c:/Users/Experttech.pk/Desktop/Salon%20Aesthetic%20Solution/backend/.env) or system settings):

```env
# ==========================================
# AliExpress Dropshipper API
# ==========================================
ALIEXPRESS_APP_KEY=your_aliexpress_app_key
ALIEXPRESS_APP_SECRET=your_aliexpress_app_secret
ALIEXPRESS_ACCESS_TOKEN=your_aliexpress_access_token

# ==========================================
# CJ Dropshipping API & Automation
# ==========================================
CJ_EMAIL=your_cj_registered_email@example.com
CJ_API_KEY=your_cj_developer_api_key
CJ_LOGIN_PASSWORD=your_cj_account_password

# Optional: Webhook signature validation secret
CJ_WEBHOOK_SECRET=your_custom_webhook_secret

# Puppeteer browser mode (set to true to run in the background, false for debugging)
CJ_PUPPETEER_HEADLESS=false
```

---

## 2. Registering the AliExpress MCP Server in Antigravity

To enable the Antigravity agent to discover and invoke the AliExpress dropshipping tools, register this server in your Antigravity configuration file.

### How to configure:
1. Open your Antigravity Settings / Config panel.
2. Locate the MCP Server Configuration section (usually under your local AppData directory or direct IDE configurations).
3. Add the following entry to the `mcpServers` object:

```json
{
  "mcpServers": {
    "aliexpress-dropshipper": {
      "command": "node",
      "args": [
        "backend/aliexpress-mcp-server/build/index.js"
      ],
      "env": {
        "ALIEXPRESS_APP_KEY": "your_aliexpress_app_key",
        "ALIEXPRESS_APP_SECRET": "your_aliexpress_app_secret",
        "ALIEXPRESS_ACCESS_TOKEN": "your_aliexpress_access_token"
      }
    }
  }
}
```

> [!NOTE]
> Make sure you run `npm run build` in the `backend/aliexpress-mcp-server` directory before registering so the build files in `build/index.js` exist.

---

## 3. Running Sourcing Automation Requests

We have created an automated browser script utilizing Puppeteer to submit sourcing requests to CJ Dropshipping. It takes any AliExpress product URL as a command-line parameter, automatically signs in, navigates to CJ Sourcing, and submits it.

### To execute the Sourcing Automator:
1. Navigate to the root directory.
2. Ensure you have the `puppeteer` and `dotenv` dependencies installed:
   ```bash
   npm install puppeteer dotenv
   ```
3. Run the script by passing the AliExpress product URL:
   ```bash
   node scripts/cjSourcingAutomator.js "https://www.aliexpress.com/item/1005006001234001.html"
   ```

---

## 4. Real-time Webhook Integration

CJ Dropshipping will send real-time package updates to the Express server at:
`POST /api/cj/order-status`

### Payload structure expected:
```json
{
  "orderId": "64f1a238b001a123456789ab",
  "cjOrderId": "CJ1234567",
  "trackingNumber": "9400111202063000000000",
  "orderStatus": "shipped",
  "shippingMethod": "CJ Packet Sensitive"
}
```
When this webhook is received, the backend:
1. Validates the signature header `cj-signature` against your `CJ_WEBHOOK_SECRET` (if configured).
2. Performs an atomic lookup of the corresponding Order in the Mongoose database.
3. Automatically sets `isShipped = true`, updates `shippedAt` to the current timestamp, inserts `trackingNumber`, sets `dropshipProvider = "cj"`, and updates `dropshipStatus = "shipped"`.
