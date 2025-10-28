export default function ContentBlock({ content }: { content: string }) {
  return <section dangerouslySetInnerHTML={{ __html: content }}></section>;
}
