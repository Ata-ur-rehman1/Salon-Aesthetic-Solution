import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProgressSteps = ({ step1, step2, step3 }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1023.20 && window.innerHeight <= 842.40;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const steps = [
    { id: 1, label: "Login", completed: step1 },
    { id: 2, label: "Shipping", completed: step2 },
    { id: 3, label: "Summary", completed: step3 }
  ];

  const StepIcon = ({ completed, stepNumber }) => {
    if (completed) {
      return (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
          stepNumber === 1 || (stepNumber === 2 && step1) || (stepNumber === 3 && step1 && step2)
            ? "border-blue-500 bg-blue-50 text-blue-500"
            : "border-gray-300 bg-gray-50 text-gray-400"
        } shadow-sm`}
      >
        <span className="text-sm font-semibold">{stepNumber}</span>
      </motion.div>
    );
  };

  const ConnectionLine = ({ completed, isActive }) => {
    return (
      <div className={`relative ${isMobile ? 'w-16' : 'w-24'} h-1 mx-2`}>
        {/* Background line */}
        <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
        
        {/* Animated progress line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: completed ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full origin-left"
          style={{ transformOrigin: 'left center' }}
        />
        
        {/* Moving dot */}
        {isActive && (
          <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: '100%', opacity: 1 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute -top-1 w-3 h-3 bg-white rounded-full shadow-lg border border-green-300"
          />
        )}
      </div>
    );
  };

  const StepLabel = ({ label, completed, stepNumber, isActive }) => {
    const isAccessible = 
      stepNumber === 1 || 
      (stepNumber === 2 && step1) || 
      (stepNumber === 3 && step1 && step2);

    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: stepNumber * 0.1 }}
        className={`text-center ${isMobile ? 'w-20' : 'w-28'}`}
      >
        <motion.span
          className={`block text-sm font-medium ${
            completed 
              ? "text-green-600" 
              : isAccessible 
                ? "text-blue-600" 
                : "text-gray-400"
          } ${isActive ? 'font-bold' : ''}`}
          whileHover={isAccessible ? { scale: 1.05 } : {}}
        >
          {label}
        </motion.span>
        
        {/* Subtle status text */}
        <AnimatePresence>
          {completed && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-green-500 font-medium block mt-1"
            >
              Completed
            </motion.span>
          )}
          {isActive && !completed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-blue-500 font-medium block mt-1"
            >
              Current
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const getCurrentStep = () => {
    if (step3) return 3;
    if (step2) return 2;
    if (step1) return 1;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Progress Bar Container */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Icon and Label */}
            <div className="flex flex-col items-center">
              <StepIcon 
                completed={step.completed} 
                stepNumber={step.id}
              />
              <StepLabel 
                label={step.label}
                completed={step.completed}
                stepNumber={step.id}
                isActive={currentStep === step.id}
              />
            </div>

            {/* Connection Line */}
            {index < steps.length - 1 && (
              <ConnectionLine 
                completed={step.completed && steps[index + 1].completed}
                isActive={currentStep === step.id && !steps[index + 1].completed}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.p
          className={`text-lg font-semibold ${
            step3 ? "text-green-600" : "text-blue-600"
          }`}
        >
          {step3 
            ? "🎉 Order Complete!" 
            : step2 
              ? "Almost there! Finalizing your order..." 
              : step1 
                ? "Great! Let's set up shipping..." 
                : "Welcome! Let's get started..."
          }
        </motion.p>
        
        {/* Progress percentage */}
        <motion.div 
          className="mt-4 bg-gray-200 rounded-full h-2 max-w-xs mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: step3 ? '100%' : step2 ? '66%' : step1 ? '33%' : '0%' 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full shadow-lg"
          />
        </motion.div>
        
        <motion.p 
          className="text-sm text-gray-600 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Step {currentStep} of 3
        </motion.p>
      </motion.div>

      {/* Floating celebration particles when complete */}
      <AnimatePresence>
        {step3 && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0, 
                  opacity: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  scale: 1,
                  opacity: [0, 1, 0],
                  x: Math.cos((i * 45 * Math.PI) / 180) * 100,
                  y: Math.sin((i * 45 * Math.PI) / 180) * 100
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute text-2xl"
                style={{
                  left: '50%',
                  top: '50%',
                }}
              >
                {['🎉', '✨', '⭐', '🌟', '💫', '🔥', '💎', '🏆'][i]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressSteps;