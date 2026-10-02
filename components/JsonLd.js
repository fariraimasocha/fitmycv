// Renders a JSON-LD <script> for structured data. Server component, emits the
// schema into the initial HTML so crawlers see it without running JS.
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" keeps a "</script>" inside a string from closing the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
