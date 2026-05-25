import axios from "axios";

/**
 * CJ Dropshipping API Client
 * Handles token generation, caching, and API calls.
 */
class CJApiClient {
  constructor() {
    this.baseUrl = "https://developers.cjdropshipping.com";
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Retrieves and caches the CJ Access Token
   * Endpoint: /api2.0/v1/authentication/getAccessToken
   */
  async getAccessToken() {
    // Check if we already have a valid token cached
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const email = process.env.CJ_EMAIL;
    const apiKey = process.env.CJ_API_KEY;

    if (!email || !apiKey) {
      throw new Error("CJ Dropshipping credentials (CJ_EMAIL, CJ_API_KEY) are missing in environment variables.");
    }

    try {
      const response = await axios.post(`${this.baseUrl}/api2.0/v1/authentication/getAccessToken`, {
        email: email,
        apiKey: apiKey,
      }, {
        headers: { "Content-Type": "application/json" }
      });

      const { data } = response;
      if (data && data.success && data.data) {
        this.accessToken = data.data.accessToken;
        
        // CJ Tokens are usually valid for 7 days (or 604800 seconds). We parse expiry.
        // Cache for 6 days to be safe (6 * 24 * 60 * 60 * 1000 ms)
        const expiryDuration = data.data.expireTime || (6 * 24 * 60 * 60 * 1000);
        this.tokenExpiry = Date.now() + expiryDuration;
        
        return this.accessToken;
      } else {
        throw new Error(data.message || "Failed to authenticate with CJ Dropshipping API.");
      }
    } catch (error) {
      console.error("Error authenticating with CJ Dropshipping:", error.message);
      throw error;
    }
  }

  /**
   * General request wrapper with auth header injection
   */
  async request(method, path, body = null) {
    const token = await this.getAccessToken();
    
    try {
      const config = {
        method: method.toLowerCase(),
        url: `${this.baseUrl}${path}`,
        headers: {
          "Content-Type": "application/json",
          "CJ-Access-Token": token,
        },
      };

      if (body) {
        config.data = body;
      }

      const response = await axios(config);
      
      if (response.data && !response.data.success) {
        throw new Error(response.data.message || "CJ Dropshipping API request failed");
      }

      return response.data;
    } catch (error) {
      console.error(`CJ API Error on ${method} ${path}:`, error.message);
      throw error;
    }
  }

  /**
   * Submits a dropship order to CJ Dropshipping
   * Endpoint: /api2.0/v1/shopping/order/createOrder
   */
  async createOrder(orderPayload) {
    // Maps internal order structures to CJ order requirements
    // CJ Order standard schema includes shipping address and product array
    const cjPayload = {
      orderNumber: orderPayload.orderId, // E-store order number
      shippingName: orderPayload.shippingAddress.name,
      shippingAddress: orderPayload.shippingAddress.address,
      shippingCity: orderPayload.shippingAddress.city,
      shippingProvince: orderPayload.shippingAddress.province || orderPayload.shippingAddress.city,
      shippingCountry: orderPayload.shippingAddress.country,
      shippingZip: orderPayload.shippingAddress.postalCode,
      shippingPhone: orderPayload.shippingAddress.mobile || "0000000000",
      shippingMethod: orderPayload.shippingMethod || "CJ Packet Sensitive",
      products: orderPayload.items.map(item => ({
        sku: item.sku,
        quantity: item.quantity,
      })),
    };

    return this.request("POST", "/api2.0/v1/shopping/order/createOrder", cjPayload);
  }

  /**
   * Fetches shipment tracking number and status from CJ
   * Endpoint: /api2.0/v1/shopping/order/getTrackingNumber
   */
  async getTrackingInfo(cjOrderId) {
    return this.request("GET", `/api2.0/v1/shopping/order/getTrackingNumber?cjOrderId=${cjOrderId}`);
  }
}

export const cjApiClient = new CJApiClient();
export default cjApiClient;
