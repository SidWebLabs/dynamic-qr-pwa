// src/components/landing/QRTypeGrid.tsx
const types = [
    "Website", "PDF", "Images", "Video",
    "MP3", "WiFi", "Menu", "Business",
    "Links", "Coupon", "Vcard", "Apps",
];

export default function QRTypeGrid() {
    return (
        <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

                <div>
                    <h2 className="text-xl font-semibold mb-6">
                        1. Select a type of QR
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        {types.map((type) => (
                            <div
                                key={type}
                                className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md cursor-pointer"
                            >
                                {type}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="w-56 h-96 bg-gray-100 rounded-3xl flex items-center justify-center shadow-lg">
                        <span className="text-gray-400 text-sm text-center">
                            QR Preview
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
}