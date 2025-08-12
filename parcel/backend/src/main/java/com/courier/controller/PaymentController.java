package com.courier.controller;

import com.courier.dto.PaymentRequest;
import com.courier.dto.PaymentResponse;
import com.courier.dto.InvoiceResponse;
import com.courier.model.Booking;
import com.courier.model.Payment;
import com.courier.model.ParcelStatus;
import com.courier.service.BookingService;
import com.courier.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.courier.model.DeliveryType;
import com.courier.model.PackingPreference;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.courier.dto.InvoiceData;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request) {
        System.out.println("=== Payment Request Debug ===");
        System.out.println("Booking ID: " + request.getBookingId());
        System.out.println("Card Number: " + request.getCardNumber());
        System.out.println("Cardholder Name: " + request.getCardholderName());
        System.out.println("Expiry Date: " + request.getExpiryDate());
        System.out.println("CVV: " + request.getCvv());
        
        try {
            // Validate booking exists
            Booking booking = bookingService.getBookingById(request.getBookingId());
            if (booking == null) {
                System.out.println("Booking not found for ID: " + request.getBookingId());
                return ResponseEntity.badRequest()
                    .body(new PaymentResponse(false, "Booking not found", null));
            }

            System.out.println("Booking found: " + booking.getBookingId());
            System.out.println("Booking amount: " + booking.getParcelServiceCost());

            // Process payment
            Payment payment = paymentService.processPayment(booking, request);
            
            // Update booking status to BOOKED
            booking.setParcelStatus(ParcelStatus.BOOKED);
            bookingService.updateBooking(booking);

            PaymentResponse response = new PaymentResponse(
                true,
                "Payment processed successfully",
                payment
            );
            
            System.out.println("Payment processed successfully");
            System.out.println("Payment ID: " + payment.getPaymentId());
            System.out.println("Transaction ID: " + payment.getTransactionId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Payment error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new PaymentResponse(false, "Payment failed: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{bookingId}/invoice")
    public ResponseEntity<InvoiceResponse> generateInvoice(@PathVariable String bookingId) {
        System.out.println("=== PaymentController.generateInvoice ===");
        System.out.println("Request for invoice with booking ID: " + bookingId);
        
        try {
            InvoiceResponse invoice = paymentService.generateInvoice(bookingId);
            System.out.println("Invoice generated successfully");
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            System.out.println("Invoice generation failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new InvoiceResponse(false, "Invoice generation failed: " + e.getMessage(), null));
        }
    }

    @GetMapping("/invoice/{bookingId}/download")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable String bookingId) {
        System.out.println("=== PaymentController.downloadInvoicePdf ===");
        System.out.println("Request to download invoice PDF for booking ID: " + bookingId);
        
        try {
            // Validate booking ID
            if (bookingId == null || bookingId.trim().isEmpty()) {
                System.out.println("Invalid booking ID provided: " + bookingId);
                return ResponseEntity.badRequest().build();
            }
            
            // Generate PDF
            byte[] pdfBytes = paymentService.downloadInvoicePdf(bookingId);
            
            if (pdfBytes == null || pdfBytes.length == 0) {
                System.out.println("PDF generation returned null or empty bytes for booking: " + bookingId);
                return ResponseEntity.status(500).build();
            }
            
            System.out.println("PDF generated successfully for booking: " + bookingId + ", size: " + pdfBytes.length + " bytes");
            
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=\"invoice_" + bookingId + ".pdf\"")
                .header("Content-Length", String.valueOf(pdfBytes.length))
                .body(pdfBytes);
                
        } catch (Exception e) {
            System.out.println("Error downloading invoice PDF for booking " + bookingId + ": " + e.getMessage());
            e.printStackTrace();
            
            // Return more specific error based on exception type
            if (e.getMessage() != null && e.getMessage().contains("Payment not found")) {
                return ResponseEntity.status(404).build();
            } else if (e.getMessage() != null && e.getMessage().contains("Failed to generate PDF")) {
                return ResponseEntity.status(500).build();
            } else {
                return ResponseEntity.status(500).build();
            }
        }
    }

    @GetMapping("/debug/payments")
    public ResponseEntity<String> listAllPayments() {
        try {
            paymentService.listAllPayments();
            return ResponseEntity.ok("Check console for payment list");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/debug/payment/{bookingId}")
    public ResponseEntity<String> checkPaymentForBooking(@PathVariable String bookingId) {
        try {
            boolean paymentExists = paymentService.checkPaymentExists(bookingId);
            if (paymentExists) {
                return ResponseEntity.ok("Payment found for booking ID: " + bookingId);
            } else {
                return ResponseEntity.ok("No payment found for booking ID: " + bookingId);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/debug/create-test-payment")
    public ResponseEntity<String> createTestPayment() {
        try {
            // Create a test booking
            Booking testBooking = new Booking();
            testBooking.setBookingId("BK1754422694940"); // Use the specific booking ID from the error
            testBooking.setReceiverName("Test Receiver");
            testBooking.setReceiverAddress("123 Test Street, Test City");
            testBooking.setReceiverMobile("9876543210");
            testBooking.setParcelWeightInGram(1000);
            testBooking.setParcelContentsDescription("Test Package");
            testBooking.setParcelDeliveryType(DeliveryType.EXPRESS);
            testBooking.setParcelPackingPreference(PackingPreference.BASIC);
            testBooking.setParcelServiceCost(new BigDecimal("250.00"));
            
            // Save the booking
            Booking savedBooking = bookingService.createBooking(testBooking);
            
            // Create a test payment
            PaymentRequest testRequest = new PaymentRequest();
            testRequest.setBookingId("BK1754422694940");
            testRequest.setCardNumber("4111111111111111");
            testRequest.setCardholderName("Test User");
            testRequest.setExpiryDate("12/25");
            testRequest.setCvv("123");
            
            Payment testPayment = paymentService.processPayment(savedBooking, testRequest);
            
            return ResponseEntity.ok("Test payment created successfully. Payment ID: " + testPayment.getPaymentId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating test payment: " + e.getMessage());
        }
    }

    @GetMapping("/test/pdf-generation")
    public ResponseEntity<String> testPdfGeneration() {
        try {
            // Test PDF generation with sample data
            InvoiceData testData = new InvoiceData(
                "TEST123",
                "PAY123",
                "TXN123",
                "INV123",
                "Test Receiver",
                "Test Address",
                "1234567890",
                1000,
                "Test Package",
                "EXPRESS",
                "BASIC",
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(1),
                new BigDecimal("250.00"),
                LocalDateTime.now()
            );
            
            byte[] pdfBytes = paymentService.downloadInvoicePdf("BK1754422694940");
            
            if (pdfBytes != null && pdfBytes.length > 0) {
                return ResponseEntity.ok("PDF generation test successful! Generated " + pdfBytes.length + " bytes");
            } else {
                return ResponseEntity.status(500).body("PDF generation test failed - no bytes generated");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("PDF generation test failed: " + e.getMessage());
        }
    }
} 