CREATE DATABASE IF NOT EXISTS testing_employee_db;
USE testing_employee_db;

DROP TABLE IF EXISTS employee_devices;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS seating;
DROP TABLE IF EXISTS salaries;
DROP TABLE IF EXISTS sites;

CREATE TABLE sites (
  site_id INT AUTO_INCREMENT PRIMARY KEY,
  site_name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE salaries (
  salary_id INT AUTO_INCREMENT PRIMARY KEY,
  salary_grade VARCHAR(50) NOT NULL,
  basic_salary DECIMAL(12, 2) NOT NULL,
  allowance DECIMAL(12, 2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB;

CREATE TABLE seating (
  seating_id INT AUTO_INCREMENT PRIMARY KEY,
  site_id INT NOT NULL,
  floor_number VARCHAR(20) NOT NULL,
  seat_code VARCHAR(50) NOT NULL,
  CONSTRAINT fk_seating_site
    FOREIGN KEY (site_id) REFERENCES sites(site_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  site_id INT NOT NULL,
  salary_id INT NOT NULL,
  seating_id INT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  job_title VARCHAR(100) NOT NULL,
  hired_date DATE NOT NULL,
  CONSTRAINT fk_employee_site
    FOREIGN KEY (site_id) REFERENCES sites(site_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_employee_salary
    FOREIGN KEY (salary_id) REFERENCES salaries(salary_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_employee_seating
    FOREIGN KEY (seating_id) REFERENCES seating(seating_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE employee_devices (
  employee_device_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  site_id INT NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  device_brand VARCHAR(50) NOT NULL,
  serial_number VARCHAR(100) NOT NULL UNIQUE,
  assigned_date DATE NOT NULL,
  CONSTRAINT fk_device_employee
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_device_site
    FOREIGN KEY (site_id) REFERENCES sites(site_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO sites (site_name, city, address) VALUES
  ('Head Office', 'Jakarta', 'Jl. Testing No. 1'),
  ('Branch Office', 'Bandung', 'Jl. Sample No. 2');

INSERT INTO salaries (salary_grade, basic_salary, allowance) VALUES
  ('Junior', 6000000.00, 750000.00),
  ('Middle', 10000000.00, 1250000.00),
  ('Senior', 15000000.00, 2000000.00);

INSERT INTO seating (site_id, floor_number, seat_code) VALUES
  (1, '10', 'JKT-10-A01'),
  (1, '10', 'JKT-10-A02'),
  (2, '3', 'BDG-03-B01');

INSERT INTO employees (site_id, salary_id, seating_id, full_name, email, job_title, hired_date) VALUES
  (1, 1, 1, 'Ahmad Zaki', 'ahmad.zaki@example.com', 'Frontend Developer', '2026-01-15'),
  (1, 2, 2, 'Budi Santoso', 'budi.santoso@example.com', 'Backend Developer', '2025-09-01'),
  (2, 3, 3, 'Citra Lestari', 'citra.lestari@example.com', 'Project Manager', '2024-05-20');

INSERT INTO employee_devices (employee_id, site_id, device_type, device_brand, serial_number, assigned_date) VALUES
  (1, 1, 'Laptop', 'Lenovo', 'LNV-JKT-0001', '2026-01-16'),
  (2, 1, 'Laptop', 'Dell', 'DLL-JKT-0002', '2025-09-02'),
  (3, 2, 'Laptop', 'HP', 'HP-BDG-0003', '2024-05-21'),
  (1, 1, 'Monitor', 'LG', 'LG-JKT-0004', '2026-01-16');

SELECT
  e.employee_id,
  e.full_name,
  e.job_title,
  s.site_name,
  st.seat_code,
  sal.salary_grade,
  sal.basic_salary,
  ed.employee_device_id,
  ed.device_type,
  ed.device_brand,
  ed.serial_number
FROM employees e
JOIN sites s ON e.site_id = s.site_id
JOIN seating st ON e.seating_id = st.seating_id
JOIN salaries sal ON e.salary_id = sal.salary_id
LEFT JOIN employee_devices ed ON e.employee_id = ed.employee_id
ORDER BY e.employee_id, ed.employee_device_id;
