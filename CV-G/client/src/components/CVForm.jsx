import React, { useState } from 'react';
import axios from 'axios';

const CVForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '', github: '', linkedin: '', skills: ''
  });

  const [educations, setEducations] = useState([
    { university: '', major: '', gpa: '' }
  ]);

  const [experiences, setExperiences] = useState([
    { company: '', jobTitle: '', duration: '', description: '' }
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (index, field, value, setter) => {
    setter(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleAddEntry = (setter, defaultObject) => {
    setter(prev => [...prev, { ...defaultObject }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://cv-builder-3mpf.onrender.com/api/generate',
        { ...formData, experiences, educations },
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
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

      // Reset form
      setFormData({ name: '', email: '', phone: '', location: '', github: '', linkedin: '', skills: '' });
      setExperiences([{ company: '', jobTitle: '', duration: '', description: '' }]);
      setEducations([{ university: '', major: '', gpa: '' }]);
      setCurrentStep(0);
    } catch (err) {
      console.error('Error generating CV:', err);
      alert('Failed to generate CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Personal Info',
      render: () => (
        ['name', 'email', 'phone', 'location', 'github', 'linkedin'].map((name) => (
          <div key={name}>
            <label className="label-text font-medium">{name.charAt(0).toUpperCase() + name.slice(1)}</label>
            <input
              type="text"
              name={name}
              className="input input-bordered w-full"
              value={formData[name]}
              onChange={handleFormDataChange}
              required
            />
          </div>
        ))
      )
    },
    {
      title: 'Education',
      render: () => (
        <>
          {educations.map((edu, i) => (
            <div key={i} className="mb-4">
              <input type="text" placeholder="University" className="input input-bordered w-full mb-2" value={edu.university} onChange={e => handleDynamicChange(i, 'university', e.target.value, setEducations)} required />
              <input type="text" placeholder="Major" className="input input-bordered w-full mb-2" value={edu.major} onChange={e => handleDynamicChange(i, 'major', e.target.value, setEducations)} required />
              <input type="text" placeholder="GPA" className="input input-bordered w-full" value={edu.gpa} onChange={e => handleDynamicChange(i, 'gpa', e.target.value, setEducations)} required />
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-outline" onClick={() => handleAddEntry(setEducations, { university: '', major: '', gpa: '' })}>+ Add Education</button>
        </>
      )
    },
    {
      title: 'Work Experience',
      render: () => (
        <>
          {experiences.map((exp, i) => (
            <div key={i} className="mb-4">
              <input type="text" placeholder="Company Name" className="input input-bordered w-full mb-2" value={exp.company} onChange={e => handleDynamicChange(i, 'company', e.target.value, setExperiences)} required />
              <input type="text" placeholder="Job Title" className="input input-bordered w-full mb-2" value={exp.jobTitle} onChange={e => handleDynamicChange(i, 'jobTitle', e.target.value, setExperiences)} required />
              <input type="text" placeholder="Duration" className="input input-bordered w-full mb-2" value={exp.duration} onChange={e => handleDynamicChange(i, 'duration', e.target.value, setExperiences)} required />
              <textarea placeholder="Description" className="textarea textarea-bordered w-full" rows={3} value={exp.description} onChange={e => handleDynamicChange(i, 'description', e.target.value, setExperiences)} required />
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-outline" onClick={() => handleAddEntry(setExperiences, { company: '', jobTitle: '', duration: '', description: '' })}>+ Add Experience</button>
        </>
      )
    },
    {
      title: 'Skills',
      render: () => (
        <div>
          <textarea
            className="textarea textarea-bordered w-full"
            name="skills"
            rows={2}
            value={formData.skills}
            onChange={handleFormDataChange}
            placeholder="JavaScript, React, SQL, etc"
            required
          ></textarea>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-2xl mx-auto my-16 px-4">
      <div className="card bg-base-100 border border-base-300 shadow-lg p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Student-X CV Builder</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h3>
          {steps[currentStep].render()}
          <div className="flex justify-between mt-4">
            {currentStep > 0 && (
              <button type="button" className="btn btn-secondary" onClick={() => setCurrentStep(prev => prev - 1)}>Back</button>
            )}
            {currentStep < steps.length - 1 ? (
              <button type="button" className="btn btn-primary ml-auto" onClick={() => setCurrentStep(prev => prev + 1)}>Next</button>
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



// import React, { useState } from 'react';
// import axios from 'axios';

// const CVForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//     github: '',
//     linkedin: '',
//     university: '',
//     major: '',
//     gpa: '',
//     company: '',
//     jobTitle: '',
//     duration: '',
//     description: '',
//     skills: ''
//   });

//   const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const steps = [
//     {
//       title: 'Personal Info',
//       fields: [
//         { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Jamal Habib' },
//         { label: 'Email', name: 'email', type: 'email', placeholder: 'Jamal@example.com' },
//         { label: 'Phone', name: 'phone', type: 'text', placeholder: '+961 71 234 567' },
//         { label: 'Location', name: 'location', type: 'text', placeholder: 'Beirut, Lebanon' },
//         { label: 'GitHub URL', name: 'github', type: 'text', placeholder: 'https://github.com/yourusername' },
//         { label: 'LinkedIn URL', name: 'linkedin', type: 'text', placeholder: 'https://linkedin.com/in/yourusername' }
//       ]
//     },
//     {
//       title: 'Education',
//       fields: [
//         { label: 'University Name', name: 'university', type: 'text', placeholder: 'AUST' },
//         { label: 'Major', name: 'major', type: 'text', placeholder: 'Computer Science' },
//         { label: 'GPA', name: 'gpa', type: 'text', placeholder: '3.7' }
//       ]
//     },
//     {
//       title: 'Work Experience',
//       fields: [
//         { label: 'Company Name', name: 'company', type: 'text', placeholder: 'Tesla, Inc.' },
//         { label: 'Job Title', name: 'jobTitle', type: 'text', placeholder: 'Software Engineering Intern' },
//         { label: 'Duration', name: 'duration', type: 'text', placeholder: 'June 2023 – Aug 2023' },
//         {
//           label: 'Description',
//           name: 'description',
//           type: 'textarea',
//           rows: 3,
//           placeholder: '- Built APIs with Node.js\n- Used MongoDB and JWT for auth'
//         }
//       ]
//     },
//     {
//       title: 'Skills',
//       fields: [
//         {
//           label: 'Skills, Certifications, Languages',
//           name: 'skills',
//           type: 'textarea',
//           rows: 2,
//           placeholder:
//             'JavaScript, Python, React, SQL, Git, Docker, AWS, English, Arabic, AWS Certified Cloud Practitioner'
//         }
//       ]
//     }
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         'https://cv-builder-3mpf.onrender.com/api/generate',
//         formData,
//         { responseType: 'blob' }
//       );

//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = 'cv.pdf';
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         location: '',
//         github: '',
//         linkedin: '',
//         university: '',
//         major: '',
//         gpa: '',
//         company: '',
//         jobTitle: '',
//         duration: '',
//         description: '',
//         skills: ''
//       });
//       setCurrentStep(0);
//     } catch (err) {
//       console.error('Error generating CV:', err);
//       alert('Failed to generate CV. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto my-16 px-4">
//       <div className="card bg-base-100 border border-base-300 shadow-lg p-6 sm:p-8">
//         <h2 className="text-3xl font-bold text-center mb-6">Student-X CV Builder</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <h3 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h3>

//           {steps[currentStep].fields.map(({ label, name, type, placeholder, rows }) => (
//             <div key={name}>
//               <label className="label-text font-medium">{label}</label>
//               {type === 'textarea' ? (
//                 <textarea
//                   className="textarea textarea-bordered w-full"
//                   name={name}
//                   rows={rows}
//                   value={formData[name]}
//                   onChange={handleChange}
//                   placeholder={placeholder}
//                   required
//                 ></textarea>
//               ) : (
//                 <input
//                   type={type}
//                   name={name}
//                   className="input input-bordered w-full"
//                   value={formData[name]}
//                   onChange={handleChange}
//                   placeholder={placeholder}
//                   required={['name', 'email'].includes(name)}
//                 />
//               )}
//             </div>
//           ))}

//           <div className="flex justify-between mt-4">
//             {currentStep > 0 && (
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={() => setCurrentStep((prev) => prev - 1)}
//               >
//                 Back
//               </button>
//             )}
//             {currentStep < steps.length - 1 ? (
//               <button
//                 type="button"
//                 className="btn btn-primary ml-auto"
//                 onClick={() => setCurrentStep((prev) => prev + 1)}
//               >
//                 Next
//               </button>
//             ) : (
//               <button type="submit" className="btn btn-success ml-auto" disabled={loading}>
//                 {loading ? <span className="loading loading-spinner"></span> : 'Generate CV'}
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CVForm;
