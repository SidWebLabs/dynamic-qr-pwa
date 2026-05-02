// src/components/landing/Features.tsx
const features = [
    "Dynamic QR codes",
    "High conversion rate",
    "Real-time analytics",
    "Easy landing pages",
    "Multiple QR types",
    "Full customization",
];

export default function Features() {
    return (
        <section className="py-16 px-6 bg-gray-50">
            <h2 className="text-center text-2xl font-semibold mb-10">
                Best QR Code Management Features
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {features.map((item) => (
                    <div key={item} className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">{item}</h3>
                        <p className="text-sm text-gray-500">
                            Manage QR codes efficiently with powerful tools.
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}