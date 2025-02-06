import nodemailer from "nodemailer";

export default async function handler(req, res) {
    console.log("Méthode HTTP reçue:", req.method);

    if (req.method !== "POST") {
        console.log("Erreur : méthode non autorisée");
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    console.log("Requête POST acceptée, données reçues :", req.body);

    if (!req.body) {
        console.log("Erreur : le corps de la requête est vide ou mal formaté");
        return res.status(400).json({ error: "Le corps de la requête est vide ou mal formaté" });
    }

    const { name, email, message, recaptchaToken } = req.body;

    // try {
    //     const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //         body: new URLSearchParams({
    //             secret: process.env.RECAPTCHA_SECRET_KEY,
    //             response: recaptchaToken,
    //         }),
    //     });

    //     const recaptchaData = await recaptchaResponse.json();
    //     console.log("Réponse reCAPTCHA:", recaptchaData);

    //     if (!recaptchaData.success) {
    //         console.log("Échec de la vérification reCAPTCHA");
    //         return res.status(400).json({ error: "Échec de la vérification reCAPTCHA", details: recaptchaData });
    //     }
    // } catch (error) {
    //     console.error("Erreur lors de la requête reCAPTCHA:", error);
    //     return res.status(500).json({ error: "Erreur lors de la requête reCAPTCHA", details: error.message });
    // }

    // Configuration de Nodemailer
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.GMAIL_USER_TO,
            subject: "Nouveau message via le formulaire de contact",
            text: message,
            html: `<p><strong>Nom:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong> ${message}</p>`,
        });

        console.log("Email envoyé avec succès !");
        res.status(200).json({ message: "Email envoyé avec succès !" });
    } catch (error) {
        console.error("Erreur d'envoi d'email:", error);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: error.message });
    }
}
