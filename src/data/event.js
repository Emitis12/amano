export const event = {
  name: 'AMANO NATIONAL CONVENTION',
  shortName: 'AMANOCON 2026',
  year: '2026',

  theme: 'Executing Maritime Excellence Through Professional Capability and Real-World Results',
  themeIntro: 'From Policy to Practice',

  tagline: 'Stronger Alumni. Greater Impact. A United AMANO for a Brighter Future.',

  // Display strings
  date: '12 – 14 November 2026',
  dateNote: '10:00 AM Prompt',

  // Main convention venue
  venueName: 'Oriental Hotels & Suites',
  venueArea: 'Lagos, Nigeria',

  // General registration message
  registration: 'Reserve your seat for AMANOCON 2026.',

  // ISO timestamps (WAT, UTC+1) used by the countdown
  startDateTime: '2026-11-12T10:00:00+01:00',
  endDateTime: '2026-11-14T20:00:00+01:00',

  // Registration
  lumaUrl: 'https://luma.com/0c8i64qw',

  // Contact & socials
  website: 'www.alumniofman.com',
  email: 'convention2026@alumniofman.com',
  phone: '+2349030000469',
  handle: '@AMANOHQ',
  hashtags: ['#AMANOCON2026', '#FromPolicyToPractice', '#EKODOINGS'],
}


// ============================================================
// VENUES
// ============================================================

export const venues = {
  day1: {
    name: 'Eko Hotels & Suites',
    area: 'Victoria Island, Lagos',
    activity: 'Meet and Greet',
    map: 'https://www.google.com/maps/search/?api=1&query=Eko+Hotel+%26+Suites+Victoria+Island+Lagos',
  },

  day2: {
    name: 'Oriental Hotels & Suites',
    area: 'Victoria Island, Lagos',
    activity: 'Stakeholder Engagement',
    map: 'https://www.google.com/maps/search/?api=1&query=Oriental+Hotel+Victoria+Island+Lagos',
  },

  day3: {
    name: 'Oriental Hotels & Suites',
    area: 'Victoria Island, Lagos',
    activity: 'Gala and Award Night',
    map: 'https://www.google.com/maps/search/?api=1&query=Oriental+Hotel+Victoria+Island+Lagos',
  },
}


// ============================================================
// SPEAKERS
// ============================================================

export const speakers = [
{
    name: 'Mr. Adegboyega Oyetola (CON)',
    role: 'Honourable Minister of Marine & Blue Economy',
    tag: 'Chairman',
    image: '/speaker5.jpg',
    bio: 'Honourable Minister, Federal Ministry of Marine and Blue Economy. Mr. Oyetola has served as Nigeria’s pioneer Minister of Marine and Blue Economy since August 2023, after two terms as Executive Governor of Osun State (2018–2023). A graduate of Insurance from the University of Lagos (B.Sc., 1978) with an MBA also from UNILAG (1990), he built a long career in the financial and insurance sectors before entering public service. Under his leadership, the Ministry secured Federal Executive Council approval for Nigeria’s National Policy on Marine and Blue Economy, and he has driven reforms in maritime safety, port efficiency, and the sector’s revenue profile.',
  },
{
    name: 'Dr. Dayo Mobereola',
    role: 'DG/CEO, Nigerian Maritime Administration and Safety Agency (NIMASA)',
    tag: 'keynote Speaker',
    image: '/speaker7.jpg',
    bio: 'Appointed DG/CEO of NIMASA in March 2024, Dr. Mobereola holds a Ph.D. and an M.Sc. in Transport Economics from the University of Wales, UK. He previously spent over a decade as Managing Director of the Lagos Metropolitan Area Transport Authority (LAMATA, 2003–2015), later serving as Lagos State Commissioner for Transportation and Board Chairman of Lagos Bus Services Ltd. His private-sector background includes senior roles at British Petroleum Shipping Limited and AFM Consulting Plc in London.',
  },

  {
    name: 'Dr. Abubakar Dantsoho',
    role: 'Managing Diretor, Nigerian Ports Authority',
    tag: 'Keynote Speaker',
    image: '/speaker8.jpg',
    bio: 'Appointed the 29th Managing Director of NPA by President Bola Tinubu in July 2024, Dr. Dantsoho rose through nearly three decades at the Authority, starting as an NYSC member in 1992 and advancing through roles including Port Manager at Onne Port, Technical Assistant to the Managing Director, and Chief of Staff to the Minister of Transportation. A Ph.D. holder with a first degree in Public Administration from the University of Maiduguri, he also chairs the Port Management Association of West and Central Africa (PMAWCA) and has overseen a sharp rise in NPA’s revenue performance during his tenure.',
  },
{
    name: 'Dr. Kelvin Okonna',
    role: 'Acting Rector, Maritime Academy of Nigeria, Oron',
    tag: 'Chief Host',
    image: '/speaker6.jpg',
    bio: 'Dr. Okonna was appointed Acting Rector of MAN, Oron in January 2025, capping nearly three decades of service at the Academy. An alumnus of the World Maritime University (WMU), Malmö, Sweden, he previously held several pioneering roles at MAN, including first Head of the Maritime Safety Department and inaugural Director of Strategy, Research and Development. He is a member of the Nautical Institute (UK) and a Fellow of the Chartered Institute of Logistics and Transport (CILT), and has represented the Academy on several Federal Government committees, including Nigeria’s IMSAS audit in 2016.',
  },
  {
    name: 'Mr. Emmanuel Maiguwa',
    role: 'President, Alumni of Maritime Academy of Nigeria (AMANO)',
    tag: 'Host',
    image: '/speaker53.png',
    bio: `Emmanuel Maiguwa is a seasoned founder, Chief Executive Officer and entrepreneur with over 23 years of experience as an all-round maritime expert. His expertise spans ship management, commercial shipping, sale and purchase, maritime security, port operations, international shipping and agency operations, and international maritime regulatory frameworks and standards.

He is adept at formulating strategies and corporate policies that drive wealth creation, capacity building and project delivery, and at carrying initiatives from planning through implementation to completion.

He is the Chief Executive Officer of Bricks Mursten Mattoni Limited and a Director of Elgan Integrated Limited and BA Ports Services Limited. He serves as President of the Maritime Security Providers Association of Nigeria (MASPAN) and, in his second tenure, as President of the Alumni of the Maritime Academy of Nigeria, Oron (AMANO).

He has been at the forefront of advancing the Nigerian maritime industry, working closely with the leadership of the Federal Ministry of Marine and Blue Economy, the Nigerian Navy, the Nigerian Ports Authority, the Nigerian Chamber of Shipping, the Shipowners Association of Nigeria, and other private-sector maritime organisations. He has also supported the maritime leadership of other African countries in their maritime development efforts.`,
  },

  {
    name: 'Captain Warredi Enisuoh',
    role: 'Executive Director, Operations and Technical Tantita Security Services',
    tag: 'Moderator',
    image: '/speaker49.jpg',
    bio: `Captain Warredi Enisuoh is a highly accomplished maritime and aviation expert with over two decades of experience spanning multiple continents and industries. His distinguished career is defined by leadership roles in maritime operations, aviation, and national security, with a strong focus on protecting vital infrastructure within Nigeria’s oil and gas sector.

Captain Enisuoh holds the prestigious Master Mariner Class 1 Unlimited Foreign Going License, making him a highly qualified maritime professional with the ability to command vessels of any size on international waters. He also holds an Aircraft Pilot’s License and a Diploma in Aviation, further demonstrating his versatility and deep understanding of complex transportation systems.

His educational background is equally impressive. He is a graduate of the Maritime Academy of Nigeria, Oron, and the Arab Maritime Transport Academy in Alexandria, Egypt. He further advanced his expertise at the Australian Maritime College in Launceston, Tasmania, and the Tasmanian Aviation College. His international training was complemented by studies at the Swiss Air Training Centre in Zurich, Switzerland, where he gained valuable knowledge and experience in aviation.

Throughout his career, Captain Enisuoh has held critical positions across both the maritime and aviation industries. He spent eight years with Pacific International Lines Pte Ltd in Singapore, gaining extensive hands-on experience in maritime operations. His commitment to education and professional development also led him to serve as a Lecturer, Instructor, Course Developer, and Examiner at the Australian Maritime College and the University of Tasmania, where he contributed to the training and development of future maritime professionals.

Captain Enisuoh further demonstrated his leadership at the Australian Maritime Safety Authority (AMSA), where he spent six years contributing to maritime safety and regulatory compliance across Australia's vast coastline. His aviation career also saw him serve as an airline pilot with Virgin Nigeria and other airlines, further showcasing his expertise across multiple transportation sectors.

In Nigeria, Captain Enisuoh made significant contributions to the Nigerian Maritime Administration and Safety Agency (NIMASA), serving as Director of Maritime Safety and Director of Shipping Development. In these roles, he played an important part in shaping policies and driving initiatives aimed at strengthening maritime safety and improving shipping operations in Nigeria.

Currently, Captain Enisuoh serves as Executive Director – Operations and Technical at Tantita Security Services Nigeria Limited, where he oversees critical operations and technical strategies focused on securing Nigeria's oil and gas infrastructure. His extensive knowledge and leadership in maritime and aviation operations make him a key figure in supporting Tantita Security's mission to protect the nation's vital resources.

Captain Warredi Enisuoh's commitment to excellence, dedication to advancing maritime and aviation safety, and passion for developing innovative security strategies have established him as a respected authority in maritime, aviation, and security operations.`
  },
{
    name: 'Mrs. Iroghama Ogbeifun',
    role: 'Managing Director/Chief Executive Officer of Starzs Investments Company Limited',
    tag: 'Panelist',
    image: '/speaker80.jpg',
    bio: `Iroghama Ogbeifun is the Managing Director/Chief Executive Officer of Starzs Investments Company Limited where she manages the affairs and operations of a Fleet of Eleven Ships working in Deep offshore Nigerian waters whilst supporting the oil exploration and production activities of International Oil Companies.

She holds a Bachelor’s degree in Biology and Psychology and an MSc in Public Health. She is also an alumnus of the Harvard Business School.

In addition to her role at Starzs Investments Company Limited, Iroghama Ogbeifun serves as Vice Chairman of Starzs Gas Limited and Director at Eaglewatch Security Services Limited.

A respected industry leader, she is a Member of the Governing Board of Nigerian Maritime Administration and Safety Agency (NIMASA), a Member of the Institute of Directors (IoD), and a Fellow of the National Institute of Credit Administration (NICA).

A strong advocate for gender inclusion and women’s advancement in business and energy, she is a Founding Member and Sponsorship Director of Women in Energy Network (WIEN), an Associate Member of Women in Management, Business and Public Service (WIMBIZ), a Patron of Association of Professional Women Engineers of Nigeria (APWEN), a Matron of the Association of Women Entrepreneurs and Business Owners (AWEBO), and a member of GAIA Africa.

Beyond the corporate space, Iroghama is deeply committed to philanthropy and social impact. She serves as a Board Trustee of The R.E.A.C.H Nigeria Foundation, a Board Member of Lagos Liga, and a Member of the Advisory Board for the Women in Maritime and Energy Awards (WiME Awards).

With over a decade of extensive entrepreneurial experience, she is the founder of Hairven Hair Limited, which has beauty salons, spa & a hair care line, and Stratom Concept Limited, a diversified company with interests in logistics, construction, petroleum marketing, agro-allied services, and retail, whose subsidiaries include Jana & Jaya’s Daily Mart and Revitalife Pharmacy.

She is a mother to beautiful twin girls and is committed to the growth of female entrepreneurs, a passion she drives through mentorship and support.`,
  },
  {
    name: 'Mr. William Azuh',
    role: 'Maritime Policy, Administration & Governance',
    tag: 'Speaker',
    image: '/speaker1.jpg',
    bio: `William Azuh is an international expert in Maritime Policy, Administration and Governance, with more than 33 years’ experience in the maritime industry. He is currently the Director/Chief Executive Officer of UCK Integrated Consulting Ltd. He served as Director at NIMASA and as Nigeria’s Alternate Permanent Representative to the International Maritime Organization (IMO) for more than 10 years. At IMO, William was the Deputy Director, Subdivision for Maritime Development, Technical Cooperation Division. Before then, he was the Head of Africa and The Middle East Section in the same Subdivision for Maritime Development. Mr Azuh served as a Board Member, Board of Governors of the World Maritime University (WMU), Malmo, Sweden. He is currently a Trustee and Board Member, Stella Maris (formerly Apostleship of the Sea), United Kingdom, a Seafarers Charity. He is a Rotarian and the immediate past President of the Rotary Club of Westminster West, London, United Kingdom. Mr William Azuh is an accomplished international maritime professional.`,
  },

  {
    name: 'Mr. Larry Amaraibi',
    role: 'Deputy General Manager, Marine (Affiliate Lead for Marine Specialty & Total Energies Specialist)',
    tag: 'Speaker',
    image: '/speaker52.jpg',
    bio: `Seasoned Marine Professional with many years of progressive experience in the energy industry including several engineer roles on board LNG carriers, shore based marine quality assurance organisation within Total E & P Nigeria and in Total E & P headquarters in Paris. Offering a combination of expertise backed by these extensive experience, strategic thinking, well-honed skill sets and behaviours, an unwavering commitment to continuous development and a clear understanding of the evolving energy industry and its close interplay with the marine discipline.`,
  },

  {
  name: 'Mr. Maximo Q. Mejia Jr.',
  role: 'President, World Maritime University',
  tag: 'Special Guest of Honour',
  image: '/speaker2.jpg',
  bio: `Professor Maximo Q. Mejia is an accomplished international civil servant, global leader, and scholar in maritime governance, policy, and administration, with over four decades of professional and academic experience. He is a passionate advocate for safe, secure, sustainable, and efficient shipping on clean oceans.

Appointed by the Secretary-General of the International Maritime Organization (IMO) as the eighth President of the World Maritime University (WMU), Professor Mejia oversees the University’s academic programmes, operations, and administration. Before becoming President, he served on the WMU Faculty from 1998, holding several leadership positions, including Director of the PhD Programme, Head of the Maritime Law and Policy Specialization, Associate Academic Dean, and Nippon Foundation Professor of Maritime Governance, Policy, and Administration.

He has authored or co-authored more than 70 published articles and book chapters and edited or co-edited 12 books. His multidisciplinary research and teaching cover maritime policy, maritime law, maritime labour law and policy, human factors, safety, and security.

Beyond academia, Professor Mejia served as Administrator/Director-General of the Maritime Industry Authority (MARINA) in the Philippines from 2013 to 2016. He previously held several positions in the Philippine Navy and Philippine Coast Guard, contributing to navigational safety and maritime development. In 2013, he was named among Lloyd’s List’s 100 Most Influential People in the Shipping Industry. He has also undertaken senior diplomatic assignments representing the Philippines at IMO meetings and chaired the 31st ASEAN Maritime Transport Working Group in 2016.

Professor Mejia holds a PhD from Lund University, Sweden; an MSc from the World Maritime University; an MA in Law and Diplomacy from The Fletcher School at Tufts University; and a BSc from the United States Naval Academy. Fluent in Filipino, English, and Swedish, with knowledge of Spanish and Chinese, he is WMU’s first President from Asia and the first President to be an alumnus of the University.`
},
]


// ============================================================
// CONVENTION SCHEDULE
// ============================================================

export const schedule = [
  {
    day: 'Day 1',
    date: 'Thu, 12 Nov',
    activity: 'Meet and Greet',
    venue: venues.day1,
  },

  {
    day: 'Day 2',
    date: 'Fri, 13 Nov',
    activity: 'Stakeholder Engagement',
    venue: venues.day2,
  },

  {
    day: 'Day 3',
    date: 'Sat, 14 Nov',
    activity: 'Gala and Award Night',
    venue: venues.day3,
  },
]


// ============================================================
// FAQS
// ============================================================

export const faqs = [
  {
    q: 'Who can attend the AMANO National Convention?',
    a: 'The convention is open to all AMANO alumni, current maritime industry professionals, Ex cadets of the Maritime Academy of Nigeria, Oron, and well-wishers of the association.',
  },

  {
    q: 'Is there a registration fee?',
    a: 'Registration details are confirmed at checkout on our Luma registration page — tap Register Now to see current availability and any pricing.',
  },

  {
    q: 'What is the exact date of the convention?',
    a: 'The convention runs from Thursday 12 to Saturday 14 November 2026, starting 10:00 AM prompt on the first day.',
  },

  {
    q: 'Where will the convention hold?',
    a: 'The convention activities will take place at two venues in Lagos. Day 1, Thursday 12 November, will be the Meet and Greet at Eko Hotels & Suites. Days 2 and 3, Friday 13 and Saturday 14 November, will take place at Oriental Hotels & Suites.',
  },

  {
    q: 'Do I need to register in advance?',
    a: 'Yes. Advance registration through Luma helps us plan seating, catering and materials for all three days.',
  },

  {
    q: 'Will there be opportunities to network with other alumni?',
    a: 'Absolutely. Networking is built into the schedule, including the opening stakeholders engagement and the closing ceremony.',
  },
]