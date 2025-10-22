import QRCode from 'qrcode';
import type { Ticket, EventItem } from '../types/models';
import type { User } from '../types/auth';

export type TicketQrPayload = {
  v: 1;
  ticket: {
    id: number;
    status: string;
    price: number | null;
  };
  event: {
    id: number;
    title: string | null;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    category: string | null;
  };
  user: {
    id: number | null;
    name: string | null;
    email: string | null;
  };
  generated_at: string;
};

export function buildTicketQrPayload(
  ticket: Ticket,
  user: User | null
): TicketQrPayload {
  const ev: EventItem | undefined = ticket.event as any;
  return {
    v: 1,
    ticket: {
      id: ticket.id!,
      status: ticket.status,
      price: ticket.price ?? null,
    },
    event: {
      id: ticket.event_id!,
      title: ev?.title ?? null,
      start_time: ev?.start_time ?? null,
      end_time: ev?.end_time ?? null,
      location: ev?.location ?? null,
      category: ev?.category?.name ?? null,
    },
    user: {
      id: user?.id ?? null,
      name: user?.name ?? null,
      email: user?.email ?? null,
    },
    generated_at: new Date().toISOString(),
  };
}

function safeFileName(s: string) {
  return s
    .normalize('NFKD')
    .replace(/[^\w\-.]+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 80);
}

export async function payloadToPngDataUrl(
  payload: TicketQrPayload,
  width = 512
): Promise<string> {
  const text = JSON.stringify(payload);
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width,
    color: { dark: '#000000', light: '#ffffff' },
  });
}

export async function downloadTicketQrPng(
  ticket: Ticket,
  user: User | null,
  width = 512
) {
  const payload = buildTicketQrPayload(ticket, user);
  const dataUrl = await payloadToPngDataUrl(payload, width);

  const title = (ticket.event as any)?.title || `event_${ticket.event_id}`;
  const fileName = safeFileName(`${title}_ticket-${ticket.id}.png`);

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
