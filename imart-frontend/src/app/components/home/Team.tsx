'use client';

import { Globe, Mail, User } from 'lucide-react';

import Image from 'next/image';

const team = [
  {
    name: "Alex Rivera",
    role: "Chief Architect",
    image: "/images/team/alex.png",
    socials: [Globe, Mail, User],
  },
  {
    name: "Jordan Smith",
    role: "UI/UX Director",
    image: "/images/team/jordan.png",
    socials: [Globe, Mail, User],
  },
  {
    name: "Mia Thorne",
    role: "Lead Engineer",
    image: "/images/team/mia.png",
    socials: [Globe, Mail, User],
  },
  {
    name: "Sam Wilson",
    role: "Product Manager",
    image: "/images/team/sam.png",
    socials: [Globe, Mail, User],
  },
];

export default function Team() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em]">The Visionaries</h2>
          <h3 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Meet the minds behind <br /> the marketplace.
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="team-member group text-center">
              <div className="relative mx-auto mb-8 h-64 w-64 overflow-hidden rounded-[40px] border border-white/5 bg-white/5 transition-all duration-500 group-hover:rounded-[24px] group-hover:scale-105 group-hover:border-primary/30">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />

                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-4 py-6 translate-y-full transition-transform duration-500 group-hover:translate-y-0 bg-gradient-to-t from-black/80 to-transparent">
                  {member.socials.map((Icon, j) => (
                    <a key={j} href="#" className="text-white hover:text-primary transition-colors">
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{member.name}</h4>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
