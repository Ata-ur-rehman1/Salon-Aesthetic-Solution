import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Receive CJ Dropshipping real-time tracking updates
 * @route   POST /api/cj/order-status
 * @access  Public (Validated using webhook header secret)
 */
export const handleCJWebhook = asyncHandler(async (req, res) => {
  const { 
    orderId,        // Matches our custom e-commerce order _id
    cjOrderId,      // CJ Dropshipping's internal order ID
    trackingNumber, // Generated tracking number for the parcel
    orderStatus,    // e.g. "shipped", "completed", "dispatched"
    shippingMethod  // e.g. "CJ Packet Sensitive"
  } = req.body;

  console.log(`[CJ Webhook] Received tracking update for Order ID: ${orderId || 'N/A'}`);
  console.log(`[CJ Webhook] Payload Details: cjOrderId=${cjOrderId}, trackingNumber=${trackingNumber}, status=${orderStatus}`);

  // In production, validate header signature / token to secure webhook
  const webhookSecret = process.env.CJ_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers["cj-signature"];
    if (!signature || signature !== webhookSecret) {
      console.warn("[CJ Webhook] Unauthorized access: invalid webhook secret/signature");
      return res.status(401).json({ message: "Invalid webhook signature" });
    }
  }

  if (!orderId && !cjOrderId) {
    res.status(400);
    throw new Error("Invalid payload: Missing orderId or cjOrderId");
  }

  // Find order by our internal database ID or dropshipOrderId
  let order;
  if (orderId) {
    order = await Order.findById(orderId);
  } else {
    order = await Order.findOne({ dropshipOrderId: cjOrderId });
  }

  if (!order) {
    res.status(404);
    throw new Error(`Order not found for matching criteria (orderId: ${orderId}, cjOrderId: ${cjOrderId})`);
  }

  // Update order tracking and shipping details
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }
  
  if (cjOrderId) {
    order.dropshipOrderId = cjOrderId;
  }

  order.dropshipProvider = "cj";

  // Map CJ status to local dropship status
  const normalizedStatus = String(orderStatus).toLowerCase();
  if (normalizedStatus.includes("ship") || normalizedStatus.includes("dispatch") || normalizedStatus.includes("send")) {
    order.dropshipStatus = "shipped";
    order.isShipped = true;
    order.shippedAt = new Date();
  } else if (normalizedStatus.includes("fail") || normalizedStatus.includes("cancel")) {
    order.dropshipStatus = "failed";
  } else {
    order.dropshipStatus = "processed";
  }

  const updatedOrder = await order.save();

  console.log(`[CJ Webhook] Order ${order._id} updated successfully: isShipped=${order.isShipped}, trackingNumber=${order.trackingNumber}`);

  res.status(200).json({
    success: true,
    message: "Webhook processed and order database updated successfully",
    order: {
      id: updatedOrder._id,
      trackingNumber: updatedOrder.trackingNumber,
      isShipped: updatedOrder.isShipped,
      dropshipStatus: updatedOrder.dropshipStatus
    }
  });
});
