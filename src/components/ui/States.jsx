import { Loader2 } from 'lucide-react';
import Button from './Button';

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted" role="status" aria-label={label}>
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-card" />
          <div className="mt-3 h-3 w-3/4 bg-card" />
          <div className="mt-2 h-3 w-1/3 bg-card" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, message, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <h3 className="display text-2xl md:text-3xl">{title}</h3>
      {message && <p className="mt-3 max-w-md text-sm text-muted">{message}</p>}
      {actionLabel && (
        <div className="mt-8">
          {actionTo ? <Button to={actionTo} variant="outline">{actionLabel}</Button> : <Button onClick={onAction} variant="outline">{actionLabel}</Button>}
        </div>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return <EmptyState title="Something went wrong" message={message} actionLabel="Try again" onAction={onRetry} />;
}

