import React, { useEffect, useState } from 'react'


// This api gets a qr code for other staff to view their claims
const Get_QR = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [error, setError] = useState(null)
    const [loadingQr, setLoadingQr] = useState(false);
    const [qrCode, setQrCode] = useState([])
    useEffect(() => {
        const get_qr = async () => {

            setLoadingQr(true);
            try {
            const response = await fetch(`${BASE_URL}/qr-code/`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                setQrCode(data.qr_code_image);
            } else {
                const errorData = await response.json();
                setError(errorData);
            }
            } catch (err) {
            console.log(err);
            } finally {
                setLoadingQr(false);
            }
        };

        get_qr()

    }, [BASE_URL])
    
    return {loadingQr, error, qrCode};
}

export default Get_QR