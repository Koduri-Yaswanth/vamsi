package com.courier.service;

import com.courier.dto.PaymentRequest;
import com.courier.dto.InvoiceResponse;
import com.courier.dto.InvoiceData;
import com.courier.model.Booking;
import com.courier.model.Payment;
import com.courier.model.TransactionStatus;
import com.courier.model.TransactionType;
import com.courier.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PdfService pdfService;

    public Payment processPayment(Booking booking, PaymentRequest request) {
        // Validate card details (simplified validation)
        if (!isValidCardNumber(request.getCardNumber()) || 
            !isValidExpiryDate(request.getExpiryDate()) || 
            !isValidCVV(request.getCvv())) {
            throw new RuntimeException("Invalid card details");
        }

        // Check for demo error card (remove spaces for comparison)
        String cleanCardNumber = request.getCardNumber().replaceAll("\\s", "");
        if ("4000000000000002".equals(cleanCardNumber)) {
            throw new RuntimeException("Insufficient funds");
        }

        // Idempotency: if a payment already exists for this booking, return it instead of creating a new one
        try {
            Optional<Payment> existing = paymentRepository.findByBooking_BookingId(booking.getBookingId());
            if (existing.isPresent()) {
                return existing.get();
            }
        } catch (Exception ignored) {}

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentId("PAY" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setTransactionId("TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setTransactionAmount(booking.getParcelServiceCost());
        payment.setTransactionDate(LocalDateTime.now());
        payment.setTransactionType(TransactionType.CREDIT);
        payment.setTransactionStatus(TransactionStatus.SUCCESS);
        payment.setCardNumber(maskCardNumber(request.getCardNumber()));
        payment.setCardholderName(request.getCardholderName());

        Payment savedPayment = paymentRepository.save(payment);
        // Sanity check
        paymentRepository.findByPaymentId(savedPayment.getPaymentId())
            .orElseThrow(() -> new RuntimeException("Payment was not saved correctly"));
        return savedPayment;
    }

    public InvoiceResponse generateInvoice(String bookingId) {
        try {
            Payment payment = paymentRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> {
                    return new RuntimeException("Payment not found for booking ID: " + bookingId);
                });

            Booking booking = payment.getBooking();
            if (booking == null) {
                return new InvoiceResponse(false, "Booking data not found", null);
            }
            
                    InvoiceData invoiceData = new InvoiceData(
            booking.getBookingId(),
            payment.getPaymentId(),
            payment.getTransactionId(),
            "INV" + booking.getBookingId(),
            booking.getReceiverName(),
            booking.getReceiverAddress(),
            booking.getReceiverMobile(),
            booking.getParcelWeightInGram(),
            booking.getParcelContentsDescription(),
            booking.getParcelDeliveryType().toString(),
            booking.getParcelPackingPreference().toString(),
            booking.getParcelPickupTime(),
            booking.getParcelDropoffTime(),
            booking.getParcelServiceCost(),
            payment.getTransactionDate()
        );

            // set pin if available
            try { invoiceData.setReceiverPin(booking.getReceiverPin()); } catch (Exception ignored) {}

            // Keep totals in sync with what UI shows: payment uses booking.parcelServiceCost
            // So invoiceData.serviceCost (and PDF/Invoice pages) already reflect exact charged amount.

            return new InvoiceResponse(true, "Invoice generated successfully", invoiceData);
        } catch (Exception e) {
            return new InvoiceResponse(false, "Invoice generation failed: " + e.getMessage(), null);
        }
    }

    public byte[] downloadInvoicePdf(String bookingId) {
        Payment payment = paymentRepository.findByBooking_BookingId(bookingId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

        Booking booking = payment.getBooking();
        
        InvoiceData invoiceData = new InvoiceData(
            booking.getBookingId(),
            payment.getPaymentId(),
            payment.getTransactionId(),
            "INV" + booking.getBookingId(),
            booking.getReceiverName(),
            booking.getReceiverAddress(),
            booking.getReceiverMobile(),
            booking.getParcelWeightInGram(),
            booking.getParcelContentsDescription(),
            booking.getParcelDeliveryType().toString(),
            booking.getParcelPackingPreference().toString(),
            booking.getParcelPickupTime(),
            booking.getParcelDropoffTime(),
            booking.getParcelServiceCost(),
            payment.getTransactionDate()
        );
        try { invoiceData.setReceiverPin(booking.getReceiverPin()); } catch (Exception ignored) {}

        return pdfService.generateInvoicePdf(invoiceData);
    }

    // Method to check if payment exists for a booking
    public boolean checkPaymentExists(String bookingId) {
        try {
            Optional<Payment> payment = paymentRepository.findByBooking_BookingId(bookingId);
            return payment.isPresent();
        } catch (Exception e) {
            return false;
        }
    }

    // Method to list all payments (for debugging purposes)
    public void listAllPayments() {
        try {
            List<Payment> payments = paymentRepository.findAll();
            System.out.println("=== All Payments ===");
            System.out.println("Total payments: " + payments.size());
            
            for (Payment payment : payments) {
                System.out.println("Payment ID: " + payment.getPaymentId());
                System.out.println("Transaction ID: " + payment.getTransactionId());
                System.out.println("Amount: " + payment.getTransactionAmount());
                System.out.println("Status: " + payment.getTransactionStatus());
                System.out.println("Date: " + payment.getTransactionDate());
                if (payment.getBooking() != null) {
                    System.out.println("Booking ID: " + payment.getBooking().getBookingId());
                }
                System.out.println("---");
            }
        } catch (Exception e) {
            System.out.println("Error listing payments: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private boolean isValidCardNumber(String cardNumber) {
        if (cardNumber == null) return false;
        String cleanCardNumber = cardNumber.replaceAll("\\s", "");
        return cleanCardNumber.length() == 16 && cleanCardNumber.matches("\\d{16}");
    }

    private boolean isValidExpiryDate(String expiryDate) {
        // Simple validation - can be enhanced
        return expiryDate != null && expiryDate.matches("\\d{2}/\\d{2}");
    }

    private boolean isValidCVV(String cvv) {
        return cvv != null && cvv.matches("\\d{3,4}");
    }

    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null) return "****";
        String cleanCardNumber = cardNumber.replaceAll("\\s", "");
        if (cleanCardNumber.length() < 4) return "****";
        return "****-****-****-" + cleanCardNumber.substring(cleanCardNumber.length() - 4);
    }
} 