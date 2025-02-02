import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendEmailVerification = async (email: string, token: string) => {
    try {
        if (process.env.NODE_ENV === "development") {
            console.log("📧 Development Mode - Email Details:");
            console.log("----------------------------------------");
            console.log("Verification URL:", `${process.env.AUTH_URL}/api/auth/verify-email?token=${token}`);
            console.log("----------------------------------------");

            return {
                success: true,
                development: true,
                message: "Email simulation successful in development mode"
            };
        }

        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your email",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Email Verification</h2>
                    <p>Please click the button below to verify your email address:</p>
                    <a href="${process.env.AUTH_URL}/api/auth/verify-email?token=${token}"
                       style="display: inline-block; padding: 12px 24px; background-color: #0070f3; 
                              color: white; text-decoration: none; border-radius: 5px; margin: 16px 0;">
                        Verify Email
                    </a>
                    <p style="color: #666; font-size: 14px;">
                        If the button doesn't work, copy and paste this link into your browser:
                        <br>
                        ${process.env.AUTH_URL}/api/auth/verify-email?token=${token}
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error("Email service error:", error);
            return { error: "Failed to send verification email" };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Unexpected error:", error);
        return { error: "An unexpected error occurred" };
    }
};