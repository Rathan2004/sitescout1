import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { validateEmail } from '@/utils/validators';

interface HandlerRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HandlerRegistrationDialog({ open, onOpenChange }: HandlerRegistrationDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: '',
    hourlyRate: '',
    experience: '',
    skills: '',
    bio: '',
    portfolio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    if (!formData.hourlyRate) {
      newErrors.hourlyRate = 'Hourly rate is required';
    } else if (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = 'Please enter a valid hourly rate';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Years of experience is required';
    } else if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      newErrors.experience = 'Please enter valid years of experience';
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 50) {
      newErrors.bio = 'Bio must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual Convex mutation call
      // const registrationId = await registerHandler({
      //   name: formData.name,
      //   email: formData.email,
      //   serviceType: formData.serviceType as "transfer" | "maintenance" | "optimization",
      //   hourlyRate: Number(formData.hourlyRate),
      //   experience: formData.experience,
      //   skills: formData.skills.split(',').map(s => s.trim()),
      //   bio: formData.bio,
      //   portfolio: formData.portfolio || undefined,
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Registration submitted! We will review your application and contact you soon.');
      setIsSubmitting(false);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        serviceType: '',
        hourlyRate: '',
        experience: '',
        skills: '',
        bio: '',
        portfolio: '',
      });
      setErrors({});
    } catch (error) {
      toast.error('Failed to submit registration. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register as a Website Handler</DialogTitle>
          <DialogDescription>
            Join our network of professional website handlers and developers. Fill out the form below to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">Primary Service Type *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => handleChange('serviceType', value)}
              >
                <SelectTrigger className={errors.serviceType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Website Transfer Specialist</SelectItem>
                  <SelectItem value="maintenance">Maintenance & Support</SelectItem>
                  <SelectItem value="optimization">Optimization Expert</SelectItem>
                </SelectContent>
              </Select>
              {errors.serviceType && (
                <p className="text-sm text-red-500">{errors.serviceType}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="50"
                  value={formData.hourlyRate}
                  onChange={(e) => handleChange('hourlyRate', e.target.value)}
                  className={errors.hourlyRate ? 'border-red-500' : ''}
                />
                {errors.hourlyRate && (
                  <p className="text-sm text-red-500">{errors.hourlyRate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="5"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  className={errors.experience ? 'border-red-500' : ''}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated) *</Label>
              <Input
                id="skills"
                placeholder="React, Node.js, WordPress, SEO, etc."
                value={formData.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                className={errors.skills ? 'border-red-500' : ''}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio *</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your experience, expertise, and what makes you a great website handler..."
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className={errors.bio ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.bio.length} / 50 minimum characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio URL (optional)</Label>
              <Input
                id="portfolio"
                type="url"
                placeholder="https://yourportfolio.com"
                value={formData.portfolio}
                onChange={(e) => handleChange('portfolio', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}