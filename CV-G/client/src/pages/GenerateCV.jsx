import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CVForm from '../components/CVForm';

const GenerateCV = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <div className="py-10">
        <h2 className="text-4xl font-bold text-center mb-8">Create Your AI-Powered CV</h2>
        <CVForm />
      </div>
    </div>
  );
};

export default GenerateCV;
