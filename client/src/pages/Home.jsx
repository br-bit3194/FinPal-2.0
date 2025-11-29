import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase/firebase';
import { signInUser } from '../features/auth/authSlice';
import { isAuthenticated } from '../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const u = response.user;
      const formData = { name: u.displayName, email: u.email };
      await dispatch(signInUser(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-in failed', err);
    }
  };

  const features = [
    {
      icon: '📊',
      title: 'Dashboard',
      description: 'Your financial command center. View total income, expenses, and balance at a glance. AI-powered pattern detection analyzes your spending habits with beautiful visualizations including donut charts, trend graphs, and monthly comparisons.',
      color: 'bg-blue-100',
      img: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/aa83524ed66d88c2945e3e59b6bce8aba669908a/Dashboard.png',
      name: 'Dashboard'
    },
    {
      icon: '📈',
      title: 'Income Tracking',
      description: 'Effortlessly track all your income sources. Add transactions manually or upload receipts for auto-fill. Filter by time periods, sort by amount or date, and visualize your income trends with day-by-day breakdowns. Export everything to CSV.',
      color: 'bg-green-100',
      img: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/226be119fe3738958808e793c6cec1c314916b97/Income.png',
      name: 'Income Tracking'
    },
    {
      icon: '📉',
      title: 'Smart Expenses',
      description: 'Master your spending with intelligent expense tracking. Upload receipts for automatic categorization, view category-wise breakdowns with pie charts, and track expense trends. Filter, sort, and export your data effortlessly.',
      color: 'bg-red-100',
      img: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/c6586abbd4677aac1f3899e88129e4c517ee2783/expense.png',
      name: 'Smart Expenses'
    },
    {
      icon: '✨',
      title: 'Genie - AI Advisor',
      description: 'Your personalized saving advisor powered by AI. Get intelligent financial reports with narrative summaries. Set savings goals and receive custom plans tailored to your financial situation. Download comprehensive PDF reports.',
      color: 'bg-purple-100',
      img: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/0ae7907d386ed69991a8bdb5897d1d6e7e0e36f9/chat.png',
      name: 'Genie - AI Advisor'
    },
    {
      icon: '🏆',
      title: 'Epic Challenges',
      description: 'Gamify your financial journey! Create saving challenges, spending reduction quests, and habit-building missions. Track your progress, build legendary streaks, unlock achievements, and level up your financial power.',
      color: 'bg-yellow-100',
      img: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/eada852a87c48c2679a604343c2f8f23aec43fee/challenge.png',
      name: 'Epic Challenges'
    },
    {
      icon: '👤',
      title: 'Complete Profile Control',
      description: 'Manage your account security with 2FA, customize notification preferences for email and push alerts, update personal information, change language and timezone, export your data, or delete your account - full control in your hands.',
      color: 'bg-blue-100',
      img: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/a3df6d5160c7d55519498f929dda75e1be6d83f3/profile.png',
      name: 'Complete Profile Control'
    }
  ];

  const team = [
    {
      name: 'Bhavesh Rathod',
      role: 'CEO & Founder',
      title: 'CEO',
      bio: 'Experienced Software Engineer with 4+ years of expertise in Python, backend development, and automation. Skilled in building scalable APIs using Django, Flask, and FastAPI, with strong proficiency in AWS, Google Cloud (GCP workflows), and MySQL. Hands-on experience with GenAI, OpenAI, Gemini, RAG, and integrating solutions like Razorpay, Docker, and Kafka. Adept at data preprocessing, document parsing, and delivering cloud-native, real-time applications. Known for adaptability, fast learning, and a results-driven mindset.',
      avatar: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/006b1e1a430e10eb1a9581785674e1d9aad0a67f/Bhavesh.jpg',
      linkedin: "https://www.linkedin.com/in/hetvi-khadela-616b732a0/"
    },
    {
      name: 'Tejeshwari Chouhan',
      role: 'CTO',
      title: 'CTO',
      bio: 'A seasoned Software Engineer with over four years of experience in Python, Java, Perl, Bash, and MySQL. I possess hands-on experience in generative AI technologies such as OpenAI, Gemini, RAG, and Agentic AI. As an AI and ML enthusiast, I have developed tools that have significantly enhanced the productivity and efficiency of testing teams. Furthermore, I have implemented process improvements and automation solutions, leading to a 20% increase in productivity. I have collaborated effectively with cross-functional teams to gather requirements, define project scopes, and enhance business objectives. This collaborative approach has fostered a positive work environment and contributed to the success of projects. I am particularly interested in data analytics and data science.',
      avatar: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/0fcee9540c9f244a77fb970d2c0ea3d487667575/Teja.jpeg',
      linkedin: "https://www.linkedin.com/in/hetvi-khadela-616b732a0/"
    },
    {
      name: 'Hetvi Khadela',
      role: 'Head of Design',
      title: 'Head',
      bio: 'Aspiring Data Scientist | Explored AI and space-tech innovations through participation in competitive hackathons organized by Scaler, DAIICT, Google, Odoo, and ISRO. Expert in data manipulation(NumPy, Pandas), data visualization(Matplotlib, Seaborn, Power BI), and statistical analysis(Probability, Regression). Strong foundation in Machine Learning. Passionate about leveraging data-driven insights to solve real-world challenges.',
      avatar: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/0d4a0f4d7cfe480df7c48ae0b86a769cdeb1730c/hetvi.jpg',
      linkedin: "https://www.linkedin.com/in/hetvi-khadela-616b732a0/"
    },
    {
      name: 'Atharwa Rathi',
      role: 'Head of Product',
      title: 'Head',
      bio: 'Highly motivated Computer Engineering student with a passion for building AI-driven solutions to solve real-world challenges. Proven problem-solver with an entrepreneurial mindset, demonstrated through success in national-level hackathons like ISRO and NASSCOM. Eager to apply skills in Python, AI, and full-stack web development to create innovative and impactful software ',
      avatar: 'https://raw.githubusercontent.com/Hetvi48/Portfolio/6baafd19b2edd17af484dd200bec4f6973fe5860/atharwa.jpg',
      linkedin: "https://www.linkedin.com/in/hetvi-khadela-616b732a0/"
    }
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentFeatureIndex((prev) => (prev + newDirection + features.length) % features.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img
                src="public/favicon.svg"
                alt="FinPal Logo"
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-gray-900">FinPal</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">How It Works</a>
              <a href="#team" className="text-gray-700 hover:text-blue-600 transition">Team</a>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                <path d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.4H272v95.6h146.9c-6.3 34-25.6 62.8-54.6 82.1v68.1h88.2c51.6-47.5 81-117.8 81-195.4z" fill="#fff" />
                <path d="M272 544.3c73.7 0 135.6-24.5 180.8-66.5l-88.2-68.1c-24.6 16.6-56.2 26.4-92.6 26.4-71 0-131.2-47.9-152.6-112.3H29.8v70.9C74.9 486.9 168.6 544.3 272 544.3z" fill="#fff" />
                <path d="M119.4 323.8c-10.6-31.7-10.6-65.8 0-97.5V155.4H29.8c-40.5 80.9-40.5 177.7 0 258.6l89.6-70.2z" fill="#fff" />
                <path d="M272 107.7c39.9 0 75.7 13.7 104 40.7l78-78C407.6 24 345.6 0 272 0 168.6 0 74.9 57.4 29.8 155.4l89.6 70.9C140.8 155.6 201 107.7 272 107.7z" fill="#fff" />
              </svg>
              <span className="text-sm font-medium">Sign in with Google</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Master your money like a <span className="text-blue-500">Boss!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Take control of your finances with AI-powered insights, intelligent tracking, and gamified challenges. Your personal financial advisor in your pocket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition shadow-lg text-lg font-medium"
              >
                <svg width="20" height="20" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                  <path d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.4H272v95.6h146.9c-6.3 34-25.6 62.8-54.6 82.1v68.1h88.2c51.6-47.5 81-117.8 81-195.4z" fill="#fff" />
                  <path d="M272 544.3c73.7 0 135.6-24.5 180.8-66.5l-88.2-68.1c-24.6 16.6-56.2 26.4-92.6 26.4-71 0-131.2-47.9-152.6-112.3H29.8v70.9C74.9 486.9 168.6 544.3 272 544.3z" fill="#fff" />
                  <path d="M119.4 323.8c-10.6-31.7-10.6-65.8 0-97.5V155.4H29.8c-40.5 80.9-40.5 177.7 0 258.6l89.6-70.2z" fill="#fff" />
                  <path d="M272 107.7c39.9 0 75.7 13.7 104 40.7l78-78C407.6 24 345.6 0 272 0 168.6 0 74.9 57.4 29.8 155.4l89.6 70.9C140.8 155.6 201 107.7 272 107.7z" fill="#fff" />
                </svg>
                Get Started Free →
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-lg hover:bg-blue-50 transition text-lg font-medium"
              >
                Watch Demo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-500">10K+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">$5M+</div>
                <div className="text-gray-600">Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-500">4.9★</div>
                <div className="text-gray-600">Rating</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
              <img
                src="https://raw.githubusercontent.com/Hetvi48/Portfolio/main/Gemini_2.png"
                alt="Financial Dashboard"
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="text-sm text-gray-600">Master your money</div>
                <div className="text-xl font-bold text-gray-900">like a Boss!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for <span className="text-blue-500">Financial Mastery</span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to take control of your finances, all in one place
          </p>
        </div>

        <div className="relative h-[600px] flex items-center justify-center">
          <button
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 shadow-lg hover:bg-white text-blue-500 transition z-20 hover:scale-110"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 shadow-lg hover:bg-white text-blue-500 transition z-20 hover:scale-110"
            onClick={() => paginate(1)}
          >
            <ChevronRight size={32} />
          </button>

          <div className="w-full max-w-6xl overflow-hidden relative h-full flex items-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentFeatureIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full px-4"
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <div className="order-2 md:order-1">
                    <div className={`w-16 h-16 ${features[currentFeatureIndex].color} rounded-xl flex items-center justify-center text-3xl mb-6`}>
                      {features[currentFeatureIndex].icon}
                    </div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">{features[currentFeatureIndex].title}</h3>
                    <p className="text-gray-600 leading-relaxed text-xl mb-8">{features[currentFeatureIndex].description}</p>
                    <button className="text-blue-500 font-medium hover:text-blue-600 transition text-lg flex items-center gap-2 group">
                      Learn more <ChevronRight size={20} className="group-hover:translate-x-1 transition" />
                    </button>
                  </div>

                  {/* Image */}
                  <div className="order-1 md:order-2">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500">
                      <img
                        src={features[currentFeatureIndex].img}
                        alt={features[currentFeatureIndex].name}
                        className="rounded-2xl shadow-lg w-full h-96 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentFeatureIndex ? 1 : -1);
                setCurrentFeatureIndex(index);
              }}
              className={`h-3 rounded-full transition-all duration-300 ${index === currentFeatureIndex ? 'bg-blue-500 w-8' : 'bg-gray-300 w-3 hover:bg-gray-400'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See <span className="text-blue-500">FinPal</span> in Action
            </h2>
            <p className="text-xl text-gray-600">
              Watch how FinPal transforms the way you manage your finances in just 2 minutes
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/WJa4RrLzGM4"
                title="FinPal Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
                <span className="text-gray-700 font-medium">Complete Platform Tour</span>
                <span className="text-gray-500">2:30 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-blue-500">Dream Team</span>
            </h2>
            <p className="text-xl text-gray-600">
              Passionate experts dedicated to revolutionizing personal finance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="relative inline-block mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto"
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {member.title}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">{member.name}</h3>
                <p className="text-blue-500 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                <div className="flex justify-center gap-4 mt-6">
                  <a href={member.linkedin} className="text-gray-400 hover:text-blue-500 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6" fill="none" stroke="white" strokeWidth="2"></polyline></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="public/favicon.svg"
                  alt="FinPal Logo"
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold text-white">FinPal</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Master your money like a boss! Your AI-powered financial companion for smarter money management.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#" className="hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                </a>
                <a href="#" className="hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="hover:text-white transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.1-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 0z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">Updates</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#team" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Press Kit</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2025 FinPal. All rights reserved.</p>
            <a href="mailto:hello@finpal.com" className="text-sm hover:text-white transition flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6" fill="none" stroke="#1f2937" strokeWidth="2"></polyline></svg>
              hello@finpal.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;