import { Plant } from '../../types/Plant';

// Import all plant data files
import AchilleaMillefoliumData from './achillea-millefolium.json';
import AlliumSchoenoprasumData from './allium-schoenoprasum.json';
import AmelanchierAlnifoliaData from './amelanchier-alnifolia.json';
import AmsoniaTabernaemontanaData from './amsonia-tabernaemontana.json';
import AnaphalisMargaritaceaData from './anaphalis-margaritacea.json';
import AquilegiaCanadensisData from './aquilegia-canadensis.json';
import AquilegiaFormosaData from './aquilegia-formosa.json';
import ArctostaphylosData from './arctostaphylos.json';
import ArnicaLatifoliaData from './arnica-latifolia.json';
import ArtemisiaDouglasianaData from './artemisia-douglasiana.json';
import AsclepiasAsperulaData from './asclepias-asperula.json';
import AsclepiasEngelmannianaData from './asclepias-engelmanniana.json';
import AsclepiasFascicularisData from './asclepias-fascicularis.json';
import AsclepiasIncarnataData from './asclepias-incarnata.json';
import AsclepiasSpeciosaData from './asclepias-speciosa.json';
import AsclepiasSyriacaData from './asclepias-syriaca.json';
import AsclepiasTuberosaData from './asclepias-tuberosa.json';
import AsclepiasVerticillataData from './asclepias-verticillata.json';
import AstragalusAmericanusData from './astragalus-americanus.json';
import BaccharisSalicinaData from './baccharis-salicina.json';
import BalsamorhizaSagittataData from './balsamorhiza-sagittata.json';
import BaptisiaAustralisData from './baptisia-australis.json';
import BerberisAquifoliumData from './berberis-aquifolium.json';
import CallirhoeInvolucrataData from './callirhoe-involucrata.json';
import CamassiaQuamashData from './camassia-quamash.json';
import ChamerionAngustifoliumData from './chamerion-angustifolium.json';
import CheloneGlabraData from './chelone-glabra.json';
import ChilopsisLinearisData from './chilopsis-linearis.json';
import ChrysogonumVirginianumData from './chrysogonum-virginianum.json';
import CirsiumOchrocentrumData from './cirsium-ochrocentrum.json';
import CirsiumUndulatumData from './cirsium-undulatum.json';
import CleomeSerrulataData from './cleome-serrulata.json';
import ConocliniumCoelestinumData from './conoclinium-coelestinum.json';
import CoreopsisLanceolataData from './coreopsis-lanceolata.json';
import CoreopsisTinctoriaData from './coreopsis-tinctoria.json';
import CorethrogyneFilaginifoliaData from './corethrogyne-filaginifolia.json';
import CornusCanadensisData from './cornus-canadensis.json';
import DaleaCandidaData from './dalea-candida.json';
import DaleaPurpureaData from './dalea-purpurea.json';
import DelphiniumGlaucumData from './delphinium-glaucum.json';
import DicentraCanadensisData from './dicentra-canadensis.json';
import EchinaceaAngustifoliaData from './echinacea-angustifolia.json';
import EchinaceaPurpureaData from './echinacea-purpurea.json';
import EpilobiumCanumData from './epilobium-canum.json';
import EricameriaNauseosaData from './ericameria-nauseosa.json';
import ErigeronSpeciosusData from './erigeron-speciosus.json';
import EriogonumUmbellatumData from './eriogonum-umbellatum.json';
import EriophyllumLanatumData from './eriophyllum-lanatum.json';
import EschscholziaCalifornicaData from './eschscholzia-californica.json';
import EupatoriumPerfoliatumData from './eupatorium-perfoliatum.json';
import EupatoriumSerotinumData from './eupatorium-serotinum.json';
import EurybiaDivaricataData from './eurybia-divaricata.json';
import EurybiaSibiricaData from './eurybia-sibirica.json';
import EutrochiumFistulosumData from './eutrochium-fistulosum.json';
import EutrochiumPurpureumData from './eutrochium-purpureum.json';
import FragariaChiloensisData from './fragaria-chiloensis.json';
import FragariaVirginianaData from './fragaria-virginiana.json';
import GaillardiaAristataData from './gaillardia-aristata.json';
import GaillardiaPulchellaData from './gaillardia-pulchella.json';
import GeraniumErianthumData from './geranium-erianthum.json';
import GeraniumMaculatumData from './geranium-maculatum.json';
import GeraniumRichardsoniiData from './geranium-richardsonii.json';
import GlandulariaBipinnatifidaData from './glandularia-bipinnatifida.json';
import HedysarumAlpinumData from './hedysarum-alpinum.json';
import HedysarumBorealeData from './hedysarum-boreale.json';
import HelianthusAngustifoliusData from './helianthus-angustifolius.json';
import HelianthusAnnuusData from './helianthus-annuus.json';
import HelianthusDivaricatusData from './helianthus-divaricatus.json';
import HelianthusGrosseserratusData from './helianthus-grosseserratus.json';
import HelianthusMaximilianiData from './helianthus-maximiliani.json';
import HelianthusPauciflorusData from './helianthus-pauciflorus.json';
import HelianthusPetiolarisData from './helianthus-petiolaris.json';
import HymenoxysOdorataData from './hymenoxys-odorata.json';
import IpomopsisAggregataData from './ipomopsis-aggregata.json';
import IrisSetosaData from './iris-setosa.json';
import LiatrisAsperaData from './liatris-aspera.json';
import LiatrisPunctataData from './liatris-punctata.json';
import LiatrisPycnostachyaData from './liatris-pycnostachya.json';
import LiatrisSpicataData from './liatris-spicata.json';
import LinumLewisiiData from './linum-lewisii.json';
import LobeliaCardinalisData from './lobelia-cardinalis.json';
import LupinusNootkatensisData from './lupinus-nootkatensis.json';
import LupinusPerennisData from './lupinus-perennis.json';
import MachaerantheraTanacetifoliaData from './machaeranthera-tanacetifolia.json';
import MentzeliaMultifloraData from './mentzelia-multiflora.json';
import MertensiaCiliataData from './mertensia-ciliata.json';
import MertensiaPaniculataData from './mertensia-paniculata.json';
import MertensiaVirginicaData from './mertensia-virginica.json';
import MonardaCitriodoraData from './monarda-citriodora.json';
import MonardaFistulosaData from './monarda-fistulosa.json';
import MonardellaOdoratissimaData from './monardella-odoratissima.json';
import MonardellaVillosaData from './monardella-villosa.json';
import OenotheraCaespitosaData from './oenothera-caespitosa.json';
import OenotheraFruticosaData from './oenothera-fruticosa.json';
import OenotheraSpeciosaData from './oenothera-speciosa.json';
import OligoneuronRigidumData from './oligoneuron-rigidum.json';
import OxytropisCampestrisData from './oxytropis-campestris.json';
import PackeraAureaData from './packera-aurea.json';
import PenstemonAlbidusData from './penstemon-albidus.json';
import PenstemonDigitalisData from './penstemon-digitalis.json';
import PenstemonGrandiflorusData from './penstemon-grandiflorus.json';
import PenstemonLaevigatusData from './penstemon-laevigatus.json';
import PenstemonData from './penstemon.json';
import PhaceliaLinearisData from './phacelia-linearis.json';
import PhiladelphusLewisiiData from './philadelphus-lewisii.json';
import PhloxPaniculataData from './phlox-paniculata.json';
import PolemoniumAcutiflorumData from './polemonium-acutiflorum.json';
import PrimulaPaucifloraData from './primula-pauciflora.json';
import PulsatillaPatensData from './pulsatilla-patens.json';
import PycnanthemumTenuifoliumData from './pycnanthemum-tenuifolium.json';
import RatibidaColumniferaData from './ratibida-columnifera.json';
import RatibidaPinnataData from './ratibida-pinnata.json';
import RhusAromaticaData from './rhus-aromatica.json';
import RibesCereumData from './ribes-cereum.json';
import RibesSanguineumData from './ribes-sanguineum.json';
import RudbeckiaFulgidaData from './rudbeckia-fulgida.json';
import RudbeckiaHirtaData from './rudbeckia-hirta.json';
import RudbeckiaOccidentalisData from './rudbeckia-occidentalis.json';
import SalixData from './salix.json';
import SalviaDorriiData from './salvia-dorrii.json';
import SanguinariaCanadensisData from './sanguinaria-canadensis.json';
import SapindusSaponariaData from './sapindus-saponaria.json';
import SenecioFlaccidusData from './senecio-flaccidus.json';
import SolidagoAltissimaData from './solidago-altissima.json';
import SolidagoCanadensisData from './solidago-canadensis.json';
import SolidagoElongataData from './solidago-elongata.json';
import SolidagoMultiradiataData from './solidago-multiradiata.json';
import SolidagoNemoralisData from './solidago-nemoralis.json';
import SolidagoOdoraData from './solidago-odora.json';
import SolidagoRigidaData from './solidago-rigida.json';
import SolidagoRugosaData from './solidago-rugosa.json';
import SolidagoSpeciosaData from './solidago-speciosa.json';
import SphaeralceaMunroanaData from './sphaeralcea-munroana.json';
import SphaeralceaData from './sphaeralcea.json';
import SymphyotrichumEricoidesData from './symphyotrichum-ericoides.json';
import SymphyotrichumLaeveData from './symphyotrichum-laeve.json';
import SymphyotrichumNovaeAngliaeData from './symphyotrichum-novae-angliae.json';
import SymphyotrichumSubspicatumData from './symphyotrichum-subspicatum.json';
import ThelespermaMegapotamicumData from './thelesperma-megapotamicum.json';
import TradescantiaOccidentalisData from './tradescantia-occidentalis.json';
import TradescantiaOhiensisData from './tradescantia-ohiensis.json';
import VerbenaHastataData from './verbena-hastata.json';
import VerbesinaEncelioidesData from './verbesina-encelioides.json';
import VernoniaGiganteaData from './vernonia-gigantea.json';
import YuccaGlaucaData from './yucca-glauca.json';
import YuccaData from './yucca.json';
import ZinniaGrandifloraData from './zinnia-grandiflora.json';
import ZiziaAureaData from './zizia-aurea.json';

// Collect all plants into an array
export const plants: Plant[] = [
  AchilleaMillefoliumData,
  AlliumSchoenoprasumData,
  AmelanchierAlnifoliaData,
  AmsoniaTabernaemontanaData,
  AnaphalisMargaritaceaData,
  AquilegiaCanadensisData,
  AquilegiaFormosaData,
  ArctostaphylosData,
  ArnicaLatifoliaData,
  ArtemisiaDouglasianaData,
  AsclepiasAsperulaData,
  AsclepiasEngelmannianaData,
  AsclepiasFascicularisData,
  AsclepiasIncarnataData,
  AsclepiasSpeciosaData,
  AsclepiasSyriacaData,
  AsclepiasTuberosaData,
  AsclepiasVerticillataData,
  AstragalusAmericanusData,
  BaccharisSalicinaData,
  BalsamorhizaSagittataData,
  BaptisiaAustralisData,
  BerberisAquifoliumData,
  CallirhoeInvolucrataData,
  CamassiaQuamashData,
  ChamerionAngustifoliumData,
  CheloneGlabraData,
  ChilopsisLinearisData,
  ChrysogonumVirginianumData,
  CirsiumOchrocentrumData,
  CirsiumUndulatumData,
  CleomeSerrulataData,
  ConocliniumCoelestinumData,
  CoreopsisLanceolataData,
  CoreopsisTinctoriaData,
  CorethrogyneFilaginifoliaData,
  CornusCanadensisData,
  DaleaCandidaData,
  DaleaPurpureaData,
  DelphiniumGlaucumData,
  DicentraCanadensisData,
  EchinaceaAngustifoliaData,
  EchinaceaPurpureaData,
  EpilobiumCanumData,
  EricameriaNauseosaData,
  ErigeronSpeciosusData,
  EriogonumUmbellatumData,
  EriophyllumLanatumData,
  EschscholziaCalifornicaData,
  EupatoriumPerfoliatumData,
  EupatoriumSerotinumData,
  EurybiaDivaricataData,
  EurybiaSibiricaData,
  EutrochiumFistulosumData,
  EutrochiumPurpureumData,
  FragariaChiloensisData,
  FragariaVirginianaData,
  GaillardiaAristataData,
  GaillardiaPulchellaData,
  GeraniumErianthumData,
  GeraniumMaculatumData,
  GeraniumRichardsoniiData,
  GlandulariaBipinnatifidaData,
  HedysarumAlpinumData,
  HedysarumBorealeData,
  HelianthusAngustifoliusData,
  HelianthusAnnuusData,
  HelianthusDivaricatusData,
  HelianthusGrosseserratusData,
  HelianthusMaximilianiData,
  HelianthusPauciflorusData,
  HelianthusPetiolarisData,
  HymenoxysOdorataData,
  IpomopsisAggregataData,
  IrisSetosaData,
  LiatrisAsperaData,
  LiatrisPunctataData,
  LiatrisPycnostachyaData,
  LiatrisSpicataData,
  LinumLewisiiData,
  LobeliaCardinalisData,
  LupinusNootkatensisData,
  LupinusPerennisData,
  MachaerantheraTanacetifoliaData,
  MentzeliaMultifloraData,
  MertensiaCiliataData,
  MertensiaPaniculataData,
  MertensiaVirginicaData,
  MonardaCitriodoraData,
  MonardaFistulosaData,
  MonardellaOdoratissimaData,
  MonardellaVillosaData,
  OenotheraCaespitosaData,
  OenotheraFruticosaData,
  OenotheraSpeciosaData,
  OligoneuronRigidumData,
  OxytropisCampestrisData,
  PackeraAureaData,
  PenstemonAlbidusData,
  PenstemonDigitalisData,
  PenstemonGrandiflorusData,
  PenstemonLaevigatusData,
  PenstemonData,
  PhaceliaLinearisData,
  PhiladelphusLewisiiData,
  PhloxPaniculataData,
  PolemoniumAcutiflorumData,
  PrimulaPaucifloraData,
  PulsatillaPatensData,
  PycnanthemumTenuifoliumData,
  RatibidaColumniferaData,
  RatibidaPinnataData,
  RhusAromaticaData,
  RibesCereumData,
  RibesSanguineumData,
  RudbeckiaFulgidaData,
  RudbeckiaHirtaData,
  RudbeckiaOccidentalisData,
  SalixData,
  SalviaDorriiData,
  SanguinariaCanadensisData,
  SapindusSaponariaData,
  SenecioFlaccidusData,
  SolidagoAltissimaData,
  SolidagoCanadensisData,
  SolidagoElongataData,
  SolidagoMultiradiataData,
  SolidagoNemoralisData,
  SolidagoOdoraData,
  SolidagoRigidaData,
  SolidagoRugosaData,
  SolidagoSpeciosaData,
  SphaeralceaMunroanaData,
  SphaeralceaData,
  SymphyotrichumEricoidesData,
  SymphyotrichumLaeveData,
  SymphyotrichumNovaeAngliaeData,
  SymphyotrichumSubspicatumData,
  ThelespermaMegapotamicumData,
  TradescantiaOccidentalisData,
  TradescantiaOhiensisData,
  VerbenaHastataData,
  VerbesinaEncelioidesData,
  VernoniaGiganteaData,
  YuccaGlaucaData,
  YuccaData,
  ZinniaGrandifloraData,
  ZiziaAureaData,
] as Plant[];
