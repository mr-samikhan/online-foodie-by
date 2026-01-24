export function generateInvoiceNumber() {
  const today = new Date();
  const dateKey = today.toISOString().slice(0, 10); // YYYY-MM-DD

  const counterKey = `invoice-counter-${dateKey}`;

  let counter = Number(localStorage.getItem(counterKey)) || 0;
  counter += 1;

  localStorage.setItem(counterKey, counter);

  const padded = String(counter).padStart(4, "0");

  return `INV-${dateKey.replace(/-/g, "")}-${padded}`;
}
