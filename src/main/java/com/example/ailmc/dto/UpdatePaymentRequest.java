package com.example.ailmc.dto;

import com.example.ailmc.models.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdatePaymentRequest {

    @NotNull(message = "Payment status is required (PENDING / PAID)")
    private PaymentStatus feeStatus;
}
