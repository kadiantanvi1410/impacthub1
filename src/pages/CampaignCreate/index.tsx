import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Eye,
  FileCheck2,
} from 'lucide-react';
import { impactService } from '../../services/impactService';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { CampaignCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const PRESET_COVERS = [
  {
    label: 'Classroom Education',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Nutrition & Ration Support',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Mobile Rural Healthcare',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Women Tailoring Center',
    url: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=1200&auto=format&fit=crop&q=80',
  },
  {
    label: 'Clean Water Project',
    url: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=1200&auto=format&fit=crop&q=80',
  },
];

export function CampaignCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Education' as CampaignCategory,
    shortDescription: '',
    fullStory: '',
    goalAmount: 500000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    beneficiaryTarget: 250,
    location: 'Bengaluru, Karnataka',
    problemStatement: '',
    expectedImpact: '',
    coverImage: PRESET_COVERS[0].url,
    videoUrl: '',
    status: 'Active' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) errs.title = 'Campaign title is required.';
      if (formData.title.length < 10) errs.title = 'Title should be at least 10 characters.';
      if (!formData.shortDescription.trim()) errs.shortDescription = 'Short description is required.';
      if (!formData.fullStory.trim()) errs.fullStory = 'Please provide the campaign story.';
    } else if (step === 2) {
      if (!formData.goalAmount || formData.goalAmount < 10000) {
        errs.goalAmount = 'Goal must be at least ₹10,000.';
      }
      if (!formData.startDate) errs.startDate = 'Start date is required.';
      if (!formData.endDate) errs.endDate = 'End date is required.';
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        errs.endDate = 'End date must be after the start date.';
      }
      if (!formData.beneficiaryTarget || formData.beneficiaryTarget <= 0) {
        errs.beneficiaryTarget = 'Target beneficiaries must be greater than 0.';
      }
    } else if (step === 3) {
      if (!formData.location.trim()) errs.location = 'Location is required.';
      if (!formData.problemStatement.trim()) errs.problemStatement = 'Problem statement is required.';
      if (!formData.expectedImpact.trim()) errs.expectedImpact = 'Expected impact is required.';
    } else if (step === 4) {
      if (!formData.coverImage.trim()) errs.coverImage = 'Cover image URL is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublish = (status: 'Active' | 'Draft') => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      alert('Please fill out all required steps before publishing.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = impactService.addCampaign({
        ...formData,
        status,
      });

      setIsSubmitting(false);

      if (status === 'Active') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      navigate(`/campaigns/${created.id}`);
    }, 600);
  };

  const steps = [
    { number: 1, title: 'Basics' },
    { number: 2, title: 'Goal & Dates' },
    { number: 3, title: 'Impact' },
    { number: 4, title: 'Media' },
    { number: 5, title: 'Review & Launch' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
            Campaign Wizard
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Create Fundraising Campaign
          </h1>
          <p className="text-sm text-slate-500">
            Design a compelling humanitarian appeal for donors with verified impact targets.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/fundraising')}>
          Cancel & Exit
        </Button>
      </div>

      {/* Step Indicator Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    currentStep === s.number
                      ? 'bg-brand-600 text-white shadow-sm ring-4 ring-brand-100'
                      : currentStep > s.number
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                </div>
                <span
                  className={`text-xs font-semibold hidden md:inline ${
                    currentStep === s.number
                      ? 'text-slate-900'
                      : currentStep > s.number
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors ${
                    currentStep > s.number ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Step Form Card */}
      <Card className="p-6 sm:p-8">
        {/* STEP 1: BASICS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1 — Campaign Basics</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Clear titles and inspiring stories dramatically increase donor completion.
              </p>
            </div>

            <Input
              label="Campaign Title *"
              placeholder="e.g., Clean Water Borewells for Dryland Communities"
              value={formData.title}
              error={errors.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              helperText="Make it specific and outcome-focused."
            />

            <Select
              label="Category *"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as CampaignCategory })
              }
            >
              <option value="Education">Education & Literacy</option>
              <option value="Hunger Relief">Hunger Relief & Nutrition</option>
              <option value="Healthcare">Rural Healthcare & Medical</option>
              <option value="Disaster Relief">Disaster & Emergency Relief</option>
              <option value="Women Empowerment">Women Empowerment & Livelihood</option>
              <option value="Environment">Environment & Safe Water</option>
              <option value="Child Welfare">Child Welfare & Protection</option>
            </Select>

            <Textarea
              label="Short Elevator Pitch (Summary) *"
              rows={2}
              placeholder="1-2 sentences summarizing the core appeal for social shares and cards..."
              value={formData.shortDescription}
              error={errors.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              helperText="Visible on campaign previews and WhatsApp links."
            />

            <Textarea
              label="Full Campaign Story & Problem Statement *"
              rows={6}
              placeholder="Explain the background, why this matters now, what interventions will be deployed, and accountability commitments..."
              value={formData.fullStory}
              error={errors.fullStory}
              onChange={(e) => setFormData({ ...formData, fullStory: e.target.value })}
              helperText="Supporters give when they understand the human story and your verified track record."
            />
          </div>
        )}

        {/* STEP 2: GOAL & TIMELINE */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2 — Financial Goal & Timeline</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set a mathematically realistic target tied directly to verified operational costs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Target Goal Amount (INR ₹) *"
                type="number"
                placeholder="500000"
                value={formData.goalAmount}
                error={errors.goalAmount}
                onChange={(e) =>
                  setFormData({ ...formData, goalAmount: Number(e.target.value) })
                }
                helperText={`Target displayed as: ${formatCurrency(formData.goalAmount || 0)}`}
              />

              <Input
                label="Target Beneficiary Headcount *"
                type="number"
                placeholder="250"
                value={formData.beneficiaryTarget}
                error={errors.beneficiaryTarget}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiaryTarget: Number(e.target.value) })
                }
                helperText="Total individuals directly assisted by this budget."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Launch Date *"
                type="date"
                value={formData.startDate}
                error={errors.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />

              <Input
                label="Campaign Deadline *"
                type="date"
                value={formData.endDate}
                error={errors.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* STEP 3: IMPACT & LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3 — Field Location & Expected Impact</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparency on where and how resources transform lives.
              </p>
            </div>

            <Input
              label="Field Intervention Location *"
              placeholder="e.g. East Bengaluru Slum Clusters, Karnataka"
              value={formData.location}
              error={errors.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              helperText="City, district, or specific village clusters."
            />

            <Textarea
              label="Core Problem Statement *"
              rows={3}
              placeholder="What crisis or systemic shortfall are we tackling? (e.g. 68% learning poverty rate among informal migrants)..."
              value={formData.problemStatement}
              error={errors.problemStatement}
              onChange={(e) =>
                setFormData({ ...formData, problemStatement: e.target.value })
              }
            />

            <Textarea
              label="Measurable Expected Impact *"
              rows={3}
              placeholder="Quantifiable outputs (e.g. 250 school retention guarantees, 100% textbook coverage, quarterly report cards)..."
              value={formData.expectedImpact}
              error={errors.expectedImpact}
              onChange={(e) =>
                setFormData({ ...formData, expectedImpact: e.target.value })
              }
            />
          </div>
        )}

        {/* STEP 4: MEDIA */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 4 — Campaign Media & Visuals</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic, high-resolution imagery connects emotionally with donors.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Select a Preset Humanitarian Cover Photo:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_COVERS.map((preset) => (
                  <div
                    key={preset.label}
                    onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      formData.coverImage === preset.url
                        ? 'border-brand-600 ring-2 ring-brand-500/30 scale-102'
                        : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt="" className="h-24 w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[11px] font-semibold text-white leading-tight">
                        {preset.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Input
              label="Or Custom Cover Image URL *"
              placeholder="https://..."
              value={formData.coverImage}
              error={errors.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            />

            <Input
              label="Optional Video Link (YouTube / Vimeo)"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              helperText="Embeds directly on the public donation page."
            />
          </div>
        )}

        {/* STEP 5: REVIEW & PUBLISH */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 5 — Final Review & Launch</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect your campaign card exactly as donors will see it across social channels.
              </p>
            </div>

            {/* Live Campaign Preview Card */}
            <div className="max-w-md mx-auto">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Public Preview</span>
              </div>
              <Card className="overflow-hidden border-2 border-brand-500/20 shadow-xl">
                <div className="relative h-48">
                  <img
                    src={formData.coverImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/95 text-brand-800 shadow-xs">
                      {formData.category}
                    </span>
                  </div>
                </div>
                <CardContent className="pt-4 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {formData.title || 'Untitled Campaign'}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {formData.shortDescription || 'Your short description will appear here.'}
                  </p>
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-900">₹0 raised</span>
                      <span className="text-slate-500">
                        Target: {formatCurrency(formData.goalAmount || 0)}
                      </span>
                    </div>
                    <ProgressBar value={0} size="sm" />
                    <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>0% Funded</span>
                      <span>Target: {formData.beneficiaryTarget} Beneficiaries</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary List */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-900">{formData.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Timeline:</span>
                <span className="font-semibold text-slate-900">
                  {formData.startDate} to {formData.endDate}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Tax Exemption:</span>
                <span className="font-semibold text-emerald-700">80G Certified Receipt Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="md"
                onClick={handlePrev}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Continue to Step {currentStep + 1}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="md"
                  isLoading={isSubmitting}
                  onClick={() => handlePublish('Draft')}
                  leftIcon={<FileCheck2 className="w-4 h-4" />}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  onClick={() => handlePublish('Active')}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Launch Campaign
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
