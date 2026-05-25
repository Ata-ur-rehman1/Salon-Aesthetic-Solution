import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import crypto from "crypto";
import axios from "axios";

// Environment variables configuration
const API_BASE_URL = "https://api-sg.aliexpress.com/sync";
const APP_KEY = process.env.ALIEXPRESS_APP_KEY || "";
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET || "";
const ACCESS_TOKEN = process.env.ALIEXPRESS_ACCESS_TOKEN || "";

/**
 * Utility to generate the AliExpress Open Platform MD5 Signature
 * 
 * Rules:
 * 1. Sort all parameter keys alphabetically.
 * 2. Concatenate sorted keys and values: key1value1key2value2...
 * 3. Prepend and append the appSecret to the concatenated string.
 * 4. Compute MD5 hash and convert to uppercase hex.
 */
function generateSignature(method: string, params: Record<string, string>): string {
  if (!APP_SECRET) {
    console.error("Warning: ALIEXPRESS_APP_SECRET is not set.");
    return "";
  }

  // Common + Business params
  const allParams = {
    ...params,
    method,
    app_key: APP_KEY,
    timestamp: String(Date.now()),
    sign_method: "md5",
    v: "2.0",
  };

  if (ACCESS_TOKEN) {
    allParams["session"] = ACCESS_TOKEN;
  }

  // Remove existing signature and empty parameters
  delete allParams["sign"];

  // Sort keys alphabetically
  const sortedKeys = Object.keys(allParams).sort();

  // Concatenate keys and values
  let paramStr = "";
  for (const key of sortedKeys) {
    const val = allParams[key as keyof typeof allParams];
    if (val !== undefined && val !== null && val !== "") {
      paramStr += key + val;
    }
  }

  // Prepend and append APP_SECRET
  const signInput = APP_SECRET + paramStr + APP_SECRET;

  // MD5 signature
  return crypto.createHash("md5").update(signInput, "utf8").digest("hex").toUpperCase();
}

/**
 * Helper to call AliExpress Open Platform API
 */
async function callAliExpressApi(method: string, businessParams: Record<string, any>) {
  if (!APP_KEY || !APP_SECRET) {
    throw new Error("AliExpress API credentials (APP_KEY, APP_SECRET) are missing in environment variables.");
  }

  // Convert business parameters into strings
  const stringifiedParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(businessParams)) {
    stringifiedParams[key] = typeof value === "object" ? JSON.stringify(value) : String(value);
  }

  // Generate common parameters
  const timestamp = String(Date.now());
  const commonParams: Record<string, string> = {
    method,
    app_key: APP_KEY,
    timestamp,
    sign_method: "md5",
    v: "2.0",
  };

  if (ACCESS_TOKEN) {
    commonParams["session"] = ACCESS_TOKEN;
  }

  // Generate signature
  const mergedParams = { ...commonParams, ...stringifiedParams };
  const sign = generateSignature(method, mergedParams);

  // Send request using POST form urlencoded as standard in Taobao Open Platform
  const requestUrl = `${API_BASE_URL}`;
  const formData = new URLSearchParams();
  for (const [key, value] of Object.entries(mergedParams)) {
    formData.append(key, value);
  }
  formData.append("sign", sign);

  try {
    const response = await axios.post(requestUrl, formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      timeout: 10000,
    });
    
    // AliExpress API returns errors inside the body, check for sub_code / msg
    const responseData = response.data;
    const errorResponseKey = "error_response";
    if (responseData && responseData[errorResponseKey]) {
      const errorMsg = responseData[errorResponseKey].sub_msg || responseData[errorResponseKey].msg || "Unknown API Error";
      throw new Error(`AliExpress API Error: ${errorMsg} (${responseData[errorResponseKey].sub_code || responseData[errorResponseKey].code})`);
    }

    return responseData;
  } catch (error: any) {
    console.error(`Error calling AliExpress API method ${method}:`, error.message);
    throw error;
  }
}

// Create MCP Server
const server = new Server(
  {
    name: "aliexpress-dropshipping-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Tool List
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_products",
        description: "Search products on AliExpress using keyword filters (price range, shipping country, page).",
        inputSchema: {
          type: "object",
          properties: {
            keyword: {
              type: "string",
              description: "Product search query, e.g., 'acrylic organizer'",
            },
            minPrice: {
              type: "number",
              description: "Minimum product price in USD",
            },
            maxPrice: {
              type: "number",
              description: "Maximum product price in USD",
            },
            shipToCountry: {
              type: "string",
              description: "Two-letter ISO country code (e.g., US, GB, CA)",
            },
            pageNo: {
              type: "integer",
              description: "Page number (defaults to 1)",
            },
            pageSize: {
              type: "integer",
              description: "Items per page (defaults to 20)",
            },
          },
          required: ["keyword"],
        },
      },
      {
        name: "get_product_details",
        description: "Fetch comprehensive AliExpress product details, including pricing, description, variants, images, and option values.",
        inputSchema: {
          type: "object",
          properties: {
            productId: {
              type: "string",
              description: "AliExpress Product ID (e.g., '100500123456789')",
            },
            targetLanguage: {
              type: "string",
              description: "Language for description translation (e.g., EN, FR, ES, defaults to EN)",
            },
            targetCurrency: {
              type: "string",
              description: "Currency for pricing structure (e.g., USD, EUR, defaults to USD)",
            },
          },
          required: ["productId"],
        },
      },
      {
        name: "get_shipping_info",
        description: "Calculate shipping methods, shipping fees, and estimated delivery dates to a destination country code.",
        inputSchema: {
          type: "object",
          properties: {
            productId: {
              type: "string",
              description: "AliExpress Product ID",
            },
            skuId: {
              type: "string",
              description: "Specific SKU ID to estimate delivery for",
            },
            countryCode: {
              type: "string",
              description: "Two-letter destination ISO country code (e.g., US, UK, FR)",
            },
            quantity: {
              type: "integer",
              description: "Quantity of items to calculate shipping for (defaults to 1)",
            },
          },
          required: ["productId", "countryCode"],
        },
      },
      {
        name: "create_order",
        description: "Submit a dropship order to AliExpress with customer address and SKU variations details.",
        inputSchema: {
          type: "object",
          properties: {
            skuId: {
              type: "string",
              description: "AliExpress variation SKU ID",
            },
            quantity: {
              type: "integer",
              description: "Quantity to order",
            },
            shippingAddress: {
              type: "object",
              description: "Shipping details of the buyer",
              properties: {
                name: { type: "string", description: "Recipient's full name" },
                address1: { type: "string", description: "Street address" },
                address2: { type: "string", description: "Apartment, suite, unit (optional)" },
                city: { type: "string", description: "City" },
                province: { type: "string", description: "State or province" },
                postalCode: { type: "string", description: "Zip / postal code" },
                country: { type: "string", description: "Two-letter ISO country code (e.g., US, CA)" },
                mobile: { type: "string", description: "Recipient's contact number" },
              },
              required: ["name", "address1", "city", "postalCode", "country", "mobile"],
            },
          },
          required: ["skuId", "quantity", "shippingAddress"],
        },
      },
    ],
  };
});

// Handle Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "search_products": {
        const { keyword, minPrice, maxPrice, shipToCountry, pageNo = 1, pageSize = 20 } = args as any;
        
        // Mock fallback if keys are missing or invalid (makes server debug-friendly)
        if (!APP_KEY || !APP_SECRET) {
          console.warn("Using sample mock search results since AliExpress credentials are not configured.");
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  note: "Demonstration mock data (AliExpress keys missing). Configure your .env file to execute real API requests.",
                  products: [
                    {
                      productId: "1005006001234001",
                      title: `Premium Modern ${keyword} - Luxury Style`,
                      price: "24.99",
                      currency: "USD",
                      imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop",
                      shipCountry: shipToCountry || "US",
                      rating: "4.8",
                      ordersCount: 452
                    },
                    {
                      productId: "1005006001234002",
                      title: `Aesthetic ${keyword} Organizer`,
                      price: "18.50",
                      currency: "USD",
                      imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop",
                      shipCountry: shipToCountry || "US",
                      rating: "4.6",
                      ordersCount: 189
                    }
                  ]
                }, null, 2)
              }
            ]
          };
        }

        // Official API call: aliexpress.ds.recommend.feed.get
        const result = await callAliExpressApi("aliexpress.ds.recommend.feed.get", {
          feed_id: "10001", // Standard dropship feed
          search_key: keyword,
          page_size: pageSize,
          page_no: pageNo,
          target_currency: "USD",
          target_language: "EN",
          ship_to_country: shipToCountry || "US",
          price_from: minPrice ? Math.floor(minPrice * 100) : undefined, // price in cents
          price_to: maxPrice ? Math.floor(maxPrice * 100) : undefined,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_product_details": {
        const { productId, targetLanguage = "EN", targetCurrency = "USD" } = args as any;

        if (!APP_KEY || !APP_SECRET) {
          console.warn("Using sample mock details since AliExpress credentials are not configured.");
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  note: "Demonstration mock data (AliExpress keys missing). Configure your .env file to execute real API requests.",
                  product: {
                    productId,
                    title: "Aesthetic Salon & Home Luxury Organizer Drawer",
                    description: "High-grade acrylic makeup and accessory storage drawers designed for salon and vanity applications.",
                    price: "24.99",
                    currency: targetCurrency,
                    images: [
                      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop"
                    ],
                    variants: [
                      { skuId: "sku_drawer_white_01", color: "White Acrylic", size: "3 Drawer", price: "24.99", stock: 120 },
                      { skuId: "sku_drawer_clear_02", color: "Clear Crystal", size: "3 Drawer", price: "26.50", stock: 95 },
                      { skuId: "sku_drawer_black_03", color: "Obsidian Black", size: "5 Drawer", price: "34.99", stock: 45 }
                    ]
                  }
                }, null, 2)
              }
            ]
          };
        }

        // Official API call: aliexpress.ds.product.get
        const result = await callAliExpressApi("aliexpress.ds.product.get", {
          product_id: productId,
          target_language: targetLanguage,
          target_currency: targetCurrency,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_shipping_info": {
        const { productId, skuId, countryCode, quantity = 1 } = args as any;

        if (!APP_KEY || !APP_SECRET) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  note: "Demonstration mock data (AliExpress keys missing). Configure your .env file to execute real API requests.",
                  shippingOptions: [
                    {
                      methodCode: "standard",
                      methodName: "AliExpress Standard Shipping",
                      cost: "3.50",
                      currency: "USD",
                      estimatedDays: "12-18",
                      trackingAvailable: true
                    },
                    {
                      methodCode: "express",
                      methodName: "DHL Express Dropshipping",
                      cost: "19.99",
                      currency: "USD",
                      estimatedDays: "4-7",
                      trackingAvailable: true
                    }
                  ]
                }, null, 2)
              }
            ]
          };
        }

        // Official API call: aliexpress.ds.shipping.info.get
        const result = await callAliExpressApi("aliexpress.ds.shipping.info.get", {
          product_id: productId,
          sku_id: skuId,
          quantity,
          country_code: countryCode,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_order": {
        const { skuId, quantity, shippingAddress } = args as any;

        if (!APP_KEY || !APP_SECRET) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  note: "Demonstration mock data (AliExpress keys missing). Configure your .env file to execute real API requests.",
                  aliexpressOrderId: `AE_DS_${Math.floor(Math.random() * 1000000000)}`,
                  status: "PLACE_ORDER_SUCCESS",
                  totalAmount: String((18.50 * quantity).toFixed(2)),
                  currency: "USD",
                  shippingAddress
                }, null, 2)
              }
            ]
          };
        }

        // Official API call: aliexpress.ds.order.create
        // Construction maps standard shipping fields to AE structures
        const result = await callAliExpressApi("aliexpress.ds.order.create", {
          sku_id: skuId,
          quantity,
          shipping_address: {
            contact_person: shippingAddress.name,
            address_line1: shippingAddress.address1,
            address_line2: shippingAddress.address2 || "",
            city: shippingAddress.city,
            province: shippingAddress.province || shippingAddress.city,
            zip_code: shippingAddress.postalCode,
            country_code: shippingAddress.country,
            mobile_no: shippingAddress.mobile,
          }
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown MCP Tool: ${name}`);
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

// Run server using stdio transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AliExpress Dropshipping MCP Server is running on stdio transport!");
}

run().catch((err) => {
  console.error("Critical error starting AliExpress MCP Server:", err);
  process.exit(1);
});
