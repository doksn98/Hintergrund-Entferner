export default async function handler(req, res) {
    // Nur POST-Anfragen erlauben
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        // Anfrage an remove.bg weiterleiten
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.REMOVE_BG_API_KEY, // Holt den Key aus Vercel
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_file_b64: req.body.image,
                size: 'auto'
            })
        });

        // Fehlerbehandlung, falls remove.bg meckert (z.B. Key falsch)
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`remove.bg Fehler: ${errorText}`);
        }

        // Das Bild von remove.bg (Binärdaten) in Base64 umwandeln für das Frontend
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        
        res.status(200).json({ image: base64 });

    } catch (error) {
        console.error("Server Fehler:", error);
        res.status(500).json({ error: error.message });
    }
}
