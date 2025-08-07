import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/">
      <img src="/logo.svg" alt="Calculadora Laboral Panamá" className="h-12 w-auto" />
    </Link>
  );
};

export default Logo;