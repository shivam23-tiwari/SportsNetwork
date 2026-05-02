export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-8 pb-12">
      <div className="bg-slate-800 rounded-md p-8 sm:p-12 border border-slate-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight italic">Terms & Conditions</h1>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-sm border border-slate-200 text-slate-700 space-y-8">
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Usage Policy</h2>
          <p className="font-medium leading-relaxed">
            Welcome to Stadium Sports Network. By accessing our website, you agree to comply with and be bound by the following terms and conditions of use. You must be at least 13 years old to use this site. Do not exploit our services or content for malicious purposes, spam, or unlawful activities.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Data Privacy</h2>
          <p className="font-medium leading-relaxed">
            Your privacy is important to us. We collect minimal personal data to improve user experience. Contact form submissions are saved securely. We do not sell your personal data to third parties. For comprehensive details, please refer to our full Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Content Rights</h2>
          <p className="font-medium leading-relaxed">
            All text, graphics, user interfaces, visual interfaces, photographs, trademarks, logos, sounds, music, artwork, and computer code contained on the Site is owned, controlled, or licensed by or to Stadium Sports Network. Unsplash and Wikipedia source images are used under their respective licenses or for demonstration purposes.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Disclaimers</h2>
          <p className="font-medium leading-relaxed">
            The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Wait, this is a demonstration project, all news and sport data might be mocked or fetched from third-parties (NewsAPI).
          </p>
        </section>
      </div>
    </div>
  );
}
