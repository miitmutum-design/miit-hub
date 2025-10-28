'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleReviewAnalysis, FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bot, Star, FileText, PlusCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full text-lg py-6">
      {pending ? 'Analyzing...' : 'Analyze Reviews with AI'}
      <Bot className="ml-2 h-5 w-5" />
    </Button>
  );
}

export default function ReviewAnalysis({ initialReviews }: { initialReviews: string[] }) {
  const [state, formAction] = useActionState(handleReviewAnalysis, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [reviews, setReviews] = useState<string[]>(['']);

  useEffect(() => {
    if (state.message && state.message !== 'Analysis successful!') {
      const description = state.errors?.reviews ? state.errors.reviews.join(' ') : state.message;
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: description,
      });
    }
    if (state.message === 'Analysis successful!') {
      formRef.current?.reset();
      setReviews(['']);
    }
  }, [state, toast]);

  const addReviewInput = () => {
    setReviews([...reviews, '']);
  };

  const handleReviewChange = (index: number, value: string) => {
    const newReviews = [...reviews];
    newReviews[index] = value;
    setReviews(newReviews);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <FileText className="text-primary"/>
                        Community Reviews
                    </CardTitle>
                    <CardDescription>
                        A glimpse of what people are saying.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {initialReviews.map((review, index) => (
                        <div key={index} className="p-3 rounded-lg border bg-background text-sm">
                            <p className="text-foreground/80">"{review}"</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Bot className="text-primary" />
                    AI Review Analyzer
                </CardTitle>
                <CardDescription>
                    Enter customer reviews (real or imagined) to get an AI-powered analysis of overall satisfaction.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form ref={formRef} action={formAction} className="space-y-4">
                    {reviews.map((review, index) => (
                        <div key={index}>
                        <Textarea
                            name="reviews"
                            placeholder={`Enter customer review ${index + 1}...`}
                            rows={3}
                            value={review}
                            onChange={(e) => handleReviewChange(index, e.target.value)}
                            className="text-base"
                        />
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addReviewInput} className="w-full border-dashed">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Another Review
                    </Button>
                    <SubmitButton />
                </form>
                </CardContent>
            </Card>

            {state.analysis && (
                <Card className="bg-accent/10 border-accent/30 animate-in fade-in-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                        <Star className="text-primary"/>
                        Analysis Result
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-semibold">Aggregate Satisfaction</h4>
                        <span className="font-bold text-lg text-primary">
                        {(state.analysis.aggregateScore * 100).toFixed(0)}%
                        </span>
                    </div>
                    <Progress value={state.analysis.aggregateScore * 100} className="h-2 bg-primary/20" />
                    </div>
                    <div>
                    <h4 className="font-semibold mb-2">AI Summary</h4>
                    <p className="text-sm text-muted-foreground p-4 rounded-lg border bg-background">
                        {state.analysis.summary}
                    </p>
                    </div>
                </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
