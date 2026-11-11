import { EmptyState } from '../components/ui/States';

export default function NotFound() {
  return <div className="pt-32"><EmptyState title="404 — Lost in motion" message="The page you are looking for does not exist." actionLabel="Back home" actionTo="/" /></div>;
}

