import puppeteer from "puppeteer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });

// Configuration options
const HEADLESS = process.env.CJ_PUPPETEER_HEADLESS === "true" || false; // Default headful for visual debugging
const EMAIL = process.env.CJ_EMAIL || "";
const PASSWORD = process.env.CJ_LOGIN_PASSWORD || "";

async function automateSourcing(aliexpressUrl) {
  if (!aliexpressUrl) {
    console.error("❌ Error: Missing AliExpress Product URL.");
    console.log("Usage: node cjSourcingAutomator.js <AliExpress_Product_URL>");
    process.exit(1);
  }

  if (!EMAIL || !PASSWORD) {
    console.error("❌ Error: CJ Dropshipping login credentials (CJ_EMAIL, CJ_LOGIN_PASSWORD) are missing in your environment.");
    process.exit(1);
  }

  console.log("🚀 Launching Puppeteer browser...");
  const browser = await puppeteer.launch({
    headless: HEADLESS ? "new" : false,
    defaultViewport: { width: 1280, height: 800 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  
  // Set custom user agent to prevent bot detection blocks
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  try {
    // Step 1: Navigating to CJ Login page
    console.log("🌐 Navigating to CJ Dropshipping Sign-In page...");
    await page.goto("https://cjdropshipping.com/signIn.html", { waitUntil: "networkidle2" });
    
    // Wait for the login form inputs to appear
    await page.waitForSelector("input[type='email']", { timeout: 15000 });
    await page.waitForSelector("input[type='password']", { timeout: 15000 });
    
    console.log("🔑 Entering login credentials...");
    await page.type("input[type='email']", EMAIL, { delay: 100 });
    await page.type("input[type='password']", PASSWORD, { delay: 100 });

    // Take screenshot of credentials input
    await page.screenshot({ path: path.join(__dirname, "sourcing_step1_credentials.png") });

    console.log("🖱️ Clicking Sign In button...");
    // Find the login button and click it
    // CJ login buttons usually have class names like `.login-btn` or button with text
    const loginButtonSelector = "button.login-btn, .sign-btn, button[type='submit']";
    await page.waitForSelector(loginButtonSelector);
    await page.click(loginButtonSelector);

    console.log("⏳ Waiting for login redirection to complete...");
    // Wait for redirection or cookie configuration
    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 20000 }).catch(() => {
      console.log("Navigation timeout reached, proceeding based on selector verification.");
    });

    // Take screenshot after login click
    await page.screenshot({ path: path.join(__dirname, "sourcing_step2_post_login.png") });

    // Step 2: Navigate to Sourcing Page
    console.log("🌐 Navigating to CJ MyCJ Sourcing Request submission form...");
    // Sourcing URL lists
    await page.goto("https://cjdropshipping.com/myCJ.html#/sourcing-list", { waitUntil: "networkidle2" });
    
    // Wait for sourcing controls to render
    console.log("⏳ Loading Sourcing Form container...");
    // CJ sourcing layout standardly contains a "Post Sourcing Request" button
    const postRequestSelector = "button.post-sourcing-btn, .post-sourcing, .btn-post";
    await page.waitForSelector(postRequestSelector, { timeout: 15000 });
    await page.click(postRequestSelector);

    // Step 3: Fill in AliExpress Sourcing Details
    console.log("✍️ Filling in AliExpress Sourcing Request details...");
    
    // Wait for the Sourcing Type / Link input selector
    // In CJ dropshipping, they have a tab or text input for sourcing URL
    const urlInputSelector = "input[placeholder*='AliExpress'], textarea[placeholder*='link'], .sourcing-url-input";
    await page.waitForSelector(urlInputSelector, { timeout: 15000 });
    await page.type(urlInputSelector, aliexpressUrl, { delay: 50 });

    // Set other sourcing parameters like target price
    const targetPriceSelector = "input[type='number'], .target-price-input";
    const priceExists = await page.$(targetPriceSelector);
    if (priceExists) {
      await page.type(targetPriceSelector, "15.00", { delay: 50 }); // Target sourcing price default
    }

    // Take screenshot of filled sourcing details
    await page.screenshot({ path: path.join(__dirname, "sourcing_step3_filled_form.png") });

    // Step 4: Submit sourcing request
    console.log("📤 Submitting Sourcing Request to CJ Dropshipping...");
    const submitBtnSelector = ".submit-btn, button.submit, button[type='submit']";
    await page.waitForSelector(submitBtnSelector, { timeout: 10000 });
    await page.click(submitBtnSelector);

    console.log("⏳ Finalizing submission...");
    await page.waitForTimeout ? await page.waitForTimeout(3000) : await new Promise(r => setTimeout(r, 3000));

    // Confirm submission result screenshot
    await page.screenshot({ path: path.join(__dirname, "sourcing_step4_completed.png") });
    console.log("✅ Success! CJ Sourcing request submitted successfully.");
    console.log(`📌 Logs and visual verification screenshots saved to ${__dirname}`);

  } catch (error) {
    console.error("❌ Sourcing Automation failed with error:", error.message);
    // Take a failure snapshot for easy debugging
    await page.screenshot({ path: path.join(__dirname, "sourcing_error_snapshot.png") });
    console.log(`📌 Debugging snapshot saved as 'sourcing_error_snapshot.png' in ${__dirname}`);
    process.exit(1);
  } finally {
    console.log("🔌 Closing browser session.");
    await browser.close();
  }
}

// Run automator
const aliexpressProductUrl = process.argv[2];
automateSourcing(aliexpressProductUrl);
