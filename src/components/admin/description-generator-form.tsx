// @ts-nocheck
'use client';

import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom'; // Corrected import for useFormStatus
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateDescriptionAction, AiDescriptionFormState } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


const initialState: AiDescriptionFormState = {
  description: undefined,
  input: undefined,
  message: undefined,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Generate Description
        </>
      )}
    </Button>
  );
}

export function DescriptionGeneratorForm() {
  const [state, formAction] = useActionState(generateDescriptionAction, initialState); 
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.description) {
      toast({
        title: "Success!",
        description: state.message,
      });
    } else if (state.message && (state.errors || !state.description)) {
       toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);


  return (
    <Card className="max-w-xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-playfair-display text-primary flex items-center">
          <Sparkles className="h-7 w-7 mr-2 text-primary/80" /> AI Jewelry Description Generator
        </CardTitle>
        <CardDescription>
          Enter the attributes of your jewelry item, and our AI will craft a captivating description for you.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          {state.message && state.errors && Object.keys(state.errors).length > 0 && !state.errors._form && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Input Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          {state.errors?._form && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Generation Error</AlertTitle>
                <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="name">Jewelry Name</Label>
            <Input id="name" name="name" defaultValue={state.input?.name} placeholder="e.g., Midnight Bloom Necklace" className="mt-1" />
            {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name.join(', ')}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="material">Primary Material</Label>
              <Input id="material" name="material" defaultValue={state.input?.material} placeholder="e.g., 18k White Gold" className="mt-1" />
              {state.errors?.material && <p className="text-sm text-destructive mt-1">{state.errors.material.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="gemstones">Gemstones (comma-separated)</Label>
              <Input id="gemstones" name="gemstones" defaultValue={state.input?.gemstones} placeholder="e.g., Sapphire, Diamond" className="mt-1" />
              {state.errors?.gemstones && <p className="text-sm text-destructive mt-1">{state.errors.gemstones.join(', ')}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="style">Style</Label>
              <Input id="style" name="style" defaultValue={state.input?.style} placeholder="e.g., Vintage, Modern, Art Deco" className="mt-1" />
              {state.errors?.style && <p className="text-sm text-destructive mt-1">{state.errors.style.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="occasion">Occasion</Label>
              <Input id="occasion" name="occasion" defaultValue={state.input?.occasion} placeholder="e.g., Wedding, Everyday, Gala" className="mt-1" />
              {state.errors?.occasion && <p className="text-sm text-destructive mt-1">{state.errors.occasion.join(', ')}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          {state.description && (
            <div className="w-full mt-6 p-4 border border-primary/30 bg-primary/5 rounded-md shadow">
              <h3 className="text-lg font-semibold text-primary mb-2">Generated Description:</h3>
              <Textarea
                readOnly
                value={state.description}
                rows={6}
                className="w-full bg-background text-foreground/90"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  navigator.clipboard.writeText(state.description || '');
                  toast({ title: 'Copied!', description: 'Description copied to clipboard.' });
                }}
              >
                Copy Description
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
