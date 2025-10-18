"use client";

import { useState } from "react";
import Agent from "./Agent";

interface InterviewConfig {
  role: string;
  level: string;
  techstack: string[];
}

export default function InterviewContainer({ user }: { user: any }) {
  const [showAgent, setShowAgent] = useState(false);
  const [config, setConfig] = useState<InterviewConfig | null>(null);

  const handleStartInterview = (interviewConfig: InterviewConfig) => {
    console.log("Starting interview with config:", interviewConfig);
    setConfig(interviewConfig);
    setShowAgent(true);
  };

  if (showAgent && config) {
    console.log("Rendering Agent component");
    return (
      <Agent
        userName={user?.name || "Guest"}
        userId={user?.id}
        type="generate"
        role={config.role}
        level={config.level}
        techstack={config.techstack}
      />
    );
  }

  return <InterviewForm onStart={handleStartInterview} />;
}

interface InterviewFormProps {
  onStart: (config: InterviewConfig) => void;
}

function InterviewForm({ onStart }: InterviewFormProps) {
  const [role, setRole] = useState("Full Stack");
  const [level, setLevel] = useState("Junior");
  const [techstack, setTechstack] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState("");

  const techOptions = [
    "React",
    "Node.js",
    "MongoDB",
    "TypeScript",
    "Next.js",
    "Express",
    "PostgreSQL",
    "Docker",
  ];

  const handleTechToggle = (tech: string) => {
    setTechstack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleAddCustomTech = () => {
    if (customTech.trim() && !techstack.includes(customTech.trim())) {
      setTechstack((prev) => [...prev, customTech.trim()]);
      setCustomTech("");
    }
  };

  const handleSubmit = () => {
    console.log("Submit clicked with:", { role, level, techstack });
    
    if (!role || !level || techstack.length === 0) {
      alert("Please select role, level, and at least one technology");
      return;
    }
    
    console.log("Calling onStart");
    onStart({ role, level, techstack });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Animation */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary-100/10 text-primary-200 rounded-full text-sm font-semibold border border-primary-200/30">
              🤖 AI Interview Setup
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Configure Your Interview</h1>
          <p className="text-text-secondary text-lg">
            Customize your practice session to match your target role
          </p>
        </div>

        {/* Main Form Card */}
        <div className="card-modern animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="text-xl">👔</span> Job Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white border-2 border-input text-text-primary px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100/20 focus:border-primary-200 shadow-sm transition-all"
            >
              <option value="Full Stack">Full Stack Developer</option>
              <option value="Frontend">Frontend Developer</option>
              <option value="Backend">Backend Developer</option>
              <option value="DevOps">DevOps Engineer</option>
              <option value="Mobile">Mobile Developer</option>
              <option value="Data Science">Data Scientist</option>
              <option value="UI/UX">UI/UX Designer</option>
            </select>
          </div>

          {/* Level Selection */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="text-xl">📊</span> Experience Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Junior", "Intermediate", "Senior"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    level === lvl
                      ? "bg-gradient-to-r from-primary-100 to-primary-200 text-white shadow-lg scale-105"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-hover border border-border-light"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="text-xl">💻</span> Tech Stack
            </label>

            {/* Available Technologies */}
            <div className="flex flex-wrap gap-3 mb-4">
              {techOptions.map((tech) => (
                <button
                  key={tech}
                  onClick={() => handleTechToggle(tech)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    techstack.includes(tech)
                      ? "bg-gradient-to-r from-accent-100 to-accent-200 text-white shadow-md scale-105"
                      : "bg-white text-text-secondary hover:bg-bg-secondary border-2 border-border-light hover:border-accent-100/50"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>

            {/* Custom Technology Input */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Add custom technology (e.g., GraphQL, Redis)"
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCustomTech()}
                className="flex-1 bg-white border-2 border-input text-text-primary px-4 py-3 rounded-xl placeholder:text-text-muted focus:outline-none focus:ring-4 focus:ring-primary-100/20 focus:border-primary-200 shadow-sm transition-all"
              />
              <button
                onClick={handleAddCustomTech}
                className="px-6 py-3 bg-gradient-to-r from-primary-100 to-primary-200 hover:from-primary-200 hover:to-primary-300 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                Add
              </button>
            </div>

            {/* Selected Technologies */}
            {techstack.length > 0 && (
              <div className="bg-gradient-to-r from-bg-secondary to-white p-4 rounded-xl border border-border-accent">
                <p className="text-sm text-text-secondary mb-3 font-semibold flex items-center gap-2">
                  <span>✓</span> Selected Technologies ({techstack.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {techstack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white border-2 border-primary-200 text-primary-200 rounded-lg font-medium shadow-sm hover:shadow-md transition-all group"
                    >
                      {tech}
                      <button
                        onClick={() => handleTechToggle(tech)}
                        className="hover:text-destructive-100 transition-colors font-bold text-lg group-hover:scale-110"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-accent-100/10 to-primary-100/10 border-l-4 border-accent-100 p-4 rounded-xl mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-semibold text-text-primary mb-1">Pro Tip</p>
                <p className="text-sm text-text-secondary">
                  Select technologies you want to be questioned on. The AI will tailor questions based on your selections.
                </p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleSubmit}
            disabled={techstack.length === 0}
            className="w-full bg-gradient-to-r from-success-100 to-success-200 hover:from-success-200 hover:to-success-100 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
          >
            {techstack.length === 0 ? (
              <span>Select at least one technology to continue</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🚀</span> Start AI Interview
              </span>
            )}
          </button>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="card-modern text-center p-4">
            <div className="text-3xl mb-2">⏱️</div>
            <p className="text-sm font-semibold text-text-primary">15-20 Minutes</p>
            <p className="text-xs text-text-secondary mt-1">Average Duration</p>
          </div>
          
          <div className="card-modern text-center p-4">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm font-semibold text-text-primary">Real-time Feedback</p>
            <p className="text-xs text-text-secondary mt-1">Instant Analysis</p>
          </div>
          
          <div className="card-modern text-center p-4">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm font-semibold text-text-primary">100% Private</p>
            <p className="text-xs text-text-secondary mt-1">Your Data is Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}