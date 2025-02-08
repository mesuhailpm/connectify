import React from 'react';

function Button({ label, icon, style, onClick, disabled = false }) {
  return (
    <button
      className={`flex items-center p-2 rounded-md text-white hover:bg-gray-600 ${style}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
}

export default Button;
