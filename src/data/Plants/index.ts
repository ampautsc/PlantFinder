import { Plant } from '../../types/Plant';

// Import all plant data files
import echinaceaPurpureaData from './echinacea-purpurea.json';
import rudbeckiaHirtaData from './rudbeckia-hirta.json';
import aquilegiaCanadensisData from './aquilegia-canadensis.json';
import asclepiasTuberosaData from './asclepias-tuberosa.json';
import asclepiasIncarnataData from './asclepias-incarnata.json';
import asclepiasSyriacaData from './asclepias-syriaca.json';
import asclepiasVerticillataData from './asclepias-verticillata.json';
import symphyotrichumNovaeAngliaeData from './symphyotrichum-novae-angliae.json';
import symphyotrichumLaeveData from './symphyotrichum-laeve.json';
import monardaFistulosaData from './monarda-fistulosa.json';
import mertensiaMirginicaData from './mertensia-virginica.json';
import eutrochumPurpureumData from './eutrochium-purpureum.json';
import lobeliaCardinalisData from './lobelia-cardinalis.json';
import liatrisSpicataData from './liatris-spicata.json';
import liatrisAsperaData from './liatris-aspera.json';
import sanguinariaCanadensisData from './sanguinaria-canadensis.json';
import solidagoCanadensisData from './solidago-canadensis.json';
import solidagoSpeciosaData from './solidago-speciosa.json';
import penstemonDigitalisData from './penstemon-digitalis.json';
import coreopsisLanceolataData from './coreopsis-lanceolata.json';
import amsoniaTabernaemontanaData from './amsonia-tabernaemontana.json';
import helianthusAngustifoliusData from './helianthus-angustifolius.json';
import helianthusGrosseserratusData from './helianthus-grosseserratus.json';
import phloxPaniculataData from './phlox-paniculata.json';
import ziziaAureaData from './zizia-aurea.json';

// Collect all plants into an array
export const plants: Plant[] = [
  echinaceaPurpureaData,
  rudbeckiaHirtaData,
  aquilegiaCanadensisData,
  asclepiasTuberosaData,
  asclepiasIncarnataData,
  asclepiasSyriacaData,
  asclepiasVerticillataData,
  symphyotrichumNovaeAngliaeData,
  symphyotrichumLaeveData,
  monardaFistulosaData,
  mertensiaMirginicaData,
  eutrochumPurpureumData,
  lobeliaCardinalisData,
  liatrisSpicataData,
  liatrisAsperaData,
  sanguinariaCanadensisData,
  solidagoCanadensisData,
  solidagoSpeciosaData,
  penstemonDigitalisData,
  coreopsisLanceolataData,
  amsoniaTabernaemontanaData,
  helianthusAngustifoliusData,
  helianthusGrosseserratusData,
  phloxPaniculataData,
  ziziaAureaData,
] as Plant[];
