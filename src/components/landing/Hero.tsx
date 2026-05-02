// src/components/landing/Hero.tsx
export default function Hero() {
    return (
        <section className="bg-gradient-to-br from-black via-green-900 to-green-600 text-white py-20 text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                We make QR Codes easy
            </h1>

            <p className="text-gray-300 max-w-xl mx-auto mb-6">
                Create, manage and store QR codes offline with ease.
            </p>

            <button className="bg-white text-black px-6 py-2 rounded-full font-semibold">
                Create QR Code
            </button>

            <div className="flex justify-center gap-6 mt-6 text-sm text-gray-300">
                <span>✔ Dynamic QR</span>
                <span>✔ Offline Ready</span>
                <span>✔ Secure</span>
            </div>
        </section>
    );
}