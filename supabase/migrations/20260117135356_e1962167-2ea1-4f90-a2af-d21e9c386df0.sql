-- Create challenge_submissions table to store all submissions
CREATE TABLE public.challenge_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  minecraft_nick TEXT NOT NULL,
  discord_nick TEXT NOT NULL,
  age INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  challenge TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public insert (no auth required for submissions)
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert submissions (public form)
CREATE POLICY "Anyone can submit"
ON public.challenge_submissions
FOR INSERT
WITH CHECK (true);

-- Only allow reading via edge functions (service role)
-- No public SELECT policy - data is private

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_challenge_submissions_updated_at
BEFORE UPDATE ON public.challenge_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();