import nodemailer from "nodemailer";

export default async function handler(req, res) {
    // Forcer le parsing JSON (utile si Next.js ne le fait pas en prod)
    if (!req.body || typeof req.body !== "object") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            try {
                req.body = JSON.parse(body);
                console.log("Corps de la requête parsé :", req.body);
                handleRequest(req, res);
            } catch (error) {
                console.error("Erreur de parsing JSON :", error);
                return res.status(400).json({ error: "Corps de la requête invalide" });
            }
        });
        return;
    }
    handleRequest(req, res);
}

async function handleRequest(req, res) {
    console.log("Méthode HTTP reçue:", req.method);
    if (req.method !== "POST") {
        console.log("Erreur : méthode non autorisée");
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    console.log("Requête POST acceptée, données reçues :", req.body);
    const { name, email, message, recaptchaToken } = req.body;

    // Vérification reCAPTCHA (désactive pour test)
    console.log("Token reCAPTCHA reçu :", recaptchaToken);

    // Configuration Nodemailer
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
