INSERT INTO `copyOIC`.`clients` (cli_name) VALUES
	 ('beval'),
	 ('febeca'),
	 ('sillaca');
INSERT INTO `copyOIC`.`users` (usr_name, usr_last_name, usr_email, usr_rol,usr_status, cli_id) VALUES
	 ('Enmanuel','Leon','eleon@intelix.biz','0','0',3),
	 ('Angel','Narvaez','anarvaez@intelix.biz','0','0',3),
	 ('Alejandro','Gonzalez','agonzalez@intelix.biz','0','0',3),
	 ('Endrina','Toledo','etoledo@intelix.biz','0','0',3),
	 ('Williams','Leon','wleon@intelix.biz','0','0',3);
INSERT INTO `habiles` (`hbl_id`, `hbl_date`, `hbl_holidays`, `hbl_days`, `hbl_habiles_5`) VALUES
	(1, '2020-12-01', '["24-12-2020", "25-12-2020", "31-12-2020"]', '20', '2020-12-16');
