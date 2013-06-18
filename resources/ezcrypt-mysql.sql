-- SQL Dump

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `ezcrypt`
--

-- --------------------------------------------------------

--
-- Table structure for table `pastes`
--

DROP TABLE IF EXISTS `pastes`;
CREATE TABLE IF NOT EXISTS `pastes` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `password` varchar(100) DEFAULT NULL,
  `data` longblob NOT NULL,
  `syntax` enum('text/plain','application/x-aspx','text/x-csrc','text/x-java','text/x-cppsrc','text/x-clojure','text/x-coffeescript','text/css','text/x-diff','text/x-groovy','text/x-haskell','text/html','htmlmixed','application/x-jsp','text/javascript','application/json','jinja2','text/less','text/x-lua','text/x-markdown','text/n-triples','text/x-pascal','text/x-perl','application/x-httpd-php','text/x-plsql','text/x-python','text/x-rsc','text/x-rst','text/x-ruby','text/x-rust','text/x-scheme','text/x-stsrc','application/sparql','text/x-stex','text/x-tiddlywiki','text/velocity','text/x-verilog','application/xml','text/x-yaml','text/x-bash','text/x-csharp') NOT NULL DEFAULT 'text/plain',
  `crypto` varchar(20) NOT NULL DEFAULT 'CRYPTO_JS',
  `added` int(15) DEFAULT NULL,
  `ttl` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf32;
