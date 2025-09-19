'use client';

export default function LazyContentMore({content}) {
  if (!content.features || content.features.length <= 3) {
    return null;
  }
  
  return (
    <ul className="soka-seo-content-features">
      {content.features.slice(3).map((feature, index) => (
        <li 
          key={index + 3} 
          className="soka-seo-feature-item" 
          dangerouslySetInnerHTML={{ __html: feature }} 
        />
      ))}
    </ul>
  );
} 