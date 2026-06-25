package com.example.ailmc.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    // ── Registration Emails ───────────────────────────────────────────────────

    @Async
    public void sendMentorWelcomeEmail(String toEmail, String name) {
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
              <div style="background:#1a73e8;padding:24px;text-align:center">
                <h1 style="color:white;margin:0">AILMC</h1>
                <p style="color:#e8f0fe;margin:4px 0">AI Literacy Mission @ Campus</p>
              </div>
              <div style="padding:32px">
                <h2>Welcome, %s! 🎓</h2>
                <p>You are registered as a <strong>Mentor</strong> on AILMC.</p>
                <p>You can now:</p>
                <ul>
                  <li>Create cohorts in your city</li>
                  <li>Accept mentees (max 10–12 per cohort)</li>
                  <li>Track attendance and issue certificates</li>
                </ul>
                <a href="%s/dashboard" style="display:inline-block;padding:12px 24px;
                   background:#1a73e8;color:white;text-decoration:none;border-radius:4px">
                  Go to Dashboard →
                </a>
              </div>
              <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#666">
                AILMC · AI Literacy Mission @ Campus
              </div>
            </div>
            """.formatted(name, baseUrl);
        send(toEmail, "Welcome to AILMC – Mentor Registration Successful!", html);
    }

    @Async
    public void sendMenteeWelcomeEmail(String toEmail, String name) {
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
              <div style="background:#34a853;padding:24px;text-align:center">
                <h1 style="color:white;margin:0">AILMC</h1>
                <p style="color:#e6f4ea;margin:4px 0">AI Literacy Mission @ Campus</p>
              </div>
              <div style="padding:32px">
                <h2>Welcome, %s! 🚀</h2>
                <p>You are registered as a <strong>Mentee</strong> on AILMC.</p>
                <p>Your learning journey:</p>
                <ul>
                  <li>🎯 MasterClass Track – 30 hrs</li>
                  <li>💻 Self-Practice Track – 30 hrs</li>
                  <li>🏆 Capstone Project – 10 hrs</li>
                </ul>
                <a href="%s/cohorts" style="display:inline-block;padding:12px 24px;
                   background:#34a853;color:white;text-decoration:none;border-radius:4px">
                  Browse Cohorts →
                </a>
              </div>
              <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#666">
                AILMC · AI Literacy Mission @ Campus
              </div>
            </div>
            """.formatted(name, baseUrl);
        send(toEmail, "Welcome to AILMC – You're Registered as a Mentee!", html);
    }

    // ── Cohort Joined ─────────────────────────────────────────────────────────

    @Async
    public void sendCohortJoinedEmail(String toEmail, String menteeName,
                                      String cohortName, String mentorEmail) {
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px">
              <h2>You've joined a cohort! 🎉</h2>
              <p>Hi %s,</p>
              <p>You have successfully joined <strong>%s</strong>, mentored by <strong>%s</strong>.</p>
              <p>Log your progress as you complete each track.</p>
              <a href="%s/tracker" style="display:inline-block;padding:12px 24px;
                 background:#1a73e8;color:white;text-decoration:none;border-radius:4px">
                View My Tracker →
              </a>
            </div>
            """.formatted(menteeName, cohortName, mentorEmail, baseUrl);
        send(toEmail, "You've joined cohort: " + cohortName, html);
    }

    // ── Certificate Issued ────────────────────────────────────────────────────

    @Async
    public void sendCertificateIssuedEmail(String toEmail, String menteeName) {
        String html = """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px">
              <h2>Congratulations, %s! 🏆</h2>
              <p>You have successfully completed the <strong>AILMC programme</strong>
                 and your certificate has been issued.</p>
              <p>Please complete your processing fee payment to download your certificate.</p>
              <a href="%s/cert" style="display:inline-block;padding:12px 24px;
                 background:#fbbc04;color:#000;text-decoration:none;border-radius:4px">
                View Certificate →
              </a>
            </div>
            """.formatted(menteeName, baseUrl);
        send(toEmail, "Your AILMC Certificate is Ready!", html);
    }

    // ── Core Sender ───────────────────────────────────────────────────────────

    private void send(String to, String subject, String html) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(msg);
            log.info("Email sent → {} : {}", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}