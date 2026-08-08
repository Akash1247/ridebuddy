// package com.ridebuddy.ridebuddy_backend.service;

// import org.apache.logging.log4j.message.SimpleMessage;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class EmailService {

//     private final JavaMailSender mailSender;

//     public void sendBookingConfirmation(
//         String to,
//         String subject,
//         String body
//     )
//     {
//         SimpleMailMessage message = new SimpleMailMessage();
//         message.setTo(to);
//         message.setSubject(subject);
//         message.setText(body);

//         mailSender.send(message);
//     }

// }




package com.ridebuddy.ridebuddy_backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async 
    public void sendBookingConfirmation(
        String to,
        String subject,
        String body
    ) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            System.out.println("Background email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send background email: " + e.getMessage());
        }
    }
}
