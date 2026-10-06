[10/3/2026 9:55 AM] Dawit Tsegei: CREATE DATABASE IF NOT EXISTS vm_pet;
USE vm_pet;
CREATE TABLE branches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE,
  address VARCHAR(255),
  phone VARCHAR(15),
  email VARCHAR(100),
  manager_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'vet', 'pharmacy', 'receptionist', 'lab', 'owner') DEFAULT 'owner',
  branch_id INT,
  address VARCHAR(255),
  profile_image VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);
CREATE TABLE invitations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  role ENUM('admin', 'vet', 'pharmacy', 'receptionist', 'lab') NOT NULL,
  branch_id INT,
  invited_by INT NOT NULL,
  token VARCHAR(100) UNIQUE,
  status ENUM('pending', 'accepted', 'expired', 'cancelled') DEFAULT 'pending',
  expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE veterinarians (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  license_number VARCHAR(50) UNIQUE,
  specialization VARCHAR(100),
  experience_years INT DEFAULT 0,
  bio TEXT,
  available_days VARCHAR(100) DEFAULT 'Mon-Fri',
  consultation_fee DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE pharmacy_staff (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  license_number VARCHAR(50) UNIQUE,
  role_type ENUM('pharmacist', 'inventory_manager') DEFAULT 'pharmacist',
  shift ENUM('morning', 'afternoon', 'night') DEFAULT 'morning',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE lab_staff (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  license_number VARCHAR(50) UNIQUE,
  specialization VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category ENUM('consultation', 'vaccination', 'surgery', 'lab', 'grooming', 'other') DEFAULT 'consultation',
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE animals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  owner_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  species ENUM('dog', 'cat', 'cow', 'horse', 'sheep', 'goat', 'chicken', 'rabbit', 'avian', 'other') NOT NULL,
  breed VARCHAR(50),
  age_months INT,
  gender ENUM('male', 'female') NOT NULL,
  color VARCHAR(30),
  weight_kg DECIMAL(5,2),
  microchip_id VARCHAR(50) UNIQUE,
  microchip_verified BOOLEAN DEFAULT FALSE,
  photo VARCHAR(255),
  is_neutered BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE allergies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  animal_id INT NOT NULL,
  allergen VARCHAR(100) NOT NULL,
  severity ENUM('mild', 'moderate', 'severe') DEFAULT 'moderate',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
);
CREATE TABLE chronic_conditions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  animal_id INT NOT NULL,
  condition_name VARCHAR(100) NOT NULL,
  diagnosed_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
);
[10/3/2026 9:55 AM] Dawit Tsegei: CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  owner_id INT NOT NULL,
  animal_id INT NOT NULL,
  vet_id INT NOT NULL,
  branch_id INT,
  service_id INT,
  appointment_date DATETIME NOT NULL,
  reason TEXT,
  status ENUM('pending', 'confirmed', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
  check_in_time TIMESTAMP NULL,
  wait_minutes INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (vet_id) REFERENCES veterinarians(id) ON DELETE CASCADE,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);
CREATE TABLE medical_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  animal_id INT NOT NULL,
  vet_id INT NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT,
  temperature DECIMAL(4,2),
  heart_rate INT,
  respiration INT,
  bcs INT COMMENT 'Body Condition Score 1-9',
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (vet_id) REFERENCES veterinarians(id) ON DELETE CASCADE
);
CREATE TABLE soap_notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  medical_record_id INT NOT NULL,
  subjective TEXT COMMENT 'Owner reports...',
  objective TEXT COMMENT 'Physical exam findings...',
  assessment TEXT COMMENT 'Diagnosis...',
  plan TEXT COMMENT 'Treatment plan...',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE
);
CREATE TABLE medicines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  generic_name VARCHAR(100),
  category VARCHAR(50),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  min_stock_level INT DEFAULT 10,
  critical_stock_level INT DEFAULT 5,
  batch_number VARCHAR(50),
  expiry_date DATE,
  supplier_id INT,
  branch_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);
CREATE TABLE prescriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rx_number VARCHAR(20) UNIQUE,
  medical_record_id INT NOT NULL,
  vet_id INT NOT NULL,
  animal_id INT NOT NULL,
  medicine_id INT,
  medicine_name VARCHAR(100),
  dosage VARCHAR(100),
  frequency VARCHAR(50),
  duration_days INT,
  quantity VARCHAR(50),
  instructions TEXT,
  status ENUM('pending', 'ready', 'dispensed', 'cancelled') DEFAULT 'pending',
  priority ENUM('normal', 'priority', 'urgent') DEFAULT 'normal',
  dispensed_by INT,
  dispensed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
  FOREIGN KEY (vet_id) REFERENCES veterinarians(id) ON DELETE CASCADE,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE SET NULL,
  FOREIGN KEY (dispensed_by) REFERENCES pharmacy_staff(id) ON DELETE SET NULL
);
[10/3/2026 9:55 AM] Dawit Tsegei: CREATE TABLE lab_tests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lab_number VARCHAR(20) UNIQUE,
  animal_id INT NOT NULL,
  vet_id INT NOT NULL,
  lab_staff_id INT,
  branch_id INT,
  test_type VARCHAR(100) NOT NULL,
  sample_type VARCHAR(50),
  priority ENUM('normal', 'STAT') DEFAULT 'normal',
  status ENUM('received', 'processing', 'awaiting_validation', 'completed', 'cancelled') DEFAULT 'received',
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processing_started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  turnaround_minutes INT,
  findings TEXT,
  reference_range VARCHAR(100),
  is_abnormal BOOLEAN DEFAULT FALSE,
  result_file VARCHAR(255),
  notes TEXT,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (vet_id) REFERENCES veterinarians(id) ON DELETE CASCADE,
  FOREIGN KEY (lab_staff_id) REFERENCES lab_staff(id) ON DELETE SET NULL,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

-- ============================================
-- 17. EQUIPMENT (UI: 6/6 online)
-- ============================================
CREATE TABLE equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  serial_number VARCHAR(50) UNIQUE,
  branch_id INT,
  status ENUM('online', 'offline', 'maintenance') DEFAULT 'online',
  last_check TIMESTAMP NULL,
  next_maintenance DATE,
  notes TEXT,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

-- ============================================
-- 18. REAGENTS (UI: Reagent stock)
-- ============================================
CREATE TABLE reagents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  catalog_number VARCHAR(50),
  quantity INT DEFAULT 0,
  unit VARCHAR(20),
  min_quantity INT DEFAULT 10,
  expiry_date DATE,
  branch_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

-- ============================================
-- 19. SUPPLIERS
-- ============================================
CREATE TABLE suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(15),
  email VARCHAR(100),
  address VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 20. PURCHASE ORDERS
-- ============================================
CREATE TABLE purchase_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  po_number VARCHAR(20) UNIQUE,
  supplier_id INT NOT NULL,
  branch_id INT,
  order_date DATE NOT NULL,
  expected_date DATE,
  status ENUM('pending', 'approved', 'ordered', 'received', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE purchase_order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  purchase_order_id INT NOT NULL,
  medicine_id INT,
  reagent_id INT,
  item_name VARCHAR(100),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE SET NULL,
  FOREIGN KEY (reagent_id) REFERENCES reagents(id) ON DELETE SET NULL
);
[10/3/2026 9:55 AM] Dawit Tsegei: -- ============================================
-- 21. STOCK ALERTS (UI: Low-stock 11, Expiring 7)
-- ============================================
CREATE TABLE stock_alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  medicine_id INT,
  reagent_id INT,
  alert_type ENUM('low_stock', 'critical_stock', 'expiring', 'expired') NOT NULL,
  message TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (reagent_id) REFERENCES reagents(id) ON DELETE CASCADE
);

-- ============================================
-- 22. INVOICES (UI: INV-10984)
-- ============================================
CREATE TABLE invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(20) UNIQUE,
  owner_id INT NOT NULL,
  animal_id INT,
  appointment_id INT,
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('unpaid', 'partial', 'paid', 'cancelled') DEFAULT 'unpaid',
  due_date DATE,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE SET NULL,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- 23. PAYMENTS
-- ============================================
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('cash', 'telebirr', 'chapa', 'bank', 'card') DEFAULT 'cash',
  payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  transaction_id VARCHAR(100),
  paid_at TIMESTAMP NULL,
  received_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- 24. NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('appointment', 'vaccination', 'payment', 'lab_result', 'prescription', 'stock', 'general') DEFAULT 'general',
  link VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- 25. VACCINATIONS
-- ============================================
CREATE TABLE vaccinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  animal_id INT NOT NULL,
  vaccine_name VARCHAR(100) NOT NULL,
  vaccination_date DATE NOT NULL,
  next_due_date DATE,
  batch_number VARCHAR(50),
  vet_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (vet_id) REFERENCES veterinarians(id) ON DELETE SET NULL
);

-- ============================================
-- 26. SYSTEM LOGS (UI: System logs)
-- ============================================
CREATE TABLE system_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
[10/3/2026 9:55 AM] Dawit Tsegei: -- ============================================
-- 27. BACKUPS (UI: Nightly backup)
-- ============================================
CREATE TABLE backups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  backup_name VARCHAR(100) NOT NULL,
  file_path VARCHAR(255),
  file_size_mb DECIMAL(10,2),
  status ENUM('success', 'failed', 'in_progress') DEFAULT 'success',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_animals_owner ON animals(owner_id);
CREATE INDEX idx_animals_microchip ON animals(microchip_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_vet ON appointments(vet_id);
CREATE INDEX idx_lab_tests_status ON lab_tests(status);
CREATE INDEX idx_lab_tests_number ON lab_tests(lab_number);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_rx ON prescriptions(rx_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

SELECT '✅ VetraCare database schema created successfully! 🐾' AS message;