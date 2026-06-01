const express = require("express");
const { Order } = require("../models/order");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const orderList = await Order.find(req.query);
        if (!orderList) {
            return res.status(500).json({ success: false });
        }
        return res.status(200).json(orderList);
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found.", success: false });
        }
        return res.status(200).json(order);
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }
});

router.get("/:id/invoice", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found.", success: false });
        }

        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="luxe_invoice_${order.paymentId || order._id}.pdf"`);

        doc.pipe(res);

        // --- LUXE Editorial Styles & Formatting ---
        // Brand logo header
        doc.font('Helvetica-Bold').fontSize(32).fillColor('#111111').text('LUXE', 50, 50);
        doc.font('Helvetica').fontSize(9).fillColor('#666666').text('CURATED FASHION EDITORIAL', 50, 90);

        // Document Meta (Top Right)
        doc.font('Helvetica-Bold').fontSize(18).fillColor('#111111').text('INVOICE', 350, 50, { align: 'right' });
        doc.font('Helvetica').fontSize(9).fillColor('#666666')
           .text(`Date: ${order.date || new Date(order.createdAt).toLocaleDateString()}`, 350, 75, { align: 'right' })
           .text(`Payment Ref: ${order.paymentId || 'N/A'}`, 350, 88, { align: 'right' });

        // Line Rule
        doc.moveTo(50, 115).lineTo(545, 115).strokeColor('#c4c7c7').lineWidth(1).stroke();

        // Details Layout
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#666666').text('BILLING DETAILS', 50, 135);
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#666666').text('PAYMENT DETAILS', 330, 135);

        const name = order.name || (order.billingDetails ? `${order.billingDetails.firstName} ${order.billingDetails.lastName}` : "Valued Customer");
        const address = order.address || order.billingDetails?.streetAddress1 || "N/A";
        const pincode = order.pincode || order.billingDetails?.postcode || "N/A";
        const phone = order.phoneNumber || order.billingDetails?.phone || "N/A";
        const email = order.email || order.billingDetails?.email || "N/A";

        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1b1c1c').text(name, 50, 155);
        doc.font('Helvetica').fontSize(10).fillColor('#444748')
           .text(address, 50, 170, { width: 250 })
           .text(`Pincode: ${pincode}`, 50, 205)
           .text(`Phone: ${phone}`, 50, 220)
           .text(`Email: ${email}`, 50, 235);

        doc.font('Helvetica-Bold').fontSize(11).fillColor('#1b1c1c').text('Razorpay Secure Online', 330, 155);
        doc.font('Helvetica').fontSize(10).fillColor('#444748')
           .text('Method: Online Digital Wallet', 330, 170)
           .text('Status: CAPTURED & SETTLED', 330, 185);

        // Table Header Line
        doc.moveTo(50, 265).lineTo(545, 265).strokeColor('#1b1c1c').lineWidth(2).stroke();

        // Table Column Labels
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#666666');
        doc.text('ITEM DESCRIPTION', 50, 278);
        doc.text('QTY', 340, 278, { width: 40, align: 'center' });
        doc.text('PRICE', 390, 278, { width: 70, align: 'right' });
        doc.text('TOTAL', 475, 278, { width: 70, align: 'right' });

        doc.moveTo(50, 292).lineTo(545, 292).strokeColor('#1b1c1c').lineWidth(1).stroke();

        // Table Items
        const items = order.items || order.products || [];
        let currentY = 305;

        items.forEach(item => {
            // Page breakdown checking (avoid trailing table cells)
            if (currentY > 680) {
                doc.addPage();
                doc.moveTo(50, 50).lineTo(545, 50).strokeColor('#1b1c1c').lineWidth(1).stroke();
                currentY = 65;
            }

            const title = item.title || "Luxury Goods Selection";
            const qty = item.quantity || 1;
            const price = item.price || 0;
            const subtotal = item.subtotal || (price * qty);

            doc.font('Helvetica-Bold').fontSize(10).fillColor('#1b1c1c').text(title, 50, currentY, { width: 270 });
            doc.font('Helvetica').fontSize(8).fillColor('#666666').text('Curated Fashion Selection', 50, currentY + 13);

            doc.font('Helvetica').fontSize(10).fillColor('#1b1c1c')
               .text(qty.toString(), 340, currentY, { width: 40, align: 'center' })
               .text(`Rs ${price.toLocaleString("en-IN")}`, 390, currentY, { width: 70, align: 'right' })
               .text(`Rs ${subtotal.toLocaleString("en-IN")}`, 475, currentY, { width: 70, align: 'right' });

            doc.moveTo(50, currentY + 28).lineTo(545, currentY + 28).strokeColor('#efeded').lineWidth(1).stroke();
            currentY += 40;
        });

        // Totals Box
        const ordSubtotal = order.subtotal || order.total || order.amount || 0;
        const ordShipping = order.shipping !== undefined ? order.shipping : 0;
        const ordTotal = order.total || order.amount || 0;

        if (currentY > 600) {
            doc.addPage();
            currentY = 60;
        }

        currentY += 15;
        doc.font('Helvetica').fontSize(10).fillColor('#666666').text('Subtotal', 330, currentY);
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#1b1c1c').text(`Rs ${ordSubtotal.toLocaleString("en-IN")}`, 455, currentY, { width: 90, align: 'right' });

        currentY += 18;
        doc.font('Helvetica').fontSize(10).fillColor('#666666').text('Shipping', 330, currentY);
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#1b1c1c').text(ordShipping === 0 ? 'FREE' : `Rs ${ordShipping.toLocaleString("en-IN")}`, 455, currentY, { width: 90, align: 'right' });

        currentY += 22;
        doc.moveTo(330, currentY - 5).lineTo(545, currentY - 5).strokeColor('#c4c7c7').lineWidth(1).stroke();
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#111111').text('Total Amount', 330, currentY);
        doc.font('Helvetica-Bold').fontSize(15).fillColor('#111111').text(`Rs ${ordTotal.toLocaleString("en-IN")}`, 435, currentY - 3, { width: 110, align: 'right' });

        // Footer Section
        doc.moveTo(50, 715).lineTo(545, 715).strokeColor('#c4c7c7').lineWidth(1).stroke();
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#111111').text('LUXE EDITORIAL', 50, 730, { align: 'center' });
        doc.font('Helvetica').fontSize(8).fillColor('#888888').text('Thank you for your acquisition. For assistance, contact customercare@luxe.com', 50, 745, { align: 'center' });

        doc.end();
    } catch (err) {
        console.error("Backend PDF generation failed:", err);
        return res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }
});

router.post("/create", async (req, res) => {
    try {
        let order = new Order({
            userId: req.body.userId,
            items: req.body.items,
            billingDetails: req.body.billingDetails,
            paymentMethod: req.body.paymentMethod,
            paymentId: req.body.paymentId,
            subtotal: req.body.subtotal,
            shipping: req.body.shipping,
            total: req.body.total,
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            pincode: req.body.pincode,
            amount: req.body.amount,
            email: req.body.email,
            products: req.body.products,
            date: req.body.date
        });

        order = await order.save();
        return res.status(201).json({
            success: true,
            order: order
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }
});

module.exports = router;
