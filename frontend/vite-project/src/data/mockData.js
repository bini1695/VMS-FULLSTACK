export const workspaces = [
  { id: 'admin', label: 'System administrator', icon: 'fa-user-shield', path: '/admin' },
  { id: 'veterinarian', label: 'Veterinarian', icon: 'fa-user-doctor', path: '/vet' },
  { id: 'lab', label: 'Laboratory technician', icon: 'fa-flask-vial', path: '/lab' },
  { id: 'receptionist', label: 'Receptionist · Front desk', icon: 'fa-headset', path: '/front-desk' },
  { id: 'pharmacist', label: 'Pharmacist · Inventory manager', icon: 'fa-pills', path: '/pharmacy' },
  { id: 'owner', label: 'Pet owner', icon: 'fa-paw', path: '/owner' },
];

export const adminStats = [
  { label: 'Active staff accounts', value: '48', hint: '3 invitations pending', icon: 'fa-users', tone: 'green' },
  { label: 'Clinic branches', value: '3', hint: 'All accepting appointments', icon: 'fa-hospital', tone: 'blue' },
  { label: 'Security posture', value: '98%', hint: 'No critical findings', icon: 'fa-shield-halved', tone: 'green' },
  { label: 'Last backup', value: '02:00', hint: 'Completed successfully', icon: 'fa-database', tone: 'teal' },
];

export const teamMembers = [
  { id: 1, name: 'Dr. Amara Mensah', email: 'amara.m@northstar.vet', role: 'Veterinarian', branch: 'Riverside', status: 'Active', tone: 'green', initials: 'AM' },
  { id: 2, name: 'Jae Lin', email: 'jae.lin@northstar.vet', role: 'Receptionist', branch: 'Central', status: 'Active', tone: 'blue', initials: 'JL' },
  { id: 3, name: 'Nora Okafor', email: 'nora.o@northstar.vet', role: 'Lab technician', branch: 'Central', status: 'Active', tone: 'purple', initials: 'NO' },
  { id: 4, name: 'Priya Kapoor', email: 'priya.k@northstar.vet', role: 'Veterinarian', branch: 'Westfield', status: 'Invited', tone: 'amber', initials: 'PK' },
];

export const vetStats = [
  { label: "Today's appointments", value: '11', hint: '5 completed · 1 urgent', icon: 'fa-calendar-day', tone: 'green' },
  { label: 'Waiting now', value: '3', hint: 'Longest wait 18 min', icon: 'fa-clock', tone: 'amber' },
  { label: 'Results to review', value: '3', hint: '1 abnormal result', icon: 'fa-flask', tone: 'red' },
  { label: 'Follow-ups', value: '6', hint: '2 need scheduling', icon: 'fa-clipboard-check', tone: 'blue' },
];

export const vetSchedule = [
  { time: '09:00', name: 'Milo Chen', reason: 'Wellness exam', meta: 'Feline · 4y', dot: 'green' },
  { time: '09:45', name: 'Cooper Davis', reason: 'Dermatology follow-up', meta: 'Canine · 7y', dot: 'amber', active: true },
  { time: '10:30', name: 'Luna Patel', reason: 'Vaccination', meta: 'Canine · 2y', dot: 'blue' },
  { time: '11:15', name: 'Pip Wilson', reason: 'Lameness assessment', meta: 'Rabbit · 3y', dot: 'purple' },
];

export const labStats = [
  { label: 'Incoming requisitions', value: '18', hint: '2 STAT priorities', icon: 'fa-clipboard-list', tone: 'amber' },
  { label: 'Samples processing', value: '7', hint: 'Average TAT 42 min', icon: 'fa-vials', tone: 'blue' },
  { label: 'Awaiting validation', value: '5', hint: '2 abnormal findings', icon: 'fa-circle-exclamation', tone: 'red' },
  { label: 'Equipment online', value: '6 / 6', hint: 'Last interface sync 2 min', icon: 'fa-microscope', tone: 'green' },
];

export const labColumns = {
  received: [
    { id: 'LAB-2841', patient: 'Bailey Morris', species: 'Canine', test: 'CBC + chemistry', time: 'Received 12:18', tag: 'STAT', tone: 'amber', initials: 'BM', avatar: 'pink', flagged: true },
    { id: 'LAB-2840', patient: 'Pip Wilson', species: 'Rabbit', test: 'Joint fluid analysis', time: 'Received 11:54', initials: 'PW', avatar: 'amber' },
    { id: 'LAB-2839', patient: 'Nala Brooks', species: 'Feline', test: 'Urinalysis', time: 'Received 11:41', initials: 'NB', avatar: 'purple' },
  ],
  processing: [
    { id: 'LAB-2838', patient: 'Cooper Davis', species: 'Canine', test: 'Ear cytology', time: '18 min', tag: 'Abnormal', tone: 'red', initials: 'CD', avatar: 'green', flagged: true },
    { id: 'LAB-2837', patient: 'Suki Yamamoto', species: 'Feline', test: 'CBC + thyroid', time: '31 min', initials: 'SY', avatar: 'blue' },
    { id: 'LAB-2835', patient: 'Archie King', species: 'Canine', test: 'Skin scrape', time: '44 min', initials: 'AK', avatar: 'purple' },
  ],
  completed: [
    { id: 'LAB-2834', patient: 'Milo Chen', species: 'Feline', test: 'Renal panel', time: 'Done 12:02', tag: 'Abnormal', tone: 'red', initials: 'MC', avatar: 'pink', flagged: true },
    { id: 'LAB-2833', patient: 'Luna Patel', species: 'Canine', test: 'Pre-op CBC', time: 'Done 11:37', initials: 'LP', avatar: 'blue' },
    { id: 'LAB-2832', patient: 'Pepper Singh', species: 'Avian', test: 'Gram stain', time: 'Done 10:58', initials: 'PS', avatar: 'green' },
  ],
};

export const frontDeskStats = [
  { label: 'Appointments today', value: '27', hint: '19 completed · 3 changes', icon: 'fa-calendar-check', tone: 'green' },
  { label: 'Checked in', value: '6', hint: 'Average wait 11 min', icon: 'fa-list-check', tone: 'blue' },
  { label: 'Unpaid invoices', value: '4', hint: '$486.50 outstanding', icon: 'fa-file-invoice-dollar', tone: 'amber' },
  { label: 'New registrations', value: '5', hint: '2 awaiting consent', icon: 'fa-user-plus', tone: 'purple' },
];

export const checkinQueue = [
  { id: 1, patient: 'Bailey', owner: 'Eli Morris · Urgent walk-in', time: '12:20', status: 'Triage now', tone: 'red', initials: 'BM', avatar: 'pink', wait: '6 min' },
  { id: 2, patient: 'Suki', owner: 'Hana Yamamoto · Ultrasound review', time: '12:00', status: 'Checked in', tone: 'green', initials: 'SP', avatar: 'blue', wait: '18 min' },
  { id: 3, patient: 'Pip', owner: 'Jamie Wilson · Lameness assessment', time: '12:15', status: 'Checked in', tone: 'green', initials: 'PW', avatar: 'amber', wait: '8 min' },
  { id: 4, patient: 'Luna', owner: 'Rina Patel · Vaccination', time: '12:30', status: 'Arrived', tone: 'blue', initials: 'LP', avatar: 'purple', wait: '2 min' },
];

export const pharmacyStats = [
  { label: 'Dispensing queue', value: '8', hint: '1 priority prescription', icon: 'fa-prescription-bottle', tone: 'blue' },
  { label: 'Ready for pickup', value: '5', hint: 'Oldest ready 34 min', icon: 'fa-box', tone: 'green' },
  { label: 'Low-stock items', value: '11', hint: '4 below critical level', icon: 'fa-triangle-exclamation', tone: 'red' },
  { label: 'Expiring in 60 days', value: '7', hint: '$614 inventory value', icon: 'fa-clock-rotate-left', tone: 'amber' },
];

export const dispensingQueue = [
  { id: 'RX-8412', patient: 'Cooper Davis', owner: 'Taylor Davis', medication: 'Mometamax otic · 15 g', doctor: 'Dr. Mensah', status: 'Ready to fill', tone: 'blue', initials: 'CD', avatar: 'green' },
  { id: 'RX-8411', patient: 'Bailey Morris', owner: 'Eli Morris', medication: 'Doxycycline 100 mg · 14 tabs', doctor: 'Dr. Ortega', status: 'Priority', tone: 'red', initials: 'BM', avatar: 'pink' },
  { id: 'RX-8410', patient: 'Nala Brooks', owner: 'Sam Brooks', medication: 'Revolution Plus · 3 pack', doctor: 'Dr. Mensah', status: 'Checking', tone: 'amber', initials: 'NB', avatar: 'purple' },
  { id: 'RX-8408', patient: 'Pip Wilson', owner: 'Jamie Wilson', medication: 'Meloxicam oral · 10 ml', doctor: 'Dr. Chen', status: 'Ready', tone: 'green', initials: 'PW', avatar: 'amber' },
];

export const ownerAnimals = [
  { name: 'Cooper', breed: 'Golden Retriever · 7 years · 31.2 kg', tags: ['Vaccines current', 'Care plan active'], img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&q=80' },
  { name: 'Milo', breed: 'Domestic shorthair · 4 years · 5.1 kg', tags: ['Booster due', 'Indoor cat'], img: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300&q=80' },
];

export const careChecklist = [
  { title: 'Cooper · Finish ear drops', date: '7 Oct', icon: 'fa-pills', tone: 'green' },
  { title: 'Milo · Rabies booster due', date: '22 Oct', icon: 'fa-syringe', tone: 'amber' },
  { title: 'Book Milo wellness exam', date: 'October', icon: 'fa-calendar-plus', tone: 'blue' },
];

export const labReports = [
  { title: 'Ear cytology · Cooper', meta: '1 Oct 2026 · Reviewed', abnormal: true },
  { title: 'CBC & chemistry panel', meta: 'Suki · 28 Sep 2026', abnormal: false },
  { title: 'Renal function panel', meta: 'Milo · 12 Aug 2026', abnormal: false },
];