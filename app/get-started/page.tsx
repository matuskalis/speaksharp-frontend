"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import AuthForm from "../components/AuthForm";
import {
  Zap,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  GraduationCap,
  Plane,
  Globe,
  Users,
  Brain,
  Sparkles,
  Clock,
  Check,
  Search,
  User,
  BookOpen,
  Target,
  Trophy,
  Rocket,
  PartyPopper,
} from "lucide-react";

type OnboardingStep = "welcome" | "name" | "language" | "level" | "goals" | "time" | "interests" | "auth" | "complete";

const GOALS = [
  { id: "career", label: "Career", icon: Briefcase },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "personal", label: "Personal", icon: Users },
  { id: "exam", label: "Exam Prep", icon: BookOpen },
];

const TIME_OPTIONS = [
  { id: "casual", minutes: 5, label: "5 min", description: "Quick & easy" },
  { id: "regular", minutes: 15, label: "15 min", description: "Steady progress" },
  { id: "serious", minutes: 30, label: "30 min", description: "Fast improvement" },
  { id: "intense", minutes: 60, label: "60 min", description: "Maximum growth" },
];

const INTERESTS = [
  { id: "business", label: "Business", emoji: "💼" },
  { id: "technology", label: "Technology", emoji: "💻" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "food", label: "Food", emoji: "🍳" },
  { id: "art", label: "Art", emoji: "🎨" },
];

const LANGUAGES = [
  { id: "es", label: "Spanish", flag: "🇪🇸" },
  { id: "zh", label: "Chinese", flag: "🇨🇳" },
  { id: "hi", label: "Hindi", flag: "🇮🇳" },
  { id: "ar", label: "Arabic", flag: "🇸🇦" },
  { id: "pt", label: "Portuguese", flag: "🇵🇹" },
  { id: "bn", label: "Bengali", flag: "🇧🇩" },
  { id: "ru", label: "Russian", flag: "🇷🇺" },
  { id: "ja", label: "Japanese", flag: "🇯🇵" },
  { id: "de", label: "German", flag: "🇩🇪" },
  { id: "fr", label: "French", flag: "🇫🇷" },
  { id: "ko", label: "Korean", flag: "🇰🇷" },
  { id: "it", label: "Italian", flag: "🇮🇹" },
];

const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    range: "A1-A2",
    description: "Just starting out",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "intermediate",
    label: "Intermediate",
    range: "B1-B2",
    description: "Can hold conversations",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "advanced",
    label: "Advanced",
    range: "C1-C2",
    description: "Nearly fluent",
    color: "from-purple-500 to-pink-500"
  },
];

export default function GetStartedPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [formData, setFormData] = useState({
    name: "",
    nativeLanguage: "",
    level: "",
    goals: [] as string[],
    dailyTimeGoal: null as number | null,
    interests: [] as string[],
  });
  const [languageSearch, setLanguageSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const steps: OnboardingStep[] = ["welcome", "name", "language", "level", "goals", "time", "interests", "auth"];
  const currentStepIndex = steps.indexOf(currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case "welcome":
        return true;
      case "name":
        return formData.name.trim().length > 0;
      case "language":
        return formData.nativeLanguage.length > 0;
      case "level":
        return formData.level.length > 0;
      case "goals":
        return formData.goals.length > 0;
      case "time":
        return formData.dailyTimeGoal !== null;
      case "interests":
        return true; // Optional step
      case "auth":
        return !!user;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === "welcome") setCurrentStep("name");
    else if (currentStep === "name") setCurrentStep("language");
    else if (currentStep === "language") setCurrentStep("level");
    else if (currentStep === "level") setCurrentStep("goals");
    else if (currentStep === "goals") setCurrentStep("time");
    else if (currentStep === "time") setCurrentStep("interests");
    else if (currentStep === "interests") {
      if (user) {
        completeOnboarding();
      } else {
        setCurrentStep("auth");
      }
    } else if (currentStep === "auth") {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep === "name") setCurrentStep("welcome");
    else if (currentStep === "language") setCurrentStep("name");
    else if (currentStep === "level") setCurrentStep("language");
    else if (currentStep === "goals") setCurrentStep("level");
    else if (currentStep === "time") setCurrentStep("goals");
    else if (currentStep === "interests") setCurrentStep("time");
    else if (currentStep === "auth") setCurrentStep("interests");
  };

  const handleSkip = () => {
    if (currentStep === "interests") {
      if (user) {
        completeOnboarding();
      } else {
        setCurrentStep("auth");
      }
    }
  };

  const completeOnboarding = async () => {
    setSaving(true);
    setCurrentStep("complete");
    setShowConfetti(true);

    try {
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);

      // Map level to CEFR format
      const levelMapping: Record<string, string> = {
        beginner: "A1",
        intermediate: "B1",
        advanced: "C1",
      };

      await apiClient.updateProfile({
        native_language: formData.nativeLanguage,
        level: levelMapping[formData.level] || formData.level,
        goals: formData.goals,
        daily_time_goal: formData.dailyTimeGoal ?? undefined,
        interests: formData.interests,
        onboarding_completed: true,
        trial_start_date: trialStartDate.toISOString(),
        trial_end_date: trialEndDate.toISOString(),
      });

      // Wait 2 seconds to show the celebration, then redirect to diagnostic test
      setTimeout(() => {
        router.push("/diagnostic");
      }, 2000);
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleGoal = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((id) => id !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const toggleInterest = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.label.toLowerCase().includes(languageSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      {currentStep !== "welcome" && currentStep !== "complete" && (
        <header className="sticky top-0 z-40 bg-dark-100 border-b border-white/[0.08] safe-area-top">
          <div className="flex items-center justify-between px-4 h-14">
            {currentStepIndex > 1 && currentStep !== "auth" ? (
              <button
                onClick={handleBack}
                className="p-2 -ml-2 touch-target flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-text-secondary" />
              </button>
            ) : (
              <div className="w-10" />
            )}

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-text-primary">Vorex</span>
            </div>

            {/* Step indicator */}
            <div className="text-sm text-text-muted">
              {currentStepIndex + 1}/{steps.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-dark-300">
            <motion.div
              className="h-full bg-gradient-brand"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </header>
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* Welcome Screen */}
          {currentStep === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="mb-8"
              >
                <div className="w-24 h-24 bg-gradient-brand rounded-3xl flex items-center justify-center shadow-btn-glow mx-auto mb-6">
                  <Zap className="w-12 h-12 text-white animate-pulse-glow" />
                </div>
                <h1 className="text-4xl font-bold text-text-primary mb-3">
                  Welcome to Vorex
                </h1>
                <p className="text-xl text-text-secondary mb-2">
                  Learn English with AI
                </p>
                <p className="text-text-muted">
                  Your personal AI tutor, available 24/7
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-md space-y-4"
              >
                <button
                  onClick={handleNext}
                  className="w-full py-4 px-6 bg-gradient-brand text-white font-bold text-lg rounded-2xl shadow-btn-glow hover:shadow-btn-glow-hover transition-all press-effect flex items-center justify-center gap-2"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push("/sign-in")}
                  className="w-full py-4 px-6 bg-dark-200 text-text-primary font-semibold rounded-2xl border border-white/[0.08] hover:bg-dark-300 transition-all press-effect"
                >
                  I already have an account
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Name & Basic Info */}
          {currentStep === "name" && (
            <StepContainer key="name">
              <div className="text-center mb-8">
                <User className="w-12 h-12 text-accent-purple mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  What should we call you?
                </h1>
                <p className="text-text-secondary">
                  Let's personalize your experience
                </p>
              </div>

              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your name"
                className="w-full px-6 py-4 bg-dark-200 border-2 border-white/[0.08] rounded-2xl text-text-primary text-lg placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors"
                autoFocus
              />
            </StepContainer>
          )}

          {/* Native Language */}
          {currentStep === "language" && (
            <StepContainer key="language">
              <div className="text-center mb-8">
                <Globe className="w-12 h-12 text-accent-purple mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  What's your native language?
                </h1>
                <p className="text-text-secondary">
                  We'll use this to help you learn better
                </p>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                    placeholder="Search languages..."
                    className="w-full pl-12 pr-4 py-3 bg-dark-200 border border-white/[0.08] rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto scrollbar-hide">
                {filteredLanguages.map((language) => {
                  const isSelected = formData.nativeLanguage === language.id;

                  return (
                    <button
                      key={language.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          nativeLanguage: language.id,
                        }))
                      }
                      className={`p-4 rounded-2xl border-2 transition-all press-effect flex items-center gap-3 ${
                        isSelected
                          ? "border-accent-purple bg-accent-purple/20"
                          : "border-white/[0.08] bg-dark-200"
                      }`}
                    >
                      <span className="text-3xl">{language.flag}</span>
                      <span
                        className={`font-semibold ${
                          isSelected ? "text-accent-purple" : "text-text-primary"
                        }`}
                      >
                        {language.label}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-accent-purple ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </StepContainer>
          )}

          {/* Current Level Assessment */}
          {currentStep === "level" && (
            <StepContainer key="level">
              <div className="text-center mb-8">
                <Target className="w-12 h-12 text-accent-purple mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  How would you describe your English?
                </h1>
                <p className="text-text-secondary">
                  Don't worry, we'll verify this later
                </p>
              </div>

              <div className="space-y-4">
                {LEVELS.map((level) => {
                  const isSelected = formData.level === level.id;

                  return (
                    <button
                      key={level.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, level: level.id }))
                      }
                      className={`w-full p-6 rounded-2xl border-2 transition-all press-effect text-left relative overflow-hidden ${
                        isSelected
                          ? "border-accent-purple bg-accent-purple/20"
                          : "border-white/[0.08] bg-dark-200"
                      }`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <div
                            className={`font-bold text-xl mb-1 ${
                              isSelected
                                ? "text-accent-purple"
                                : "text-text-primary"
                            }`}
                          >
                            {level.label}
                          </div>
                          <div className="text-text-muted text-sm mb-1">
                            {level.range}
                          </div>
                          <div className="text-text-secondary">
                            {level.description}
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-10`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => router.push("/diagnostic")}
                className="w-full mt-4 py-3 px-4 bg-dark-300 text-text-secondary font-semibold rounded-xl border border-white/[0.08] hover:bg-dark-400 transition-all press-effect"
              >
                Take a diagnostic test instead
              </button>
            </StepContainer>
          )}

          {/* Learning Goals */}
          {currentStep === "goals" && (
            <StepContainer key="goals">
              <div className="text-center mb-8">
                <Trophy className="w-12 h-12 text-accent-purple mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  Why are you learning English?
                </h1>
                <p className="text-text-secondary">Select all that apply</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = formData.goals.includes(goal.id);

                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-2xl border-2 transition-all press-effect text-left relative ${
                        isSelected
                          ? "border-accent-purple bg-accent-purple/20"
                          : "border-white/[0.08] bg-dark-200"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                          isSelected ? "bg-gradient-brand" : "bg-dark-300"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            isSelected ? "text-white" : "text-text-muted"
                          }`}
                        />
                      </div>
                      <span
                        className={`font-semibold ${
                          isSelected ? "text-accent-purple" : "text-text-primary"
                        }`}
                      >
                        {goal.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-gradient-brand rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </StepContainer>
          )}

          {/* Daily Commitment */}
          {currentStep === "time" && (
            <StepContainer key="time">
              <div className="text-center mb-8">
                <Clock className="w-12 h-12 text-accent-purple mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  How much time can you practice daily?
                </h1>
                <p className="text-text-secondary">
                  Consistency is key to success
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {TIME_OPTIONS.map((option) => {
                  const isSelected = formData.dailyTimeGoal === option.minutes;

                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          dailyTimeGoal: option.minutes,
                        }))
                      }
                      className={`p-6 rounded-2xl border-2 transition-all press-effect relative ${
                        isSelected
                          ? "border-accent-purple bg-accent-purple/20"
                          : "border-white/[0.08] bg-dark-200"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-5xl font-bold mb-2 ${
                            isSelected
                              ? "text-accent-purple"
                              : "text-text-primary"
                          }`}
                        >
                          {option.label}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {option.description}
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-gradient-brand rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </StepContainer>
          )}

          {/* Topics of Interest */}
          {currentStep === "interests" && (
            <StepContainer key="interests">
              <div className="text-center mb-8">
                <Sparkles className="w-12 h-12 text-accent-purple mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  What topics interest you?
                </h1>
                <p className="text-text-secondary">
                  We'll personalize your content (optional)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((interest) => {
                  const isSelected = formData.interests.includes(interest.id);

                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-4 rounded-2xl border-2 transition-all press-effect flex items-center gap-3 ${
                        isSelected
                          ? "border-accent-purple bg-accent-purple/20"
                          : "border-white/[0.08] bg-dark-200"
                      }`}
                    >
                      <span className="text-2xl">{interest.emoji}</span>
                      <span
                        className={`font-semibold ${
                          isSelected ? "text-accent-purple" : "text-text-primary"
                        }`}
                      >
                        {interest.label}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-accent-purple ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </StepContainer>
          )}

          {/* Auth Step */}
          {currentStep === "auth" && (
            <StepContainer key="auth">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  Create your account
                </h1>
                <p className="text-text-secondary">
                  Save your progress and start learning
                </p>
              </div>

              <AuthForm variant="dark" onSuccess={() => completeOnboarding()} />
            </StepContainer>
          )}

          {/* Complete & Celebrate */}
          {currentStep === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center"
            >
              {showConfetti && (
                <>
                  {[...Array(50)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 1,
                        y: -20,
                        x: Math.random() * window.innerWidth,
                      }}
                      animate={{
                        opacity: 0,
                        y: window.innerHeight,
                        x:
                          Math.random() * window.innerWidth +
                          (Math.random() - 0.5) * 200,
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        ease: "easeOut",
                      }}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          "#6366F1",
                          "#8B5CF6",
                          "#EC4899",
                          "#F59E0B",
                          "#10B981",
                        ][Math.floor(Math.random() * 5)],
                      }}
                    />
                  ))}
                </>
              )}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="mb-8"
              >
                <div className="w-24 h-24 bg-gradient-brand rounded-full flex items-center justify-center shadow-glow-lg mx-auto mb-6">
                  <PartyPopper className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-text-primary mb-3">
                  You're all set, {formData.name}!
                </h1>
                <p className="text-xl text-text-secondary mb-4">
                  Your personalized learning path is ready
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-dark-200 border border-white/[0.08] rounded-2xl p-6 max-w-md mb-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-text-primary mb-1">
                      Your Learning Plan
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {formData.dailyTimeGoal} minutes/day • {LEVELS.find(l => l.id === formData.level)?.label} level
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-text-primary mb-1">
                      Your Goals
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {formData.goals.map(g => GOALS.find(goal => goal.id === g)?.label).join(", ")}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-text-muted"
              >
                Next: Quick diagnostic test to calibrate your AI learning path...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Action */}
      {currentStep !== "auth" && currentStep !== "welcome" && currentStep !== "complete" && (
        <div className="sticky bottom-0 bg-dark-100 border-t border-white/[0.08] p-4 safe-area-bottom">
          {currentStep === "interests" ? (
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-4 rounded-2xl font-semibold text-lg transition-all press-effect bg-dark-300 text-text-secondary border border-white/[0.08] hover:bg-dark-400"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                disabled={saving}
                className="flex-1 py-4 rounded-2xl font-bold text-lg transition-all press-effect flex items-center justify-center gap-2 bg-gradient-brand text-white shadow-btn-glow"
              >
                {saving ? "Saving..." : user ? "Start Learning" : "Continue"}
                {!saving && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed() || saving}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all press-effect flex items-center justify-center gap-2 ${
                canProceed() && !saving
                  ? "bg-gradient-brand text-white shadow-btn-glow"
                  : "bg-dark-300 text-text-muted"
              }`}
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex-1 px-4 py-6 overflow-y-auto"
    >
      {children}
    </motion.div>
  );
}
