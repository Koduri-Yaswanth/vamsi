package com.courier.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Booking Entity Class
 * 
 * This class represents a parcel booking in our courier management system.
 * It maps to the "bookings" table in the database and contains all the information
 * about a customer's parcel booking including sender, receiver, parcel details,
 * delivery preferences, and tracking information.
 * 
 * Key Concepts:
 * - @Entity: Marks this class as a JPA entity that maps to a database table
 * - @Table: Specifies the database table name
 * - @Id: Marks a field as the primary key
 * - @GeneratedValue: Automatically generates values for the primary key
 * - @Column: Maps a field to a database column with specific properties
 * - @ManyToOne: Defines a many-to-one relationship with another entity
 * - @JoinColumn: Specifies the foreign key column for the relationship
 * - @Enumerated: Maps an enum to a database column
 * - @PreUpdate: Method called before an entity is updated
 */
@Entity
@Table(name = "bookings")
public class Booking {
    
    /**
     * Primary Key - Unique identifier for each booking
     * Generated automatically by the database (auto-increment)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Unique booking ID for customer reference
     * Format: "BK" + timestamp (e.g., BK1703123456789)
     */
    @Column(name = "booking_id", unique = true, nullable = false)
    private String bookingId;
    
    /**
     * Customer who made this booking
     * Many bookings can belong to one customer (Many-to-One relationship)
     */
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    /**
     * Name of the person receiving the parcel
     * Required field with validation
     */
    @NotBlank(message = "Receiver name is required")
    @Column(name = "receiver_name", nullable = false)
    private String receiverName;
    
    /**
     * Complete address where the parcel should be delivered
     * Required field with validation
     */
    @NotBlank(message = "Receiver address is required")
    @Column(name = "receiver_address", nullable = false)
    private String receiverAddress;
    
    /**
     * PIN code of the receiver's address
     * Exactly 6 digits
     */
    @NotBlank(message = "Receiver PIN is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "PIN must be 6 digits")
    @Column(name = "receiver_pin", nullable = false)
    private String receiverPin;

    /**
     * Mobile number of the receiver for delivery coordination
     * Must be exactly 10 digits (Indian mobile format)
     */
    @NotBlank(message = "Receiver mobile is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    @Column(name = "receiver_mobile", nullable = false)
    private String receiverMobile;
    
    /**
     * Weight of the parcel in grams
     * Minimum weight is 1 gram
     */
    @NotNull(message = "Parcel weight is required")
    @Min(value = 1, message = "Weight must be at least 1 gram")
    @Column(name = "parcel_weight_gram", nullable = false)
    private Integer parcelWeightInGram;
    
    /**
     * Description of what's inside the parcel
     * Helps with customs and delivery handling
     */
    @NotBlank(message = "Parcel contents description is required")
    @Column(name = "parcel_contents_description", nullable = false)
    private String parcelContentsDescription;
    
    /**
     * Type of delivery service chosen
     * Options: STANDARD, EXPRESS, SAME_DAY
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "parcel_delivery_type", nullable = false)
    private DeliveryType parcelDeliveryType;
    
    /**
     * Type of packing service chosen
     * Options: BASIC, PREMIUM
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "parcel_packing_preference", nullable = false)
    private PackingPreference parcelPackingPreference;
    
    /**
     * When the parcel was picked up from the sender
     * Null until pickup is scheduled/completed
     */
    @Column(name = "parcel_pickup_time")
    private LocalDateTime parcelPickupTime;
    
    /**
     * When the parcel was delivered to the receiver
     * Null until delivery is completed
     */
    @Column(name = "parcel_dropoff_time")
    private LocalDateTime parcelDropoffTime;
    
    /**
     * Total cost of the courier service
     * Calculated based on weight, delivery type, and packing preference
     */
    @NotNull(message = "Service cost is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Service cost must be greater than 0")
    @Column(name = "parcel_service_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal parcelServiceCost;
    
    /**
     * When the payment was made for this booking
     * Null until payment is completed
     */
    @Column(name = "parcel_payment_time")
    private LocalDateTime parcelPaymentTime;
    
    /**
     * Current status of the parcel
     * Default status is NEW when booking is created
     * Options: NEW, PICKED_UP, IN_TRANSIT, DELIVERED, CANCELLED
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "parcel_status", nullable = false)
    private ParcelStatus parcelStatus = ParcelStatus.NEW;
    
    /**
     * When this booking record was created
     * Automatically set when booking is saved
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    /**
     * When this booking record was last updated
     * Automatically updated on every save/update
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Default constructor
     * Initializes timestamps and generates a unique booking ID
     */
    public Booking() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.bookingId = generateBookingId();
    }
    
    /**
     * Generates a unique booking ID using current timestamp
     * Format: "BK" + current time in milliseconds
     * 
     * @return Unique booking ID string
     */
    private String generateBookingId() {
        return "BK" + System.currentTimeMillis();
    }
    
    // Getters and Setters
    // These methods allow other classes to access and modify the private fields
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }
    
    public Customer getCustomer() {
        return customer;
    }
    
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    
    public String getReceiverName() {
        return receiverName;
    }
    
    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }
    
    public String getReceiverAddress() {
        return receiverAddress;
    }
    
    public void setReceiverAddress(String receiverAddress) {
        this.receiverAddress = receiverAddress;
    }

    public String getReceiverPin() {
        return receiverPin;
    }

    public void setReceiverPin(String receiverPin) {
        this.receiverPin = receiverPin;
    }
    
    public String getReceiverMobile() {
        return receiverMobile;
    }
    
    public void setReceiverMobile(String receiverMobile) {
        this.receiverMobile = receiverMobile;
    }
    
    public Integer getParcelWeightInGram() {
        return parcelWeightInGram;
    }
    
    public void setParcelWeightInGram(Integer parcelWeightInGram) {
        this.parcelWeightInGram = parcelWeightInGram;
    }
    
    public String getParcelContentsDescription() {
        return parcelContentsDescription;
    }
    
    public void setParcelContentsDescription(String parcelContentsDescription) {
        this.parcelContentsDescription = parcelContentsDescription;
    }
    
    public DeliveryType getParcelDeliveryType() {
        return parcelDeliveryType;
    }
    
    public void setParcelDeliveryType(DeliveryType parcelDeliveryType) {
        this.parcelDeliveryType = parcelDeliveryType;
    }
    
    public PackingPreference getParcelPackingPreference() {
        return parcelPackingPreference;
    }
    
    public void setParcelPackingPreference(PackingPreference parcelPackingPreference) {
        this.parcelPackingPreference = parcelPackingPreference;
    }
    
    public LocalDateTime getParcelPickupTime() {
        return parcelPickupTime;
    }
    
    public void setParcelPickupTime(LocalDateTime parcelPickupTime) {
        this.parcelPickupTime = parcelPickupTime;
    }
    
    public LocalDateTime getParcelDropoffTime() {
        return parcelDropoffTime;
    }
    
    public void setParcelDropoffTime(LocalDateTime parcelDropoffTime) {
        this.parcelDropoffTime = parcelDropoffTime;
    }
    
    public BigDecimal getParcelServiceCost() {
        return parcelServiceCost;
    }
    
    public void setParcelServiceCost(BigDecimal parcelServiceCost) {
        this.parcelServiceCost = parcelServiceCost;
    }
    
    public LocalDateTime getParcelPaymentTime() {
        return parcelPaymentTime;
    }
    
    public void setParcelPaymentTime(LocalDateTime parcelPaymentTime) {
        this.parcelPaymentTime = parcelPaymentTime;
    }
    
    public ParcelStatus getParcelStatus() {
        return parcelStatus;
    }
    
    public void setParcelStatus(ParcelStatus parcelStatus) {
        this.parcelStatus = parcelStatus;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    /**
     * JPA lifecycle method called before an entity is updated
     * Automatically updates the updatedAt timestamp
     */
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 