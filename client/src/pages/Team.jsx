import React from 'react';
import NavbarPage from '../components/Navbar';
import FooterPage from '../components/Footer';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Bhavesh Rathod",
      role: "Software Engineer",
      photo: "https://media.licdn.com/dms/image/v2/D4D03AQGkKKVFqvQ5fA/profile-displayphoto-crop_800_800/B4DZiZ8DxvHsAI-/0/1754929315570?e=1759363200&v=beta&t=0YeYxY_5gSQQOXO-HtWJh9UpUNFv652NARVS6nfUu3M",
      description: "Experienced Software Engineer with 4+ years of expertise in Python, backend development, and automation. Skilled in building scalable APIs using Django, Flask, and FastAPI, with strong proficiency in AWS, Google Cloud (GCP workflows), and MySQL. Hands-on experience with GenAI, OpenAI, Gemini, RAG, and integrating solutions like Razorpay, Docker, and Kafka. Adept at data preprocessing, document parsing, and delivering cloud-native, real-time applications. Known for adaptability, fast learning, and a results-driven mindset.",
      skills: ["Python", "Regex", "NLTK", "Pandas", "NumPy", "Django", "Flask", "FastAPI", "MySQL", "PostgreSQL", "AWS (S3, EC2, Lambda, RDS, SNS, SFTP, CloudWatch)", "GCP (Workflows, Cloud Services)", "OpenAI", "Gemini", "RAG", "GenAI", "Docker", "Kafka", "Razorpay Integration", "Git", "CI/CD", "Linux Scripting", "Problem-solving", "Adaptability", "Leadership", "Collaboration"],
      linkedin: "https://www.linkedin.com/in/bhaveshkumar-rathod",
      github: "https://github.com/br-bit3194"
    },
    {
      id: 2,
      name: "Tejeshwari Chouhan",
      role: "Senior Software Engineer",
      photo: "https://media.licdn.com/dms/image/v2/D4D03AQHyID5f-FBPJA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1728204076967?e=1759363200&v=beta&t=uCotRVMsAvjxwq2-W39KgpVvA0YmhgSkjKgTjFUD8TY",
      description: "Experienced Software Engineer with 4+ years of expertise in Python, Java, Perl, Bash, Mysql. Hands-on experience with GenAI, OpenAI, Gemini, RAG, Agentic Ai. AI and ML enthusiast. Developed tools that helped to enhance productivity and efficiency of testing team. Implemented process improvements and automation solutions, resulting in 20% increase in productivity. Collaborated with cross-functional team to gather requirements, define project scopes and enhanced business objectives, fostering effective teamwork and project success. Highly interested in data analytics and data science.",
      skills: ["Python", "Java", "Spring", "Bash", "Perl", "MySQL", "Data Analysis", "AI", "ML", "Agentic Ai", "NLTK", "Pandas", "NumPy", "OpenAI", "Gemini", "RAG", "GenAI", "Prototyping", "User Research", "Team Player"],
      linkedin: "www.linkedin.com/in/tejeshwari-chouhan-42194216b",
      github: "https://github.com/Tejeshwari-Chouhan"
    },
    {
      id: 3,
      name: "Atharwa Rathi",
      role: "Student at MIT World Peace University",
      photo: "https://media.licdn.com/dms/image/v2/D4D35AQHQhy3K1pwJJg/profile-framedphoto-shrink_400_400/B4DZjir0CcHYAg-/0/1756149793556?e=1757005200&v=beta&t=kdOF4mPVU5g7-xJPR61Ju5NVC56CKwD3OE4MFuPKzY8",
      description: "Highly motivated Computer Engineering student with a passion for building AI-driven solutions to solve real-world challenges. Proven problem-solver with an entrepreneurial mindset, demonstrated through success in national-level hackathons like ISRO and NASSCOM. Eager to apply skills in Python, AI, and full-stack web development to create innovative and impactful software",
      skills: ["Python", "C++", "JavaScript", "HTML", "React", "Next.js", "Tailwind", "Bootstrap", "MySQL", "Mongo DB"],
      linkedin: "www.linkedin.com/in/atharwa-rathi-6b9767310.",
      github: "https://github.com/Icoder25"
    },
    {
      id: 4,
      name: "Hetvi Khadela",
      role: "Student at Vishwakarma Government Engineering College",
      photo: "https://media.licdn.com/dms/image/v2/D4D03AQHM2CtGJRDT5g/profile-displayphoto-shrink_400_400/B4DZd9T_3nHMAg-/0/1750154086642?e=1759363200&v=beta&t=Khl1xY-H4Gx6vK7uQzuMRXxOZpTJ3l3B4xnvYLn2bC8",
      description: "Aspiring Data Scientist | Explored AI and space-tech innovations through participation in competitive hackathons organized by Scaler, DAIICT, Google, Odoo, and ISRO. Expert in data manipulation(NumPy, Pandas), data visualization(Matplotlib, Seaborn, Power BI), and statistical analysis(Probability, Regression). Strong foundation in Machine Learning. Passionate about leveraging data-driven insights to solve real-world challenges.",
      skills: ["ML algorithm", "Supervised Learning", "Data Analysis", "Statistical Analysis", "Scikit-Learn", "Microsoft Power BI", "Python", "Data Visualization", "SQL", "MongoDB", "Databse", "JAVA"],
      linkedin: "https://www.linkedin.com/in/hetvi-khadela-616b732a0/",
      github: "https://github.com/Hetvi48"
    }
  ];

  return (
    <>
      <NavbarPage />
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/40">
        {/* Header Section */}
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Meet Our
              <span className="block bg-gradient-to-r from-[#0081A7] via-[#00B4D8] to-[#0077B6] bg-clip-text text-transparent">
                FinPal Team
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're a passionate team of students and professionals working together
              to revolutionize personal finance management through innovative technology.
            </p>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 hover:scale-105"
              >
                {/* Photo Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-[#0081A7] font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    {member.linkedin && member.linkedin !== "#" ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#0081A7] text-white rounded-lg hover:bg-[#006B8A] transition-colors duration-200 cursor-pointer"
                        title={`Visit ${member.name}'s LinkedIn`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    ) : (
                      <div className="p-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed" title="LinkedIn not available">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </div>
                    )}

                    {member.github && member.github !== "#" ? (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                        title={`Visit ${member.name}'s GitHub`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    ) : (
                      <div className="p-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed" title="GitHub not available">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-[#0081A7] to-[#00B4D8] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who are already taking control of their financial future with FinPal.
            </p>
          </div>
        </div>
      </div>
      <FooterPage />
    </>
  );
};

export default Team;
