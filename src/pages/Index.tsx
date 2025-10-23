import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Play, SkipForward, RotateCcw, Pause, FastForward, BookOpen } from 'lucide-react';
import StackVisual from '@/components/game/StackVisual';
import BoatVisual from '@/components/game/BoatVisual';
import ConfettiEffect from '@/components/game/ConfettiEffect';
import QuizModal from '@/components/game/QuizModal';
import Scoreboard from '@/components/game/Scoreboard';
import { PDA_TEMPLATES } from '@/types/pda';
import type { MicroStep, StackSymbol, PDAState } from '@/types/pda';

const Index = () => {
  // Game state
  const [input, setInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(PDA_TEMPLATES[0].id);
  const [batchMode, setBatchMode] = useState(false);
  const [predictionEnabled, setPredictionEnabled] = useState(true);
  const [prediction, setPrediction] = useState<'accept' | 'reject' | null>(null);
  
  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<MicroStep[]>([]);
  const [stack, setStack] = useState<StackSymbol[]>([]);
  const [currentState, setCurrentState] = useState<PDAState>('q0');
  const [boatPosition, setBoatPosition] = useState(0);
  const [animatingPush, setAnimatingPush] = useState(false);
  const [animatingPop, setAnimatingPop] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalResult, setFinalResult] = useState<'accept' | 'reject' | null>(null);
  
  // Visual effects
  const [showConfetti, setShowConfetti] = useState(false);
  const [sinking, setSinking] = useState(false);
  
  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState<{
    question: string;
    options: string[];
    correctAnswer: number;
  } | null>(null);
  
  // Scoreboard
  const [totalPlayed, setTotalPlayed] = useState(0);
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [correctPredictions, setCorrectPredictions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  // Get current template
  const template = PDA_TEMPLATES.find(t => t.id === selectedTemplate) || PDA_TEMPLATES[0];

  // Generate steps from input
  const generateSteps = (inputStr: string): MicroStep[] => {
    const generatedSteps: MicroStep[] = [];
    let tempStack: StackSymbol[] = [];
    let tempState: PDAState = 'q0';
    let stepNum = 0;

    // Process each character
    const chars = inputStr.split('');
    
    if (batchMode) {
      // Batch mode: detect runs of same symbol
      let i = 0;
      while (i < chars.length) {
        const currentChar = chars[i];
        let runLength = 1;
        
        // Count consecutive identical symbols
        while (i + runLength < chars.length && chars[i + runLength] === currentChar) {
          runLength++;
        }
        
        // Process each micro-step in the run
        for (let j = 0; j < runLength; j++) {
          const stackBefore = [...tempStack];
          const result = template.rule(currentChar, tempStack, tempState);
          
          if (result.reject) {
            generatedSteps.push({
              step: ++stepNum,
              symbol: currentChar,
              operation: `Reject: Cannot process '${currentChar}'`,
              stackBefore,
              stackAfter: tempStack,
              state: 'qreject',
              explanation: result.pop && tempStack.length === 0 
                ? `Cannot pop from empty stack while reading '${currentChar}'`
                : `Invalid transition for '${currentChar}' in state ${tempState}`,
              error: 'Rejected'
            });
            return generatedSteps;
          }
          
          // Apply operations
          if (result.pop && result.pop > 0) {
            for (let p = 0; p < result.pop; p++) {
              if (tempStack.length === 0) {
                generatedSteps.push({
                  step: ++stepNum,
                  symbol: currentChar,
                  operation: `Error: Pop from empty stack`,
                  stackBefore,
                  stackAfter: tempStack,
                  state: 'qreject',
                  explanation: `Cannot pop from empty stack`,
                  error: 'Stack underflow'
                });
                return generatedSteps;
              }
              tempStack.pop();
            }
          }
          
          if (result.push) {
            tempStack.push(...result.push);
          }
          
          tempState = result.newState;
          
          const operation = result.push 
            ? `Push ${result.push.join(', ')}` 
            : result.pop 
            ? `Pop ${result.pop}` 
            : 'No operation';
          
          generatedSteps.push({
            step: ++stepNum,
            symbol: currentChar,
            operation: `Read '${currentChar}' → ${operation} (run ${j + 1}/${runLength})`,
            stackBefore,
            stackAfter: [...tempStack],
            state: tempState,
            explanation: `Processing symbol '${currentChar}' (${j + 1} of ${runLength} consecutive)`
          });
        }
        
        i += runLength;
      }
    } else {
      // Micro-step mode: process each character
      for (const char of chars) {
        const stackBefore = [...tempStack];
        const result = template.rule(char, tempStack, tempState);
        
        if (result.reject) {
          generatedSteps.push({
            step: ++stepNum,
            symbol: char,
            operation: `Reject: Cannot process '${char}'`,
            stackBefore,
            stackAfter: tempStack,
            state: 'qreject',
            explanation: result.pop && tempStack.length === 0 
              ? `Cannot pop from empty stack while reading '${char}'`
              : `Invalid transition for '${char}' in state ${tempState}`,
            error: 'Rejected'
          });
          return generatedSteps;
        }
        
        // Apply operations
        if (result.pop && result.pop > 0) {
          for (let p = 0; p < result.pop; p++) {
            if (tempStack.length === 0) {
              generatedSteps.push({
                step: ++stepNum,
                symbol: char,
                operation: `Error: Pop from empty stack`,
                stackBefore,
                stackAfter: tempStack,
                state: 'qreject',
                explanation: `Cannot pop from empty stack`,
                error: 'Stack underflow'
              });
              return generatedSteps;
            }
            tempStack.pop();
          }
        }
        
        if (result.push) {
          tempStack.push(...result.push);
        }
        
        tempState = result.newState;
        
        const operation = result.push 
          ? `Push ${result.push.join(', ')}` 
          : result.pop 
          ? `Pop ${result.pop}` 
          : 'No operation';
        
        generatedSteps.push({
          step: ++stepNum,
          symbol: char,
          operation: `Read '${char}' → ${operation}`,
          stackBefore,
          stackAfter: [...tempStack],
          state: tempState,
          explanation: `Processed symbol '${char}' in state ${tempState}`
        });
      }
    }
    
    // Final acceptance check
    const finalResult = template.rule('', tempStack, tempState);
    const accepted = finalResult.accept || (finalResult.newState === 'qaccept');
    
    generatedSteps.push({
      step: ++stepNum,
      symbol: '',
      operation: accepted ? 'Accept' : 'Reject',
      stackBefore: [...tempStack],
      stackAfter: tempStack,
      state: accepted ? 'qaccept' : 'qreject',
      explanation: accepted 
        ? `Input accepted! Stack is ${tempStack.length === 0 ? 'empty' : 'valid'}.`
        : `Input rejected. Stack has ${tempStack.length} items remaining.`
    });
    
    return generatedSteps;
  };

  // Start simulation
  const handleStart = () => {
    if (!input.trim()) {
      toast.error('Please enter an input string');
      return;
    }

    const generatedSteps = generateSteps(input);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setStack([]);
    setCurrentState('q0');
    setBoatPosition(0);
    setIsRunning(true);
    setIsComplete(false);
    setFinalResult(null);
    setSinking(false);
    setShowConfetti(false);
    toast.success('Simulation started!');
  };

  // Next step
  const handleNextStep = () => {
    if (currentStep >= steps.length) return;

    const step = steps[currentStep];
    
    // Animate push/pop
    if (step.operation.includes('Push')) {
      setAnimatingPush(true);
      setTimeout(() => setAnimatingPush(false), 500);
    } else if (step.operation.includes('Pop')) {
      setAnimatingPop(true);
      setTimeout(() => setAnimatingPop(false), 400);
    }
    
    setStack(step.stackAfter);
    setCurrentState(step.state);
    setBoatPosition(Math.min(((currentStep + 1) / steps.length) * 100, 100));
    
    // Check for quiz trigger (every 3 steps)
    if (currentStep > 0 && currentStep % 3 === 0 && !showQuiz) {
      triggerQuiz();
    }
    
    if (currentStep === steps.length - 1) {
      // Final step
      setIsComplete(true);
      const accepted = step.state === 'qaccept';
      setFinalResult(accepted ? 'accept' : 'reject');
      
      // Update scoreboard
      setTotalPlayed(prev => prev + 1);
      if (accepted) {
        setTotalAccepted(prev => prev + 1);
        setShowConfetti(true);
        
        if (prediction === 'accept') {
          setCorrectPredictions(prev => prev + 1);
          setCurrentStreak(prev => prev + 1);
          toast.success('🎉 Correct prediction! Bonus points!');
        } else {
          setCurrentStreak(0);
        }
      } else {
        setSinking(true);
        setCurrentStreak(0);
        
        if (prediction === 'reject') {
          setCorrectPredictions(prev => prev + 1);
          toast.success('Correct prediction!');
        }
      }
      
      setTimeout(() => {
        toast(accepted ? '✅ The boat sails smoothly!' : '❌ Oh no! The boat sank!', {
          description: step.explanation
        });
      }, 500);
    }
    
    setCurrentStep(prev => prev + 1);
  };

  // Run to end
  const handleRunToEnd = async () => {
    for (let i = currentStep; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, batchMode ? 300 : 600));
      handleNextStep();
    }
  };

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setSteps([]);
    setStack([]);
    setCurrentState('q0');
    setBoatPosition(0);
    setIsComplete(false);
    setFinalResult(null);
    setSinking(false);
    setShowConfetti(false);
    setPrediction(null);
    toast.info('Game reset');
  };

  // Quiz system
  const triggerQuiz = () => {
    const quizzes = [
      {
        question: 'What happens if the stack is empty and we try to pop?',
        options: ['Push a new symbol', 'Reject immediately', 'Continue normally', 'Accept the input'],
        correctAnswer: 1
      },
      {
        question: 'What is the acceptance condition for most PDAs?',
        options: ['Stack is full', 'Stack is empty at the end', 'Input is consumed', 'State is q1'],
        correctAnswer: 1
      },
      {
        question: 'In batch mode, what does "run length" mean?',
        options: ['Total input length', 'Consecutive identical symbols', 'Stack height', 'Number of states'],
        correctAnswer: 1
      }
    ];
    
    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    setQuizData(quiz);
    setShowQuiz(true);
  };

  const handleQuizAnswer = (correct: boolean) => {
    if (correct) {
      toast.success('Correct answer! 🎓');
    } else {
      toast.error('Incorrect. Review the steps!');
    }
    setShowQuiz(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            🚢 PDA Story Boat — Realtime Mode
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn Pushdown Automata through interactive animations!
          </p>
        </div>

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-primary">Controls</h2>
            
            <div className="space-y-2">
              <Label>Select PDA Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PDA_TEMPLATES.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <p className="text-xs text-accent">Examples: {template.examples.join(', ')}</p>
            </div>

            <div className="space-y-2">
              <Label>Input String</Label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input (e.g., aabb)"
                disabled={isRunning}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Batch Mode</Label>
              <Switch checked={batchMode} onCheckedChange={setBatchMode} disabled={isRunning} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Enable Prediction</Label>
              <Switch checked={predictionEnabled} onCheckedChange={setPredictionEnabled} />
            </div>

            {predictionEnabled && !isRunning && (
              <div className="space-y-2">
                <Label>Your Prediction</Label>
                <div className="flex gap-2">
                  <Button
                    variant={prediction === 'accept' ? 'default' : 'outline'}
                    onClick={() => setPrediction('accept')}
                    className="flex-1"
                  >
                    ✅ Accept
                  </Button>
                  <Button
                    variant={prediction === 'reject' ? 'default' : 'outline'}
                    onClick={() => setPrediction('reject')}
                    className="flex-1"
                  >
                    ❌ Reject
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-4">
              {!isRunning ? (
                <Button onClick={handleStart} className="w-full" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Start Simulation
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleNextStep} 
                    disabled={isComplete}
                    className="w-full"
                    size="lg"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Next Step
                  </Button>
                  <Button 
                    onClick={handleRunToEnd} 
                    disabled={isComplete}
                    variant="secondary"
                    className="w-full"
                  >
                    <FastForward className="w-4 h-4 mr-2" />
                    Run to End
                  </Button>
                </>
              )}
              
              <Button onClick={handleReset} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <Scoreboard
              totalPlayed={totalPlayed}
              totalAccepted={totalAccepted}
              correctPredictions={correctPredictions}
              currentStreak={currentStreak}
            />
          </Card>

          {/* Center: Visualization */}
          <Card className="lg:col-span-2 p-6 space-y-6">
            <h2 className="text-2xl font-bold text-primary">Visualization</h2>
            
            <div className="flex justify-between items-center">
              <StackVisual
                stack={stack}
                animatingPush={animatingPush}
                animatingPop={animatingPop}
              />
              
              <div className="flex-1 px-8">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">Current State</h3>
                    <div className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full text-xl font-bold">
                      {currentState}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Current Input</h3>
                    <div className="bg-muted rounded-lg p-4 font-mono text-lg break-all">
                      {currentStep > 0 && steps[currentStep - 1] ? (
                        <>
                          <span className="text-muted-foreground">{input.slice(0, currentStep)}</span>
                          <span className="bg-accent text-accent-foreground px-1 rounded">
                            {steps[currentStep - 1].symbol || ''}
                          </span>
                          <span>{input.slice(currentStep)}</span>
                        </>
                      ) : (
                        input || 'No input'
                      )}
                    </div>
                  </div>
                  
                  {currentStep > 0 && steps[currentStep - 1] && (
                    <div className="bg-card border-2 border-primary/30 rounded-lg p-4">
                      <h4 className="font-bold mb-2">Step {steps[currentStep - 1].step}</h4>
                      <p className="text-sm">{steps[currentStep - 1].operation}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {steps[currentStep - 1].explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">River Journey</h3>
              <BoatVisual
                position={boatPosition}
                sinking={sinking}
                sailing={isRunning}
              />
            </div>

            {/* Progress indicator */}
            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{currentStep} / {steps.length}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Step-by-step explanation */}
        {steps.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Step-by-Step Solution
            </h2>
            <Textarea
              value={steps.map((s, i) => 
                `Step ${s.step}: ${s.operation}\n  Stack: [${s.stackBefore.join(', ')}] → [${s.stackAfter.join(', ')}]\n  State: ${s.state}\n  ${s.explanation}${s.error ? ` (${s.error})` : ''}`
              ).join('\n\n')}
              readOnly
              className="font-mono text-sm h-64"
            />
          </Card>
        )}
      </div>

      <ConfettiEffect active={showConfetti} />
      
      {quizData && (
        <QuizModal
          open={showQuiz}
          question={quizData.question}
          options={quizData.options}
          correctAnswer={quizData.correctAnswer}
          onAnswer={handleQuizAnswer}
          onSkip={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
};

export default Index;
