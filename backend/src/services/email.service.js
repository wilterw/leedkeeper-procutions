const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: `"Lead Keeper IA" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '¡Bienvenido a Lead Keeper! 🚀',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #6366f1;">Hola, ${name} 👋</h2>
                    <p>Gracias por registrar tu inmobiliaria en <strong>Lead Keeper</strong>.</p>
                    <p>Tu cuenta ha sido creada exitosamente y actualmente se encuentra en <strong>fase de revisión</strong>.</p>
                    <p>Un administrador activará tu acceso en las próximas horas para que puedas comenzar a configurar tu agente IA.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">Este es un correo automático, por favor no respondas.</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER) {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Correo de bienvenida enviado a: ${email}`);
        } else {
            console.log('⚠️ EMAIL_USER no configurado. Correo de bienvenida no enviado (simulado en log):');
            console.log(mailOptions.html);
        }
    } catch (error) {
        console.error('❌ Error enviando correo de bienvenida:', error);
    }
};

const sendResetPasswordEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    try {
        const mailOptions = {
            from: `"Lead Keeper IA" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Recuperación de Contraseña - Lead Keeper',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #6366f1;">Recuperar Contraseña</h2>
                    <p>Has solicitado restablecer tu contraseña en Lead Keeper.</p>
                    <p>Haz clic en el siguiente botón para continuar. Este enlace expira en 1 hora.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
                    </div>
                    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                    <p style="font-size: 11px; color: #999;">O copia y pega este enlace: ${resetUrl}</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER) {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Correo de recuperación enviado a: ${email}`);
        } else {
            console.log('⚠️ EMAIL_USER no configurado. Correo de recuperación no enviado (simulado en log):');
            console.log(mailOptions.html);
        }
    } catch (error) {
        console.error('❌ Error enviando correo de recuperación:', error);
    }
};

const sendActivationEmail = async (email, name) => {
    const loginUrl = `${process.env.FRONTEND_URL || 'https://leedkeeper.econos.io'}/login`;
    try {
        const mailOptions = {
            from: `"Lead Keeper IA" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '¡Tu cuenta ha sido activada! 🚀 - Lead Keeper',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fcfcfc;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #6366f1; margin: 0;">Lead Keeper</h1>
                        <p style="color: #666; font-size: 14px;">IA Inmobiliaria Autónoma</p>
                    </div>
                    <h2 style="color: #333;">¡Felicidades, ${name}! 🎉</h2>
                    <p style="color: #444; line-height: 1.6;">Tu cuenta ha sido revisada y <strong>autorizada con éxito</strong>. Ya puedes acceder a todas las herramientas de automatización de Lead Keeper.</p>
                    
                    <div style="background-color: #fff; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                        <p style="margin-top: 0; color: #666;">Haz clic abajo para entrar a tu terminal:</p>
                        <a href="${loginUrl}" style="background-color: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(99,102,241,0.3);">Entrar al Panel de Control</a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">Siguientes pasos recomendados:</p>
                    <ul style="color: #666; font-size: 14px; padding-left: 20px;">
                        <li>Conecta tu WhatsApp Business.</li>
                        <li>Sube tu inventario XML.</li>
                        <li>Entrena a tu Agente IA.</li>
                    </ul>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                    <p style="font-size: 11px; color: #999; text-align: center;">© 2026 Lead Keeper IA. Todos los derechos reservados.</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER) {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Correo de activación enviado a: ${email}`);
        }
    } catch (error) {
        console.error('❌ Error enviando correo de activación:', error);
    }
};

module.exports = {
    sendWelcomeEmail,
    sendResetPasswordEmail,
    sendActivationEmail
};
