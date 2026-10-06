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