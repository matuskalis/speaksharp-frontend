import Script from "next/script";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://vorex.app/#website",
        "url": "https://vorex.app",
        "name": "Vorex",
        "description":
          "Master English fluently with AI-powered personalized lessons, real-time pronunciation feedback, and structured practice.",
        "publisher": {
          "@id": "https://vorex.app/#organization",
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://vorex.app/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://vorex.app/#organization",
        "name": "Vorex",
        "url": "https://vorex.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vorex.app/opengraph-image",
        },
        "sameAs": ["https://twitter.com/vorex"],
      },
      {
        "@type": "WebApplication",
        "name": "Vorex",
        "url": "https://vorex.app",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "1250",
        },
        "description":
          "AI-powered English learning platform with personalized lessons, real-time pronunciation feedback, grammar corrections, and CEFR assessment.",
        "featureList": [
          "AI-powered personalized lessons",
          "Real-time pronunciation feedback",
          "Grammar checking and corrections",
          "CEFR level assessment",
          "Interactive speaking practice",
          "Structured learning paths",
        ],
      },
      {
        "@type": "Course",
        "name": "English Fluency Course",
        "description":
          "Comprehensive English learning course with AI-powered feedback and personalized lessons",
        "provider": {
          "@id": "https://vorex.app/#organization",
        },
        "educationalLevel": "All Levels",
        "inLanguage": "en",
        "availableLanguage": ["en"],
        "teaches": "English Language",
      },
    ],
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
