'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
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
  const { pending } = useActionState();
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
    <div className="space-y-6">
        <div>
            <Card className="h-full bg-card border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <FileText className="text-primary"/>
                        Community Reviews
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {initialReviews.map((review, index) => (
                        <div key={index} className="p-3 rounded-lg border border-border/50 bg-background/50 text-sm">
                            <p className="text-foreground/80">"{review}"</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card className="bg-card border-border/50">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-xl">
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
                            className="text-base bg-background/50"
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
                <Card className="bg-card border-primary/30 animate-in fade-in-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
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
                    <p className="text-sm text-muted-foreground p-4 rounded-lg border border-border/50 bg-background/50">
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
