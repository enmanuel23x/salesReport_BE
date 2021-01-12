INSERT INTO 
	habiles 
	(hbl_date, hbl_holidays, hbl_days, hbl_habiles_5)
VALUES 
	(DATE_ADD(DATE_FORMAT(NOW() ,'%Y-%m-01'), INTERVAL 1 MONTH), '[]', 20, DATE_ADD(DATE_FORMAT(NOW() ,'%Y-%m-01'), INTERVAL 1 MONTH))