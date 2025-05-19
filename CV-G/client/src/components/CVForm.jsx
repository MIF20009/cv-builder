// import React, { useState } from 'react'
// import axios from 'axios'

// const CVForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//     github: '',
//     linkedin: '',
//     education: '',
//     experience: '',
//     skills: ''
//   })

//   const [loading, setLoading] = useState(false)

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/generate',
//         formData,
//         { responseType: 'blob' }
//       )

//       const blob = new Blob([response.data], { type: 'application/pdf' })
//       const url = window.URL.createObjectURL(blob)
//       const link = document.createElement('a')
//       link.href = url
//       link.download = 'cv.pdf'
//       document.body.appendChild(link)
//       link.click()
//       link.remove()
//       window.URL.revokeObjectURL(url)

//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         location: '',
//         github: '',
//         linkedin: '',
//         education: '',
//         experience: '',
//         skills: ''
//       })
//     } catch (err) {
//       console.error('Error generating CV:', err)
//       alert('Failed to generate CV. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto my-16 px-4">
//       <div className="card bg-base-100 border border-base-300 shadow-lg p-6 sm:p-8">
//         <h2 className="text-3xl font-bold text-center mb-6">Student-X CV Builder</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Text inputs */}
//           {[
//             { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Sarah Johnson' },
//             { label: 'Email', name: 'email', type: 'email', placeholder: 'sarah@example.com' },
//             { label: 'Phone', name: 'phone', type: 'text', placeholder: '+1 234 567 8901' },
//             { label: 'Location', name: 'location', type: 'text', placeholder: 'Austin, TX' },
//             { label: 'GitHub URL', name: 'github', type: 'text', placeholder: 'https://github.com/yourusername' },
//             { label: 'LinkedIn URL', name: 'linkedin', type: 'text', placeholder: 'https://linkedin.com/in/yourusername' }
//           ].map(({ label, name, type, placeholder }) => (
//             <div key={name}>
//               <label className="label-text font-medium">{label}</label>
//               <input
//                 type={type}
//                 name={name}
//                 className="input input-bordered w-full"
//                 value={formData[name]}
//                 onChange={handleChange}
//                 placeholder={placeholder}
//                 required={['name', 'email'].includes(name)}
//               />
//             </div>
//           ))}

//           {/* Textareas */}
//           {[
//             {
//               label: 'Education',
//               name: 'education',
//               rows: 3,
//               placeholder:
//                 'B.S. in Computer Science, University of Texas, 2019–2023\nGPA: 3.8\nDean’s List (6 semesters)'
//             },
//             {
//               label: 'Experience',
//               name: 'experience',
//               rows: 3,
//               placeholder:
//                 'Software Engineering Intern, Tesla, Summer 2022\n- Built React dashboards to monitor battery performance\n- Collaborated with 4 backend engineers on APIs'
//             },
//             {
//               label: 'Skills, Certifications, Languages',
//               name: 'skills',
//               rows: 2,
//               placeholder:
//                 'JavaScript, Python, React, SQL, Git, Docker, AWS, English, Arabic, AWS Certified Cloud Practitioner'
//             }
//           ].map(({ label, name, rows, placeholder }) => (
//             <div key={name}>
//               <label className="label-text font-medium">{label}</label>
//               <textarea
//                 className="textarea textarea-bordered w-full"
//                 name={name}
//                 rows={rows}
//                 value={formData[name]}
//                 onChange={handleChange}
//                 placeholder={placeholder}
//               ></textarea>
//             </div>
//           ))}

//           <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
//             {loading ? <span className="loading loading-spinner"></span> : 'Generate CV'}
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default CVForm

import React, { useState } from 'react';
import axios from 'axios';

const CVForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    university: '',
    major: '',
    gpa: '',
    company: '',
    jobTitle: '',
    duration: '',
    description: '',
    skills: ''
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: 'Personal Info',
      fields: [
        { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Sarah Johnson' },
        { label: 'Email', name: 'email', type: 'email', placeholder: 'sarah@example.com' },
        { label: 'Phone', name: 'phone', type: 'text', placeholder: '+1 234 567 8901' },
        { label: 'Location', name: 'location', type: 'text', placeholder: 'Austin, TX' },
        { label: 'GitHub URL', name: 'github', type: 'text', placeholder: 'https://github.com/yourusername' },
        { label: 'LinkedIn URL', name: 'linkedin', type: 'text', placeholder: 'https://linkedin.com/in/yourusername' }
      ]
    },
    {
      title: 'Education',
      fields: [
        { label: 'University Name', name: 'university', type: 'text', placeholder: 'AUST' },
        { label: 'Major', name: 'major', type: 'text', placeholder: 'Computer Science' },
        { label: 'GPA', name: 'gpa', type: 'text', placeholder: '3.7' }
      ]
    },
    {
      title: 'Work Experience',
      fields: [
        { label: 'Company Name', name: 'company', type: 'text', placeholder: 'Tesla, Inc.' },
        { label: 'Job Title', name: 'jobTitle', type: 'text', placeholder: 'Software Engineering Intern' },
        { label: 'Duration', name: 'duration', type: 'text', placeholder: 'June 2023 – Aug 2023' },
        {
          label: 'Description',
          name: 'description',
          type: 'textarea',
          rows: 3,
          placeholder: '- Built APIs with Node.js\n- Used MongoDB and JWT for auth'
        }
      ]
    },
    {
      title: 'Skills',
      fields: [
        {
          label: 'Skills, Certifications, Languages',
          name: 'skills',
          type: 'textarea',
          rows: 2,
          placeholder:
            'JavaScript, Python, React, SQL, Git, Docker, AWS, English, Arabic, AWS Certified Cloud Practitioner'
        }
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/generate',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cv.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        github: '',
        linkedin: '',
        university: '',
        major: '',
        gpa: '',
        company: '',
        jobTitle: '',
        duration: '',
        description: '',
        skills: ''
      });
      setCurrentStep(0);
    } catch (err) {
      console.error('Error generating CV:', err);
      alert('Failed to generate CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-16 px-4">
      <div className="card bg-base-100 border border-base-300 shadow-lg p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Student-X CV Builder</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h3>

          {steps[currentStep].fields.map(({ label, name, type, placeholder, rows }) => (
            <div key={name}>
              <label className="label-text font-medium">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  className="textarea textarea-bordered w-full"
                  name={name}
                  rows={rows}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                ></textarea>
              ) : (
                <input
                  type={type}
                  name={name}
                  className="input input-bordered w-full"
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required={['name', 'email'].includes(name)}
                />
              )}
            </div>
          ))}

          <div className="flex justify-between mt-4">
            {currentStep > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary ml-auto"
                onClick={() => setCurrentStep((prev) => prev + 1)}
              >
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-success ml-auto" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : 'Generate CV'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CVForm;
