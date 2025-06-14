-- Add onboarding_completed field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT FALSE;

-- Update existing users to mark onboarding as completed if they have a name
UPDATE public.user_profiles 
SET onboarding_completed = TRUE 
WHERE name IS NOT NULL AND trim(name) != '';

-- Create index for better performance on onboarding queries
CREATE INDEX idx_user_profiles_onboarding_completed 
ON public.user_profiles(onboarding_completed);
