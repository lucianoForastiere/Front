// WhatsAppButton.js
import React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import './estilos.css';

const WhatsAppButton = () => {
    return (
        <a
            href="https://wa.me/2281359060" // Reemplaza con tu número de WhatsApp
            className="whatsapp-button"
            target="_blank"
            rel="noopener noreferrer"
        >
            <WhatsAppIcon className="whatsapp-icon" aria-label="WhatsApp" />
        </a>
    );
};

export default WhatsAppButton;
