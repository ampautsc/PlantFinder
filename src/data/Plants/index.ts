import { Plant } from '../../types/Plant';

// Import all plant data files
import echinaceaPurpureaData from './echinacea-purpurea.json';
import rudbeckiaHirtaData from './rudbeckia-hirta.json';
import aquilegiaCanadensisData from './aquilegia-canadensis.json';
import asclepiasTuberosaData from './asclepias-tuberosa.json';
import symphyotrichumNovaeAngliaeData from './symphyotrichum-novae-angliae.json';
import monardaFistulosaData from './monarda-fistulosa.json';
import mertensiaMirginicaData from './mertensia-virginica.json';
import eutrochumPurpureumData from './eutrochium-purpureum.json';
import asclepiasIncarnataData from './asclepias-incarnata.json';
import lobeliaCardinalisData from './lobelia-cardinalis.json';
import liatrisSpicataData from './liatris-spicata.json';
import sanguinariaCanadensisData from './sanguinaria-canadensis.json';
import solidagoCanadensisData from './solidago-canadensis.json';
import penstemonDigitalisData from './penstemon-digitalis.json';
import coreopsisLanceolataData from './coreopsis-lanceolata.json';
import amsoniaTabernaemontanaData from './amsonia-tabernaemontana.json';
import helianthusAngustifoliusData from './helianthus-angustifolius.json';
import phloxPaniculataData from './phlox-paniculata.json';

// Collect all plants into an array
export const plants: Plant[] = [
  echinaceaPurpureaData,
  rudbeckiaHirtaData,
  aquilegiaCanadensisData,
  asclepiasTuberosaData,
  symphyotrichumNovaeAngliaeData,
  monardaFistulosaData,
  mertensiaMirginicaData,
  eutrochumPurpureumData,
  asclepiasIncarnataData,
  lobeliaCardinalisData,
  liatrisSpicataData,
  sanguinariaCanadensisData,
  solidagoCanadensisData,
  penstemonDigitalisData,
  coreopsisLanceolataData,
  amsoniaTabernaemontanaData,
  helianthusAngustifoliusData,
  phloxPaniculataData,
] as Plant[];
