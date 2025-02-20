import React from 'react';

const Terms = () => {
    return (
        <div className="terms-container w-full p-6 bg-gray-100/30">
            <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
            <p className="mb-2">Welcome to our application. By using our service, you agree to the following terms and conditions:</p>
            <ul className="list-disc list-inside mb-4">
                <li className="mb-2">You must be at least 18 years old to use this service.</li>
                <li className="mb-2">You are responsible for maintaining the confidentiality of your account and password.</li>
                <li className="mb-2">You may not use the service for any illegal or unauthorized purpose.</li>
                <li className="mb-2">We reserve the right to terminate your account if you violate any of these terms.</li>
            </ul>
            <p className="mb-2">These terms are subject to change at any time without notice. It is your responsibility to review these terms periodically.</p>
            <p>If you have any questions about these terms, please contact us.</p>
        </div>
    );
};

export default Terms;