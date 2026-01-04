import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLng = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;

const resources = {
  en: {
    translation: {
      brand: {
        main: 'Invest',
        accent: 'Corp'
      },
      common: {
        loading: 'Loading...'
      },
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        process: 'Process',
        plans: 'Plans',
        reports: 'Reports',
        blog: 'Blog',
        faq: 'FAQ',
        contact: 'Contact',
        language: {
          en: 'English',
          ne: 'Nepali'
        }
      },
      footer: {
        tagline: 'Your trusted partner for financial growth and stability. We build wealth that lasts generations.',
        quickLinksTitle: 'Quick Links',
        quickLinks: {
          about: 'About Us',
          services: 'Our Services',
          plans: 'Investment Plans',
          blog: 'Latest Insights'
        },
        servicesTitle: 'Services',
        servicesList: [
          'Wealth Management',
          'Mutual Funds',
          'Real Estate',
          'Fixed Deposits'
        ],
        contactTitle: 'Contact Us',
        address: '123 Financial District, NY',
        phone: '+1 (555) 123-4567',
        email: 'info@investcorp.com',
        copyright: '© 2024 InvestCorp. All Rights Reserved.',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      },
      home: {
        hero: {
          subtitle: 'Trusted Investment Partner',
          title: 'Grow Your Wealth With Confidence',
          text: 'Secure your future with our premium investment solutions. Expert portfolio management, high-yield plans, and transparent advice trusted by thousands.',
          primaryCta: 'View Plans',
          secondaryCta: 'Contact Us'
        },
        overview: {
          badge: 'WHO WE ARE',
          title: 'Leading the Way in Smart Investments',
          text: 'At InvestCorp, we believe in long-term value creation. Since our inception, we have managed over $500M in assets, helping individuals and corporations achieve financial freedom through strategic mutual funds, fixed deposits, and equity investments.',
          list: [
            'Fully Regulated & Compliant',
            'Expert Board of Directors',
            'Transparent Returns Model'
          ],
          cta: 'Learn More'
        },
        values: {
          title: 'Why Choose InvestCorp?',
          subtitle: 'We combine market expertise with innovative technology to deliver superior returns while managing risk effectively.',
          cards: [
            {
              title: 'Secure & Safe',
              text: 'Your investments are backed by robust risk management strategies and legal compliance.'
            },
            {
              title: 'High Returns',
              text: 'Our expert portfolio managers consistently outperform the market to grow your wealth.'
            },
            {
              title: 'Expert Support',
              text: '24/7 access to financial advisors who understand your goals and guide you every step.'
            }
          ]
        },
        plans: {
          badge: 'OUR PACKAGES',
          title: 'Choose Your Investment Path',
          cards: [
            {
              name: 'Starter',
              rate: '6-8% / year',
              desc: 'Perfect for first-time investors looking for safe, steady growth.',
              cta: 'View Details'
            },
            {
              name: 'Growth',
              rate: '10-14% / year',
              desc: 'Balanced risk and reward for serious wealth accumulation.',
              cta: 'View Details',
              badge: 'POPULAR'
            },
            {
              name: 'Wealth',
              rate: '15-20% / year',
              desc: 'High-growth opportunities for accredited investors.',
              cta: 'View Details'
            }
          ]
        },
        testimonials: {
          title: 'What Our Clients Say',
          list: [
            {
              text: 'InvestCorp transformed my retirement planning. Their expert advice and consistent returns have given me true peace of mind.',
              name: 'Michael Roberts',
              role: 'Business Owner'
            },
            {
              text: 'The transparency and professionalism of the team are unmatched. I finally feel like my money is working for me.',
              name: 'Sarah Johnson',
              role: 'Doctor'
            },
            {
              text: 'Their diverse portfolio options allowed me to balance high-growth startups with stable fixed income. Highly recommended!',
              name: 'David Lee',
              role: 'Software Engineer'
            }
          ]
        },
        blog: {
          badge: 'FROM THE BLOG',
          title: 'Market Insights',
          posts: [
            { date: 'Dec 24, 2024', title: 'Understanding the 2024 Bull Market' },
            { date: 'Dec 18, 2024', title: '5 Golden Rules of SIP Investment' },
            { date: 'Dec 10, 2024', title: 'The Future of Real Estate Investment' }
          ],
          readMore: 'Read More',
          viewAllDesktop: 'View All Posts',
          viewAllMobile: 'View All Posts'
        },
        newsletter: {
          title: 'Join Our Exclusive Investor Circle',
          text: 'Get the latest market insights, investment tips, and company news delivered directly to your inbox. No spam, just value.',
          placeholder: 'Enter your email address',
          button: 'Subscribe',
          success: 'Thank you for subscribing!'
        }
      },
      about: {
        headerTitle: 'About InvestCorp',
        headerSubtitle: 'Building Trust Through Transparency and Excellence',
        storyBadge: 'OUR STORY',
        storyTitle: 'Defining the Future of Wealth Management',
        storyIntro: 'Founded in 2010, InvestCorp has grown from a boutique advisory firm to a global investment powerhouse. We manage assets for over 10,000 clients, ranging from individual investors to large corporations.',
        storyBody: 'Our success is built on a foundation of rigorous research, ethical practices, and a client-first approach.',
        missionTitle: 'Our Mission',
        missionText: 'To provide accessible, secure, and high-growth investment opportunities that empower our clients to achieve financial freedom.',
        visionTitle: 'Our Vision',
        visionText: 'To be the most trusted and transparent investment partner globally, known for consistent performance and integrity.',
        journeyTitle: 'Our Journey',
        timeline: [
          {
            title: '2010 - The Beginning',
            text: 'InvestCorp was founded in a small office in New York with a vision to democratize wealth management.'
          },
          {
            title: '2015 - Expansion',
            text: 'Crossed $100 Million in Assets Under Management (AUM) and expanded operations to London and Singapore.'
          },
          {
            title: '2020 - Digital Transformation',
            text: 'Launched our proprietary AI-driven investment platform, allowing clients real-time access to their portfolios.'
          },
          {
            title: '2024 - A New Era',
            text: 'Recognized as the "Top Wealth Manager of the Year" with over $500 Million AUM and a growing global family.'
          }
        ],
        complianceTitle: 'Legal Registration & Compliance',
        complianceText: 'We are a fully regulated entity, registered with the SEC and adhering to the strictest international financial standards. Your trust is our capital.',
        complianceBadges: ['ISO 27001 Certified', 'SEC Registered', 'GDPR Compliant'],
        leadershipBadge: 'LEADERSHIP',
        leadershipTitle: 'Meet Our Board of Directors',
        leadershipSubtitle: 'Guided by industry veterans with decades of experience.',
        team: [
          { name: 'James Sterling', role: 'CEO & Founder' },
          { name: 'Sarah Jenkins', role: 'Chief Financial Officer' },
          { name: 'Robert Chen', role: 'Head of Investments' }
        ]
      },
      services: {
        headerTitle: 'Investment Products',
        headerSubtitle: 'Diverse Options. Tailored for Your Growth.',
        cta: 'Inquire Now',
        items: [
          {
            title: 'Mutual Funds',
            icon: 'fa-chart-pie',
            image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Professionally managed portfolios of stocks and bonds. We offer a range of risk profiles from conservative debt funds to aggressive equity funds.',
            features: ['High liquidity', 'Professional management', 'Diversified risk']
          },
          {
            title: 'Fixed Income / FDs',
            icon: 'fa-piggy-bank',
            image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Secure your capital with our guaranteed return fixed deposit plans. Ideal for conservative investors looking for steady income.',
            features: ['Guaranteed returns', 'Flexible tenure', 'Higher rates for seniors']
          },
          {
            title: 'Portfolio Advisory',
            icon: 'fa-briefcase',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Customized investment strategies tailored to high-net-worth individuals. We manage your direct equity and asset allocation.',
            features: ['Personalized strategy', 'Direct equity exposure', 'Quarterly rebalancing']
          },
          {
            title: 'Real Estate Funds',
            icon: 'fa-building',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'Invest in premium commercial and residential properties through our REITs and direct investment funds.',
            features: ['Capital appreciation', 'Rental yield', 'Inflation hedge']
          },
          {
            title: 'Startup Equity',
            icon: 'fa-rocket',
            image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'For aggressive investors, gain access to pre-IPO and early-stage startup opportunities with high growth potential.',
            features: ['High growth potential', 'Early access', 'Sector agnostic']
          }
        ]
      },
      process: {
        headerTitle: 'How It Works',
        headerSubtitle: 'A transparent 4-step journey to your financial success.',
        steps: [
          {
            number: 1,
            title: 'Consultation',
            description: "We begin by understanding your financial goals, risk appetite, and investment horizon. Whether you're planning for retirement or wealth accumulation, we listen first."
          },
          {
            number: 2,
            title: 'Custom Plan Creation',
            description: 'Our experts design a tailored portfolio mixing equity, debt, and alternative assets to maximize returns while staying within your risk comfort zone.'
          },
          {
            number: 3,
            title: 'Investment & Execution',
            description: 'Once you approve the plan, we execute the investments efficiently. Your capital is deployed across chosen instruments with full transparency.'
          },
          {
            number: 4,
            title: 'Monitor & Grow',
            description: 'We provide 24/7 dashboard access for you to track performance. We also conduct quarterly reviews to rebalance and optimize your portfolio.'
          }
        ],
        riskTitle: 'Our Risk Management Philosophy',
        riskFeatures: [
          {
            title: 'Diversification',
            description: 'We never put all your eggs in one basket. We spread investments across asset classes, geographies, and sectors.'
          },
          {
            title: 'Due Diligence',
            description: 'Every investment opportunity undergoes a rigorous 50-point checklist before being presented to you.'
          },
          {
            title: 'Stop-Loss Mechanisms',
            description: 'We employ automated triggers to limit downside in volatile market conditions, protecting your principal.'
          }
        ]
      },
      plansPage: {
        headerTitle: 'Investment Plans',
        headerSubtitle: 'Choose the right path for your financial journey.',
        popularLabel: 'POPULAR',
        cta: 'Get Started',
        labels: {
          expectedReturns: 'Expected Returns',
          lockIn: 'Lock-in Period',
          min: 'min'
        },
        cards: [
          {
            name: 'Starter',
            subtitle: 'For beginners',
            minAmount: '$500',
            returns: '6-8%',
            lockIn: '1 Year',
            risk: 'Low Risk Profile',
            support: 'Standard Support'
          },
          {
            name: 'Growth',
            subtitle: 'For intermediate investors',
            minAmount: '$5,000',
            returns: '10-14%',
            lockIn: '3 Years',
            risk: 'Moderate Risk Profile',
            support: 'Priority Support',
            featured: true
          },
          {
            name: 'Wealth',
            subtitle: 'For high net worth',
            minAmount: '$50,000',
            returns: '15-20%',
            lockIn: '5 Years',
            risk: 'High Growth Risk Profile',
            support: 'Dedicated Advisor'
          }
        ]
      },
      reports: {
        headerTitle: 'Performance & Reports',
        headerSubtitle: 'Transparent results backed by data.',
        performanceTitle: 'Fund Performance 2024',
        chartTitle: 'Annual Returns Comparison',
        chartLabels: {
          inflation: 'Inflation',
          market: 'Market Avg',
          investcorp: 'InvestCorp'
        },
        statsTitle: 'Consistent Outperformance',
        statsText: 'Our proprietary algorithms and expert management have consistently delivered returns above the market average for the last 5 years.',
        statsList: [
          '$500M+ Assets Under Management',
          '12.5% Average Annual Return',
          '98% Client Retention Rate'
        ],
        resourcesTitle: 'Investor Resources',
        resources: [
          { icon: 'fa-file-pdf', title: 'Annual Report 2023', size: 'PDF (2.4 MB)' },
          { icon: 'fa-file-powerpoint', title: 'Q3 Investor Presentation', size: 'PPT (5.1 MB)' },
          { icon: 'fa-chart-bar', title: 'Market Outlook 2024', size: 'PDF (1.2 MB)' }
        ]
      },
      blogPage: {
        headerTitle: 'Market Insights',
        headerSubtitle: 'Stay updated with the latest economic trends and tips.',
        readMore: 'Read More',
        posts: [
          {
            category: 'MARKET UPDATE',
            title: 'Understanding the 2024 Bull Market',
            description: 'Why equity markets are hitting all-time highs and what it means for your portfolio allocation.',
            image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            category: 'TIPS',
            title: '5 Golden Rules of SIP Investment',
            description: 'Dollar-cost averaging is your best friend in volatile markets. Here is how to master it.',
            image: 'https://images.unsplash.com/photo-1579532551697-495dca3c3fa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            category: 'NEWS',
            title: 'The Future of Real Estate Investment',
            description: 'Commercial vs Residential: Where should smart money flow in the coming decade?',
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          }
        ]
      },
      faq: {
        headerTitle: 'Frequently Asked Questions',
        headerSubtitle: 'Answers to your most common questions.',
        items: [
          {
            question: 'Is my investment safe with InvestCorp?',
            answer: 'Absolutely. We are fully registered with the Securities Exchange Commission (SEC) and adhere to strict financial regulations. All client funds are held in segregated accounts with top-tier custodian banks.'
          },
          {
            question: 'What is the minimum investment amount?',
            answer: 'Our Starter plan begins at just $500. For our premium wealth management services and custom portfolios, the minimum investment is $50,000.'
          },
          {
            question: 'How can I withdraw my funds?',
            answer: 'Withdrawals can be requested at any time through your online dashboard. Standard processing time is 3-5 business days. Please note that certain fixed-term plans may have lock-in periods.'
          },
          {
            question: 'What are the expected returns?',
            answer: 'Returns vary based on the plan and market conditions. Our historical average for the Growth Plan is 12.5% annually. However, past performance is not indicative of future results.'
          },
          {
            question: 'Do you offer tax advice?',
            answer: 'While we provide annual tax reports for your investments, we recommend consulting with a certified tax professional for personalized tax planning and advice.'
          }
        ]
      },
      contact: {
        headerTitle: 'Contact Us',
        headerSubtitle: 'We are here to help you achieve your financial goals.',
        infoTitle: 'Get In Touch',
        addressTitle: 'Our Main Office',
        addressLine1: '123 Financial District, Wall Street,',
        addressLine2: 'New York, NY 10005',
        phoneTitle: 'Phone Number',
        phoneLine1: '+1 (555) 123-4567',
        phoneLine2: '+1 (555) 987-6543',
        emailTitle: 'Email Address',
        emailLine1: 'info@investcorp.com',
        emailLine2: 'support@investcorp.com',
        formTitle: 'Send a Message',
        fields: {
          nameLabel: 'Full Name',
          emailLabel: 'Email Address',
          subjectLabel: 'Subject',
          messageLabel: 'Message',
          namePlaceholder: 'John Doe',
          emailPlaceholder: 'john@example.com',
          messagePlaceholder: 'How can we help you?'
        },
        subjectOptions: ['Investment Inquiry', 'Support Question', 'Partnership', 'Other'],
        submitText: 'Send Message',
        successMessage: 'Thank you for your message! We will contact you shortly.'
      }
    }
  },
  ne: {
    translation: {
      brand: {
        main: 'Invest',
        accent: 'Corp'
      },
      common: {
        loading: 'लोड हुँदै...'
      },
      nav: {
        home: 'होम',
        about: 'हाम्रो बारे',
        services: 'सेवाहरू',
        process: 'प्रक्रिया',
        plans: 'योजना',
        reports: 'प्रतिवेदन',
        blog: 'ब्लग',
        faq: 'प्रश्नोत्तर',
        contact: 'सम्पर्क',
        language: {
          en: 'अंग्रेजी',
          ne: 'नेपाली'
        }
      },
      footer: {
        tagline: 'आर्थिक वृद्धि र स्थायित्वका लागि तपाईंको विश्वसनीय साझेदार। हामी पीढीभर टिक्ने सम्पत्ति बनाउँछौं।',
        quickLinksTitle: 'छिटो लिङ्कहरू',
        quickLinks: {
          about: 'हाम्रो बारे',
          services: 'हाम्रा सेवाहरू',
          plans: 'लगानी योजना',
          blog: 'ताजा अन्तर्दृष्टि'
        },
        servicesTitle: 'सेवाहरू',
        servicesList: [
          'धन व्यवस्थापन',
          'म्युचुअल फन्ड',
          'रियल इस्टेट',
          'फिक्स्ड डिपोजिट'
        ],
        contactTitle: 'सम्पर्क गर्नुहोस्',
        address: '१२३ फाइनान्सियल डिस्ट्रिक्ट, न्यूयोर्क',
        phone: '+१ (५५५) १२३-४५६७',
        email: 'info@investcorp.com',
        copyright: '© २०२४ InvestCorp. सबै अधिकार सुरक्षित।',
        privacy: 'गोपनीयता नीति',
        terms: 'सेवाका सर्तहरू'
      },
      home: {
        hero: {
          subtitle: 'विश्वासिलो लगानी साझेदार',
          title: 'आत्मविश्वासका साथ धन वृद्धिसँग अघि बढ्नुहोस्',
          text: 'हाम्रो प्रिमियम लगानी समाधानसँग आफ्नो भविष्य सुरक्षित गर्नुहोस्। विज्ञ पोर्टफोलियो व्यवस्थापन, उच्च प्रतिफल योजना, र हजारौँले विश्वास गरेको पारदर्शी सल्लाह।',
          primaryCta: 'योजनाहरू हेर्नुहोस्',
          secondaryCta: 'सम्पर्क गर्नुहोस्'
        },
        overview: {
          badge: 'हामी को हौं',
          title: 'स्मार्ट लगानीमा अग्रणी',
          text: 'InvestCorp मा, हामी दीर्घकालीन मूल्य सिर्जनामा विश्वास गर्छौं। सुरु देखि नै, हामीले $500M भन्दा बढी सम्पत्ति व्यवस्थापन गरेका छौं, रणनीतिक म्युचुअल फन्ड, फिक्स्ड डिपोजिट र इक्विटी लगानीमार्फत व्यक्तिहरू र कम्पनीहरूलाई आर्थिक स्वतन्त्रता दिलाउँदै।',
          list: [
            'पूर्ण रूपमा नियमन र अनुपालन',
            'विशेषज्ञ बोर्ड अफ डायरेक्टर्स',
            'पारदर्शी प्रतिफल मोडेल'
          ],
          cta: 'थप जान्नुहोस्'
        },
        values: {
          title: 'किन InvestCorp छान्ने?',
          subtitle: 'हामी बजार विशेषज्ञता र नवप्रविधि संयोजन गरी जोखिम सन्तुलन गर्दै उत्कृष्ट प्रतिफल दिन्छौं।',
          cards: [
            {
              title: 'सुरक्षित र भरपर्दो',
              text: 'तपाईंको लगानी मजबुत जोखिम व्यवस्थापन रणनीति र कानुनी अनुपालनले सुरक्षित गर्छ।'
            },
            {
              title: 'उच्च प्रतिफल',
              text: 'हाम्रा विशेषज्ञ पोर्टफोलियो व्यवस्थापकहरूले निरन्तर बजारभन्दा राम्रो प्रदर्शन गरेर सम्पत्ति बढाउँछन्।'
            },
            {
              title: 'विशेषज्ञ सहयोग',
              text: 'तपाईंका लक्ष्य बुझ्ने वित्तीय सल्लाहकारहरू २४/७ उपलब्ध छन्।'
            }
          ]
        },
        plans: {
          badge: 'हाम्रा प्याकेजहरू',
          title: 'आफ्नो लगानीको बाटो छान्नुहोस्',
          cards: [
            {
              name: 'स्टार्टर',
              rate: '६-८% / वर्ष',
              desc: 'सुरक्षित र स्थिर वृद्धिका लागि पहिलो पटकका लगानीकर्ताहरूका लागि उत्कृष्ट।',
              cta: 'विवरण हेर्नुहोस्'
            },
            {
              name: 'ग्रोथ',
              rate: '१०-१४% / वर्ष',
              desc: 'गम्भीर सम्पत्ति वृद्धि चाहनेका लागि जोखिम र प्रतिफलको सन्तुलन।',
              cta: 'विवरण हेर्नुहोस्',
              badge: 'लोकप्रिय'
            },
            {
              name: 'वेल्थ',
              rate: '१५-२०% / वर्ष',
              desc: 'प्रमाणित लगानीकर्ताहरूका लागि उच्च वृद्धि अवसरहरू।',
              cta: 'विवरण हेर्नुहोस्'
            }
          ]
        },
        testimonials: {
          title: 'हाम्रा ग्राहकहरूको प्रतिक्रिया',
          list: [
            {
              text: 'InvestCorp ले मेरो अवकाश योजना पूर्ण रूपमा परिवर्तन गर्‍यो। उनीहरूको विशेषज्ञ सल्लाह र स्थिर प्रतिफलले वास्तविक शान्ति दिएको छ।',
              name: 'माइकल रोबर्ट्स',
              role: 'व्यापारी'
            },
            {
              text: 'टोलीको पारदर्शिता र व्यावसायिकता अद्वितीय छ। अब मलाई मेरो पैसा साँच्चिकै काम गरिरहेको महसुस हुन्छ।',
              name: 'सारा जोनसन',
              role: 'चिकित्सक'
            },
            {
              text: 'उनहरूको विविध पोर्टफोलियो विकल्पले स्टार्टअपहरू र स्थिर आम्दानीबीच सन्तुलन मिलाउन मद्दत गर्‍यो। धेरै सिफारिस!',
              name: 'डेभिड ली',
              role: 'सफ्टवेयर इञ्जिनियर'
            }
          ]
        },
        blog: {
          badge: 'ब्लगबाट',
          title: 'बजार अन्तर्दृष्टि',
          posts: [
            { date: 'डिसेम्बर २४, २०२४', title: '२०२४ को बुल मार्केट बुझ्ने' },
            { date: 'डिसेम्बर १८, २०२४', title: 'एसआईपी लगानीका ५ स्वर्ण नियम' },
            { date: 'डिसेम्बर १०, २०२४', title: 'रियल इस्टेट लगानीको भविष्य' }
          ],
          readMore: 'थप पढ्नुहोस्',
          viewAllDesktop: 'सबै पोस्ट हेर्नुहोस्',
          viewAllMobile: 'सबै पोस्ट हेर्नुहोस्'
        },
        newsletter: {
          title: 'हाम्रो विशेष लगानीकर्ता सर्कलमा जोडिनुहोस्',
          text: 'ताजा बजार अन्तर्दृष्टि, लगानी टिप्स, र कम्पनी समाचार सिधै तपाईंको इमेलमा। कुनै स्प्याम होइन, केवल मूल्य।',
          placeholder: 'आफ्नो इमेल ठेगाना प्रविष्ट गर्नुहोस्',
          button: 'सबसक्राइब',
          success: 'सबसक्राइब गर्नुभएकोमा धन्यवाद!'
        }
      },
      about: {
        headerTitle: 'InvestCorp बारे',
        headerSubtitle: 'पारदर्शिता र उत्कृष्टताबाट विश्वास निर्माण',
        storyBadge: 'हाम्रो कथा',
        storyTitle: 'धन व्यवस्थापनको भविष्य परिभाषित गर्दै',
        storyIntro: '२०१० मा स्थापित, InvestCorp एक बुटिक सल्लाहकार फर्मबाट विश्वव्यापी लगानी शक्ति केन्द्रमा विकसित भएको छ। हामी १०,००० भन्दा बढी ग्राहकका सम्पत्ति व्यवस्थापन गर्छौं।',
        storyBody: 'हाम्रो सफलता कठोर अनुसन्धान, नैतिक अभ्यास र ग्राहक-प्रथम दृष्टिकोणमा आधारित छ।',
        missionTitle: 'हाम्रो मिशन',
        missionText: 'सुलभ, सुरक्षित र उच्च-वृद्धि लगानी अवसरहरू उपलब्ध गराई ग्राहकलाई आर्थिक स्वतन्त्रतामा सक्षम बनाउने।',
        visionTitle: 'हाम्रो भिजन',
        visionText: 'सुसंगत प्रदर्शन र इमानदारीका लागि विश्वभर विश्वासिलो र पारदर्शी लगानी साझेदार बन्ने।',
        journeyTitle: 'हाम्रो यात्रा',
        timeline: [
          {
            title: '२०१० - सुरु',
            text: 'InvestCorp न्यूयोर्कको सानो कार्यालयमा सम्पत्ति व्यवस्थापन सबल पार्ने दृष्टि सहित सुरु भयो।'
          },
          {
            title: '२०१५ - विस्तार',
            text: '$100 मिलियन AUM पार गर्‍यो र लन्डन तथा सिंगापुरमा विस्तार गर्‍यो।'
          },
          {
            title: '२०२० - डिजिटल रूपान्तरण',
            text: 'स्वामित्व AI-समर्थित लगानी प्लेटफर्म सुरु गरी ग्राहकलाई वास्तविक समय पोर्टफोलियो पहुँच उपलब्ध गराइयो।'
          },
          {
            title: '२०२४ - नयाँ युग',
            text: '"वर्षको शीर्ष धन व्यवस्थापक" को रूपमा मान्यता, $500 मिलियन AUM र बढ्दो वैश्विक परिवारसँग।'
          }
        ],
        complianceTitle: 'कानुनी दर्ता र अनुपालन',
        complianceText: 'हामी पूर्ण रूपमा नियमन गरिएको इकाइ हौं, SEC मा दर्ता र कठोर अन्तर्राष्ट्रिय वित्तीय मापदण्डहरू पालना गर्छौं। तपाईंको विश्वास नै हाम्रो पूँजी हो।',
        complianceBadges: ['ISO 27001 प्रमाणित', 'SEC दर्ता', 'GDPR अनुपालन'],
        leadershipBadge: 'नेतृत्व',
        leadershipTitle: 'हाम्रो बोर्ड अफ डायरेक्टर्स',
        leadershipSubtitle: 'दशकौँ अनुभव भएका उद्योग विशेषज्ञहरूले मार्गदर्शन गरेका।',
        team: [
          { name: 'जेम्स स्टर्लिङ', role: 'CEO & संस्थापक' },
          { name: 'सारा जेन्किन्स', role: 'मुख्य वित्तीय अधिकारी' },
          { name: 'रोबर्ट चेन', role: 'हेड अफ इन्भेस्टमेन्ट्स' }
        ]
      },
      services: {
        headerTitle: 'लगानी उत्पादनहरू',
        headerSubtitle: 'विविध विकल्प। तपाईंको वृद्धिका लागि अनुकूल।',
        cta: 'पूछताछ गर्नुहोस्',
        items: [
          {
            title: 'म्युचुअल फन्ड',
            icon: 'fa-chart-pie',
            image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'व्यावसायिक रूपमा व्यवस्थापित स्टक र बन्ड पोर्टफोलियो। हामीले सावधानीपूर्वकदेखि आक्रामक इक्विटी फन्डसम्मका जोखिम प्रोफाइल उपलब्ध गराउँछौं।',
            features: ['उच्च तरलता', 'व्यावसायिक व्यवस्थापन', 'विविधीकरण जोखिम']
          },
          {
            title: 'फिक्स्ड इनकम / FD',
            icon: 'fa-piggy-bank',
            image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'हाम्रा ग्यारेन्टी प्रतिफल फिक्स्ड डिपोजिट योजनासँग पूँजी सुरक्षित राख्नुहोस्। स्थिर आम्दानी चाहने सावधान लगानीकर्ताका लागि उपयुक्त।',
            features: ['ग्यारेन्टी प्रतिफल', 'लचिलो अवधिपूर्व', 'सीनियरका लागि उच्च दर']
          },
          {
            title: 'पोर्टफोलियो सल्लाहकार',
            icon: 'fa-briefcase',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'उच्च-शुद्ध सम्पत्तिका लागि अनुकूलित रणनीति। हामी तपाईंको प्रत्यक्ष इक्विटी र सम्पत्ति आवंटन व्यवस्थापन गर्छौं।',
            features: ['व्यक्तिगत रणनीति', 'प्रत्यक्ष इक्विटी पहुँच', 'त्रैमासिक पुनर्सन्तुलन']
          },
          {
            title: 'रियल इस्टेट फन्ड',
            icon: 'fa-building',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'हाम्रो REITs र प्रत्यक्ष लगानी फन्डमार्फत प्रिमियम व्यावसायिक र आवासीय सम्पत्तिमा लगानी गर्नुहोस्।',
            features: ['पूँजी वृद्धी', 'भाडा आम्दानी', 'महँगीको बचाउ']
          },
          {
            title: 'स्टार्टअप इक्विटी',
            icon: 'fa-rocket',
            image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            description: 'आक्रामक लगानीकर्ताका लागि, प्रि-IPO र प्रारम्भिक स्टार्टअप अवसरहरूमा पहुँच पाउनुहोस् जसमा उच्च वृद्धि सम्भावना छ।',
            features: ['उच्च वृद्धि सम्भावना', 'छिटो पहुँच', 'क्षेत्र-निरपेक्ष']
          }
        ]
      },
      process: {
        headerTitle: 'यसरी काम गर्छ',
        headerSubtitle: 'आर्थिक सफलताका लागि पारदर्शी ४ चरणको यात्रा।',
        steps: [
          {
            number: 1,
            title: 'परामर्श',
            description: 'हामी तपाईँको लक्ष्य, जोखिम क्षमताप र लगानी समयसीमा बुझेर सुरु गर्छौं। सेवानिवृत्ति योजना होस् वा सम्पत्ति वृद्धि, हामी पहिले सुन्छौं।'
          },
          {
            number: 2,
            title: 'अनुकूल योजना निर्माण',
            description: 'हाम्रा विशेषज्ञले इक्विटी, ऋण र वैकल्पिक सम्पत्तिको मिश्रण गरी तपाईंको जोखिम दायरा भित्र उच्च प्रतिफल दिने पोर्टफोलियो डिजाइन गर्छन्।'
          },
          {
            number: 3,
            title: 'लगानी र कार्यान्वयन',
            description: 'तपाईंले योजना स्वीकृत गरेपछि, हामी पारदर्शी रूपमा लगानी कार्यान्वयन गर्छौं र पूँजी चुनेका उपकरणमा लगाउँछौं।'
          },
          {
            number: 4,
            title: 'निगरानी र वृद्धि',
            description: 'प्रदर्शन ट्रयाक गर्न २४/७ ड्यासबोर्ड पहुँच दिन्छौं। पोर्टफोलियो पुनर्सन्तुलनका लागि त्रैमासिक समीक्षा पनि हुन्छ।'
          }
        ],
        riskTitle: 'हाम्रो जोखिम व्यवस्थापन दर्शन',
        riskFeatures: [
          {
            title: 'विविधीकरण',
            description: 'हामी कहिल्यै सबै लगानी एकै ठाउँमा राख्दैनौँ; सम्पत्ति वर्ग, भूगोल र क्षेत्रहरूमा फैलाउँछौँ।'
          },
          {
            title: 'ड्यु डिलिजेन्स',
            description: 'प्रत्येक अवसर ५०-बिन्दु चेकलिस्टबाट गुजारेर मात्र तपाईंलाई प्रस्तुत गरिन्छ।'
          },
          {
            title: 'स्टप-लस संयन्त्र',
            description: 'अस्थिर बजारमा जोखिम घटाउन स्वचालित ट्रिगर प्रयोग गर्छौं, जसले मूलधन जोगाउँछ।'
          }
        ]
      },
      plansPage: {
        headerTitle: 'लगानी योजना',
        headerSubtitle: 'तपाईंको आर्थिक यात्राका लागि सही बाटो छान्नुहोस्।',
        popularLabel: 'लोकप्रिय',
        cta: 'सुरु गर्नुहोस्',
        labels: {
          expectedReturns: 'अपेक्षित प्रतिफल',
          lockIn: 'लॉक-इन अवधि',
          min: 'न्यूनतम'
        },
        cards: [
          {
            name: 'स्टार्टर',
            subtitle: 'नयाँ लगानीकर्ता',
            minAmount: '$500',
            returns: '६-८%',
            lockIn: '१ वर्ष',
            risk: 'कम जोखिम प्रोफाइल',
            support: 'मानक सहयोग'
          },
          {
            name: 'ग्रोथ',
            subtitle: 'मझौला लगानीकर्ता',
            minAmount: '$5,000',
            returns: '१०-१४%',
            lockIn: '३ वर्ष',
            risk: 'मध्यम जोखिम प्रोफाइल',
            support: 'प्राथमिकता सहयोग',
            featured: true
          },
          {
            name: 'वेल्थ',
            subtitle: 'उच्च नेटवर्थ',
            minAmount: '$50,000',
            returns: '१५-२०%',
            lockIn: '५ वर्ष',
            risk: 'उच्च वृद्धि जोखिम प्रोफाइल',
            support: 'समर्पित सल्लाहकार'
          }
        ]
      },
      reports: {
        headerTitle: 'प्रदर्शन र प्रतिवेदन',
        headerSubtitle: 'डेटाले समर्थित पारदर्शी नतिजा।',
        performanceTitle: 'फन्ड प्रदर्शन २०२४',
        chartTitle: 'वार्षिक प्रतिफल तुलना',
        chartLabels: {
          inflation: 'महँगी',
          market: 'बजार औसत',
          investcorp: 'InvestCorp'
        },
        statsTitle: 'लगातार उत्कृष्ट प्रदर्शन',
        statsText: 'हाम्रा स्वामित्व एल्गोरिदम र विशेषज्ञ व्यवस्थापनले पछिल्ला ५ वर्षदेखि बजार औसतभन्दा बढी प्रतिफल दिइरहेका छन्।',
        statsList: [
          '$500M+ सम्पत्ति व्यवस्थापन अन्तर्गत',
          '१२.५% औसत वार्षिक प्रतिफल',
          '९८% ग्राहक प्रतिधारण दर'
        ],
        resourcesTitle: 'लगानीकर्ता स्रोतहरू',
        resources: [
          { icon: 'fa-file-pdf', title: 'वार्षिक प्रतिवेदन २०२३', size: 'PDF (2.4 MB)' },
          { icon: 'fa-file-powerpoint', title: 'Q3 लगानीकर्ता प्रस्तुति', size: 'PPT (5.1 MB)' },
          { icon: 'fa-chart-bar', title: 'बजार दृष्टिकोण २०२४', size: 'PDF (1.2 MB)' }
        ]
      },
      blogPage: {
        headerTitle: 'बजार अन्तर्दृष्टि',
        headerSubtitle: 'नवीनतम आर्थिक रुझान र टिप्समा अपडेट रहनुहोस्।',
        readMore: 'थप पढ्नुहोस्',
        posts: [
          {
            category: 'बजार अपडेट',
            title: '२०२४ को बुल मार्केट बुझ्ने',
            description: 'इक्विटी बजार किन नयाँ उच्चतामा छन् र तपाईंको पोर्टफोलियोको लागि यसको अर्थ के हो।',
            image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            category: 'टिप्स',
            title: 'एसआईपी लगानीका ५ स्वर्ण नियम',
            description: 'डॉलर-कस्ट एभरिजिङ अस्थिर बजारमा तपाईंको साथी हो। यसलाई कसरी मास्टर गर्ने यहाँ छ।',
            image: 'https://images.unsplash.com/photo-1579532551697-495dca3c3fa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            category: 'समाचार',
            title: 'रियल इस्टेट लगानीको भविष्य',
            description: 'व्यावसायिक vs आवासीय: आगामी दशकमा स्मार्ट पैसा कहाँ जान्छ?',
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          }
        ]
      },
      faq: {
        headerTitle: 'प्रश्नोत्तर',
        headerSubtitle: 'तपाईंका सामान्य प्रश्नहरूको उत्तर।',
        items: [
          {
            question: 'InvestCorp सँग मेरो लगानी सुरक्षित छ?',
            answer: 'पूर्ण रूपमा। हामी SEC मा दर्ता भएका छौँ र कडा वित्तीय नियमहरू पालना गर्छौँ। सबै ग्राहक निधि उच्च दर्जाका कस्टोडियन बैंकमा अलग राखिन्छन्।'
          },
          {
            question: 'न्यूनतम लगानी रकम कति हो?',
            answer: 'हाम्रो स्टार्टर योजना केवल $500 बाट सुरु हुन्छ। प्रिमियम धन व्यवस्थापन र कस्टम पोर्टफोलियोका लागि न्यूनतम $50,000 हो।'
          },
          {
            question: 'म आफ्नो निधि कसरी निकाल्न सक्छु?',
            answer: 'तपाईंको अनलाइन ड्यासबोर्डमार्फत जुनसुकै बेला निकासी अनुरोध गर्न सक्नुहुन्छ। सामान्य प्रक्रिया समय ३-५ कार्य दिवस हो। केही निश्चित अवधिका योजनामा लॉक-इन हुन सक्छ।'
          },
          {
            question: 'अपेक्षित प्रतिफल कति हुन्छ?',
            answer: 'योजना र बजार अवस्थाअनुसार प्रतिफल फरक पर्छ। हाम्रो ग्रोथ प्लानको ऐतिहासिक औसत १२.५% वार्षिक छ, तर विगतको प्रदर्शन भविष्यको ग्यारेन्टी होइन।'
          },
          {
            question: 'के तपाईंले कर सल्लाह दिनुहुन्छ?',
            answer: 'हामी वार्षिक कर प्रतिवेदन दिन्छौं, तर व्यक्तिगत कर योजना र सल्लाहका लागि प्रमाणित कर विशेषज्ञसँग परामर्श गर्न सिफारिस गर्छौं।'
          }
        ]
      },
      contact: {
        headerTitle: 'सम्पर्क गर्नुहोस्',
        headerSubtitle: 'आफ्नो आर्थिक लक्ष्य हासिल गर्न हामी यहाँ छौँ।',
        infoTitle: 'सम्पर्कमा रहनुहोस्',
        addressTitle: 'हाम्रो मुख्य कार्यालय',
        addressLine1: '१२३ फाइनान्सियल डिस्ट्रिक्ट, वाल स्ट्रिट,',
        addressLine2: 'न्यूयोर्क, NY 10005',
        phoneTitle: 'फोन नम्बर',
        phoneLine1: '+१ (५५५) १२३-४५६७',
        phoneLine2: '+१ (५५५) ९८७-६५४३',
        emailTitle: 'इमेल ठेगाना',
        emailLine1: 'info@investcorp.com',
        emailLine2: 'support@investcorp.com',
        formTitle: 'सन्देश पठाउनुहोस्',
        fields: {
          nameLabel: 'पूरा नाम',
          emailLabel: 'इमेल ठेगाना',
          subjectLabel: 'विषय',
          messageLabel: 'सन्देश',
          namePlaceholder: 'राम कुमार',
          emailPlaceholder: 'ram@example.com',
          messagePlaceholder: 'हामीले कसरी मद्दत गर्न सक्छौँ?'
        },
        subjectOptions: ['लगानी पूछताछ', 'सपोर्ट प्रश्न', 'साझेदारी', 'अन्य'],
        submitText: 'सन्देश पठाउनुहोस्',
        successMessage: 'धन्यवाद! चाँडै नै हामी तपाईंलाई सम्पर्क गर्छौं।'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLng || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
});

export default i18n;

