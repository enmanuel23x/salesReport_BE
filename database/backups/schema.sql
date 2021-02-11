DROP SCHEMA IF EXISTS `copyoic`;
CREATE SCHEMA IF NOT EXISTS `copyoic`;
USE `copyoic`;

DROP TABLE IF EXISTS `copyoic`.`BASE_OIC2`;
CREATE TABLE IF NOT EXISTS `copyoic`.`BASE_OIC2` (
	`CLIENTE` varchar(100) DEFAULT NULL,
	`NOMBRE` varchar(256) DEFAULT NULL,
	`VENDEDOR` varchar(50) DEFAULT NULL,
	`VENNOM` varchar(256) DEFAULT NULL,
	`U_SEGMENTO` varchar(256) DEFAULT NULL,
	`U_REGION_VTA` varchar(256) DEFAULT NULL,
	`U_AGRUPACION` varchar(256) DEFAULT NULL,
	`RUTA` varchar(256) DEFAULT NULL,
	`ZONA` varchar(256) DEFAULT NULL,
	`PROVINCIA` varchar(256) DEFAULT NULL,
	`CANTON` varchar(256) DEFAULT NULL,
	`DISTRITO` varchar(256) DEFAULT NULL,
	`PEDIDO` varchar(120) DEFAULT NULL,
	`MONEDA_FACTURA` varchar(2) DEFAULT NULL,
	`TIPO_CAMBIO` DECIMAL(38,8) DEFAULT NULL,
	`ARTICULO` varchar(256) DEFAULT NULL,
	`DESCRIPCION` varchar(256) DEFAULT NULL,
	`CLASIFICACION_1` varchar(256) DEFAULT NULL,
	`CLASIFICACION_1_DES` varchar(256) DEFAULT NULL,
	`CLASIFICACION_2` varchar(256) DEFAULT NULL,
	`CLASIFICACION_2_DES` varchar(256) DEFAULT NULL,
	`CLASIFICACION_3` varchar(256) DEFAULT NULL,
	`CLASIFICACION_3_DES` varchar(256) DEFAULT NULL,
	`CLASIFICACION_4` varchar(256) DEFAULT NULL,
	`CLASIFICACION_4_DES` varchar(256) DEFAULT NULL,
	`CLASIFICACION_5` varchar(256) DEFAULT NULL,
	`CLASIFICACION_5_DES` varchar(256) DEFAULT NULL,
	`FECHA` DATETIME(3) DEFAULT NULL,
	`CANTIDAD` DECIMAL(38,8) DEFAULT NULL,
	`VTAS` DECIMAL(38,8) DEFAULT NULL,
	`MARGEN` DECIMAL(38,8) DEFAULT NULL,
	`COSTO` DECIMAL(38,8) DEFAULT NULL
);

DROP TABLE IF EXISTS `copyoic`.`CLIENTE_OIC`;
CREATE TABLE IF NOT EXISTS `copyoic`.`CLIENTE_OIC` (
	`CLIENTE` varchar(50) DEFAULT NULL,
	`RAZON_SOCIAL` varchar(256) DEFAULT NULL,
	`PROVINCIA` varchar(256) DEFAULT NULL,
	`CANTON` varchar(256) DEFAULT NULL,
	`DISTRITO` varchar(256) DEFAULT NULL,
	`DIRECCION` varchar(256) DEFAULT NULL,
	`ZONA` varchar(256) DEFAULT NULL,
	`CODIGO_VENDEDOR` varchar(256) DEFAULT NULL,
	`REPRESENTANTE_VENTAS` varchar(256) DEFAULT NULL,
	`SECTOR_DESPACHO` varchar(256) DEFAULT NULL,
	`CONDICION_PAGO` INT(10) DEFAULT NULL
);

DROP TABLE IF EXISTS `copyoic`.`OIC_VENDEDOR`;
CREATE TABLE IF NOT EXISTS `copyoic`.`OIC_VENDEDOR` (
	`VENDEDOR` varchar(4) NOT NULL,
	`NOMBRE` varchar(40) NOT NULL,
	`E_MAIL` varchar(249) DEFAULT NULL,
	`ACTIVO` varchar(1) NOT NULL,
	`U_SUPERVISOR` varchar(150) DEFAULT NULL,
	`U_LOCALIDAD` varchar(150) DEFAULT NULL,
	`U_ROL` varchar(150) DEFAULT NULL
);

DROP TABLE IF EXISTS `copyoic`.`clients`;
CREATE TABLE IF NOT EXISTS `copyoic`.`clients` (
    `cli_id` int(11) NOT NULL AUTO_INCREMENT,
    `cli_name` varchar(45) NOT NULL,
    PRIMARY KEY (`cli_id`)
);

DROP TABLE IF EXISTS `copyoic`.`users`;
CREATE TABLE IF NOT EXISTS `copyoic`.`users` (
    `usr_id` int(11) NOT NULL AUTO_INCREMENT,
    `usr_name` varchar(45) DEFAULT NULL,
    `usr_last_name` varchar(45) DEFAULT NULL,
    `usr_email` varchar(200) DEFAULT NULL,
    `usr_rol` varchar(45) DEFAULT NULL,
    `usr_status` varchar(45) DEFAULT NULL,
    `cli_id` int(11) NOT NULL,
    PRIMARY KEY (`usr_id`),
    KEY `cli_id` (`cli_id`),
    CONSTRAINT `users_ibfk_1` FOREIGN KEY (`cli_id`) REFERENCES `copyoic`.`clients` (`cli_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS `copyoic`.`habiles`;
CREATE TABLE IF NOT EXISTS `copyoic`.`habiles` (
  `hbl_id` int(11) NOT NULL AUTO_INCREMENT,
  `hbl_date` date DEFAULT NULL,
  `hbl_holidays` json DEFAULT NULL,
  `hbl_days` varchar(50) DEFAULT '1',
  `hbl_habiles_5` date DEFAULT NULL,
  PRIMARY KEY (`hbl_id`)
);


-- Tablas de Reportes

DROP TABLE IF EXISTS `copyoic`.`report_1`;
CREATE TABLE IF NOT EXISTS `copyoic`.`report_1` (
	`rpt1_group` varchar(256) DEFAULT NULL,
	`rpt1_avg_sales` varchar(256) DEFAULT NULL,
  	`rpt1_last_month` varchar(256) DEFAULT NULL,
  	`rpt1_scope` varchar(256) DEFAULT NULL,
	`rpt1_abc` varchar(10) DEFAULT NULL,
  	`rpt1_seller_code` varchar(256) DEFAULT NULL,
  	`rpt1_seller` varchar(256) DEFAULT NULL,
	`rpt1_seller_active` varchar(256) DEFAULT NULL,
	`rpt1_date` date DEFAULT NULL
);

DROP TABLE IF EXISTS `copyoic`.`report_2`;
CREATE TABLE IF NOT EXISTS `copyoic`.`report_2` (
	`rpt2_group` varchar(256) DEFAULT NULL,
	`rpt2_avg_sales_weekly` varchar(256) DEFAULT NULL,
  	`rpt2_first_week` varchar(256) DEFAULT NULL,
  	`rpt2_scope` varchar(256) DEFAULT NULL,
  	`rpt2_seller_code` varchar(256) DEFAULT NULL,
  	`rpt2_seller` varchar(256) DEFAULT NULL,
	`rpt2_seller_active` varchar(256) DEFAULT NULL,
	`rpt2_date` date DEFAULT NULL
);

DROP TABLE IF EXISTS `copyoic`.`report_3`;
CREATE TABLE IF NOT EXISTS `copyoic`.`report_3` (
	`rpt3_client_code` varchar(256) DEFAULT NULL,
	`rpt3_group` varchar(256) DEFAULT NULL,
	`rpt3_brand` varchar(256) DEFAULT NULL,
	`rpt3_avg_sales` varchar(256) DEFAULT NULL,
  	`rpt3_month_sales` varchar(256) DEFAULT NULL,
  	`rpt3_scope_perc` varchar(256) DEFAULT NULL,
  	`rpt3_seller_code` varchar(256) DEFAULT NULL,
  	`rpt3_seller` varchar(256) DEFAULT NULL,
	`rpt3_seller_active` varchar(256) DEFAULT NULL,
	`rpt3_date` date DEFAULT NULL
);

DROP TABLE IF EXISTS `copyoic`.`report_4`;
CREATE TABLE IF NOT EXISTS `copyoic`.`report_4` (
	`rpt4_client_code` varchar(256) DEFAULT NULL,
	`rpt4_group` varchar(256) DEFAULT NULL,
	`rpt4_article` varchar(256) DEFAULT NULL,
	`rpt4_description` varchar(256) DEFAULT NULL,
	`rpt4_avg_sales` varchar(256) DEFAULT NULL,
	`rpt4_avg_sales_units` varchar(256) DEFAULT NULL,
  	`rpt4_month_sales_units` varchar(256) DEFAULT NULL,
  	`rpt4_seller_code` varchar(256) DEFAULT NULL,
  	`rpt4_seller` varchar(256) DEFAULT NULL,
	`rpt4_class` varchar(256) DEFAULT NULL,
	`rpt4_brand` varchar(256) DEFAULT NULL,
	`rpt4_date` date DEFAULT NULL
);

DROP TABLE IF EXISTS `copyoic`.`report_5`;
CREATE TABLE IF NOT EXISTS `copyoic`.`report_5` (
  `rpt5_client_code` varchar(256) DEFAULT NULL,
  `rpt5_group` varchar(256) DEFAULT NULL,
  `rpt5_article_code` varchar(256) DEFAULT NULL,
  `rpt5_class` varchar(256) DEFAULT NULL,
  `rpt5_description` varchar(256) DEFAULT NULL,
  `rpt5_vtaCantidad_1` varchar(256) DEFAULT NULL,
  `rpt5_vtaCantidad_2` varchar(256) DEFAULT NULL,
  `rpt5_vtaCantidad_3` varchar(256) DEFAULT NULL,
  `rpt5_vtaCantidad_4` varchar(256) DEFAULT NULL,
  `rpt5_seller_code` varchar(256) DEFAULT NULL,
  `rpt5_seller` varchar(256) DEFAULT NULL,
  `rpt5_date` varchar(256) DEFAULT NULL
);
