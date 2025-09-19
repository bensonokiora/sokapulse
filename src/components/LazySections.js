'use client';

export default function LazySections({content, renderSections}) {
  return (
    <div className="soka-seo-sections-container">
      {renderSections()}
    </div>
  );
} 