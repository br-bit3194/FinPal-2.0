import React, { useEffect, useState } from 'react';
import { Sparkles, Bot, Send, Target, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getallTransactions } from '../features/transaction/transactionSlice';
import { generateAIReport, generatePersonalChat, generateSavingAdvisor } from '../features/ai/aiSlice';


const FinSight = () => {
    const [showChat, setShowChat] = useState(false);
    // State for the AI-generated monthly report
    const [report, setReport] = useState('');
    const [isReportLoading, setIsReportLoading] = useState(false);

    // State for the conversational Q&A feature
    const [chatHistory, setChatHistory] = useState([]);
    const [userQuery, setUserQuery] = useState('');
    // const [isChatLoading, setIsChatLoading] = useState(false);

    // State for the savings goal advisor
    const [goal, setGoal] = useState({ name: '', amount: '' });
    const [advice, setAdvice] = useState('');
    // const [isAdviceLoading, setIsAdviceLoading] = useState(false);

    //AI LOGICS
    const {transactions} = useSelector(state => state.transaction)
    const {aiPlan ,  aiReport, isLoading, isAdviceLoading , isError, isSuccess, message , aiChat , isChatLoading} = useSelector(state => state.ai)
        
        const dispatch = useDispatch();

        const [htmlReport, setHtmlReport] = useState("");
        const [htmlPlan, setHtmlPlan] = useState("");

        // Fetch all transactions when component mounts
        useEffect(() => {
        dispatch(getallTransactions());
        }, [dispatch]);

        //Formate the Report 
        useEffect(() => {
        if (isSuccess && aiReport) {
            // aiReport looks like: { report: "```html ... ```" }
            let rawReport = aiReport || "";
            // More robust cleaning of markdown fences and any extra content
            let cleanReport = rawReport
                .replace(/```html|```/g, "") // strip markdown fences
                .replace(/^\s*[\r\n]+/gm, "") // remove leading/trailing whitespace
                .trim();
            
            console.log('Raw AI Report:', rawReport);
            console.log('Cleaned Report:', cleanReport);
            
            // Ensure it's valid HTML by wrapping in a div if needed
            if (!cleanReport.startsWith('<')) {
                cleanReport = `<div>${cleanReport}</div>`;
            }
            
            setHtmlReport(cleanReport);
        }

        if (isError) {
            console.error(message);
        }
        }, [isSuccess, isError, aiReport, message]);

        // Ensure hidden div is updated when htmlReport changes
        useEffect(() => {
            if (htmlReport) {
                const hiddenDiv = document.getElementById('pdf-report-clean');
                if (hiddenDiv) {
                    hiddenDiv.innerHTML = htmlReport;
                    console.log('Hidden div updated with:', htmlReport);
                }
            }
        }, [htmlReport]);

        //Formate the Plan 
        useEffect(() => {
        if (isSuccess && aiPlan) {
            // aiReport looks like: { report: "```html ... ```" }
            let rawPlan = aiPlan || "";
            let cleanPlan = rawPlan.replace(/```html|```/g, ""); // strip markdown fences
            setHtmlPlan(cleanPlan);
        }

        if (isError) {
            console.error(message);
        }
        }, [isSuccess, isError, aiPlan, message]);

        // console.log(htmlReport)

        // Generate report
        const handleGenerateReport = () => {
            dispatch(generateAIReport());
        };

        // Whenever aiReport updates, clean it up & set into htmlReport

    /**
     * Simulates sending a user query to the AI and getting a response.
     */
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!userQuery.trim() || isChatLoading) return;

        const newHistory = [...chatHistory, { type: 'user', text: userQuery }];
        setChatHistory(newHistory);
        setUserQuery('');
        // setIsChatLoading(true);

        // TODO: Replace with actual API call to your backend
        // setTimeout(() => {
        //     const sampleResponse = "Your expenses last month were higher mainly because of a ₹9,000 charge for 'Phone Repair'. Your spending on 'Shopping' also increased by about 30% compared to your recent average. Your regular costs like 'Rent' and 'Utilities' remained stable.";
        //     setChatHistory([...newHistory, { type: 'ai', text: sampleResponse }]);
        //     // setIsChatLoading(false);
        // }, 1500);

        dispatch(generatePersonalChat(userQuery))
        // setChatHistory([...newHistory, { type: 'ai', text: aiChat }]);

    };

    useEffect(() => {
        if(isSuccess && aiChat) {
            setChatHistory([...chatHistory , {type : 'ai' , text : aiChat} ])
        }

        if(isError) {
            console.log(message)
        }
    } , [isError , isSuccess , aiChat , message])

    /**
     * Simulates generating a personalized savings plan from the AI.
     */
    const handleGenerateAdvice = () => {
        if (!goal.name || !goal.amount) return;

        const formData = {
            goal: goal.name,
            amount: goal.amount
        };

        // console.log(formData)

        dispatch(generateSavingAdvisor(formData));
    };

    // Download PDF handler (place this above the return statement)
    const handleDownloadPDF = () => {
        if (!htmlReport) {
            alert('Report is not ready yet. Please generate the report first.');
            return;
        }
        
        console.log('htmlReport content:', htmlReport);
        
        // Always use the hidden clean report div for PDF export
        const cleanReport = document.getElementById('pdf-report-clean');
        console.log('cleanReport element:', cleanReport);
        console.log('cleanReport innerHTML:', cleanReport ? cleanReport.innerHTML : 'null');
        
        if (!cleanReport || !cleanReport.innerHTML.trim()) {
            alert('Report content is missing or not ready. Please try generating the report again.');
            return;
        }
        
        // Clone the node to avoid jsPDF/DOM issues
        const clone = cleanReport.cloneNode(true);
        clone.style.display = 'block';
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.width = '800px';
        clone.style.background = '#fff';
        clone.style.fontFamily = 'Arial, sans-serif';
        clone.style.fontSize = '14px';
        clone.style.lineHeight = '1.5';
        clone.style.padding = '20px';
        document.body.appendChild(clone);
        
        console.log('Clone innerHTML:', clone.innerHTML);
        
        setTimeout(() => {
            // Use html2canvas for more reliable HTML to PDF conversion
            import('html2canvas').then(({ default: html2canvas }) => {
                import('jspdf').then(({ default: jsPDF }) => {
                    html2canvas(clone, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#fff',
                        width: 800,
                        height: clone.scrollHeight
                    }).then(canvas => {
                        const imgData = canvas.toDataURL('image/png');
                        const pdf = new jsPDF({
                            orientation: 'portrait',
                            unit: 'mm',
                            format: 'a4'
                        });
                        
                        const imgWidth = 210; // A4 width in mm
                        const pageHeight = 295; // A4 height in mm
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        let heightLeft = imgHeight;
                        
                        let position = 0;
                        
                        // Add first page
                        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                        
                        // Add additional pages if content is longer
                        while (heightLeft >= 0) {
                            position = heightLeft - imgHeight;
                            pdf.addPage();
                            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;
                        }
                        
                        pdf.save('FinSight_Report.pdf');
                        document.body.removeChild(clone);
                    }).catch(err => {
                        console.error('Error generating canvas:', err);
                        document.body.removeChild(clone);
                        alert('Error generating PDF. Please try again.');
                    });
                }).catch(err => {
                    console.error('Error importing jsPDF:', err);
                    document.body.removeChild(clone);
                });
            }).catch(err => {
                console.error('Error importing html2canvas:', err);
                document.body.removeChild(clone);
            });
        }, 1000); // Increased timeout for html2canvas
    };

    // console.log(transactions)

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50/90 to-[#0081A7]/5 p-6 ml-0 sm:ml-0 pt-20'>
      <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-10 h-10 text-[#0081A7]" />
                    <h1 className="text-4xl font-bold text-gray-800">
                        🧠 AI <span className="text-[#0081A7]">Financial Oracle</span> 🔮
                    </h1>
                </div>
                <p className="text-gray-600 ml-1">Your personal AI-powered financial genius that sees what others can't! 🚀✨</p>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-4xl mx-auto space-y-6">
                {/* 1. Intelligent Monthly Report */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-xl border border-[#0081A7]/20">
                                <Calendar className="w-6 h-6 text-[#0081A7]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Intelligent Report</h3>
                                <p className="text-sm text-gray-500">Get a narrative summary of your finances.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                              onClick={handleGenerateReport}
                              disabled={isLoading}
                              className="px-4 py-2 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] text-white rounded-xl hover:from-[#0081A7]/90 hover:to-[#00B4D8]/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                              {isLoading ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                  <Sparkles className="w-5 h-5" />
                              )}
                              <span>{isLoading ? "Analyzing..." : "Generate"}</span>
                          </button>
                          <button
                              onClick={handleDownloadPDF}
                              disabled={!htmlReport || isLoading}
                              className="px-4 py-2 bg-gradient-to-r from-[#00B4D8] to-[#0081A7] text-white rounded-xl hover:from-[#00B4D8]/90 hover:to-[#0081A7]/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                              Download PDF
                          </button>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-gradient-to-br from-[#0081A7]/5 to-[#00B4D8]/5 rounded-lg border border-[#0081A7]/10 min-h-[150px] flex items-center justify-center">
                        {isLoading && (
                            <Loader2 className="w-8 h-8 text-[#0081A7] animate-spin" />
                        )}
                        {htmlReport && !isLoading && (
                            <>
                                <div className="text-gray-700 w-full" dangerouslySetInnerHTML={{ __html: htmlReport }} />
                            </>
                        )}
                        {!htmlReport && !isLoading && (
                            <p className="text-gray-500 text-center">Click 'Generate' to get your AI-powered financial report.</p>
                        )}
                    </div>
                    
                    {/* Hidden clean HTML for PDF export - always present */}
                    <div
                      id="pdf-report-clean"
                      style={{
                        display: 'none',
                        position: 'absolute',
                        left: '-9999px',
                        top: 0,
                        width: '800px',
                        background: '#fff',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}
                      dangerouslySetInnerHTML={{ __html: htmlReport || '<p>No report available</p>' }}
                    />
                </div>
                {/* 2. Personalized Savings Advisor */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-xl border border-[#0081A7]/20">
                            <Target className="w-6 h-6 text-[#0081A7]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Personalized Savings Advisor</h3>
                            <p className="text-sm text-gray-500">Set a goal and get a custom plan.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Goal Name (e.g., Goa Trip)"
                            value={goal.name}
                            onChange={(e) => setGoal({ ...goal, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800"
                        />
                        <input
                            type="number"
                            placeholder="Amount (₹)"
                            value={goal.amount}
                            onChange={(e) => setGoal({ ...goal, amount: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800"
                        />
                        <button
                            onClick={handleGenerateAdvice}
                            disabled={isAdviceLoading || !goal.name || !goal.amount}
                            className="w-full px-4 py-2 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] text-white rounded-xl hover:from-[#0081A7]/90 hover:to-[#00B4D8]/90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAdviceLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                            <span>{isAdviceLoading ? 'Crafting Plan...' : 'Get Advice'}</span>
                        </button>
                    </div>
                    <div className="mt-4 p-4 bg-gradient-to-br from-[#0081A7]/5 to-[#00B4D8]/5 rounded-lg border border-[#0081A7]/10 min-h-[150px] flex items-center justify-center">
                        {isAdviceLoading && <Loader2 className="w-8 h-8 text-[#0081A7] animate-spin" />}
                        {aiPlan && !isAdviceLoading && (
                            <div className="text-gray-700 w-full" dangerouslySetInnerHTML={{ __html: htmlPlan }} />
                        )}
                        {!aiPlan && !isAdviceLoading && (
                            <p className="text-gray-500 text-center">Define your goal and click 'Get Advice' for a personalized savings plan.</p>
                        )}
                        {isError && (
                            <p className="text-red-500 text-center">{aiPlan}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Chatbot Button and Modal */}
            <button
                className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center hover:scale-110 transition-all"
                onClick={() => setShowChat(true)}
                aria-label="Open Financial Chat"
            >
                <Bot className="w-8 h-8" />
            </button>

            {showChat && (
                <div className="fixed bottom-28 right-8 z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 flex flex-col w-80 h-[32rem]">
                    <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-xl border border-[#0081A7]/20">
                            <Bot className="w-6 h-6 text-[#0081A7]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Financial Chat</h3>
                            <p className="text-sm text-gray-500">Ask me anything about your finances.</p>
                        </div>
                        <button className="ml-auto text-gray-400 hover:text-[#0081A7]" onClick={() => setShowChat(false)} aria-label="Close Chat">✕</button>
                    </div>
                    <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                        {chatHistory.length === 0 && (
                            <div className="flex gap-3">
                                <div className="p-2 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-full h-fit">
                                    <Bot className="w-5 h-5 text-[#0081A7]" />
                                </div>
                                <div className="bg-gradient-to-br from-[#0081A7]/5 to-[#00B4D8]/5 p-3 rounded-lg rounded-tl-none border border-[#0081A7]/10 text-sm text-gray-700">
                                    Hello! How can I help you today? You can ask things like "Why were my expenses high last month?" or "Summarize my spending on food".
                                </div>
                            </div>
                        )}
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.type === 'ai' && (
                                    <div className="p-2 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-full h-fit">
                                        <Bot className="w-5 h-5 text-[#0081A7]" />
                                    </div>
                                )}
                                <div className={`p-3 rounded-lg text-sm max-w-xs md:max-w-sm ${msg.type === 'user' ? 'bg-[#0081A7] text-white rounded-br-none' : 'bg-gradient-to-br from-[#0081A7]/5 to-[#00B4D8]/5 border border-[#0081A7]/10 text-gray-700 rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex gap-3">
                                <div className="p-2 bg-gradient-to-r from-[#0081A7]/10 to-[#00B4D8]/10 rounded-full h-fit">
                                    <Bot className="w-5 h-5 text-[#0081A7]" />
                                </div>
                                <div className="bg-gradient-to-br from-[#0081A7]/5 to-[#00B4D8]/5 p-3 rounded-lg rounded-tl-none border border-[#0081A7]/10 text-sm text-gray-700">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 flex items-center gap-3">
                        <input
                            type="text"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder="Ask a question..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/50 bg-gray-50 text-gray-800"
                        />
                        <button type="submit" disabled={isChatLoading || !userQuery.trim()} className="p-3 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] text-white rounded-lg hover:from-[#0081A7]/90 hover:to-[#00B4D8]/90 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50">
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}
    </div>
  )
}

export default FinSight