import { motion } from 'framer-motion';

const DEFAULT_ITEMS = [
  'BUILT TO MOVE',
  'DROP 001 — LIVE NOW',
  'HEAVYWEIGHT LUXURY STREETWEAR',
  'LIMITED NUMBERS · NEVER RESTOCKED',
  'WE DON’T FOLLOW MOVEMENT. WE CREATE IT.',
  'INSTANT ORDERING VIA WHATSAPP',
];

export default function Marquee({ items = DEFAULT_ITEMS, speed = 28, dark = false }) {
  const row = [...items, ...items, ...items];
  return (
    <div
      className={`relative overflow-hidden border-y border-line py-3.5 select-none ${
        dark ? 'bg-ink text-white' : 'bg-surface text-accent'
      }`}
      aria-hidden="true"
    >
      <motion.div
        className="flex w-max items-center gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {row.map((text, i) => (
          <span key={i} className="inline-flex items-center gap-10 text-[0.68rem] font-medium uppercase tracking-[0.32em]">
            <span>{text}</span>
            <span className="h-1 w-1 bg-white/50" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

