CREATE USER IF NOT EXISTS 'testing_reader'@'%' IDENTIFIED BY 'testing_reader_password';
CREATE USER IF NOT EXISTS 'testing_writer'@'%' IDENTIFIED BY 'testing_writer_password';

GRANT SELECT, SHOW VIEW ON testing_employee_db.* TO 'testing_reader'@'%';
GRANT SELECT, INSERT ON testing_employee_db.* TO 'testing_writer'@'%';

FLUSH PRIVILEGES;
