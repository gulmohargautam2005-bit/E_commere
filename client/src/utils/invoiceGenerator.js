/**
 * LUXE Editorial Invoice Downloader
 * 
 * Streams a high-fidelity vector PDF generated securely on the server
 * directly to the client browser, completely bypassing local canvas/DOM rendering.
 * 
 * @param {string|Object} orderIdOrPayload - The database order ID or order object.
 */
export const downloadLuxeInvoice = async (orderIdOrPayload) => {
  const orderId = typeof orderIdOrPayload === 'string'
    ? orderIdOrPayload
    : (orderIdOrPayload?.id || orderIdOrPayload?._id);

  if (!orderId) {
    console.error("No valid order ID provided for invoice download");
    return;
  }

  try {
    const baseUrl = process.env.REACT_APP_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/order/${orderId}/invoice`);

    if (!res.ok) {
      throw new Error(`Invoice generation failed on server: ${res.statusText}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxe_invoice_${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to download PDF invoice from server:", err);
  }
};
