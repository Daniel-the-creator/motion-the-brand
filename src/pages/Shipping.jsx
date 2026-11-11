import Button from '../components/ui/Button';
import { useUI } from '../context/UIContext';

const SECTIONS = [
  { title: 'Ordering', body: 'Orders are placed through WhatsApp. Once you send your order message, we confirm availability, delivery cost and payment details with you directly.' },
  { title: 'Delivery within Nigeria', body: 'Lagos: 1–3 working days. Other states: 3–7 working days. Delivery fees depend on your location and are confirmed on WhatsApp.' },
  { title: 'International shipping', body: 'We ship worldwide on request. Message us with your location and we will quote shipping and delivery times.' },
  { title: 'Exchanges', body: 'Wrong size? Message us within 7 days of delivery. Items must be unworn with tags attached.' },
];

export default function Shipping() {
  const { openSizeGuide } = useUI();
  return (
    <div className="container-x pb-10 pt-32 md:pt-40">
      <p className="eyebrow mb-3">Information</p>
      <h1 className="display text-5xl md:text-9xl">Shipping</h1>
      <div className="mt-14 grid max-w-4xl gap-px border border-line bg-line md:grid-cols-2">
        {SECTIONS.map((s) => (
          <div key={s.title} className="bg-surface p-8">
            <h2 className="display text-2xl">{s.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex gap-3">
        <Button onClick={openSizeGuide} variant="outline">Size guide</Button>
        <Button to="/contact" variant="ghost">Contact us</Button>
      </div>
    </div>
  );
}

