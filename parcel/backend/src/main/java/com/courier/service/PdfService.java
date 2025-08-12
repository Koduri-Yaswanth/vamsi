package com.courier.service;

import com.courier.dto.InvoiceData;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {
    
    private static final Logger logger = LoggerFactory.getLogger(PdfService.class);

    public byte[] generateInvoicePdf(InvoiceData invoiceData) {
        logger.info("Starting PDF generation for booking: {}", invoiceData.getBookingId());
        
        // Try HTML to PDF first (better UI matching)
        try {
            return generateHtmlPdf(invoiceData);
        } catch (Exception e) {
            logger.warn("HTML to PDF generation failed, falling back to iText7: {}", e.getMessage());
            
            // Fallback to iText7 PDF generation
            try {
                return generateItextPdf(invoiceData);
            } catch (Exception fallbackError) {
                logger.error("Both PDF generation methods failed for booking: {}", invoiceData.getBookingId(), fallbackError);
                throw new RuntimeException("Failed to generate PDF invoice. Please try again later.", fallbackError);
            }
        }
    }

    private byte[] generateHtmlPdf(InvoiceData invoiceData) throws Exception {
        logger.debug("Generating HTML-based PDF for booking: {}", invoiceData.getBookingId());
        
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            String html = buildHtmlInvoice(invoiceData);
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(baos);
            builder.run();
            
            byte[] result = baos.toByteArray();
            logger.info("HTML PDF generated successfully for booking: {}, size: {} bytes", 
                       invoiceData.getBookingId(), result.length);
            return result;
        } catch (Exception e) {
            logger.error("HTML PDF generation failed for booking: {}", invoiceData.getBookingId(), e);
            throw e;
        }
    }

    private byte[] generateItextPdf(InvoiceData invoiceData) throws Exception {
        logger.debug("Generating iText7-based PDF for booking: {}", invoiceData.getBookingId());
        
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PdfWriter writer = new PdfWriter(baos);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf)) {
            
            // Add content to PDF
            addHeader(document, invoiceData);
            addInvoiceDetails(document, invoiceData);
            addReceiverInfo(document, invoiceData);
            addParcelInfo(document, invoiceData);
            addTimingInfo(document, invoiceData);
            addPaymentInfo(document, invoiceData);
            addFooter(document);
            
            document.close();
            
            byte[] result = baos.toByteArray();
            logger.info("iText7 PDF generated successfully for booking: {}, size: {} bytes", 
                       invoiceData.getBookingId(), result.length);
            return result;
        } catch (Exception e) {
            logger.error("iText7 PDF generation failed for booking: {}", invoiceData.getBookingId(), e);
            throw e;
        }
    }

    private String buildHtmlInvoice(InvoiceData d) {
        String css = """
          <style>
            body{font-family: Arial, Helvetica, sans-serif; color:#0f172a;}
            .container{max-width:900px;margin:24px auto;padding:0 16px;}
            .header{text-align:center;margin-bottom:24px}
            .badge{display:inline-flex;align-items:center;gap:8px;background:#0891b2;color:#fff;padding:6px 12px;border-radius:9999px;font-size:12px}
            h1{font-size:28px;margin:10px 0}
            .card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;margin-bottom:16px}
            .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
            .row{display:flex;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding:8px 0}
            .row:last-child{border-bottom:none}
            .label{color:#64748b;font-weight:600}
            .value{color:#0f172a;font-weight:600}
            .section-title{display:flex;align-items:center;gap:8px;margin-bottom:12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px}
            .total{background:linear-gradient(135deg,#0891b2,#0e7490);color:#fff;border-color:#0891b2}
          </style>
        """;

        String invoiceDetails = htmlCard(
            "Invoice Details",
            new String[][]{
                {"Booking ID", safe(d.getBookingId())},
                {"Payment ID", safe(d.getPaymentId())},
                {"Transaction ID", safe(d.getTransactionId())},
                {"Invoice Number", safe(d.getInvoiceNumber())}
            }
        );

        String receiver = htmlCard(
            "Receiver Information",
            new String[][]{
                {"Name", safe(d.getReceiverName())},
                {"Phone", safe(d.getReceiverMobile())},
                {"Address", safe(d.getReceiverAddress())},
                {"PIN Code", safe(d.getReceiverPin())}
            }
        );

        String parcel = htmlCard(
            "Parcel Information",
            new String[][]{
                {"Weight", safe(d.getParcelWeight() != null ? d.getParcelWeight()+"g" : "")},
                {"Contents", safe(d.getParcelContents())},
                {"Delivery Type", safe(d.getDeliveryType())},
                {"Packing Preference", safe(d.getPackingPreference())}
            }
        );

        String timing = htmlCard(
            "Timing Information",
            new String[][]{
                {"Pickup Time", safeDate(d.getPickupTime())},
                {"Drop-off Time", safeDate(d.getDropoffTime())},
                {"Payment Time", safeDate(d.getPaymentTime())}
            }
        );

        String payment = htmlCard(
            "Payment Information",
            new String[][]{
                {"Service Cost", "₹" + safe(d.getServiceCost() != null ? d.getServiceCost().toString() : "")},
                {"Payment Type", "Credit/Debit Card"},
                {"Status", "PAID"}
            }
        );

        StringBuilder page = new StringBuilder();
        page.append("<html><head>");
        page.append(css);
        page.append("</head><body><div class='container'>");
        page.append("<div class='header'><div class='badge'>Invoice</div><h1>Invoice & Receipt</h1></div>");
        page.append(invoiceDetails).append(receiver).append(parcel).append(timing).append(payment);
        page.append("</div></body></html>");
        return page.toString();
    }

    private String htmlCard(String title, String[][] rows){
        StringBuilder sb = new StringBuilder();
        sb.append("<div class='card'>");
        sb.append("<div class='section-title'><span>"+title+"</span></div>");
        for(String[] r: rows){
            sb.append("<div class='row'><div class='label'>"+r[0]+"</div><div class='value'>"+r[1]+"</div></div>");
        }
        sb.append("</div>");
        return sb.toString();
    }

    private void addHeader(Document document, InvoiceData invoiceData) throws Exception {
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        // Company header
        Paragraph companyHeader = new Paragraph("COURIER SERVICE MANAGEMENT")
            .setFont(boldFont)
            .setFontSize(20)
            .setFontColor(ColorConstants.DARK_GRAY);
        document.add(companyHeader);

        // Invoice title
        Paragraph invoiceTitle = new Paragraph("INVOICE")
            .setFont(boldFont)
            .setFontSize(16)
            .setFontColor(ColorConstants.BLUE);
        document.add(invoiceTitle);

        // Invoice number
        Paragraph invoiceNumber = new Paragraph("Invoice #: " + invoiceData.getInvoiceNumber())
            .setFont(regularFont)
            .setFontSize(12);
        document.add(invoiceNumber);

        document.add(new Paragraph(""));
    }

    private void addInvoiceDetails(Document document, InvoiceData invoiceData) throws Exception {
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        Paragraph sectionTitle = new Paragraph("INVOICE DETAILS")
            .setFont(boldFont)
            .setFontSize(14)
            .setFontColor(ColorConstants.BLUE);
        document.add(sectionTitle);

        Table table = new Table(2).useAllAvailableWidth();
        
        addTableRow(table, "Booking ID", invoiceData.getBookingId(), boldFont, regularFont);
        addTableRow(table, "Payment ID", invoiceData.getPaymentId(), boldFont, regularFont);
        addTableRow(table, "Transaction ID", invoiceData.getTransactionId(), boldFont, regularFont);
        addTableRow(table, "Invoice Number", invoiceData.getInvoiceNumber(), boldFont, regularFont);

        document.add(table);
        document.add(new Paragraph(""));
    }

    private void addReceiverInfo(Document document, InvoiceData invoiceData) throws Exception {
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        Paragraph sectionTitle = new Paragraph("RECEIVER INFORMATION")
            .setFont(boldFont)
            .setFontSize(14)
            .setFontColor(ColorConstants.BLUE);
        document.add(sectionTitle);

        Table table = new Table(2).useAllAvailableWidth();
        
        addTableRow(table, "Name", invoiceData.getReceiverName(), boldFont, regularFont);
        addTableRow(table, "Address", invoiceData.getReceiverAddress(), boldFont, regularFont);
        addTableRow(table, "Mobile", invoiceData.getReceiverMobile(), boldFont, regularFont);
        addTableRow(table, "PIN Code", safe(invoiceData.getReceiverPin()), boldFont, regularFont);

        document.add(table);
        document.add(new Paragraph(""));
    }

    private void addParcelInfo(Document document, InvoiceData invoiceData) throws Exception {
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        Paragraph sectionTitle = new Paragraph("PARCEL INFORMATION")
            .setFont(boldFont)
            .setFontSize(14)
            .setFontColor(ColorConstants.BLUE);
        document.add(sectionTitle);

        Table table = new Table(2).useAllAvailableWidth();
        
        addTableRow(table, "Weight", invoiceData.getParcelWeight() + "g", boldFont, regularFont);
        addTableRow(table, "Contents", invoiceData.getParcelContents(), boldFont, regularFont);
        addTableRow(table, "Delivery Type", invoiceData.getDeliveryType(), boldFont, regularFont);
        addTableRow(table, "Packing Preference", invoiceData.getPackingPreference(), boldFont, regularFont);

        document.add(table);
        document.add(new Paragraph(""));
    }

    private void addTimingInfo(Document document, InvoiceData invoiceData) throws Exception {
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        Paragraph sectionTitle = new Paragraph("TIMING INFORMATION")
            .setFont(boldFont)
            .setFontSize(14)
            .setFontColor(ColorConstants.BLUE);
        document.add(sectionTitle);

        Table table = new Table(2).useAllAvailableWidth();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        
        String pickupTime = invoiceData.getPickupTime() != null ? 
            invoiceData.getPickupTime().format(formatter) : "Not scheduled";
        String dropoffTime = invoiceData.getDropoffTime() != null ? 
            invoiceData.getDropoffTime().format(formatter) : "Not scheduled";
        String paymentTime = invoiceData.getPaymentTime() != null ? 
            invoiceData.getPaymentTime().format(formatter) : "Not available";
        
        addTableRow(table, "Pickup Time", pickupTime, boldFont, regularFont);
        addTableRow(table, "Drop-off Time", dropoffTime, boldFont, regularFont);
        addTableRow(table, "Payment Time", paymentTime, boldFont, regularFont);

        document.add(table);
        document.add(new Paragraph(""));
    }

    private void addPaymentInfo(Document document, InvoiceData invoiceData) throws Exception {
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        Paragraph sectionTitle = new Paragraph("PAYMENT INFORMATION")
            .setFont(boldFont)
            .setFontSize(14)
            .setFontColor(ColorConstants.BLUE);
        document.add(sectionTitle);

        Table table = new Table(2).useAllAvailableWidth();
        
        addTableRow(table, "Service Cost", "₹" + invoiceData.getServiceCost(), boldFont, regularFont);
        addTableRow(table, "Payment Type", "Credit/Debit Card", boldFont, regularFont);
        addTableRow(table, "Status", "PAID", boldFont, regularFont);

        document.add(table);
        document.add(new Paragraph(""));
    }

    private void addFooter(Document document) throws Exception {
        PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

        Paragraph footer = new Paragraph("Thank you for choosing our courier service!")
            .setFont(regularFont)
            .setFontSize(10)
            .setFontColor(ColorConstants.GRAY);
        document.add(footer);
    }

    private void addTableRow(Table table, String label, String value, PdfFont boldFont, PdfFont regularFont) {
        Cell labelCell = new Cell().add(new Paragraph(label).setFont(boldFont));
        Cell valueCell = new Cell().add(new Paragraph(value != null ? value : "").setFont(regularFont));
        
        labelCell.setBorder(null);
        valueCell.setBorder(null);
        
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private String safe(String v) {
        return v == null ? "" : v;
    }

    private String safeDate(java.time.LocalDateTime dt) {
        if (dt == null) return "";
        java.time.format.DateTimeFormatter f = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return dt.format(f);
    }
} 