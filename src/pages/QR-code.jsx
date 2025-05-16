import React, { useContext } from "react";
import { APIContext } from "../utils/context/APIContextProvider";

const QRCode = () => {
    const { qrCode, loadingQr, error } = useContext(APIContext)

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = `data:image/png;base64,${qrCode}`;
        a.download = "claim-verification-qr.png";
        a.click();
    };

    if (loadingQr) {
        return <div className="w-[200px] h-[200px] animate-pulse bg-gray-400"></div>
    }

    if (error) {
        return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
        </div>
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">QR Code for Claim Verification</h1>
        {qrCode ? (
            <>
            <img 
                title="QR Code"
                src={`data:image/png;base64,${qrCode}`}
                alt="QR Code"
                className="shadow-lg rounded bg-white p-2"
            />

            <button title="download Qr Code" onClick={handleDownload} className="mt-6 bg-slate-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-slate-700">
                Download QR Code
            </button>
            </>
        ) : (
            <p>QR Code not available.</p>
        )}
        </div>
    );
};

export default QRCode;
