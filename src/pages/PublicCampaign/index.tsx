import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Heart,
  Share2,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import {
  formatCurrency,
  getDaysRemaining,
  getCategoryBadgeClass,
} from '../../utils/formatters';

const IMPACT_TIERS = [
  {
    amount: 500,
    title: 'School Kit Sponsor',
    impact: 'Provides 1 child with an annual backpack, notebooks, and stationary set.',
  },
  {
    amount: 1000,
    title: 'Family Food Security',
    impact: 'Feeds a family of 4 with a 30-day wholesome grocery & nutrition ration hamper.',
  },
  {
    amount: 2500,
    title: 'Rural Healthcare Checkups',
    impact: 'Supports mobile clinic screenings and free medications for 5 rural elders.',
  },
  {
    amount: 5000,
    title: 'Livelihood Tooling',
    impact: 'Equips 1 woman with a sewing machine and commercial tailoring certification.',
  },
];

export function PublicCampaign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { service, organization } = useImpactData();

  const campaign = service.getCampaignById(id || 'camp-1');
  const donations = service.getDonationsByCampaign(campaign?.id || '');

  // Donation Modal State
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [donorMessage, setDonorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Campaign Not Found</h2>
        <p className="text-slate-500 mt-2">This fundraising appeal may have concluded or been relocated.</p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Return to Workspace
        </Button>
      </div>
    );
  }

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;
  const percent = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100);
  const daysLeft = getDaysRemaining(campaign.endDate);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount < 100) {
      alert('Please enter a valid donation amount of at least ₹100.');
      return;
    }
    if (!donorName.trim() && !isAnonymous) {
      alert('Please enter your full name or select anonymous donation.');
      return;
    }
    if (!donorEmail.trim()) {
      alert('Please enter your email address for your 80G tax receipt.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      service.addDonation({
        campaignId: campaign.id,
        amount: effectiveAmount,
        donorName: isAnonymous ? 'Kind Supporter' : donorName,
        donorEmail,
        donorPhone,
        paymentMethod,
        isAnonymous,
        message: donorMessage,
      });

      setIsProcessing(false);
      setDonationSuccess(true);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, 800);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Public Top Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base">
              {organization.name}
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified 80G Non-Profit
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDonateOpen(true)}
            leftIcon={<Heart className="w-4 h-4 fill-current" />}
          >
            Donate Now
          </Button>
          <Link
            to="/"
            className="text-xs font-medium text-slate-500 hover:text-brand-700 ml-2 hidden md:inline-flex items-center gap-1"
          >
            <span>Staff Portal</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      {/* Hero Appeal Section */}
      <header className="bg-slate-900 text-white relative overflow-hidden py-12 sm:py-16 px-4 sm:px-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={campaign.coverImage}
            alt=""
            className="w-full h-full object-cover filter blur-xs"
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                {campaign.category}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Community Campaign
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              {campaign.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {campaign.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-400" />
                <span>
                  <strong>{campaign.donorsCount}</strong> Generous Donors
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>{daysLeft}</strong> Days Remaining
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>50% Tax Deduction under 80G</span>
              </div>
            </div>
          </div>

          {/* Right Action Box */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {formatCurrency(campaign.raisedAmount)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Goal: {formatCurrency(campaign.goalAmount, true)}
                </span>
              </div>
              <ProgressBar value={percent} size="lg" variant="teal" />
              <div className="flex justify-between text-xs text-slate-500 font-medium pt-1">
                <span className="text-brand-700 font-bold">{percent}% Achieved</span>
                <span>Target: {campaign.beneficiaryTarget} Beneficiaries</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Contribution Amount:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-bold shadow-lg shadow-brand-600/30 py-3.5"
              onClick={() => setIsDonateOpen(true)}
              leftIcon={<Heart className="w-5 h-5 fill-current" />}
            >
              Donate ₹{effectiveAmount.toLocaleString('en-IN')} Now
            </Button>

            <p className="text-[11px] text-center text-slate-400">
              Tax exemption receipt with 80G certificate issued immediately via email.
            </p>
          </div>
        </div>
      </header>

      {/* Main Narrative & Donation Impact Tiers */}
      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Story, Problem, Updates */}
        <div className="lg:col-span-8 space-y-10">
          {/* Detailed Narrative */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              About This Mission
            </h2>
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
              {campaign.fullStory}
            </div>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  The Problem
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {campaign.problemStatement}
                </p>
              </div>
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block mb-1">
                  The Direct Impact
                </span>
                <p className="text-xs text-teal-900 leading-relaxed">
                  {campaign.expectedImpact}
                </p>
              </div>
            </div>
          </section>

          {/* Impact Examples (PRD Specified) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">What Your Donation Delivers</h3>
                <p className="text-xs text-slate-500">Every rupee is directly accounted for on the ground</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {IMPACT_TIERS.map((tier) => (
                <div
                  key={tier.amount}
                  onClick={() => {
                    setSelectedAmount(tier.amount);
                    setCustomAmount('');
                    setIsDonateOpen(true);
                  }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-brand-500 hover:shadow-card-hover transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-brand-700">
                      ₹{tier.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-brand-50 group-hover:text-brand-800 transition-colors">
                      {tier.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{tier.impact}</p>
                  <div className="pt-2 flex items-center text-xs font-semibold text-brand-700 group-hover:translate-x-1 transition-transform">
                    <span>Choose this tier</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Field Updates */}
          {campaign.updates && campaign.updates.length > 0 && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Latest Field Updates</h3>
              <div className="space-y-4">
                {campaign.updates.map((upd) => (
                  <div key={upd.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="font-bold text-slate-900">{upd.title}</h4>
                      <span className="text-slate-400">{upd.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{upd.content}</p>
                    <span className="text-[11px] text-brand-700 font-medium block pt-1">
                      — {upd.author}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Supporter Wall & Trust Information */}
        <div className="lg:col-span-4 space-y-6">
          {/* Supporter Wall */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Supporters Wall ({donations.length})
              </h3>
              <Heart className="w-4 h-4 text-rose-500 fill-current" />
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {donations.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Be the very first supporter to fuel this mission!
                </p>
              ) : (
                donations.map((don) => (
                  <div key={don.id} className="py-3 space-y-1 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-900">{don.donorName}</span>
                      <span className="font-bold text-brand-700">{formatCurrency(don.amount)}</span>
                    </div>
                    {don.message && (
                      <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg mt-1">
                        &ldquo;{don.message}&rdquo;
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 block">{don.date.split(' ')[0]}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* NGO Information & Trust Assurances */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              About {organization.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {organization.description}
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Govt Reg: {organization.registrationNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{organization.taxExemptStatus}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Official Email: {organization.email}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs border-t border-slate-800">
        <p>© 2026 {organization.name}. All donations are securely audited & tax deductible under Section 80G.</p>
        <p className="mt-1 text-[11px] text-slate-400">
          Powered by ImpactHub SaaS platform for modern non-profit governance.
        </p>
      </footer>

      {/* Donation Checkout Modal (Mock with Live State Update!) */}
      <Modal
        isOpen={isDonateOpen}
        onClose={() => {
          setIsDonateOpen(false);
          setDonationSuccess(false);
        }}
        title={donationSuccess ? 'Thank You for Your Generosity!' : `Support: ${campaign.title}`}
        description={
          donationSuccess
            ? 'Your contribution will directly transform lives on the ground.'
            : 'Complete your tax-exempt donation in 60 seconds.'
        }
      >
        {donationSuccess ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Donation of {formatCurrency(effectiveAmount)} Received!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              We have dispatched your instant 80G tax receipt to{' '}
              <strong>{donorEmail || 'your email'}</strong>. Your gift is now recorded on the campaign ledger!
            </p>
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={() => {
                  setIsDonateOpen(false);
                  setDonationSuccess(false);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDonateSubmit} className="space-y-4">
            {/* Amount Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Amount (INR ₹) *
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Or enter custom amount in ₹"
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
            </div>

            {/* Donor Information */}
            <Input
              label="Full Name *"
              placeholder="e.g. Ramesh Kulkarni"
              value={donorName}
              disabled={isAnonymous}
              onChange={(e) => setDonorName(e.target.value)}
            />

            <Input
              label="Email Address (For 80G Tax Receipt) *"
              type="email"
              placeholder="name@example.com"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
            />

            <Input
              label="Phone Number"
              placeholder="+91 98..."
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
            />

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Payment Channel *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['UPI', 'Card', 'NetBanking'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      paymentMethod === method
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Supporter Note / Encouragement (Optional)"
              placeholder="Leave a message for the field team..."
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
            />

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Keep my name anonymous on the public supporters wall</span>
            </label>

            <div className="pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                type="submit"
                size="lg"
                isLoading={isProcessing}
                className="w-full font-bold"
              >
                Complete Donation of {formatCurrency(effectiveAmount)}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
