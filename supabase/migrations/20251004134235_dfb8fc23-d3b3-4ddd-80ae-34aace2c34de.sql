-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create prompts table to store user's XML prompts
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  plain_text TEXT NOT NULL,
  xml_output TEXT NOT NULL,
  explanation TEXT,
  intent_type TEXT NOT NULL,
  ai_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for prompts
CREATE POLICY "Users can view their own prompts" 
ON public.prompts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prompts" 
ON public.prompts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts" 
ON public.prompts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts" 
ON public.prompts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX idx_prompts_created_at ON public.prompts(created_at DESC);