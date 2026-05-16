"use client";

import { UserPlus, Building, Key, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TutorialCards() {
  const steps = [
    {
      title: "1. Mülk Sahibi Ekle",
      description: "Sürece mülk sahibini kaydederek başlayın. Tüm mülkler bir sahibe bağlıdır.",
      icon: UserPlus,
      link: "/landlords",
      color: "from-blue-500 to-indigo-600",
      btnText: "Sahipleri Yönet"
    },
    {
      title: "2. Mülk Ataması Yap",
      description: "Eklediğiniz mülk sahibinin altına dairesini, dükkanını veya arsasını tanımlayın.",
      icon: Building,
      link: "/properties",
      color: "from-indigo-500 to-purple-600",
      btnText: "Mülk Ekle"
    },
    {
      title: "3. Kiracı Bağla",
      description: "Mülk boşsa hemen bir kiracı atayın ve kira sözleşmesini başlatın.",
      icon: Key,
      link: "/leases/new",
      color: "from-emerald-500 to-teal-600",
      btnText: "Sözleşme Yap"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className="group relative overflow-hidden glass rounded-3xl p-6 border border-white/20 shadow-xl hover-lift transition-all duration-500"
        >
          {/* Background Gradient Blur */}
          <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${step.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
          
          <div className="relative z-10">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 mb-6 shadow-lg shadow-blue-500/20`}>
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <step.icon className={`w-7 h-7 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} style={{ color: 'transparent', backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                {/* Fallback if bg-clip-text fails in some browsers for icons */}
                <step.icon className="w-7 h-7 text-indigo-600 absolute" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {step.description}
            </p>

            <Link 
              href={step.link}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors group/link"
            >
              {step.btnText}
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Progress Indicator Dots */}
          <div className="absolute bottom-6 right-6 flex gap-1">
            {[0, 1, 2].map((dot) => (
              <div 
                key={dot} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${dot === index ? 'w-4 bg-indigo-500' : 'bg-slate-200'}`} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
