import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuizModalProps {
  open: boolean;
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswer: (correct: boolean) => void;
  onSkip: () => void;
}

const QuizModal = ({ open, question, options, correctAnswer, onAnswer, onSkip }: QuizModalProps) => {
  const [selected, setSelected] = useState<string>('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const selectedIndex = parseInt(selected);
    const correct = selectedIndex === correctAnswer;
    setIsCorrect(correct);
    setAnswered(true);
    
    setTimeout(() => {
      onAnswer(correct);
      setAnswered(false);
      setSelected('');
    }, 1500);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Quiz Time! 🎓</DialogTitle>
          <DialogDescription className="text-base mt-2">{question}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <RadioGroup value={selected} onValueChange={setSelected}>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={answered} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className={`cursor-pointer ${
                    answered && index === correctAnswer ? 'text-secondary font-bold' : ''
                  }`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {answered && (
            <div className={`p-3 rounded-lg text-center font-bold ${
              isCorrect ? 'bg-secondary/20 text-secondary' : 'bg-destructive/20 text-destructive'
            }`}>
              {isCorrect ? '✅ Correct! Great job!' : '❌ Not quite. Review the explanation.'}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onSkip} disabled={answered}>
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={!selected || answered}>
            Submit Answer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
