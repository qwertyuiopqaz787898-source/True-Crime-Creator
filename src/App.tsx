import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, FileText, Image as ImageIcon, Video, Search, ChevronRight, ChevronLeft, Loader2, Play, Download, Copy, CheckCircle2, TrendingUp, ExternalLink, Skull, Fingerprint, Siren, Globe, Youtube, Users, X } from 'lucide-react';
import Markdown from 'react-markdown';
import { generateIdeas, generateScript, generateThumbnail, generateEditingAssets, generateSEO, generateCompetitorAnalysis, Idea, CRIME_TEMPLATES } from './services/geminiService';
import './types';

const TOP_CHANNELS = {
  ar: [
    { name: 'كويلي (Kweli)', subs: '+5.5M', style: 'سرد قصصي، غموض، قضايا لم تحل', url: 'https://www.youtube.com/@Kweli' },
    { name: 'محمد المكسور', subs: '+3.2M', style: 'جرائم حقيقية، تحليل نفسي، سرد درامي', url: 'https://www.youtube.com/@mohamed_elmaksoor' },
    { name: 'بصمة', subs: '+1.5M', style: 'وثائقيات جرائم، تحقيقات مفصلة', url: 'https://www.youtube.com/@Bassma_1' },
    { name: 'قصة جريمة', subs: '+2M', style: 'قضايا جنائية عربية وعالمية', url: 'https://www.youtube.com/results?search_query=قصة+جريمة' }
  ],
  en: [
    { name: 'JCS - Criminal Psychology', subs: '+5.4M', style: 'Interrogation analysis, psychological deep dives', url: 'https://www.youtube.com/@JCS' },
    { name: 'Explore With Us (EWU)', subs: '+5.8M', style: 'Bodycam footage, interrogations, educational', url: 'https://www.youtube.com/@ExploreWithUs' },
    { name: 'Bailey Sarian', subs: '+7.3M', style: 'Murder, Mystery & Makeup, conversational', url: 'https://www.youtube.com/@BaileySarian' },
    { name: 'MrBallen', subs: '+9.2M', style: 'Strange, dark, and mysterious stories', url: 'https://www.youtube.com/@MrBallen' },
    { name: 'Eleanor Neale', subs: '+2.6M', style: 'True crime deep dives, empathetic storytelling', url: 'https://www.youtube.com/@EleanorNeale' }
  ]
};

const translations = {
  ar: {
    appTitle: 'TrueCrime',
    appSubtitle: 'مساعدك الذكي لليوتيوب',
    step1: 'الأفكار',
    step2: 'الاسكريبت',
    step3: 'الصورة المصغرة',
    step4: 'ملحقات المونتاج',
    step5: 'SEO',
    step6: 'المنافسين',
    whatToTalkAbout: 'عن ماذا تريد أن تتحدث؟',
    topicPlaceholder: 'مثال: سفاح مجهول، لغز اختفاء غامض، جريمة في فندق...',
    generateIdeas: 'توليد أفكار',
    chooseIdea: 'اختر فكرة للبدء:',
    copyIdeas: 'نسخ الأفكار',
    copied: 'تم النسخ',
    copy: 'نسخ',
    writeScript: 'كتابة الاسكريبت التشريحي',
    scriptTitle: 'الاسكريبت التشريحي:',
    copyScript: 'نسخ الاسكريبت',
    backToIdeas: 'رجوع للأفكار',
    nextThumbnail: 'التالي: الصورة المصغرة',
    thumbnailTitle: 'الصورة المصغرة (Thumbnail)',
    regenerate: 'إعادة توليد',
    generatingThumbnail: 'جاري تصميم الصورة المصغرة...',
    downloadImage: 'تحميل الصورة',
    noImageYet: 'لم يتم توليد صورة بعد',
    backToScript: 'رجوع للاسكريبت',
    nextAssets: 'التالي: ملحقات المونتاج',
    assetsTitle: 'ملحقات المونتاج المقترحة',
    backToThumbnail: 'رجوع للصورة المصغرة',
    nextSEO: 'التالي: SEO',
    seoTitle: 'بيانات الـ SEO لليوتيوب',
    copyAll: 'نسخ الكل',
    videoTitle: 'عنوان الفيديو',
    videoDesc: 'وصف الفيديو',
    tags: 'الكلمات المفتاحية (Tags)',
    hashtags: 'الهاشتاجات',
    backToAssets: 'رجوع لملحقات المونتاج',
    nextAnalysis: 'التالي: تحليل المنافسين',
    analysisTitle: 'تحليل المنافسين والإحصائيات',
    copyAnalysis: 'نسخ التحليل',
    analyzing: 'جاري البحث في يوتيوب وتحليل المنافسين...',
    linksTitle: 'روابط الفيديوهات والمصادر',
    backToSEO: 'رجوع للـ SEO',
    errorIdeas: 'حدث خطأ أثناء توليد الأفكار.',
    errorScript: 'حدث خطأ أثناء كتابة الاسكريبت.',
    errorThumbnail: 'حدث خطأ أثناء توليد الصورة المصغرة.',
    errorAssets: 'حدث خطأ أثناء اقتراح ملحقات المونتاج.',
    errorSEO: 'حدث خطأ أثناء توليد بيانات الـ SEO.',
    errorAnalysis: 'حدث خطأ أثناء تحليل المنافسين.',
    crimeScene: 'مسرح جريمة ممنوع العبور',
    policeLine: 'منطقة شرطة ممنوع الدخول',
    topChannels: 'أشهر القنوات',
    arabicChannels: 'قنوات عربية',
    englishChannels: 'قنوات أجنبية',
    subscribers: 'المشتركين:',
    contentStyle: 'أسلوب المحتوى:',
    close: 'إغلاق',
    channelStats: 'إحصائيات وأفكار القنوات المنافسة',
    backToChannels: 'العودة للقنوات',
    backToChannel: 'العودة للقناة',
    videos: 'الفيديوهات',
    views: 'مشاهدة',
    likes: 'إعجاب',
    comments: 'تعليق',
    videoStats: 'إحصائيات الفيديو',
    channelKeywords: 'الكلمات المفتاحية للقناة',
    videoTags: 'الكلمات المفتاحية للفيديو',
    noData: 'لا توجد بيانات',
    selectTemplate: 'اختر قالب المحتوى (اختياري):',
    templateUnsolved: 'ألغاز لم تُحل',
    templateHistorical: 'قضايا تاريخية',
    templateSerialKiller: 'سفاحون متسلسلون',
  },
  en: {
    appTitle: 'TrueCrime',
    appSubtitle: 'Your Smart YouTube Assistant',
    step1: 'Ideas',
    step2: 'Script',
    step3: 'Thumbnail',
    step4: 'Editing Assets',
    step5: 'SEO',
    step6: 'Competitors',
    whatToTalkAbout: 'What do you want to talk about?',
    topicPlaceholder: 'e.g., Unknown serial killer, mysterious disappearance...',
    generateIdeas: 'Generate Ideas',
    chooseIdea: 'Choose an idea to start:',
    copyIdeas: 'Copy Ideas',
    copied: 'Copied',
    copy: 'Copy',
    writeScript: 'Write Anatomical Script',
    scriptTitle: 'Anatomical Script:',
    copyScript: 'Copy Script',
    backToIdeas: 'Back to Ideas',
    nextThumbnail: 'Next: Thumbnail',
    thumbnailTitle: 'Thumbnail',
    regenerate: 'Regenerate',
    generatingThumbnail: 'Designing thumbnail...',
    downloadImage: 'Download Image',
    noImageYet: 'No image generated yet',
    backToScript: 'Back to Script',
    nextAssets: 'Next: Editing Assets',
    assetsTitle: 'Suggested Editing Assets',
    backToThumbnail: 'Back to Thumbnail',
    nextSEO: 'Next: SEO',
    seoTitle: 'YouTube SEO Data',
    copyAll: 'Copy All',
    videoTitle: 'Video Title',
    videoDesc: 'Video Description',
    tags: 'Tags',
    hashtags: 'Hashtags',
    backToAssets: 'Back to Assets',
    nextAnalysis: 'Next: Competitor Analysis',
    analysisTitle: 'Competitor Analysis & Stats',
    copyAnalysis: 'Copy Analysis',
    analyzing: 'Searching YouTube and analyzing competitors...',
    linksTitle: 'Video Links & Sources',
    backToSEO: 'Back to SEO',
    errorIdeas: 'Error generating ideas.',
    errorScript: 'Error writing script.',
    errorThumbnail: 'Error generating thumbnail.',
    errorAssets: 'Error suggesting editing assets.',
    errorSEO: 'Error generating SEO data.',
    errorAnalysis: 'Error analyzing competitors.',
    crimeScene: 'CRIME SCENE DO NOT CROSS',
    policeLine: 'POLICE LINE DO NOT CROSS',
    topChannels: 'Top Channels',
    arabicChannels: 'Arabic Channels',
    englishChannels: 'English Channels',
    subscribers: 'Subscribers:',
    contentStyle: 'Content Style:',
    close: 'Close',
    channelStats: 'Competitor Channels Stats & Ideas',
    backToChannels: 'Back to Channels',
    backToChannel: 'Back to Channel',
    videos: 'Videos',
    views: 'Views',
    likes: 'Likes',
    comments: 'Comments',
    videoStats: 'Video Statistics',
    channelKeywords: 'Channel Keywords',
    videoTags: 'Video Tags',
    noData: 'No data available',
    selectTemplate: 'Select content template (optional):',
    templateUnsolved: 'Unsolved Mysteries',
    templateHistorical: 'Historical Cases',
    templateSerialKiller: 'Serial Killer Profiles',
  }
};

const CrimeBackground = ({ step, lang, t }: { step: number, lang: 'ar' | 'en', t: any }) => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-brand-darker pointer-events-none">
      {/* Flashing Police Lights */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-64 bg-blue-600/10 blur-[120px]"
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-64 bg-red-600/10 blur-[120px]"
        animate={{ opacity: [0.4, 0.1, 0.4] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Ambient Glow */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full opacity-20 blur-[100px]"
        animate={{
          x: step % 2 === 0 ? ['-20%', '50%', '-20%'] : ['50%', '-20%', '50%'],
          y: step % 3 === 0 ? ['-20%', '30%', '-20%'] : ['30%', '-20%', '30%'],
          backgroundColor: step === 1 ? '#e63946' : step === 2 ? '#7f1d1d' : step === 3 ? '#4c1d95' : step === 4 ? '#14532d' : '#831843',
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Static Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Floating Particles (Dust/Blood drops) */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-brand-red rounded-full opacity-20 blur-[1px]"
          initial={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
          }}
          animate={{
            top: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            opacity: [0.1, 0.6, 0.1],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Animated Fingerprint Scanner */}
      <div className={`absolute ${lang === 'ar' ? 'right-[10%]' : 'left-[10%]'} top-[30%] opacity-[0.03] transform rotate-12`}>
        <div className="relative">
          <Fingerprint className="w-96 h-96 text-white" strokeWidth={1} />
          <motion.div
            className="absolute top-0 left-0 w-full h-2 bg-brand-red shadow-[0_0_20px_#e63946] rounded-full"
            animate={{ y: [0, 380, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Floating Skull */}
      <motion.div
        className={`absolute ${lang === 'ar' ? 'left-[5%]' : 'right-[5%]'} bottom-[20%] opacity-[0.02]`}
        animate={{ 
          y: [0, -30, 0],
          rotate: [-5, 5, -5]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Skull className="w-64 h-64 text-white" strokeWidth={1} />
      </motion.div>

      {/* Infinite Scrolling Crime Scene Tape */}
      <div className="absolute bottom-20 left-0 right-0 opacity-20 transform -rotate-3 w-[200vw] -ml-[50vw]">
        <motion.div
          className="flex whitespace-nowrap bg-yellow-500 text-black font-black text-2xl py-3 border-y-4 border-black items-center shadow-[0_0_30px_rgba(234,179,8,0.3)]"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(20)].map((_, i) => (
            <span key={i} className="mx-4 flex items-center gap-4">
              CRIME SCENE DO NOT CROSS <Siren className="w-6 h-6" /> {t.crimeScene} <Siren className="w-6 h-6" />
            </span>
          ))}
        </motion.div>
      </div>
      
      <div className="absolute top-40 left-0 right-0 opacity-10 transform rotate-6 w-[200vw] -ml-[50vw]">
        <motion.div
          className="flex whitespace-nowrap bg-yellow-500 text-black font-black text-2xl py-3 border-y-4 border-black items-center"
          animate={{ x: [-1000, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(20)].map((_, i) => (
            <span key={i} className="mx-4 flex items-center gap-4">
              POLICE LINE DO NOT CROSS <Siren className="w-6 h-6" /> {t.policeLine} <Siren className="w-6 h-6" />
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [script, setScript] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [editingAssets, setEditingAssets] = useState('');
  const [seo, setSeo] = useState<{ title: string; description: string; tags: string[]; hashtags: string[] } | null>(null);
  const [analysisData, setAnalysisData] = useState<{ text: string, links: { uri: string, title: string }[] } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showChannelsModal, setShowChannelsModal] = useState(false);

  const t = translations[lang];

  const STEPS = [
    { id: 1, title: t.step1, icon: Lightbulb },
    { id: 2, title: t.step2, icon: FileText },
    { id: 3, title: t.step3, icon: ImageIcon },
    { id: 4, title: t.step4, icon: Video },
    { id: 5, title: t.step5, icon: Search },
    { id: 6, title: t.step6, icon: TrendingUp },
  ];

  const NextIcon = lang === 'ar' ? ChevronLeft : ChevronRight;
  const PrevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;

  const handleGenerateIdeas = async () => {
    setLoading(true);
    try {
      const newIdeas = await generateIdeas(topic, lang, selectedTemplate || undefined);
      setIdeas(newIdeas);
    } catch (error) {
      console.error(error);
      alert(t.errorIdeas);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!selectedIdea) return;
    setLoading(true);
    try {
      const newScript = await generateScript(selectedIdea.title, selectedIdea.summary, lang);
      setScript(newScript);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert(t.errorScript);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!selectedIdea) return;
    
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    }

    setLoading(true);
    try {
      const url = await generateThumbnail(selectedIdea.title, selectedIdea.summary);
      if (url) {
        setThumbnailUrl(url);
      } else {
        alert(t.errorThumbnail);
      }
    } catch (error) {
      console.error(error);
      alert(t.errorThumbnail);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAssets = async () => {
    if (!script) return;
    setLoading(true);
    try {
      const assets = await generateEditingAssets(script, lang);
      setEditingAssets(assets);
    } catch (error) {
      console.error(error);
      alert(t.errorAssets);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!script) return;
    setLoading(true);
    try {
      const seoData = await generateSEO(script, lang);
      setSeo(seoData);
    } catch (error) {
      console.error(error);
      alert(t.errorSEO);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!selectedIdea) return;
    setLoading(true);
    try {
      const data = await generateCompetitorAnalysis(selectedIdea.title, selectedIdea.summary, lang);
      setAnalysisData(data);
    } catch (error) {
      console.error(error);
      alert(t.errorAnalysis);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-brand-dark/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">{t.whatToTalkAbout}</h2>
              <div className="mb-4">
                <label className="block text-white/60 text-sm mb-2">{t.selectTemplate}</label>
                <select
                  value={selectedTemplate || ''}
                  onChange={(e) => setSelectedTemplate(e.target.value || null)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                >
                  <option value="">--</option>
                  <option value="unsolved">{t.templateUnsolved}</option>
                  <option value="historical">{t.templateHistorical}</option>
                  <option value="serialKiller">{t.templateSerialKiller}</option>
                </select>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t.topicPlaceholder}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateIdeas}
                  disabled={loading}
                  className="bg-brand-red hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lightbulb className="w-5 h-5" />}
                  {t.generateIdeas}
                </motion.button>
              </div>
            </div>

            {ideas.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-semibold text-white/80">{t.chooseIdea}</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const text = ideas.map(i => `${lang === 'ar' ? 'العنوان' : 'Title'}: ${i.title}\n${lang === 'ar' ? 'الملخص' : 'Summary'}: ${i.summary}`).join('\n\n');
                      copyToClipboard(text, 'ideas');
                    }}
                    className="text-white/50 hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-4 py-2 rounded-lg"
                  >
                    {copied === 'ideas' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied === 'ideas' ? t.copied : t.copyIdeas}</span>
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ideas.map((idea, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedIdea(idea)}
                      className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                        selectedIdea === idea
                          ? 'border-brand-red bg-brand-red/20 shadow-[0_0_20px_rgba(230,57,70,0.3)]'
                          : 'border-white/10 bg-brand-dark/80 backdrop-blur-sm hover:border-white/30 hover:shadow-lg'
                      }`}
                    >
                      <h4 className="text-lg font-bold text-white mb-2">{idea.title}</h4>
                      <p className="text-white/60 text-sm leading-relaxed">{idea.summary}</p>
                    </motion.div>
                  ))}
                </div>
                
                {selectedIdea && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex ${lang === 'ar' ? 'justify-end' : 'justify-start'} mt-6`}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerateScript}
                      disabled={loading}
                      className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.writeScript}
                      <NextIcon className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? -20 : 20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-brand-dark/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t.scriptTitle} {selectedIdea?.title}</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(script, 'script')}
                  className="text-white/50 hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-4 py-2 rounded-lg"
                >
                  {copied === 'script' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">{copied === 'script' ? t.copied : t.copyScript}</span>
                </motion.button>
              </div>
              
              <div className={`prose prose-invert max-w-none bg-black/40 p-6 rounded-xl border border-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div className={`markdown-body ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <Markdown>{script}</Markdown>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(1)}
                className="text-white/60 hover:text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <PrevIcon className="w-5 h-5" />
                {t.backToIdeas}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStep(3);
                  if (!thumbnailUrl) handleGenerateThumbnail();
                }}
                className="bg-brand-red hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(230,57,70,0.3)]"
              >
                {t.nextThumbnail}
                <NextIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? -20 : 20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-brand-dark/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t.thumbnailTitle}</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateThumbnail}
                  disabled={loading}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  {t.regenerate}
                </motion.button>
              </div>

              <div className="aspect-video w-full max-w-3xl mx-auto bg-black/50 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative group">
                {loading ? (
                  <div className="flex flex-col items-center gap-4 text-white/50">
                    <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
                    <p>{t.generatingThumbnail}</p>
                  </div>
                ) : thumbnailUrl ? (
                  <>
                    <motion.img 
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={thumbnailUrl} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={thumbnailUrl}
                        download="thumbnail.png"
                        className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        {t.downloadImage}
                      </motion.a>
                    </div>
                  </>
                ) : (
                  <div className="text-white/50">{t.noImageYet}</div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                className="text-white/60 hover:text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <PrevIcon className="w-5 h-5" />
                {t.backToScript}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStep(4);
                  if (!editingAssets) handleGenerateAssets();
                }}
                className="bg-brand-red hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(230,57,70,0.3)]"
              >
                {t.nextAssets}
                <NextIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? -20 : 20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-brand-dark/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t.assetsTitle}</h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateAssets}
                    disabled={loading}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                    {t.regenerate}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(editingAssets, 'assets')}
                    className="text-white/50 hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-4 py-2 rounded-lg"
                  >
                    {copied === 'assets' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied === 'assets' ? t.copied : t.copy}</span>
                  </motion.button>
                </div>
              </div>

              {loading && !editingAssets ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
                </div>
              ) : (
                <div className={`prose prose-invert max-w-none bg-black/40 p-6 rounded-xl border border-white/5`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className={`markdown-body ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    <Markdown>{editingAssets}</Markdown>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(3)}
                className="text-white/60 hover:text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <PrevIcon className="w-5 h-5" />
                {t.backToThumbnail}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStep(5);
                  if (!seo) handleGenerateSEO();
                }}
                className="bg-brand-red hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(230,57,70,0.3)]"
              >
                {t.nextSEO}
                <NextIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? -20 : 20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-brand-dark/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t.seoTitle}</h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateSEO}
                    disabled={loading}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    {t.regenerate}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if(seo) {
                        const text = `${t.videoTitle}:\n${seo.title}\n\n${t.videoDesc}:\n${seo.description}\n\n${t.tags}:\n${seo.tags.join(', ')}\n\n${t.hashtags}:\n${seo.hashtags.join(' ')}`;
                        copyToClipboard(text, 'all_seo');
                      }
                    }}
                    className="text-white/50 hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-4 py-2 rounded-lg"
                  >
                    {copied === 'all_seo' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied === 'all_seo' ? t.copied : t.copyAll}</span>
                  </motion.button>
                </div>
              </div>

              {loading && !seo ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
                </div>
              ) : seo ? (
                <div className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  {/* Title */}
                  <motion.div whileHover={{ scale: 1.01 }} className="bg-black/40 p-5 rounded-xl border border-white/5 relative group">
                    <div className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <button onClick={() => copyToClipboard(seo.title, 'title')} className="text-white/50 hover:text-white">
                        {copied === 'title' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <h3 className="text-sm text-white/50 mb-2 uppercase tracking-wider font-semibold">{t.videoTitle}</h3>
                    <p className="text-xl font-bold text-white">{seo.title}</p>
                  </motion.div>

                  {/* Description */}
                  <motion.div whileHover={{ scale: 1.01 }} className="bg-black/40 p-5 rounded-xl border border-white/5 relative group">
                    <div className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <button onClick={() => copyToClipboard(seo.description, 'desc')} className="text-white/50 hover:text-white">
                        {copied === 'desc' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <h3 className="text-sm text-white/50 mb-2 uppercase tracking-wider font-semibold">{t.videoDesc}</h3>
                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{seo.description}</p>
                  </motion.div>

                  {/* Tags */}
                  <motion.div whileHover={{ scale: 1.01 }} className="bg-black/40 p-5 rounded-xl border border-white/5 relative group">
                    <div className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <button onClick={() => copyToClipboard(seo.tags.join(', '), 'tags')} className="text-white/50 hover:text-white">
                        {copied === 'tags' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <h3 className="text-sm text-white/50 mb-3 uppercase tracking-wider font-semibold">{t.tags}</h3>
                    <div className="flex flex-wrap gap-2">
                      {seo.tags.map((tag, i) => (
                        <span key={i} className="bg-white/10 text-white/90 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Hashtags */}
                  <motion.div whileHover={{ scale: 1.01 }} className="bg-black/40 p-5 rounded-xl border border-white/5 relative group">
                    <div className={`absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <button onClick={() => copyToClipboard(seo.hashtags.join(' '), 'hash')} className="text-white/50 hover:text-white">
                        {copied === 'hash' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <h3 className="text-sm text-white/50 mb-3 uppercase tracking-wider font-semibold">{t.hashtags}</h3>
                    <div className="flex flex-wrap gap-2">
                      {seo.hashtags.map((tag, i) => (
                        <span key={i} className="text-brand-red font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </div>

            <div className="flex justify-between mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(4)}
                className="text-white/60 hover:text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <PrevIcon className="w-5 h-5" />
                {t.backToAssets}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStep(6);
                  if (!analysisData) handleGenerateAnalysis();
                }}
                className="bg-brand-red hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(230,57,70,0.3)]"
              >
                {t.nextAnalysis}
                <NextIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: lang === 'ar' ? -20 : 20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-brand-dark/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t.analysisTitle}</h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateAnalysis}
                    disabled={loading}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                    {t.regenerate}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if(analysisData) {
                        copyToClipboard(analysisData.text, 'analysis');
                      }
                    }}
                    className="text-white/50 hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-4 py-2 rounded-lg"
                  >
                    {copied === 'analysis' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied === 'analysis' ? t.copied : t.copyAnalysis}</span>
                  </motion.button>
                </div>
              </div>

              {loading && !analysisData ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
                  <p className="text-white/50">{t.analyzing}</p>
                </div>
              ) : analysisData ? (
                <div className="space-y-6">
                  <div className={`prose prose-invert max-w-none bg-black/40 p-6 rounded-xl border border-white/5`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className={`markdown-body ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                      <Markdown>{analysisData.text}</Markdown>
                    </div>
                  </div>

                  {analysisData.links && analysisData.links.length > 0 && (
                    <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-brand-red" />
                        {t.linksTitle}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysisData.links.map((link, idx) => (
                          <a 
                            key={idx} 
                            href={link.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-lg text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2 truncate"
                            title={link.title}
                          >
                            <span className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0"></span>
                            <span className="truncate">{link.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className={`flex ${lang === 'ar' ? 'justify-start' : 'justify-end'} mt-6`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(5)}
                className="text-white/60 hover:text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <PrevIcon className="w-5 h-5" />
                {t.backToSEO}
              </motion.button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-brand-light font-sans selection:bg-brand-red/30 relative" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CrimeBackground step={step} lang={lang} t={t} />
      
      {/* Header */}
      <header className="border-b border-white/5 bg-brand-dark/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: lang === 'ar' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div 
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(230,57,70,0.4)]"
            >
              <Play className="w-5 h-5 text-white fill-white" />
            </motion.div>
            <h1 className="text-xl font-bold tracking-tight">
              {t.appTitle}<span className="text-brand-red">Creator</span>
            </h1>
            <div className="w-px h-6 bg-white/20 mx-2 hidden sm:block"></div>
            <button
              onClick={() => setShowChannelsModal(true)}
              className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
            >
              <Youtube className="w-4 h-4 text-brand-red" />
              {t.topChannels}
            </button>
          </motion.div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-white/50 font-medium tracking-widest uppercase hidden md:block">
              {t.appSubtitle}
            </div>
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/10 -z-10 transform -translate-y-1/2"></div>
            <motion.div 
              className={`absolute ${lang === 'ar' ? 'right-0' : 'left-0'} top-1/2 h-[2px] bg-brand-red -z-10 transform -translate-y-1/2`}
              initial={{ width: 0 }}
              animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            ></motion.div>
            
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              
              return (
                <div key={s.id} className="flex flex-col items-center gap-3 relative">
                  <motion.div 
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isActive ? '#1a1a1a' : isCompleted ? '#e63946' : '#0f0f0f',
                      borderColor: isActive || isCompleted ? '#e63946' : 'rgba(255,255,255,0.1)',
                      color: isActive ? '#e63946' : isCompleted ? '#ffffff' : 'rgba(255,255,255,0.3)',
                      boxShadow: isActive ? '0 0 20px rgba(230,57,70,0.4)' : 'none'
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-brand-darker"
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </motion.div>
                  <span className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/30'
                  }`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>
      </main>

      {/* Top Channels Modal */}
      <AnimatePresence>
        {showChannelsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowChannelsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-dark border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-red/20 rounded-xl flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-brand-red" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{t.channelStats}</h2>
                </div>
                <button
                  onClick={() => setShowChannelsModal(false)}
                  className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Arabic Channels */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                      <Globe className="w-5 h-5 text-brand-red" />
                      {t.arabicChannels}
                    </h3>
                    <div className="space-y-3">
                      {TOP_CHANNELS.ar.map((channel, i) => (
                        <a key={i} href={channel.url} target="_blank" rel="noopener noreferrer" className="block bg-black/40 border border-white/5 hover:border-brand-red/50 p-4 rounded-xl transition-all hover:bg-black/60 group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white group-hover:text-brand-red transition-colors">{channel.name}</h4>
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white/80 flex items-center gap-1">
                              <Users className="w-3 h-3" /> {channel.subs}
                            </span>
                          </div>
                          <p className="text-sm text-white/60"><span className="text-white/40">{t.contentStyle}</span> {channel.style}</p>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* English Channels */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      {t.englishChannels}
                    </h3>
                    <div className="space-y-3">
                      {TOP_CHANNELS.en.map((channel, i) => (
                        <a key={i} href={channel.url} target="_blank" rel="noopener noreferrer" className="block bg-black/40 border border-white/5 hover:border-blue-500/50 p-4 rounded-xl transition-all hover:bg-black/60 group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{channel.name}</h4>
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white/80 flex items-center gap-1">
                              <Users className="w-3 h-3" /> {channel.subs}
                            </span>
                          </div>
                          <p className="text-sm text-white/60"><span className="text-white/40">{t.contentStyle}</span> {channel.style}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
