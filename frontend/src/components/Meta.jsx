import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />

      {/* Favicons */}
      <link rel="icon" type="image/png" href="/logo.png?v=6" />
      <link rel="shortcut icon" href="/logo.png?v=6" type="image/png" />
      <link rel="apple-touch-icon" href="/logo.png?v=6" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Salon Aesthetic Solution | Premium Salon Equipment",
  description: "High-quality salon aesthetic solutions, aesthetic machines, and electronic equipment for professional salons.",
  keywords: "salon equipment, salon aesthetic solution, aesthetic machines, professional salon furniture",
};

export default Meta;
