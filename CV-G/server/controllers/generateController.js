const { OpenAI } = require('openai');
const puppeteer = require('puppeteer');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateCV = async (req, res) => {
  try {
    // const { name, email, phone, location, education, experience, skills, github, linkedin } = req.body;
    const {
      name, email, phone, location,
      university, major, gpa,
      company, jobTitle, duration, description,
      skills, github, linkedin
    } = req.body;

    // let userInfo = `Name: ${name}\nEmail: ${email}`;
    // if (phone) userInfo += `\nPhone: ${phone}`;
    // if (location) userInfo += `\nLocation: ${location}`;
    // if (github) userInfo += `\nGitHub: ${github}`;
    // if (linkedin) userInfo += `\nLinkedIn: ${linkedin}`;
    // if (education) userInfo += `\nEducation:\n${education}`;
    // if (experience) userInfo += `\nExperience:\n${experience}`;
    // if (skills) userInfo += `\nSkills:\n${skills}`;

    let userInfo = `Name: ${name}\nEmail: ${email}`;
    if (phone) userInfo += `\nPhone: ${phone}`;
    if (location) userInfo += `\nLocation: ${location}`;
    if (github) userInfo += `\nGitHub: ${github}`;
    if (linkedin) userInfo += `\nLinkedIn: ${linkedin}`;

    let educationText = '';
    if (university || major || gpa) {
      educationText = `Degree: ${major || 'N/A'}\nUniversity: ${university || 'N/A'}`;
      if (gpa) educationText += `\nGPA: ${gpa}`;
      userInfo += `\nEducation:\n${educationText}`;
    }

    let experienceText = '';
    if (company || jobTitle || duration || description) {
      experienceText = `${jobTitle || 'Job Title'} at ${company || 'Company'}\n${duration || ''}`;
      if (description) experienceText += `\n${description}`;
      userInfo += `\nExperience:\n${experienceText}`;
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
    cvText = cvText.replace(/```[\s\S]*?```/g, '').replace(/```/g, '').replace(/\n{3,}/g, '\n\n').trim();

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
              <h1>${req.body.name?.toUpperCase() || ''}</h1>
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

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: false });
    await browser.close();

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
