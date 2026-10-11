import type { ReactNode } from 'react';

/** Renders `**bold**` spans as React elements, so model output is never injected as HTML. */
function inline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    );
}

/** A deliberately small Markdown subset: headings, bullet lists, paragraphs and bold. */
export function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${String(blocks.length)}`}>
        {bullets.map((b, i) => (
          <li key={i}>{inline(b)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  for (const line of text.split('\n')) {
    const heading = /^#{1,4}\s+(.*)$/.exec(line);
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    if (bullet?.[1] !== undefined) {
      bullets.push(bullet[1]);
      continue;
    }
    flushBullets();
    if (heading?.[1] !== undefined) {
      blocks.push(<h4 key={blocks.length}>{inline(heading[1])}</h4>);
    } else if (line.trim()) {
      blocks.push(<p key={blocks.length}>{inline(line)}</p>);
    }
  }
  flushBullets();

  return <div className="prose">{blocks}</div>;
}
