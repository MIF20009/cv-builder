const { OpenAI } = require('openai');
// const puppeteer = require('puppeteer');
const pdf = require('html-pdf-node');

const { User } = require('../models/User');
const { Education } = require('../models/Education');
const { Experience } = require('../models/Experience');

const supabase = require('../supabase'); // import your client
const path = require('path');

require('dotenv').config();

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY
});

exports.generateCV = async (req, res) => {
  try {
    const {
      name, email, phone, location, github, linkedin,
      educations = [], experiences = [], skills = ''
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    // 1. Update user profile with new data
    await User.update(
      { phone, location, github, linkedin, skills },
      { where: { id: userId } }
    );

    // 2. Clear old education/experience records for this user
    await Education.destroy({ where: { user_id: userId } });
    await Experience.destroy({ where: { user_id: userId } });

    // 3. Insert new education records
    for (const edu of educations) {
      await Education.create({
        university: edu.university,
        degree: edu.major,
        gpa: edu.gpa,
        user_id: userId
      });
    }

    // 4. Insert new experience records
    for (const exp of experiences) {
      await Experience.create({
        company: exp.company,
        job_title: exp.jobTitle,
        duration: exp.duration,
        description: exp.description,
        user_id: userId
      });
    }

    // Base info
    let userInfo = `Name: ${name}\nEmail: ${email}`;
    if (phone) userInfo += `\nPhone: ${phone}`;
    if (location) userInfo += `\nLocation: ${location}`;
    if (github) userInfo += `\nGitHub: ${github}`;
    if (linkedin) userInfo += `\nLinkedIn: ${linkedin}`;

    // Education
    if (educations.length > 0) {
      userInfo += `\nEducation:\n`;
      educations.forEach(({ university, major, gpa }) => {
        userInfo += `Degree: ${major || 'N/A'}\nUniversity: ${university || 'N/A'}`;
        if (gpa) userInfo += `\nGPA: ${gpa}`;
        userInfo += `\n`;
      });
    }

    // Experience
    if (experiences.length > 0) {
      userInfo += `\nExperience:\n`;
      experiences.forEach(({ company, jobTitle, duration, description }) => {
        userInfo += `${jobTitle || 'N/A'} at ${company || 'N/A'}\n${duration || ''}`;
        if (description) userInfo += `\n${description}`;
        userInfo += `\n`;
      });
    }

    if (skills) userInfo += `\nSkills:\n${skills}`;

    const prompt = `
You are a professional resume writer.

Generate a resume using ONLY the data provided. Follow these rules:
1. Add a 3–4 sentence professional summary ("About Me").
2. Format education with:
   - Degree: [...]
   - University: [...]
   - GPA: [...] (optional)
3. For work experience:
   - If user provides full bullet points, keep them and end with a period.
   - If only job titles are given, infer realistic bullets using a dash prefix (–), no period.

Split the output into:
- Skills (comma-separated)
- Certificates (if found in Skills or Experience)
- Languages (if found)

Use this structure:

Full Name: [name]  
Title: Computer Science Graduate  

Contact:  
- Email: [...]  
- Phone: [...]  
- Location: [...]  
- GitHub: [...]  
- LinkedIn: [...]

About Me:  
[...]

Education:  
- Degree: [...]  
- University: [...]  
- GPA: [...]

Work Experience:  
- [Job Title]  
  • [user bullet ending with .]  
  – [auto-generated bullet no period]

Skills: HTML, CSS, ...

Certificates: AWS Certified, ...

Languages: English, Arabic

Only use information the user gives.

User Data:
${userInfo}
`;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You write structured, professional CVs with layout and intelligent formatting.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1000
    });

    let cvText = aiResponse.choices[0].message.content.trim();
    cvText = cvText.replace(/```[\s\S]*?```/g, '').replace(/\n{3,}/g, '\n\n').trim();

    const extractSection = (label, until) => {
      if (!cvText.includes(label)) return '';
      const start = cvText.split(label)[1];
      const end = until && start.includes(until) ? start.split(until)[0] : start;
      return end.trim();
    };

    const sections = {
      about: extractSection('About Me:', 'Education:'),
      education: extractSection('Education:', 'Work Experience:'),
      experience: extractSection('Work Experience:', 'Skills:'),
      skills: extractSection('Skills:', 'Certificates:'),
      certificates: extractSection('Certificates:', 'Languages:'),
      languages: extractSection('Languages:')
    };

    const renderList = (items) => items.split(',').map(i => `<div class="skill">${i.trim()}</div>`).join('');
    const renderEntry = (text) => {
      return text.split('\n').map(line => {
        if (line.startsWith('•')) return `<div>• ${line.replace(/^•\s*/, '').replace(/\.*$/, '.')}</div>`;
        if (line.startsWith('–')) return `<div>– ${line.replace(/^–\s*/, '')}</div>`;
        if (line.startsWith('-')) return `<div>– ${line.replace(/^-+\s*/, '')}</div>`;
        return `<div>${line}</div>`;
      }).join('');
    };

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 50px;
              font-size: 13.5px;
              color: #222;
              line-height: 1.6;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              margin: 0;
              text-transform: uppercase;
            }
            .title {
              font-weight: bold;
              margin-bottom: 10px;
            }
            .contact {
              text-align: right;
              font-size: 13px;
              line-height: 1.4;
            }
            .section {
              margin-top: 30px;
            }
            .section h2 {
              font-size: 16px;
              font-weight: bold;
              border-bottom: 1px solid #ccc;
              padding-bottom: 4px;
              margin-bottom: 12px;
              text-transform: uppercase;
            }
            .entry {
              margin-bottom: 12px;
            }
            .skills {
              display: flex;
              flex-wrap: wrap;
              gap: 4px 8px;
              margin-top: 6px;
              align-items: center;
            }
            .skill {
              background-color: #f3f3f3;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 12px;
              margin: 2px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>${name?.toUpperCase() || ''}</h1>
              <div class="title">Computer Science Graduate</div>
            </div>
            <div class="contact">
              ${email ? `<div><strong>Email:</strong> ${email}</div>` : ''}
              ${phone ? `<div><strong>Phone:</strong> ${phone}</div>` : ''}
              ${location ? `<div><strong>Location:</strong> ${location}</div>` : ''}
              ${github ? `<div><strong>GitHub:</strong> ${github}</div>` : ''}
              ${linkedin ? `<div><strong>LinkedIn:</strong> ${linkedin}</div>` : ''}
            </div>
          </div>

          ${sections.about ? `<div class="section"><h2>About Me</h2><div class="entry">${sections.about}</div></div>` : ''}
          ${sections.education ? `<div class="section"><h2>Education</h2><div class="entry">${renderEntry(sections.education)}</div></div>` : ''}
          ${sections.experience ? `<div class="section"><h2>Work Experience</h2><div class="entry">${renderEntry(sections.experience)}</div></div>` : ''}
          ${sections.skills ? `<div class="section"><h2>Skills</h2><div class="skills">${renderList(sections.skills)}</div></div>` : ''}
          ${sections.certificates ? `<div class="section"><h2>Certificates</h2><div class="entry">${renderEntry(sections.certificates)}</div></div>` : ''}
          ${sections.languages ? `<div class="section"><h2>Languages</h2><div class="entry">${renderEntry(sections.languages)}</div></div>` : ''}
        </body>
      </html>
    `;

    const file = { content: htmlContent };
    const pdfBuffer = await pdf.generatePdf(file, { format: 'A4' });

    const fileName = `cv-${userId}-${Date.now()}.pdf`;
    const bucketName = 'cv-files'; // create this bucket in Supabase Storage

    // Upload to Supabase
    const { data, error: uploadError } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error("❌ Supabase upload error:", uploadError);
      return res.status(500).json({ message: "Failed to upload CV" });
    }

    // Get public URL
    const { data: publicURLData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const cvUrl = publicURLData?.publicUrl;

    // Update user's cv_url
    await User.update(
      { cv_url: cvUrl },
      { where: { id: userId } }
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=cv.pdf'
    });
    res.send(pdfBuffer);
    
  } catch (err) {
    console.error('❌ Error generating CV:', err);
    res.status(500).json({ message: 'Failed to generate CV' });
  }
};

// exports.generateCV = async (req, res) => {
//   try {
//     // const { name, email, phone, location, education, experience, skills, github, linkedin } = req.body;
//     const {
//       name, email, phone, location,
//       university, major, gpa,
//       company, jobTitle, duration, description,
//       skills, github, linkedin
//     } = req.body;

//     // let userInfo = `Name: ${name}\nEmail: ${email}`;
//     // if (phone) userInfo += `\nPhone: ${phone}`;
//     // if (location) userInfo += `\nLocation: ${location}`;
//     // if (github) userInfo += `\nGitHub: ${github}`;
//     // if (linkedin) userInfo += `\nLinkedIn: ${linkedin}`;
//     // if (education) userInfo += `\nEducation:\n${education}`;
//     // if (experience) userInfo += `\nExperience:\n${experience}`;
//     // if (skills) userInfo += `\nSkills:\n${skills}`;

//     let userInfo = `Name: ${name}\nEmail: ${email}`;
//     if (phone) userInfo += `\nPhone: ${phone}`;
//     if (location) userInfo += `\nLocation: ${location}`;
//     if (github) userInfo += `\nGitHub: ${github}`;
//     if (linkedin) userInfo += `\nLinkedIn: ${linkedin}`;

//     let educationText = '';
//     if (university || major || gpa) {
//       educationText = `Degree: ${major || 'N/A'}\nUniversity: ${university || 'N/A'}`;
//       if (gpa) educationText += `\nGPA: ${gpa}`;
//       userInfo += `\nEducation:\n${educationText}`;
//     }

//     let experienceText = '';
//     if (company || jobTitle || duration || description) {
//       experienceText = `${jobTitle || 'Job Title'} at ${company || 'Company'}\n${duration || ''}`;
//       if (description) experienceText += `\n${description}`;
//       userInfo += `\nExperience:\n${experienceText}`;
//     }

//     if (skills) userInfo += `\nSkills:\n${skills}`;

//     const prompt = `
// You are a professional resume writer.

// Generate a resume using ONLY the data provided. Follow these rules:
// 1. Add a 3–4 sentence professional summary ("About Me").
// 2. Format education with:
//    - Degree: [...]
//    - University: [...]
//    - GPA: [...] (optional)
// 3. For work experience:
//    - If user provides full bullet points, keep them and end with a period.
//    - If only job titles are given, infer realistic bullets using a dash prefix (–), no period.

// Split the output into:
// - Skills (comma-separated)
// - Certificates (if found in Skills or Experience)
// - Languages (if found)

// Use this structure:

// Full Name: [name]  
// Title: Computer Science Graduate  

// Contact:  
// - Email: [...]  
// - Phone: [...]  
// - Location: [...]  
// - GitHub: [...]  
// - LinkedIn: [...]

// About Me:  
// [...]

// Education:  
// - Degree: [...]  
// - University: [...]  
// - GPA: [...]

// Work Experience:  
// - [Job Title]  
//   • [user bullet ending with .]  
//   – [auto-generated bullet no period]

// Skills: HTML, CSS, ...

// Certificates: AWS Certified, ...

// Languages: English, Arabic

// Only use information the user gives.

// User Data:
// ${userInfo}
// `;

//     const aiResponse = await openai.chat.completions.create({
//       model: 'gpt-4o',
//       messages: [
//         { role: 'system', content: 'You write structured, professional CVs with layout and intelligent formatting.' },
//         { role: 'user', content: prompt }
//       ],
//       temperature: 0.5,
//       max_tokens: 1000
//     });

//     let cvText = aiResponse.choices[0].message.content.trim();
//     cvText = cvText.replace(/```[\s\S]*?```/g, '').replace(/```/g, '').replace(/\n{3,}/g, '\n\n').trim();

//     const extractSection = (label, until) => {
//       if (!cvText.includes(label)) return '';
//       const start = cvText.split(label)[1];
//       const end = until && start.includes(until) ? start.split(until)[0] : start;
//       return end.trim();
//     };

//     const sections = {
//       about: extractSection('About Me:', 'Education:'),
//       education: extractSection('Education:', 'Work Experience:'),
//       experience: extractSection('Work Experience:', 'Skills:'),
//       skills: extractSection('Skills:', 'Certificates:'),
//       certificates: extractSection('Certificates:', 'Languages:'),
//       languages: extractSection('Languages:')
//     };

//     const renderList = (items) => items.split(',').map(i => `<div class="skill">${i.trim()}</div>`).join('');

//     const renderEntry = (text) => {
//       return text.split('\n').map(line => {
//         if (line.startsWith('•')) return `<div>• ${line.replace(/^•\s*/, '').replace(/\.*$/, '.')}</div>`;
//         if (line.startsWith('–')) return `<div>– ${line.replace(/^–\s*/, '')}</div>`;
//         if (line.startsWith('-')) return `<div>– ${line.replace(/^-+\s*/, '')}</div>`;
//         return `<div>${line}</div>`;
//       }).join('');
//     };

//     const htmlContent = `
//       <html>
//         <head>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               padding: 50px;
//               font-size: 13.5px;
//               color: #222;
//               line-height: 1.6;
//             }
//             .header {
//               display: flex;
//               justify-content: space-between;
//               align-items: flex-start;
//               margin-bottom: 20px;
//             }
//             .header h1 {
//               font-size: 24px;
//               margin: 0;
//               text-transform: uppercase;
//             }
//             .title {
//               font-weight: bold;
//               margin-bottom: 10px;
//             }
//             .contact {
//               text-align: right;
//               font-size: 13px;
//               line-height: 1.4;
//             }
//             .section {
//               margin-top: 30px;
//             }
//             .section h2 {
//               font-size: 16px;
//               font-weight: bold;
//               border-bottom: 1px solid #ccc;
//               padding-bottom: 4px;
//               margin-bottom: 12px;
//               text-transform: uppercase;
//             }
//             .entry {
//               margin-bottom: 12px;
//             }
//             .skills {
//               display: flex;
//               flex-wrap: wrap;
//               gap: 4px 8px;
//               margin-top: 6px;
//               align-items: center;
//             }
//             .skill {
//               background-color: #f3f3f3;
//               padding: 2px 6px;
//               border-radius: 4px;
//               font-size: 12px;
//               margin: 2px 0;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div>
//               <h1>${req.body.name?.toUpperCase() || ''}</h1>
//               <div class="title">Computer Science Graduate</div>
//             </div>
//             <div class="contact">
//               ${email ? `<div><strong>Email:</strong> ${email}</div>` : ''}
//               ${phone ? `<div><strong>Phone:</strong> ${phone}</div>` : ''}
//               ${location ? `<div><strong>Location:</strong> ${location}</div>` : ''}
//               ${github ? `<div><strong>GitHub:</strong> ${github}</div>` : ''}
//               ${linkedin ? `<div><strong>LinkedIn:</strong> ${linkedin}</div>` : ''}
//             </div>
//           </div>

//           ${sections.about ? `<div class="section"><h2>About Me</h2><div class="entry">${sections.about}</div></div>` : ''}
//           ${sections.education ? `<div class="section"><h2>Education</h2><div class="entry">${renderEntry(sections.education)}</div></div>` : ''}
//           ${sections.experience ? `<div class="section"><h2>Work Experience</h2><div class="entry">${renderEntry(sections.experience)}</div></div>` : ''}
//           ${sections.skills ? `<div class="section"><h2>Skills</h2><div class="skills">${renderList(sections.skills)}</div></div>` : ''}
//           ${sections.certificates ? `<div class="section"><h2>Certificates</h2><div class="entry">${renderEntry(sections.certificates)}</div></div>` : ''}
//           ${sections.languages ? `<div class="section"><h2>Languages</h2><div class="entry">${renderEntry(sections.languages)}</div></div>` : ''}
//         </body>
//       </html>
//     `;

//     // const browser = await puppeteer.launch({ headless: 'new' });
//     // const browser = await puppeteer.launch({
//     //   headless: 'new',
//     //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     //   executablePath: require('puppeteer').executablePath(), // 👈 Force using bundled Chromium
//     // });
//     // const page = await browser.newPage();
//     // await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
//     // const pdfBuffer = await page.pdf({ format: 'A4', printBackground: false });
//     // await browser.close();
//     const file = { content: htmlContent };
//     const pdfBuffer = await pdf.generatePdf(file, { format: 'A4' });


//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename=cv.pdf'
//     });
//     res.send(pdfBuffer);
//   } catch (err) {
//     console.error('❌ Error generating CV:', err);
//     res.status(500).json({ message: 'Failed to generate CV' });
//   }
// };
