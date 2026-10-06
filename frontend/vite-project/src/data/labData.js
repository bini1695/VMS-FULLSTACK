/* ============================================
   Laboratory — mock data
============================================ */

export const labStats = [
  { label: 'Incoming requisitions', value: '18',    hint: '2 STAT priorities',          icon: 'fa-clipboard-list',     tone: 'amber' },
  { label: 'Samples processing',    value: '7',     hint: 'Average TAT 42 min',         icon: 'fa-vials',              tone: 'blue'  },
  { label: 'Awaiting validation',   value: '5',     hint: '2 abnormal findings',        icon: 'fa-circle-exclamation', tone: 'red'   },
  { label: 'Equipment online',      value: '6 / 6', hint: 'Last interface sync 2 min',  icon: 'fa-microscope',         tone: 'green' },
];

export const labColumns = {
  received: [
    { id: 'LAB-2841', patient: 'Bailey Morris', species: 'Canine', test: 'CBC + chemistry',       time: 'Received 12:18', tag: 'STAT',     tone: 'amber', initials: 'BM', avatar: 'pink',   flagged: true  },
    { id: 'LAB-2840', patient: 'Pip Wilson',    species: 'Rabbit', test: 'Joint fluid analysis',  time: 'Received 11:54',                  initials: 'PW', avatar: 'amber'                },
    { id: 'LAB-2839', patient: 'Nala Brooks',   species: 'Feline', test: 'Urinalysis',            time: 'Received 11:41',                  initials: 'NB', avatar: 'purple'               },
  ],
  processing: [
    { id: 'LAB-2838', patient: 'Cooper Davis',  species: 'Canine', test: 'Ear cytology',  time: '18 min', tag: 'Abnormal', tone: 'red', initials: 'CD', avatar: 'green',  flagged: true },
    { id: 'LAB-2837', patient: 'Suki Yamamoto', species: 'Feline', test: 'CBC + thyroid', time: '31 min',                                  initials: 'SY', avatar: 'blue'                 },
    { id: 'LAB-2835', patient: 'Archie King',   species: 'Canine', test: 'Skin scrape',   time: '44 min',                                  initials: 'AK', avatar: 'purple'               },
  ],
  completed: [
    { id: 'LAB-2834', patient: 'Milo Chen',     species: 'Feline', test: 'Renal panel',  time: 'Done 12:02', tag: 'Abnormal', tone: 'red', initials: 'MC', avatar: 'pink',  flagged: true },
    { id: 'LAB-2833', patient: 'Luna Patel',    species: 'Canine', test: 'Pre-op CBC',   time: 'Done 11:37',                                  initials: 'LP', avatar: 'blue'                },
    { id: 'LAB-2832', patient: 'Pepper Singh',  species: 'Avian',  test: 'Gram stain',   time: 'Done 10:58',                                  initials: 'PS', avatar: 'green'               },
  ],
};

export const requisitions = [
  { id: 'REQ-501', patient: 'Bailey Morris', owner: 'Eli Morris',     vet: 'Dr. Mensah', test: 'CBC + chemistry',   priority: 'STAT',    status: 'Received',   time: '12:18', initials: 'BM', avatar: 'pink' },
  { id: 'REQ-500', patient: 'Cooper Davis',  owner: 'Taylor Davis',   vet: 'Dr. Mensah', test: 'Ear cytology',      priority: 'Routine', status: 'Processing', time: '12:08', initials: 'CD', avatar: 'green' },
  { id: 'REQ-499', patient: 'Suki Yamamoto', owner: 'Hana Yamamoto',  vet: 'Dr. Ortega', test: 'CBC + thyroid',     priority: 'Routine', status: 'Processing', time: '11:52', initials: 'SY', avatar: 'blue' },
  { id: 'REQ-498', patient: 'Pip Wilson',    owner: 'Jamie Wilson',   vet: 'Dr. Chen',   test: 'Joint fluid',       priority: 'Routine', status: 'Received',   time: '11:54', initials: 'PW', avatar: 'amber' },
  { id: 'REQ-497', patient: 'Nala Brooks',   owner: 'Sam Brooks',     vet: 'Dr. Mensah', test: 'Urinalysis',        priority: 'Routine', status: 'Received',   time: '11:41', initials: 'NB', avatar: 'purple' },
  { id: 'REQ-496', patient: 'Milo Chen',     owner: 'Jamie Chen',     vet: 'Dr. Park',   test: 'Renal panel',       priority: 'Routine', status: 'Completed',  time: '11:20', initials: 'MC', avatar: 'pink' },
];

export const findings = [
  { id: 'LAB-2838', patient: 'Cooper Davis', test: 'Ear cytology', organism: 'Malassezia', value: 'HIGH (4+)', ref: 'None to rare',       status: 'Abnormal', initials: 'CD', avatar: 'green'  },
  { id: 'LAB-2837', patient: 'Suki Yamamoto', test: 'CBC + thyroid', organism: 'T4',      value: '2.8 µg/dL', ref: '1.0 – 4.0 µg/dL',   status: 'Normal',   initials: 'SY', avatar: 'blue'   },
  { id: 'LAB-2836', patient: 'Luna Patel',   test: 'Pre-op CBC',    organism: 'WBC',     value: '8.2 K/µL',  ref: '6.0 – 17.0 K/µL',  status: 'Normal',   initials: 'LP', avatar: 'blue'   },
  { id: 'LAB-2834', patient: 'Milo Chen',    test: 'Renal panel',   organism: 'Creatinine', value: '2.6 mg/dL', ref: '0.3 – 1.4 mg/dL', status: 'Abnormal', initials: 'MC', avatar: 'pink' },
  { id: 'LAB-2833', patient: 'Pepper Singh', test: 'Gram stain',    organism: 'Bacteria', value: 'Gram-negative', ref: 'No growth',   status: 'Abnormal', initials: 'PS', avatar: 'green'  },
];

export const reports = [
  { id: 'RPT-2841', patient: 'Bailey Morris', test: 'CBC + chemistry', date: '04 Oct 2026', vet: 'Dr. Mensah', status: 'Awaiting validation', initials: 'BM', avatar: 'pink' },
  { id: 'RPT-2838', patient: 'Cooper Davis',  test: 'Ear cytology',    date: '04 Oct 2026', vet: 'Dr. Mensah', status: 'Released',            initials: 'CD', avatar: 'green' },
  { id: 'RPT-2834', patient: 'Milo Chen',     test: 'Renal panel',     date: '04 Oct 2026', vet: 'Dr. Park',   status: 'Released',            initials: 'MC', avatar: 'pink' },
  { id: 'RPT-2833', patient: 'Luna Patel',    test: 'Pre-op CBC',      date: '04 Oct 2026', vet: 'Dr. Chen',   status: 'Released',            initials: 'LP', avatar: 'blue' },
  { id: 'RPT-2830', patient: 'Archie King',   test: 'Skin scrape',     date: '03 Oct 2026', vet: 'Dr. Mensah', status: 'Released',            initials: 'AK', avatar: 'purple' },
];

export const equipment = [
  { name: 'ProCyte DX',     type: 'Hematology analyzer', status: 'Online',      lastSync: '2 min ago',   tone: 'green' },
  { name: 'Catalyst One',   type: 'Chemistry analyzer',  status: 'Online',      lastSync: '5 min ago',   tone: 'green' },
  { name: 'SedVue',         type: 'Urine analyzer',      status: 'Maintenance', lastSync: 'Scheduled 4 PM', tone: 'amber' },
  { name: 'SNAP Pro',       type: 'Rapid test reader',   status: 'Online',      lastSync: '8 min ago',   tone: 'green' },
  { name: 'Microscope A',   type: 'Digital microscope',  status: 'Online',      lastSync: '1 min ago',   tone: 'green' },
  { name: 'Centrifuge 2',   type: 'Benchtop centrifuge', status: 'Online',      lastSync: '12 min ago',  tone: 'green' },
];

export const reagents = [
  { name: 'CBC reagent pack',       lot: 'RGT-26-104', qty: 12, min: 8,  expires: '15 Dec 2026', status: 'OK' },
  { name: 'Chemistry panel slides', lot: 'RGT-26-098', qty: 4,  min: 10, expires: '30 Nov 2026', status: 'Low' },
  { name: 'Ear cytology stain',     lot: 'RGT-26-201', qty: 18, min: 6,  expires: '22 Jan 2027', status: 'OK' },
  { name: 'Urinalysis strips',      lot: 'RGT-26-301', qty: 2,  min: 5,  expires: '08 Nov 2026', status: 'Critical' },
  { name: 'Gram stain kit',         lot: 'RGT-26-407', qty: 9,  min: 4,  expires: '19 Feb 2027', status: 'OK' },
  { name: 'SNAP test kits',         lot: 'RGT-26-510', qty: 6,  min: 6,  expires: '14 Dec 2026', status: 'Low' },
];

export const qcRuns = [
  { id: 'QC-091', analyzer: 'ProCyte DX',   level: 'Normal',  result: 'Pass', date: '04 Oct 2026 · 08:00', operator: 'Nora Okafor' },
  { id: 'QC-090', analyzer: 'Catalyst One', level: 'Normal',  result: 'Pass', date: '04 Oct 2026 · 07:45', operator: 'Nora Okafor' },
  { id: 'QC-089', analyzer: 'ProCyte DX',   level: 'Abnormal',result: 'Pass', date: '04 Oct 2026 · 07:30', operator: 'Nora Okafor' },
  { id: 'QC-088', analyzer: 'SedVue',       level: 'Normal',  result: 'Fail', date: '03 Oct 2026 · 17:00', operator: 'Daniel Kim' },
  { id: 'QC-087', analyzer: 'Catalyst One', level: 'Abnormal',result: 'Pass', date: '03 Oct 2026 · 16:45', operator: 'Nora Okafor' },
];