"use client";
import { useState, useEffect } from "react";
import { Github, Mail, Linkedin } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

const siteKey = "6Lcd1MwqAAAAAM1Iy63U0qKsTAAv8IISWeCtxBUL";

const socials = [
	{
		icon: <Linkedin size={20} />,
		href: "https://www.linkedin.com/in/roman-bourguignon-2703a730b/",
		label: "Linkedin",
		handle: "Roman Bourguignon",
	},
	{
		icon: <Mail size={20} />,
		href: "mailto:roman.bourguignon@gmail.com",
		label: "Email",
		handle: "roman.bourguignon@gmail.com",
	},
	{
		icon: <Github size={20} />,
		href: "https://github.com/Oxamoxa/portfolio/",
		label: "Github",
		handle: "Oxamoxa",
	},
];

export default function ContactPage() {
	const [status, setStatus] = useState("");
	const [recaptchaToken, setRecaptchaToken] = useState("");

	useEffect(() => {
		// Charger le script de reCAPTCHA
		const script = document.createElement("script");
		script.src = `https://www.google.com/recaptcha/api.js`;
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);
	}, []);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("Envoi en cours...");

		// Assurer que e.target est bien un formulaire
		const form = e.target as HTMLFormElement;

		// Récupérer la valeur des champs
		const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
		const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
		const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value;

		// Vérifier si le token reCAPTCHA est bien généré
		const tokenElement = document.getElementById("g-recaptcha-response") as HTMLInputElement | null;
		const token = tokenElement?.value;

		if (!token) {
			setStatus("Veuillez cocher la case reCAPTCHA.");
			return;
		}

		setRecaptchaToken(token);

		const formData = { name, email, message, recaptchaToken: token };

		// Envoi des données au backend
		const response = await fetch("/api/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			setStatus("Message envoyé avec succès !");
			form.reset();
		} else {
			setStatus("Erreur lors de l'envoi du message.");
		}
	}

	return (
		<div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<Navigation />

			{/* Section Socials */}
			<div className="container flex items-center justify-center min-h-[70vh] px-4 mx-auto">
				<div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
					{socials.map((s, index) => (
						<Card key={index}>
							<Link
								href={s.href}
								target="_blank"
								className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16"
							>
								<span
									className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
									aria-hidden="true"
								/>
								<span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
									{s.icon}
								</span>
								<div className="z-10 flex flex-col items-center">
									<span className="lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
										{s.handle}
									</span>
									<span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
										{s.label}
									</span>
								</div>
							</Link>
						</Card>
					))}
				</div>
			</div>

			{/* Formulaire de contact */}
			<div className="container mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center mb-8 text-white">Me contacter</h2>
				<form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-300">
							Nom
						</label>
						<input
							type="text"
							name="name"
							id="name"
							placeholder="Votre nom"
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-zinc-800 text-white"
						/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-300">
							Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							placeholder="Votre email"
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-zinc-800 text-white"
						/>
					</div>
					<div>
						<label htmlFor="message" className="block text-sm font-medium text-gray-300">
							Message
						</label>
						<textarea
							name="message"
							id="message"
							rows={4}
							placeholder="Votre message"
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-zinc-800 text-white"
						></textarea>
					</div>

					{/* reCAPTCHA v2 case à cocher */}
					<div className="g-recaptcha" data-sitekey={siteKey}></div>

					<div>
						<button type="submit" className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
							Envoyer
						</button>
					</div>
					<p className="text-center text-sm text-white">{status}</p>
				</form>
			</div>
		</div>
	);
}
