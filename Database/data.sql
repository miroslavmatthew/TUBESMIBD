CREATE DATABASE Broklyn

CREATE TABLE `User` (
  `idU` int(11) NOT NULL,
  `UsernameAdmin` varchar(50),
   `PasswordAdmin` varchar(50),
   `Username` varchar(50),
   `Password` varchar(50),
   `namaMember` varchar(50),
   `Alamat` varchar(50),
   `namaPemesan` varchar(50),
   `idKelurahan` int(11)
);

CREATE TABLE `Kelurahan` (
  `idKelurahan` int(11) not null,
  `namaKelurahan` varchar(50),
    `idKecamatan` int(11) not null
);

CREATE TABLE `Kecamatan` (
  `idKecamatan` int(11) not null,
  `namaKecamatan` varchar(50),
    `idKota` int(11) not null
);

CREATE TABLE `Kota` (
  `idKota` int(11) not null,
  `namaKota` varchar(50)
);

CREATE TABLE `Tiket` (
  `idTiket` int(11) not null,
  `Status` varchar(50),
  `Tanggal` date,
   `Jam` time,
    `hargaTiket` int(11),
    `noMeja` int(11) not null
);

CREATE TABLE `MejaB` (
  `noMeja` int(11) not null,
  `statusMB` boolean DEFAULT true
);

CREATE TABLE `Transaksi` (
  `idU` int(11) not null,
  `idTiket` int(11)not null,
  `tglTransaksi` date,
   `waktuTransaksi` time
);

ALTER TABLE user MODIFY COLUMN idU INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE `Kelurahan`ADD CONSTRAINT `PK-Kel` PRIMARY KEY (idKelurahan);

ALTER TABLE `User` ADD CONSTRAINT `FK-Kel` FOREIGN KEY (`idKelurahan`) REFERENCES `Kelurahan`(`idKelurahan`);

ALTER TABLE `Kecamatan`ADD CONSTRAINT `PK-Kec` PRIMARY KEY (idKecamatan);

ALTER TABLE `Kota`ADD CONSTRAINT `PK-Kot` PRIMARY KEY (idKota);

ALTER TABLE `Kelurahan` ADD CONSTRAINT `FK-Kec` FOREIGN KEY (`idKecamatan`) REFERENCES `Kecamatan`(`idKecamatan`);

ALTER TABLE `Kecamatan` ADD CONSTRAINT `FK-Kot` FOREIGN KEY (`idKota`) REFERENCES `Kota`(`idKota`);

ALTER TABLE Tiket MODIFY COLUMN idTiket INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE `MejaB`ADD CONSTRAINT `PK-MB` PRIMARY KEY (noMeja);

ALTER TABLE `Tiket` ADD CONSTRAINT `FK-NoM` FOREIGN KEY (`noMeja`) REFERENCES `MejaB`(`noMeja`);


ALTER TABLE Transaksi ADD FOREIGN KEY (idU) REFERENCES user(idU);

ALTER TABLE Transaksi ADD FOREIGN KEY (idTiket) REFERENCES Tiket(idTiket);


INSERT INTO `Kota` (`idKota`, `namaKota`) VALUES ('1', 'Bandung'),('2', 'Cimahi'), ('3', 'Sukabumi'), ('4', 'Cirebon'), ('5', 'Bogor');
INSERT INTO `Kecamatan` (`idKecamatan`, `namaKecamatan`, `idKota`) VALUES ('1', 'Andir', '1'), ('2', 'Antapani', '1');
INSERT INTO `Kecamatan` (`idKecamatan`, `namaKecamatan`, `idKota`) VALUES ('3', 'Cimahi Utara', '2'), ('4', 'Cimahi Selatan', '2');
INSERT INTO `Kecamatan` (`idKecamatan`, `namaKecamatan`, `idKota`) VALUES ('5', 'Ciracap', '3'), ('6', 'Cisolok', '3');
INSERT INTO `Kecamatan` (`idKecamatan`, `namaKecamatan`, `idKota`) VALUES ('7', 'Jamblang', '4'), ('8', 'Gempol', '4');
INSERT INTO `Kecamatan` (`idKecamatan`, `namaKecamatan`, `idKota`) VALUES ('9', 'Bogor Barat', '5'), ('10', 'Bogor Timur', '5');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('1', 'Ciroyom', '1'), ('2', 'Kebonjeruk', '1');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('3', 'Antapani Kidul', '2'), ('4', 'Antapani Kulon', '2');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('7', 'Cibabat', '3'), ('8', 'Citeureup', '3');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('5', 'Cibeber', '4'), ('6', 'Cibeureum', '4');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('9', 'Cikangkung', '5'), ('10', 'Pasirpanjang', '5');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('11', 'Gunungtanjung', '6'), ('12', 'Pasirbaru', '6');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('13', 'Bakung Kidul', '7'), ('14', 'Bakung Lor', '7');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('15', 'Cupang', '8'), ('16', 'Winong', '8');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('17', 'Menteng', '9'), ('18', 'Margajaya', '9');
INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('19', 'Sindangsari', '10'), ('20', 'Sindangrasa', '10');

INSERT INTO `User` (`idU`, `UsernameAdmin`, `PasswordAdmin`, `Username`, `Password`, `namaMember`, `Alamat`, `namaPemesan`, `idKelurahan`) VALUES ('1', 'admin', 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `User` (`idU`, `UsernameAdmin`, `PasswordAdmin`, `Username`, `Password`, `namaMember`, `Alamat`, `namaPemesan`, `idKelurahan`) VALUES ('2', NULL, NULL, 'andi', 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=', 'andi', 'Jl. Andir No. 20', NULL, '1');

INSERT INTO `MejaB` (`noMeja`, `posisiM`) VALUES ('1', '1'), ('2', '1'), ('3', '1'), ('4', '1'), ('5', '1');

