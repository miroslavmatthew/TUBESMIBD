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
  `posisiM` int(11)
);

CREATE TABLE `Transaksi` (
  `idU` int(11) not null,
  `idTiket` int(11)not null,
  `tglTransaksi` date,
   `waktuTransaksi` time
);

ALTER TABLE `User`ADD CONSTRAINT `PK-U` PRIMARY KEY (idU);

ALTER TABLE `Kelurahan`ADD CONSTRAINT `PK-Kel` PRIMARY KEY (idKelurahan);

ALTER TABLE `User` ADD CONSTRAINT `FK-Kel` FOREIGN KEY (`idKelurahan`) REFERENCES `Kelurahan`(`idKelurahan`);

ALTER TABLE `Kecamatan`ADD CONSTRAINT `PK-Kec` PRIMARY KEY (idKecamatan);

ALTER TABLE `Kota`ADD CONSTRAINT `PK-Kot` PRIMARY KEY (idKota);

ALTER TABLE `Kelurahan` ADD CONSTRAINT `FK-Kec` FOREIGN KEY (`idKecamatan`) REFERENCES `Kecamatan`(`idKecamatan`);

ALTER TABLE `Kecamatan` ADD CONSTRAINT `FK-Kot` FOREIGN KEY (`idKota`) REFERENCES `Kota`(`idKota`);

ALTER TABLE `Tiket`ADD CONSTRAINT `PK-Tik` PRIMARY KEY (idTiket);

ALTER TABLE `MejaB`ADD CONSTRAINT `PK-MB` PRIMARY KEY (noMeja);

ALTER TABLE `Tiket` ADD CONSTRAINT `FK-NoM` FOREIGN KEY (`noMeja`) REFERENCES `MejaB`(`noMeja`);

ALTER TABLE `Transaksi` ADD CONSTRAINT `FK-UTrans` FOREIGN KEY (`idU`) REFERENCES `User`(`idU`);

ALTER TABLE `Transaksi` ADD CONSTRAINT `FK-TikTrans` FOREIGN KEY (`idTiket`) REFERENCES `Tiket`(`idTiket`);

ALTER TABLE MejaB ADD CONSTRAINT UnikNo UNIQUE (posisiM);

INSERT INTO `User` (`idU`, `UsernameAdmin`, `PasswordAdmin`, `Username`, `Password`, `namaMember`, `Alamat`, `namaPemesan`, `idKelurahan`) VALUES ('1', 'admin', 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `User` (`idU`, `UsernameAdmin`, `PasswordAdmin`, `Username`, `Password`, `namaMember`, `Alamat`, `namaPemesan`, `idKelurahan`) VALUES ('2', NULL, NULL, 'andi', 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=', 'andi', 'Jl. Andir No. 20', NULL, '1');

INSERT INTO `Kota` (`idKota`, `namaKota`) VALUES ('1', 'Bandung'),('2', 'Cimahi'), ('3', 'Sukabumi'), ('4', 'Cirebon'), ('5', 'Bogor');
INSERT INTO `Kecamatan` (`idKecamatan`, `namaKecamatan`, `idKota`) VALUES ('1', 'Andir', '1'), ('2', 'Antapani', '1');
INSERT INTO `Kecamatan` (`idKecamatan`, `namaKecamatan`, `idKota`) VALUES ('3', 'Cimahi Utara', '2'), ('4', 'Cimahi Selatan', '2');
INSERT INTO `Kecamatan` (`idKecamatan`, `namaKecamatan`, `idKota`) VALUES ('5', 'Ciracap', '3'), ('6', 'Cisolok', '3');


INSERT INTO `Kelurahan` (`idKelurahan`, `namaKelurahan`, `idKecamatan`) VALUES ('1', 'Ciroyom', '1'), ('2', 'Kebonjeruk', '1');
