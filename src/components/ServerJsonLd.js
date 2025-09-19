import Script from 'next/script';

// This is a server component that renders JSON-LD directly in the HTML
export default function ServerJsonLd({ schema, id = 'default-jsonld' }) {
  // If schema is null or undefined, don't render anything
  if (!schema) {
    console.log(`ServerJsonLd: Schema is null or undefined for id ${id}`);
    return null;
  }

  // Ensure schema has @context and @graph
  const normalizedSchema = {
    '@context': 'https://schema.org',
    '@graph': []
  };

  // If schema already has @graph, use it, otherwise add schema to @graph
  if (schema['@graph'] && Array.isArray(schema['@graph'])) {
    normalizedSchema['@graph'] = schema['@graph'];
  } else if (schema['@type']) {
    normalizedSchema['@graph'] = [schema];
  }

  // Only render if there's actual content
  if (normalizedSchema['@graph'].length === 0) {
    console.log(`ServerJsonLd: No content in schema for id ${id}`);
    return null;
  }

  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(normalizedSchema, null, 2)
      }}
    />
  );
}