# Skill Guide: Server-Side Vector PDF Invoice Generation & Streaming

This guide outlines the standard operating pattern for implementing secure, high-fidelity, server-side PDF transaction receipt generators and streamed downloads.

---

## 1. Architectural Concept

Always decouple print-rendering from the frontend client viewport. Instead of converting DOM structures via HTML5 canvas captures (which exposes customer data, limits styling control, and violates strict CSP policies), utilize the **Secure Server-Side Vector Pipeline**:

```
[Customer Clicks INVOICE] 
          ↓
[Client fetch]  —————— GET /api/order/:id/invoice —————→ [Express Backend Router]
                                                                  ↓
                                                       [Fetch Order from DB]
                                                                  ↓
                                                       [Compile Vector PDF via pdfkit]
                                                                  ↓
[Download anchor click] ← Stream PDF Blob (application/pdf) ← [Pipe directly to res]
```

---

## 2. Server-Side Pattern (`pdfkit`)

Ensure all vector layout operations are calculated programmatically inside the Node.js Express router.

### Setup & Headers
Initialize the `PDFDocument` and stream the binary stream directly with attachment headers:

```javascript
const PDFDocument = require('pdfkit');
const doc = new PDFDocument({ margin: 50, size: 'A4' });

res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', `attachment; filename="invoice_${orderId}.pdf"`);
doc.pipe(res);
```

### Layout Calculation & Cursor Management
Manage layout cursor coordinates (`currentY`) programmatically to support dynamic lists and automatic page-break detection:

```javascript
let currentY = 300;

items.forEach(item => {
    // Prevent trailing item cells by checking current position
    if (currentY > 680) {
        doc.addPage();
        doc.moveTo(50, 50).lineTo(545, 50).strokeColor('#1b1c1c').lineWidth(1).stroke();
        currentY = 65;
    }

    // Draw item titles and price structures
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#111111').text(item.title, 50, currentY);
    doc.font('Helvetica').fontSize(10).text(item.quantity.toString(), 340, currentY, { align: 'center' });
    
    // Bottom border row divider
    doc.moveTo(50, currentY + 28).lineTo(545, currentY + 28).strokeColor('#efeded').lineWidth(1).stroke();
    currentY += 40;
});
```

### Finalization
Always finalize the stream with:
```javascript
doc.end();
```

---

## 3. Client-Side Pattern (Blob Stream)

Keep the client-side code completely isolated from screenshotting scripts or DOM manipulations. Invoke a native streaming download with the following 25-line pattern:

```javascript
export const downloadLuxeInvoice = async (orderId) => {
  if (!orderId) return;

  try {
    const baseUrl = process.env.REACT_APP_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/order/${orderId}/invoice`);
    
    if (!res.ok) {
      throw new Error(`Server generation failed: ${res.statusText}`);
    }

    // Download stream as a binary blob
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Trigger direct silent download via a temporary link
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxe_invoice_${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to stream PDF invoice:", err);
  }
};
```

---

## 4. Key Advantages

1. **Security**: Customer billing information is queried and formatted strictly on the secure server layer. No unverified packages or scripts are injected into the frontend.
2. **Visual Fidelity**: `pdfkit` draws vector geometry directly into the document, producing razor-sharp text and borders at any screen zoom scale.
3. **No Dynamic Layout Glitches**: Bypasses viewport cropping, scrolled coordinates offset bugs, CORS image blockages, and CSS layout shifting completely.
