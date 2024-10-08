const passwordResetMailBody = (username, userId, token) => {
    return `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                          <h2 style="color: #333;">Hello, ${username}</h2>
                          <p>Click the link below to reset your password:</p>
                          <p style="text-align: center;">
                            <a href="http://localhost:8080/auth/reset-password/${userId}/${token}"
                               style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">
                              Reset Password
                            </a>
                          </p>
                          <p>If the button above doesn't work, please copy and paste the following link into your web browser:</p>
                          <p style="word-break: break-all;">http://localhost:8080/auth/reset-password/${userId}/${token}</p>
                          <p>For any issues or assistance, feel free to reach out to our support team.</p>
                          <br>
                          <p>Best regards,</p>
                          <p><strong>Forum Support Team</strong></p>
            </div>`
}

export default passwordResetMailBody;