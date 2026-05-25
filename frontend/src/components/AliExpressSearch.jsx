import React, { useState } from "react";

/**
 * AliExpressSearch Component
 * A premium, responsive React interface styled with custom CSS glassmorphism,
 * showcasing seamless integration with the AliExpress Dropshipper MCP tools.
 */
const AliExpressSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [shipCountry, setShipCountry] = useState("US");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);

  // Emulates calling the MCP `search_products` tool via the Antigravity agent or custom backend proxy
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedProduct(null);

    try {
      console.log(`[MCP Call] Invoking search_products with parameters:`, {
        keyword,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        shipToCountry: shipCountry
      });

      // Simulation of AliExpress API or agent-tool response:
      // In production, this can be handled via a backend route proxying AliExpress
      // or directly through an MCP agent execution interface.
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Smooth loading transition

      // Sample beautiful products returned from MCP search_products tool execution
      const dummyProducts = [
        {
          productId: "1005006001234001",
          title: "Acrylic Professional Salon Makeup Organizer Case",
          price: 24.99,
          currency: "USD",
          imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop",
          shipCountry: shipCountry,
          rating: 4.8,
          reviewsCount: 142,
          ordersCount: 489,
          description: "Premium dustproof acrylic box with drawers and compartmentalized grids, perfect for beauty clinics, vanity tables, and styling salons.",
          variants: [
            { skuId: "sku_org_clear_01", color: "Crystal Clear", size: "3-Drawer", price: 24.99, stock: 120 },
            { skuId: "sku_org_pink_02", color: "Rose Tinted Pink", size: "3-Drawer", price: 26.99, stock: 45 },
            { skuId: "sku_org_black_03", color: "Obsidian Black", size: "5-Drawer", price: 34.99, stock: 80 }
          ]
        },
        {
          productId: "1005006001234002",
          title: "Luxury Gold Rimmed Ceramic Vanity Tray",
          price: 18.50,
          currency: "USD",
          imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop",
          shipCountry: shipCountry,
          rating: 4.9,
          reviewsCount: 96,
          ordersCount: 312,
          description: "Stunning white marbleized ceramic plate decorated with an electroplated gold border. Elegant tabletop styling piece for cosmetic displays.",
          variants: [
            { skuId: "sku_tray_marble_01", color: "Carrara White Marble", size: "Medium", price: 18.50, stock: 240 },
            { skuId: "sku_tray_emerald_02", color: "Royal Emerald Green", size: "Large", price: 22.00, stock: 110 }
          ]
        },
        {
          productId: "1005006001234003",
          title: "LED Smart Vanity Makeup Mirror (USB Rechargeable)",
          price: 32.99,
          currency: "USD",
          imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=500&auto=format&fit=crop",
          shipCountry: shipCountry,
          rating: 4.7,
          reviewsCount: 215,
          ordersCount: 840,
          description: "Dimmable high-definition mirror with built-in rechargeable battery, smart touch controls, and 3 light settings (warm, natural, cool white).",
          variants: [
            { skuId: "sku_mirror_white_01", color: "Pearl White", size: "Standard", price: 32.99, stock: 85 },
            { skuId: "sku_mirror_pink_02", color: "Sakura Pink", size: "Standard", price: 32.99, stock: 40 }
          ]
        }
      ];

      setProducts(dummyProducts);
    } catch (err) {
      console.error(err);
      setError("An error occurred while calling the search tool. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSourceOnCJ = (prod) => {
    alert(`🚀 Initiating CJ Sourcing automation script for AliExpress Product ID: ${prod.productId}\nTarget URL: https://aliexpress.com/item/${prod.productId}.html`);
  };

  return (
    <div style={styles.container}>
      {/* Search Header and Glassmorphic Panel */}
      <div style={styles.glassPanel}>
        <h2 style={styles.title}>AliExpress Dropshipping Hub</h2>
        <p style={styles.subtitle}>Directly query live products & manage fulfillment using Antigravity MCP Tools</p>
        
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., acrylic makeup box"
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroupRow}>
            <div style={styles.formSubGroup}>
              <label style={styles.label}>Min Price (USD)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                style={styles.input}
              />
            </div>
            
            <div style={styles.formSubGroup}>
              <label style={styles.label}>Max Price (USD)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                style={styles.input}
              />
            </div>

            <div style={styles.formSubGroup}>
              <label style={styles.label}>Ship To Country</label>
              <select
                value={shipCountry}
                onChange={(e) => setShipCountry(e.target.value)}
                style={styles.select}
              >
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
                <option value="FR">France (FR)</option>
                <option value="AU">Australia (AU)</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Searching via MCP Tool..." : "Search AliExpress Products"}
          </button>
        </form>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      {/* Main Grid View */}
      <div style={styles.mainLayout}>
        {/* Results List */}
        <div style={styles.resultsContainer}>
          {loading ? (
            <div style={styles.skeletonContainer}>
              {[1, 2].map((n) => (
                <div key={n} style={styles.skeletonCard}>
                  <div style={styles.skeletonImage}></div>
                  <div style={styles.skeletonLineLong}></div>
                  <div style={styles.skeletonLineShort}></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div style={styles.productsGrid}>
              {products.map((prod) => (
                <div
                  key={prod.productId}
                  style={{
                    ...styles.productCard,
                    ...(selectedProduct?.productId === prod.productId ? styles.activeCard : {})
                  }}
                  onClick={() => setSelectedProduct(prod)}
                >
                  <img src={prod.imageUrl} alt={prod.title} style={styles.productImage} />
                  <div style={styles.cardContent}>
                    <h3 style={styles.productTitle}>{prod.title}</h3>
                    <div style={styles.priceRow}>
                      <span style={styles.price}>${prod.price.toFixed(2)}</span>
                      <span style={styles.rating}>⭐ {prod.rating}</span>
                    </div>
                    <div style={styles.cardActions}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSourceOnCJ(prod);
                        }}
                        style={styles.actionBtn}
                      >
                        Source on CJ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <span style={{ fontSize: "3rem" }}>🔍</span>
              <p>Enter keywords above to query products directly using the AliExpress Open Platform API.</p>
            </div>
          )}
        </div>

        {/* Detailed Product Inspector Sidebar */}
        {selectedProduct && (
          <div style={styles.sidebar}>
            <div style={styles.glassPanel}>
              <div style={styles.sidebarHeader}>
                <h3 style={styles.sidebarTitle}>Product Inspector</h3>
                <button onClick={() => setSelectedProduct(null)} style={styles.closeBtn}>×</button>
              </div>

              <img src={selectedProduct.imageUrl} alt={selectedProduct.title} style={styles.sidebarImage} />
              
              <h4 style={styles.sidebarProductTitle}>{selectedProduct.title}</h4>
              <p style={styles.sidebarDesc}>{selectedProduct.description}</p>
              
              <div style={styles.statsContainer}>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Orders</span>
                  <span style={styles.statValue}>{selectedProduct.ordersCount}+</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Rating</span>
                  <span style={styles.statValue}>★ {selectedProduct.rating}</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statLabel}>Item ID</span>
                  <span style={styles.statValue} title={selectedProduct.productId}>
                    {selectedProduct.productId.slice(-6)}
                  </span>
                </div>
              </div>

              <h4 style={styles.sectionHeader}>SKU Variations ({selectedProduct.variants.length})</h4>
              <div style={styles.variantsList}>
                {selectedProduct.variants.map((v) => (
                  <div key={v.skuId} style={styles.variantItem}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={styles.variantName}>{v.color} - {v.size}</span>
                      <span style={styles.variantSku}>{v.skuId}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <span style={styles.variantPrice}>${v.price.toFixed(2)}</span>
                      <span style={styles.variantStock}>{v.stock} in stock</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Premium Glassmorphism Styles
const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
    color: "#fff",
    backgroundColor: "#0d0f14",
    padding: "2rem",
    minHeight: "100vh",
  },
  glassPanel: {
    background: "rgba(22, 28, 45, 0.45)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "2.5rem",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "700",
    margin: "0 0 0.5rem 0",
    background: "linear-gradient(135deg, #60efff 0%, #0061ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "1.05rem",
    margin: "0 0 2rem 0",
  },
  searchForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  formGroupRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1.5rem",
  },
  formSubGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    color: "#cbd5e1",
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "0.8rem 1rem",
    color: "#fff",
    fontSize: "1rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
  },
  select: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "0.8rem 1rem",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    cursor: "pointer",
  },
  button: {
    background: "linear-gradient(135deg, #0061ff 0%, #60efff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "1rem",
    fontSize: "1.05rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px 0 rgba(0, 97, 255, 0.3)",
    transition: "transform 0.2s, filter 0.2s",
  },
  mainLayout: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
  },
  resultsContainer: {
    flex: "3",
    minWidth: "300px",
  },
  sidebar: {
    flex: "1.5",
    minWidth: "320px",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "2rem",
  },
  productCard: {
    background: "rgba(22, 28, 45, 0.3)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s, border-color 0.3s",
  },
  activeCard: {
    borderColor: "#38bdf8",
    transform: "scale(1.02)",
    boxShadow: "0 0 20px rgba(56, 189, 248, 0.15)",
  },
  productImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  cardContent: {
    padding: "1.25rem",
  },
  productTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0 0 0.75rem 0",
    color: "#f8fafc",
    lineHeight: "1.4",
    height: "2.8em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  price: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#38bdf8",
  },
  rating: {
    color: "#fbbf24",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  cardActions: {
    display: "flex",
    gap: "0.5rem",
  },
  actionBtn: {
    flex: "1",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "6px",
    padding: "0.6rem",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "5rem 2rem",
    textAlign: "center",
    color: "#64748b",
  },
  errorAlert: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    borderRadius: "8px",
    padding: "1rem",
    color: "#fca5a5",
    marginBottom: "2rem",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  sidebarTitle: {
    margin: 0,
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#f8fafc",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  sidebarImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "1.25rem",
  },
  sidebarProductTitle: {
    margin: "0 0 0.75rem 0",
    fontSize: "1.2rem",
    fontWeight: "700",
  },
  sidebarDesc: {
    color: "#cbd5e1",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    margin: "0 0 1.5rem 0",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statBox: {
    background: "rgba(15, 23, 42, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
  },
  statLabel: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  statValue: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#fff",
  },
  sectionHeader: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 1rem 0",
  },
  variantsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  variantItem: {
    background: "rgba(15, 23, 42, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  variantName: {
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  variantSku: {
    fontSize: "0.75rem",
    color: "#64748b",
  },
  variantPrice: {
    fontWeight: "700",
    color: "#38bdf8",
    fontSize: "0.95rem",
  },
  variantStock: {
    fontSize: "0.75rem",
    color: "#10b981",
  },
  // Skeleton Loading styles
  skeletonContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "2rem",
  },
  skeletonCard: {
    background: "rgba(22, 28, 45, 0.25)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  skeletonImage: {
    width: "100%",
    height: "180px",
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "8px",
  },
  skeletonLineLong: {
    width: "80%",
    height: "1rem",
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "4px",
  },
  skeletonLineShort: {
    width: "40%",
    height: "1rem",
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "4px",
  },
};

export default AliExpressSearch;
