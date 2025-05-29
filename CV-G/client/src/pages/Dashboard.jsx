import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://cv-builder-3mpf.onrender.com/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 pt-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {data.user.name} 
        </h2>

        <div className="space-y-6">
          {/* User Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Personal Info</h3>
            <p className="text-gray-600"><span className="font-medium">Email:</span> {data.user.email}</p>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Education</h3>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border">
                  <p className="text-gray-800 font-medium">🎓 {edu.degree}</p>
                  <p className="text-gray-600">University: {edu.university}</p>
                  <p className="text-gray-600">GPA: {edu.gpa}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Experience</h3>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border">
                  <p className="text-gray-800 font-medium">💼 {exp.title} at {exp.company}</p>
                  <p className="text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CV Link */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your CV</h3>
            <a
              href={data.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-primary btn-sm rounded-lg"
            >
              View Your CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
