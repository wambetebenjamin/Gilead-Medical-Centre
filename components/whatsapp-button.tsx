import { MessageCircle } from "@/components/icons";

export function WhatsAppButton() {
  const message = "Hello! I would like to book an appointment at Gilead Medical Centre.";
  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/254112272061?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Book an appointment or enquire about services on WhatsApp"
    >
      <span className="whatsapp-float__tooltip">Book an appointment or enquire about services</span>
      <MessageCircle size={23} aria-hidden="true" />
    </a>
  );
}
