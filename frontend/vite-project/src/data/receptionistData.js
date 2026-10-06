/* ============================================
   Receptionist — mock data
============================================ */

export const frontDeskStats = [
  { label: 'Appointments today', value: '27', hint: '19 completed · 3 changes',    icon: 'fa-calendar-check',      tone: 'green' },
  { label: 'Checked in',          value: '6',  hint: 'Average wait 11 min',        icon: 'fa-list-check',          tone: 'blue' },
  { label: 'Unpaid invoices',     value: '4',  hint: '$486.50 outstanding',        icon: 'fa-file-invoice-dollar', tone: 'amber', hintTone: 'amber' },
  { label: 'New registrations',   value: '5',  hint: '2 awaiting consent',         icon: 'fa-user-plus',           tone: 'purple' },
];

export const checkinQueue = [
  { id: 1, patient: 'Bailey', owner: 'Eli Morris · Urgent walk-in',    time: '12:20', status: 'Triage now', tone: 'red',   initials: 'BM', avatar: 'pink',   wait: '6 min'  },
  { id: 2, patient: 'Suki',   owner: 'Hana Yamamoto · Ultrasound review', time: '12:00', status: 'Checked in', tone: 'green', initials: 'SP', avatar: 'blue',   wait: '18 min' },
  { id: 3, patient: 'Pip',    owner: 'Jamie Wilson · Lameness assessment', time: '12:15', status: 'Checked in', tone: 'green', initials: 'PW', avatar: 'amber',  wait: '8 min'  },
  { id: 4, patient: 'Luna',   owner: 'Rina Patel · Vaccination',       time: '12:30', status: 'Arrived',    tone: 'blue',  initials: 'LP', avatar: 'purple', wait: '2 min'  },
];

export const frontDeskAppointments = [
  { id: 1, time: '09:00', patient: 'Milo Chen',     owner: 'Jamie Chen',    reason: 'Wellness exam',           species: 'Feline', status: 'Completed',   initials: 'MC', avatar: 'pink'   },
  { id: 2, time: '09:45', patient: 'Cooper Davis',  owner: 'Taylor Davis',  reason: 'Dermatology follow-up',   species: 'Canine', status: 'In progress', initials: 'CD', avatar: 'green'  },
  { id: 3, time: '10:30', patient: 'Luna Patel',    owner: 'Rina Patel',    reason: 'Vaccination',             species: 'Canine', status: 'Waiting',     initials: 'LP', avatar: 'blue'   },
  { id: 4, time: '11:15', patient: 'Pip Wilson',    owner: 'Jamie Wilson',  reason: 'Lameness assessment',     species: 'Rabbit', status: 'Waiting',     initials: 'PW', avatar: 'amber'  },
  { id: 5, time: '12:00', patient: 'Suki Yamamoto', owner: 'Hana Yamamoto', reason: 'Ultrasound review',       species: 'Feline', status: 'Waiting',     initials: 'SY', avatar: 'blue'   },
  { id: 6, time: '12:45', patient: 'Archie King',   owner: 'Priya King',    reason: 'Skin scrape',             species: 'Canine', status: 'Scheduled',   initials: 'AK', avatar: 'purple' },
  { id: 7, time: '13:30', patient: 'Nala Brooks',   owner: 'Sam Brooks',    reason: 'Urinalysis',              species: 'Feline', status: 'Scheduled',   initials: 'NB', avatar: 'purple' },
  { id: 8, time: '14:15', patient: 'Pepper Singh',  owner: 'Raj Singh',     reason: 'Gram stain',              species: 'Avian',  status: 'Scheduled',   initials: 'PS', avatar: 'green'  },
];

export const ownersAndAnimals = [
  { id: 1, owner: 'Taylor Davis',  phone: '(555) 018-4271', email: 'taylor@example.com', animals: ['Cooper Davis'],                        initials: 'TD', avatar: 'green',  since: '2019' },
  { id: 2, owner: 'Jamie Chen',    phone: '(555) 018-1122', email: 'jamie.chen@example.com', animals: ['Milo Chen'],                       initials: 'JC', avatar: 'pink',   since: '2021' },
  { id: 3, owner: 'Rina Patel',    phone: '(555) 018-3344', email: 'rina.p@example.com',  animals: ['Luna Patel'],                          initials: 'RP', avatar: 'blue',   since: '2023' },
  { id: 4, owner: 'Jamie Wilson',  phone: '(555) 018-5566', email: 'jamie.w@example.com', animals: ['Pip Wilson'],                          initials: 'JW', avatar: 'amber',  since: '2024' },
  { id: 5, owner: 'Hana Yamamoto', phone: '(555) 018-7788', email: 'hana.y@example.com',  animals: ['Suki Yamamoto'],                       initials: 'HY', avatar: 'blue',   since: '2018' },
  { id: 6, owner: 'Sam Brooks',    phone: '(555) 018-9900', email: 'sam.b@example.com',   animals: ['Nala Brooks'],                         initials: 'SB', avatar: 'purple', since: '2022' },
];

export const invoices = [
  { id: 'INV-10984', patient: 'Cooper Davis', owner: 'Taylor Davis',  date: '04 Oct 2026', total: 165.50, paid: 0,     status: 'Unpaid',   initials: 'CD', avatar: 'green'  },
  { id: 'INV-10983', patient: 'Suki Yamamoto', owner: 'Hana Yamamoto', date: '04 Oct 2026', total: 220.00, paid: 220.00, status: 'Paid',     initials: 'SY', avatar: 'blue'   },
  { id: 'INV-10982', patient: 'Milo Chen',    owner: 'Jamie Chen',    date: '03 Oct 2026', total: 85.00,  paid: 0,     status: 'Unpaid',   initials: 'MC', avatar: 'pink'   },
  { id: 'INV-10981', patient: 'Luna Patel',   owner: 'Rina Patel',    date: '03 Oct 2026', total: 45.00,  paid: 45.00,  status: 'Paid',     initials: 'LP', avatar: 'blue'   },
  { id: 'INV-10980', patient: 'Pip Wilson',   owner: 'Jamie Wilson',  date: '02 Oct 2026', total: 136.50, paid: 0,     status: 'Overdue',  initials: 'PW', avatar: 'amber'  },
  { id: 'INV-10979', patient: 'Archie King',  owner: 'Priya King',    date: '02 Oct 2026', total: 320.00, paid: 320.00, status: 'Paid',     initials: 'AK', avatar: 'purple' },
];

export const payments = [
  { id: 'PMT-9001', invoiceId: 'INV-10983', patient: 'Suki Yamamoto', amount: 220.00, method: 'Credit card', date: '04 Oct 2026 · 11:42', status: 'Completed', initials: 'SY', avatar: 'blue'   },
  { id: 'PMT-9000', invoiceId: 'INV-10981', patient: 'Luna Patel',    amount: 45.00,  method: 'Cash',        date: '03 Oct 2026 · 14:20', status: 'Completed', initials: 'LP', avatar: 'blue'   },
  { id: 'PMT-8999', invoiceId: 'INV-10979', patient: 'Archie King',   amount: 320.00, method: 'Credit card', date: '02 Oct 2026 · 16:55', status: 'Completed', initials: 'AK', avatar: 'purple' },
  { id: 'PMT-8998', invoiceId: 'INV-10978', patient: 'Nala Brooks',   amount: 65.00,  method: 'Debit card',  date: '01 Oct 2026 · 10:30', status: 'Completed', initials: 'NB', avatar: 'purple' },
  { id: 'PMT-8997', invoiceId: 'INV-10977', patient: 'Pepper Singh',  amount: 42.50,  method: 'Cash',        date: '30 Sep 2026 · 09:15', status: 'Refunded',  initials: 'PS', avatar: 'green'  },
];

export const messages = [
  { id: 1, from: 'Taylor Davis',   channel: 'SMS',   subject: 'Appointment reminder',         preview: 'Confirming Cooper\'s appointment on 15 Oct...', time: '10:24', read: false, initials: 'TD', avatar: 'green'  },
  { id: 2, from: 'Jamie Chen',     channel: 'Email', subject: 'Question about Milo\'s meds',   preview: 'Should I continue the medication for another week?', time: '09:58', read: false, initials: 'JC', avatar: 'pink'   },
  { id: 3, from: 'Rina Patel',     channel: 'SMS',   subject: 'Vaccination certificate',      preview: 'Can you send Luna\'s certificate by email?',       time: '09:12', read: true,  initials: 'RP', avatar: 'blue'   },
  { id: 4, from: 'Hana Yamamoto',  channel: 'Email', subject: 'Insurance paperwork',          preview: 'Attached the updated insurance form for Suki.',     time: 'Yesterday', read: true, initials: 'HY', avatar: 'blue' },
  { id: 5, from: 'Sam Brooks',     channel: 'SMS',   subject: 'Reschedule request',           preview: 'Can we move Nala\'s appointment to next Tuesday?', time: 'Yesterday', read: true, initials: 'SB', avatar: 'purple' },
];