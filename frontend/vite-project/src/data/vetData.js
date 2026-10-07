/* ============================================
   Veterinarian — mock data
============================================ */

export const vetStats = [
  { label: "Today's appointments", value: '11', hint: '5 completed · 1 urgent',    icon: 'fa-calendar-day',    tone: 'green' },
  { label: 'Waiting now',          value: '3',  hint: 'Longest wait 18 min',       icon: 'fa-clock',           tone: 'amber', hintTone: 'amber' },
  { label: 'Results to review',    value: '3',  hint: '1 abnormal result',         icon: 'fa-flask',           tone: 'red',   hintTone: 'red' },
  { label: 'Follow-ups',           value: '6',  hint: '2 need scheduling',         icon: 'fa-clipboard-check', tone: 'blue' },
];

export const vetSchedule = [
  { time: '09:00', name: 'Milo Chen',     reason: 'Wellness exam',           meta: 'Feline · 4y',  dot: 'green' },
  { time: '09:45', name: 'Cooper Davis',  reason: 'Dermatology follow-up',    meta: 'Canine · 7y',  dot: 'amber', active: true },
  { time: '10:30', name: 'Luna Patel',    reason: 'Vaccination',             meta: 'Canine · 2y',  dot: 'blue' },
  { time: '11:15', name: 'Pip Wilson',    reason: 'Lameness assessment',     meta: 'Rabbit · 3y',  dot: 'purple' },
  { time: '12:00', name: 'Suki Yamamoto', reason: 'Ultrasound review',       meta: 'Feline · 8y',  dot: 'green' },
];

export const appointments = [
  { id: 1, time: '09:00', patient: 'Milo Chen',     owner: 'Jamie Chen',     reason: 'Wellness exam',        species: 'Feline', status: 'Completed',  initials: 'MC', avatar: 'pink' },
  { id: 2, time: '09:45', patient: 'Cooper Davis',  owner: 'Taylor Davis',   reason: 'Dermatology follow-up', species: 'Canine', status: 'In progress', initials: 'CD', avatar: 'green' },
  { id: 3, time: '10:30', patient: 'Luna Patel',    owner: 'Rina Patel',     reason: 'Vaccination',          species: 'Canine', status: 'Waiting',     initials: 'LP', avatar: 'blue' },
  { id: 4, time: '11:15', patient: 'Pip Wilson',    owner: 'Jamie Wilson',   reason: 'Lameness assessment',  species: 'Rabbit', status: 'Waiting',     initials: 'PW', avatar: 'amber' },
  { id: 5, time: '12:00', patient: 'Suki Yamamoto', owner: 'Hana Yamamoto',  reason: 'Ultrasound review',    species: 'Feline', status: 'Waiting',     initials: 'SY', avatar: 'blue' },
  { id: 6, time: '12:45', patient: 'Archie King',   owner: 'Priya King',     reason: 'Skin scrape',          species: 'Canine', status: 'Scheduled',   initials: 'AK', avatar: 'purple' },
  { id: 7, time: '13:30', patient: 'Nala Brooks',   owner: 'Sam Brooks',     reason: 'Urinalysis',           species: 'Feline', status: 'Scheduled',   initials: 'NB', avatar: 'purple' },
  { id: 8, time: '14:15', patient: 'Pepper Singh',  owner: 'Raj Singh',      reason: 'Gram stain',           species: 'Avian',  status: 'Scheduled',   initials: 'PS', avatar: 'green' },
];

export const patients = [
  { id: 1, name: 'Cooper Davis',  species: 'Canine',  breed: 'Golden Retriever',     age: '7y 3m', weight: '31.2 kg', owner: 'Taylor Davis',  lastVisit: '12 Aug 2026', status: 'Active',   initials: 'CD', avatar: 'green' },
  { id: 2, name: 'Milo Chen',     species: 'Feline',  breed: 'Domestic shorthair',   age: '4y',    weight: '5.1 kg',  owner: 'Jamie Chen',    lastVisit: '15 Sep 2026', status: 'Active',   initials: 'MC', avatar: 'pink' },
  { id: 3, name: 'Luna Patel',    species: 'Canine',  breed: 'Beagle',               age: '2y',    weight: '12.4 kg', owner: 'Rina Patel',    lastVisit: '01 Oct 2026', status: 'Active',   initials: 'LP', avatar: 'blue' },
  { id: 4, name: 'Pip Wilson',    species: 'Rabbit',  breed: 'Holland Lop',          age: '3y',    weight: '1.8 kg',  owner: 'Jamie Wilson',  lastVisit: '20 Sep 2026', status: 'Active',   initials: 'PW', avatar: 'amber' },
  { id: 5, name: 'Suki Yamamoto', species: 'Feline',  breed: 'Siamese mix',          age: '8y',    weight: '4.6 kg',  owner: 'Hana Yamamoto', lastVisit: '28 Sep 2026', status: 'Chronic',  initials: 'SY', avatar: 'blue' },
  { id: 6, name: 'Archie King',   species: 'Canine',  breed: 'Border Collie',        age: '5y',    weight: '18.9 kg', owner: 'Priya King',    lastVisit: '22 Sep 2026', status: 'Active',   initials: 'AK', avatar: 'purple' },
];

export const consultations = [
  { id: 'CONS-2841', patient: 'Cooper Davis',  date: '04 Oct 2026', type: 'Dermatology follow-up', status: 'In progress', initials: 'CD', avatar: 'green' },
  { id: 'CONS-2840', patient: 'Milo Chen',     date: '04 Oct 2026', type: 'Wellness exam',         status: 'Completed',   initials: 'MC', avatar: 'pink' },
  { id: 'CONS-2839', patient: 'Luna Patel',    date: '04 Oct 2026', type: 'Vaccination',           status: 'Completed',   initials: 'LP', avatar: 'blue' },
  { id: 'CONS-2838', patient: 'Suki Yamamoto', date: '03 Oct 2026', type: 'Ultrasound review',     status: 'Completed',   initials: 'SY', avatar: 'blue' },
  { id: 'CONS-2837', patient: 'Pip Wilson',    date: '03 Oct 2026', type: 'Lameness assessment',   status: 'Completed',   initials: 'PW', avatar: 'amber' },
];

export const vetLabOrders = [
  { id: 'LAB-2841', patient: 'Bailey Morris', test: 'CBC + chemistry', status: 'Received',   result: 'Pending',      initials: 'BM', avatar: 'pink' },
  { id: 'LAB-2838', patient: 'Cooper Davis',  test: 'Ear cytology',    status: 'Completed',  result: 'Abnormal',     initials: 'CD', avatar: 'green' },
  { id: 'LAB-2837', patient: 'Suki Yamamoto', test: 'CBC + thyroid',   status: 'Processing', result: 'Pending',      initials: 'SY', avatar: 'blue' },
  { id: 'LAB-2834', patient: 'Milo Chen',     test: 'Renal panel',     status: 'Completed',  result: 'Abnormal',     initials: 'MC', avatar: 'pink' },
  { id: 'LAB-2833', patient: 'Luna Patel',    test: 'Pre-op CBC',      status: 'Completed',  result: 'Normal',       initials: 'LP', avatar: 'blue' },
];

export const prescriptions = [
  { id: 'RX-8412', patient: 'Cooper Davis',  medication: 'Mometamax otic suspension', dose: '4 drops BID · 10 days',   date: '04 Oct 2026', status: 'Pending',  initials: 'CD', avatar: 'green' },
  { id: 'RX-8411', patient: 'Bailey Morris', medication: 'Doxycycline 100 mg',         dose: '1 tab BID · 7 days',      date: '04 Oct 2026', status: 'Priority', initials: 'BM', avatar: 'pink' },
  { id: 'RX-8410', patient: 'Nala Brooks',   medication: 'Revolution Plus',            dose: 'Topical monthly',         date: '03 Oct 2026', status: 'Active',   initials: 'NB', avatar: 'purple' },
  { id: 'RX-8408', patient: 'Pip Wilson',    medication: 'Meloxicam oral',             dose: '0.2 mg/kg SID · 5 days',  date: '02 Oct 2026', status: 'Active',   initials: 'PW', avatar: 'amber' },
  { id: 'RX-8406', patient: 'Suki Yamamoto', medication: 'Apoquel 16 mg',              dose: '1 tab SID · 14 days',     date: '01 Oct 2026', status: 'Completed', initials: 'SY', avatar: 'blue' },
];

export const surgeries = [
  { id: 'SRG-301', patient: 'Cooper Davis',  procedure: 'Mass removal (left flank)', surgeon: 'Dr. Mensah', date: '05 Oct 2026', time: '09:00', duration: '90 min', status: 'Scheduled',   initials: 'CD', avatar: 'green' },
  { id: 'SRG-300', patient: 'Luna Patel',    procedure: 'Spay (feline)',             surgeon: 'Dr. Park',   date: '05 Oct 2026', time: '11:00', duration: '45 min', status: 'Pre-op',      initials: 'LP', avatar: 'blue' },
  { id: 'SRG-299', patient: 'Archie King',   procedure: 'Dental cleaning',           surgeon: 'Dr. Mensah', date: '05 Oct 2026', time: '14:00', duration: '60 min', status: 'Scheduled',   initials: 'AK', avatar: 'purple' },
  { id: 'SRG-298', patient: 'Milo Chen',     procedure: 'Neuter (canine)',           surgeon: 'Dr. Chen',   date: '06 Oct 2026', time: '10:30', duration: '45 min', status: 'Scheduled',   initials: 'MC', avatar: 'pink' },
  { id: 'SRG-297', patient: 'Pip Wilson',    procedure: 'Joint fluid tap',           surgeon: 'Dr. Mensah', date: '03 Oct 2026', time: '15:30', duration: '30 min', status: 'Completed',   initials: 'PW', avatar: 'amber' },
];

export const followUps = [
  { id: 'FU-201', patient: 'Cooper Davis',  reason: 'Dermatology recheck',        dueDate: '15 Oct 2026', status: 'Scheduled', initials: 'CD', avatar: 'green' },
  { id: 'FU-200', patient: 'Milo Chen',     reason: 'Rabies booster due',         dueDate: '22 Oct 2026', status: 'Pending',   initials: 'MC', avatar: 'pink' },
  { id: 'FU-199', patient: 'Suki Yamamoto', reason: 'Renal panel recheck',        dueDate: '28 Oct 2026', status: 'Scheduled', initials: 'SY', avatar: 'blue' },
  { id: 'FU-198', patient: 'Archie King',   reason: 'Post-op check',              dueDate: '12 Oct 2026', status: 'Scheduled', initials: 'AK', avatar: 'purple' },
  { id: 'FU-197', patient: 'Luna Patel',    reason: 'Vaccination series follow',  dueDate: '08 Nov 2026', status: 'Pending',   initials: 'LP', avatar: 'blue' },
  { id: 'FU-196', patient: 'Pip Wilson',    reason: 'Lameness re-evaluation',     dueDate: '18 Oct 2026', status: 'Scheduled', initials: 'PW', avatar: 'amber' },
];