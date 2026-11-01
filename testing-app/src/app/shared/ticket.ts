import { QueueTicket } from './models';
import { code39Svg } from './code39';

/** Value stored in the barcode, e.g. 20261101-A001 (unique per day + number). */
export function ticketBarcodeValue(ticket: QueueTicket): string {
  return ticket.queueDate.replace(/-/g, '') + '-' + ticket.queueNumber;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Inner HTML of the ticket (used for both the on-screen preview and the printout). */
export function ticketHtml(ticket: QueueTicket, hospitalName: string): string {
  return `
  <div class="ticket">
    <div class="t-hospital">${hospitalName}</div>
    <div class="t-line"></div>
    <div class="t-label">Nomor Antrian anda :</div>
    <div class="t-number">${ticket.queueNumber}</div>
    <div class="t-wait">Mohon Menunggu</div>
    <div class="t-barcode">${code39Svg(ticketBarcodeValue(ticket), 1, 60)}</div>
    <div class="t-date">${formatDateTime(ticket.createdAt)}</div>
    <div class="t-line"></div>
    <div class="t-footer">Budayakan antri untuk kenyamanan bersama<br>Terima Kasih atas kunjungan anda</div>
  </div>`;
}

export const TICKET_CSS = `
  .ticket { width: 300px; margin: 0 auto; padding: 12px 8px; background: #fff; color: #000;
            font-family: 'Times New Roman', Times, serif; text-align: center; }
  .t-hospital { font-size: 22px; font-weight: bold; letter-spacing: 1px; }
  .t-line { border-top: 3px solid #000; margin: 4px 0; }
  .t-label { font-size: 16px; }
  .t-number { font-size: 72px; font-weight: bold; line-height: 1.1; margin: 6px 0; }
  .t-wait { font-size: 18px; margin-bottom: 8px; }
  .t-barcode svg { width: 100%; height: 60px; display: block; }
  .t-date { font-size: 16px; margin-top: 4px; }
  .t-footer { font-size: 14px; font-weight: bold; margin-top: 4px; }
`;

/**
 * Prints the ticket through a hidden iframe, so only the ticket is printed
 * and the browser does not block it as a pop-up.
 */
export function printTicket(ticket: QueueTicket, hospitalName: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<!doctype html><html><head><title>Queue ${ticket.queueNumber}</title>
    <style>@page { size: 80mm auto; margin: 4mm; } body { margin: 0; } ${TICKET_CSS}</style>
    </head><body>${ticketHtml(ticket, hospitalName)}</body></html>`);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  }, 250);
}
