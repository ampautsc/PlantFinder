import { Plant } from '../../types/Plant';

// Import all plant data files
import AbutilonIncanumData from './abutilon-incanum.json';
import AcaciellaAngustissimaData from './acaciella-angustissima.json';
import AcerCircinatumData from './acer-circinatum.json';
import AcerNegundoData from './acer-negundo.json';
import AcerRubrumData from './acer-rubrum.json';
import AcerSaccharinumData from './acer-saccharinum.json';
import AchilleaMillefoliumData from './achillea-millefolium.json';
import ActaeaRacemosaData from './actaea-racemosa.json';
import AesculusCalifornicaData from './aesculus-californica.json';
import AgalinisPauperculaData from './agalinis-paupercula.json';
import AgaveDesertiData from './agave-deserti.json';
import AgaveLechuguillaData from './agave-lechuguilla.json';
import AgavePalmeriData from './agave-palmeri.json';
import AgaveParryiData from './agave-parryi.json';
import AgaveUtahensisData from './agave-utahensis.json';
import AlliumSchoenoprasumData from './allium-schoenoprasum.json';
import AllowissadulaHolosericeaData from './allowissadula-holosericea.json';
import AlnusIncanaData from './alnus-incana.json';
import AmaranthusTuberculatusData from './amaranthus-tuberculatus.json';
import AmbrosiaTrifidaData from './ambrosia-trifida.json';
import AmelanchierAlnifoliaData from './amelanchier-alnifolia.json';
import AmorphaFruticosaData from './amorpha-fruticosa.json';
import AmphicarpaeaBracteataData from './amphicarpaea-bracteata.json';
import AmsoniaTabernaemontanaData from './amsonia-tabernaemontana.json';
import AnaphalisMargaritaceaData from './anaphalis-margaritacea.json';
import AndropogonGerardiiData from './andropogon-gerardii.json';
import AngelicaAtropurpureaData from './angelica-atropurpurea.json';
import AnisacanthusQuadrifidusData from './anisacanthus-quadrifidus.json';
import AnnonaGlabraData from './annona-glabra.json';
import AntennariaHowelliiData from './antennaria-howellii.json';
import AntennariaParvifoliaData from './antennaria-parvifolia.json';
import AntennariaPlantaginiifoliaData from './antennaria-plantaginifolia.json';
import ApiosAmericanaData from './apios-americana.json';
import ApocynumAndrosaemifoliumData from './apocynum-androsaemifolium.json';
import ApocynumCannabinumData from './apocynum-cannabinum.json';
import AquilegiaBrevistylaData from './aquilegia-brevistyla.json';
import AquilegiaCanadensisData from './aquilegia-canadensis.json';
import AquilegiaChrysanthaData from './aquilegia-chrysantha.json';
import AquilegiaFormosaData from './aquilegia-formosa.json';
import ArabisGlabraData from './arabis-glabra.json';
import ArabisXdivaricarpaData from './arabis-xdivaricarpa.json';
import ArbutusMenziesiiData from './arbutus-menziesii.json';
import ArctostaphylosData from './arctostaphylos.json';
import ArctostaphylosPungensData from './arctostaphylos-pungens.json';
import ArctostaphylosUvaUrsiData from './arctostaphylos-uva-ursi.json';
import AristolochiaCalifornicaData from './aristolochia-californica.json';
import AristolochiaErectaData from './aristolochia-erecta.json';
import ArnicaLatifoliaData from './arnica-latifolia.json';
import ArtemisiaDouglasianaData from './artemisia-douglasiana.json';
import ArtemisiaTridentataData from './artemisia-tridentata.json';
import AruncusDioicusData from './aruncus-dioicus.json';
import AsclepiasAsperulaData from './asclepias-asperula.json';
import AsclepiasEngelmannianaData from './asclepias-engelmanniana.json';
import AsclepiasFascicularisData from './asclepias-fascicularis.json';
import AsclepiasIncarnataData from './asclepias-incarnata.json';
import AsclepiasOvalifoliaData from './asclepias-ovalifolia.json';
import AsclepiasSpeciosaData from './asclepias-speciosa.json';
import AsclepiasSullivantiiData from './asclepias-sullivantii.json';
import AsclepiasSyriacaData from './asclepias-syriaca.json';
import AsclepiasTuberosaData from './asclepias-tuberosa.json';
import AsclepiasVerticillataData from './asclepias-verticillata.json';
import AsiminaTrilobaData from './asimina-triloba.json';
import AstragalusAlpinusData from './astragalus-alpinus.json';
import AstragalusAmericanusData from './astragalus-americanus.json';
import AstragalusCrassicarpusData from './astragalus-crassicarpus.json';
import AstragalusDrummondiiData from './astragalus-drummondii.json';
import AtriplexCanescensData from './atriplex-canescens.json';
import AtriplexLentiformisData from './atriplex-lentiformis.json';
import BaccharisSalicinaData from './baccharis-salicina.json';
import BacopaMonnieriData from './bacopa-monnieri.json';
import BalsamorhizaSagittataData from './balsamorhiza-sagittata.json';
import BaptisiaAustralisData from './baptisia-australis.json';
import BaptisiaTinctoriaData from './baptisia-tinctoria.json';
import BerberisAquifoliumData from './berberis-aquifolium.json';
import BetulaAlleghaniensisData from './betula-alleghaniensis.json';
import BetulaLentaData from './betula-lenta.json';
import BetulaPapyriferaData from './betula-papyrifera.json';
import BetulaPopulifoliaData from './betula-populifolia.json';
import BidensAlbaData from './bidens-alba.json';
import BoehmeriaCylindricaData from './boehmeria-cylindrica.json';
import BoutelouaCurtipendulaData from './bouteloua-curtipendula.json';
import BoutelouaGracilisData from './bouteloua-gracilis.json';
import BrachyelytrumErectumData from './brachyelytrum-erectum.json';
import BromusAnomalusData from './bromus-anomalus.json';
import BromusInermisData from './bromus-inermis.json';
import BurseraSimarubaData from './bursera-simaruba.json';
import ByrsonimaLucidaData from './byrsonima-lucida.json';
import CalamagrostisPurpurascensData from './calamagrostis-purpurascens.json';
import CallirhoeInvolucrataData from './callirhoe-involucrata.json';
import CamassiaQuamashData from './camassia-quamash.json';
import CamissoniaContortaData from './camissonia-contorta.json';
import CampsisRadicansData from './campsis-radicans.json';
import CardamineConcatenataData from './cardamine-concatenata.json';
import CardamineDiphyllaData from './cardamine-diphylla.json';
import CarexBigelowiiData from './carex-bigelowii.json';
import CarexLacustrisData from './carex-lacustris.json';
import CarexStrictaData from './carex-stricta.json';
import CarpinusCarolinianaData from './carpinus-caroliniana.json';
import CassiopeMertensianaData from './cassiope-mertensiana.json';
import CastaneaPumilaData from './castanea-pumila.json';
import CastillejaIntegraData from './castilleja-integra.json';
import CeanothusAmericanusData from './ceanothus-americanus.json';
import CeanothusCordulatusData from './ceanothus-cordulatus.json';
import CeanothusCuneatusData from './ceanothus-cuneatus.json';
import CeanothusFendleriData from './ceanothus-fendleri.json';
import CeanothusHerbaceusData from './ceanothus-herbaceus.json';
import CeanothusSanguineusData from './ceanothus-sanguineus.json';
import CelosiaNitidaData from './celosia-nitida.json';
import CeltisLaevigataData from './celtis-laevigata.json';
import CeltisLindheimeriData from './celtis-lindheimeri.json';
import CeltisOccidentalisData from './celtis-occidentalis.json';
import CephalanthusOccidentalisData from './cephalanthus-occidentalis.json';
import CercisCanadensisData from './cercis-canadensis.json';
import CercocarpusMontanusData from './cercocarpus-montanus.json';
import ChamerionAngustifoliumData from './chamerion-angustifolium.json';
import CheloneGlabraData from './chelone-glabra.json';
import ChenopodiumAlbumData from './chenopodium-album.json';
import ChilopsisLinearisData from './chilopsis-linearis.json';
import ChiococcaAlbaData from './chiococca-alba.json';
import ChionanthusVirginicusData from './chionanthus-virginicus.json';
import ChrysogonumVirginianumData from './chrysogonum-virginianum.json';
import CirsiumDiscolorData from './cirsium-discolor.json';
import CirsiumHorridulumData from './cirsium-horridulum.json';
import CirsiumMuticumData from './cirsium-muticum.json';
import CirsiumOchrocentrumData from './cirsium-ochrocentrum.json';
import CirsiumPitcheriData from './cirsium-pitcheri.json';
import CirsiumUndulatumData from './cirsium-undulatum.json';
import CleomeSerrulataData from './cleome-serrulata.json';
import ComandraUmbellataData from './comandra-umbellata.json';
import ComptoniaPeregrinaData from './comptonia-peregrina.json';
import CondaliaHookeriData from './condalia-hookeri.json';
import CondaliaSpathulataData from './condalia-spathulata.json';
import CondaliaViridisData from './condalia-viridis.json';
import ConocliniumCoelestinumData from './conoclinium-coelestinum.json';
import CoreopsisLanceolataData from './coreopsis-lanceolata.json';
import CoreopsisTinctoriaData from './coreopsis-tinctoria.json';
import CorethrogyneFilaginifoliaData from './corethrogyne-filaginifolia.json';
import CornusAlternifoliaData from './cornus-alternifolia.json';
import CornusCanadensisData from './cornus-canadensis.json';
import CornusFloridaData from './cornus-florida.json';
import CornusRacemosaData from './cornus-racemosa.json';
import CornusRugosaData from './cornus-rugosa.json';
import CornusSericeaData from './cornus-sericea.json';
import CorylusCornutaData from './corylus-cornuta.json';
import CoursetiaGlandulosaData from './coursetia-glandulosa.json';
import CrataegusDouglasiiData from './crataegus-douglasii.json';
import CrotonCapitatusData from './croton-capitatus.json';
import CyperusEsculentusData from './cyperus-esculentus.json';
import DaleaCandidaData from './dalea-candida.json';
import DaleaPurpureaData from './dalea-purpurea.json';
import DanthoniaSpicataData from './danthonia-spicata.json';
import DelphiniumGlaucumData from './delphinium-glaucum.json';
import DeschampsiaCespitosaData from './deschampsia-cespitosa.json';
import DesmodiumCanadenseData from './desmodium-canadense.json';
import DesmodiumGlutinosumData from './desmodium-glutinosum.json';
import DiapensiaLapponicaData from './diapensia-lapponica.json';
import DicentraCanadensisData from './dicentra-canadensis.json';
import DicentraUnifloraData from './dicentra-uniflora.json';
import DiclipteraBrachiataData from './dicliptera-brachiata.json';
import DiospyrosTexanaData from './diospyros-texana.json';
import DiospyrosVirginianaData from './diospyros-virginiana.json';
import DistichlisSpicataData from './distichlis-spicata.json';
import DryasIntegrifoliaData from './dryas-integrifolia.json';
import DryasOctopetalaData from './dryas-octopetala.json';
import EchinaceaAngustifoliaData from './echinacea-angustifolia.json';
import EchinaceaPurpureaData from './echinacea-purpurea.json';
import EleocharisEllipticaData from './eleocharis-elliptica.json';
import EmpetrumNigrumData from './empetrum-nigrum.json';
import EpigaeaRepensData from './epigaea-repens.json';
import EpilobiumCanumData from './epilobium-canum.json';
import EricameriaNauseosaData from './ericameria-nauseosa.json';
import ErigeronPhiladelphicusData from './erigeron-philadelphicus.json';
import ErigeronSpeciosusData from './erigeron-speciosus.json';
import EriogonumAbertianumData from './eriogonum-abertianum.json';
import EriogonumFasciculatumData from './eriogonum-fasciculatum.json';
import EriogonumGiganteumData from './eriogonum-giganteum.json';
import EriogonumNudumData from './eriogonum-nudum.json';
import EriogonumUmbellatumData from './eriogonum-umbellatum.json';
import EriogonumWrightiiData from './eriogonum-wrightii.json';
import EriophyllumLanatumData from './eriophyllum-lanatum.json';
import EschscholziaCalifornicaData from './eschscholzia-californica.json';
import EugeniaAxillarisData from './eugenia-axillaris.json';
import EupatoriumPerfoliatumData from './eupatorium-perfoliatum.json';
import EupatoriumSerotinumData from './eupatorium-serotinum.json';
import EurybiaDivaricataData from './eurybia-divaricata.json';
import EurybiaMacrophyllaData from './eurybia-macrophylla.json';
import EurybiaSibiricaData from './eurybia-sibirica.json';
import EutrochiumFistulosumData from './eutrochium-fistulosum.json';
import EutrochiumPurpureumData from './eutrochium-purpureum.json';
import FagusGrandifoliaData from './fagus-grandifolia.json';
import FestucaIdahoensisData from './festuca-idahoensis.json';
import FragariaChiloensisData from './fragaria-chiloensis.json';
import FragariaVirginianaData from './fragaria-virginiana.json';
import FraxinusAlbicansData from './fraxinus-albicans.json';
import FraxinusAmericanaData from './fraxinus-americana.json';
import FraxinusGreggiiData from './fraxinus-greggii.json';
import FraxinusPennsylvanicaData from './fraxinus-pennsylvanica.json';
import GaillardiaAristataData from './gaillardia-aristata.json';
import GaillardiaPulchellaData from './gaillardia-pulchella.json';
import GaultheriaHispidulaData from './gaultheria-hispidula.json';
import GeraniumErianthumData from './geranium-erianthum.json';
import GeraniumMaculatumData from './geranium-maculatum.json';
import GeraniumRichardsoniiData from './geranium-richardsonii.json';
import GlandulariaBipinnatifidaData from './glandularia-bipinnatifida.json';
import GleditsiaTriacanthosData from './gleditsia-triacanthos.json';
import GlycyrrhizaLepidotaData from './glycyrrhiza-lepidota.json';
import GymnocladusDioicusData from './gymnocladus-dioicus.json';
import HameliaPatensData from './hamelia-patens.json';
import HedysarumAlpinumData from './hedysarum-alpinum.json';
import HedysarumBorealeData from './hedysarum-boreale.json';
import HelianthusAngustifoliusData from './helianthus-angustifolius.json';
import HelianthusAnnuusData from './helianthus-annuus.json';
import HelianthusArgophyllusData from './helianthus-argophyllus.json';
import HelianthusDecapetalusData from './helianthus-decapetalus.json';
import HelianthusDivaricatusData from './helianthus-divaricatus.json';
import HelianthusGrosseserratusData from './helianthus-grosseserratus.json';
import HelianthusMaximilianiData from './helianthus-maximiliani.json';
import HelianthusPauciflorusData from './helianthus-pauciflorus.json';
import HelianthusPetiolarisData from './helianthus-petiolaris.json';
import HorkeliaFuscaData from './horkelia-fusca.json';
import HumulusLupulusData from './humulus-lupulus.json';
import HumulusLupulusVarLupuloidesData from './humulus-lupulus-var.-lupuloides.json';
import HybanthusVerticillatusData from './hybanthus-verticillatus.json';
import HydrangeaArborescensData from './hydrangea-arborescens.json';
import HymenoxysOdorataData from './hymenoxys-odorata.json';
import IlexMucronataData from './ilex-mucronata.json';
import IpomopsisAggregataData from './ipomopsis-aggregata.json';
import IrisSetosaData from './iris-setosa.json';
import JuglansMicrocarpaData from './juglans-microcarpa.json';
import JuniperusCalifornicaData from './juniperus-californica.json';
import KalmiaAngustifoliaData from './kalmia-angustifolia.json';
import KalmiaLatifoliaData from './kalmia-latifolia.json';
import LaporteaCanadensisData from './laportea-canadensis.json';
import LarixLaricinaData from './larix-laricina.json';
import LedumGroenlandicumData from './ledum-groenlandicum.json';
import LeersiaOryzoidesData from './leersia-oryzoides.json';
import LeersiaVirginicaData from './leersia-virginica.json';
import LeptochloaDubiaData from './leptochloa-dubia.json';
import LespedezaHirtaData from './lespedeza-hirta.json';
import LeucophyllumFrutescensData from './leucophyllum-frutescens.json';
import LiatrisAsperaData from './liatris-aspera.json';
import LiatrisPunctataData from './liatris-punctata.json';
import LiatrisPycnostachyaData from './liatris-pycnostachya.json';
import LiatrisSpicataData from './liatris-spicata.json';
import LinderaBenzoinData from './lindera-benzoin.json';
import LinumLewisiiData from './linum-lewisii.json';
import LippiaAlbaData from './lippia-alba.json';
import LiriodendronTulipiferaData from './liriodendron-tulipifera.json';
import LobeliaCardinalisData from './lobelia-cardinalis.json';
import LoniceraSempervirensData from './lonicera-sempervirens.json';
import LotusScopariusData from './lotus-scoparius.json';
import LupinusNootkatensisData from './lupinus-nootkatensis.json';
import LupinusPerennisData from './lupinus-perennis.json';
import LupinusTexensisData from './lupinus-texensis.json';
import MachaerantheraTanacetifoliaData from './machaeranthera-tanacetifolia.json';
import MagnoliaVirginianaData from './magnolia-virginiana.json';
import MalpighiaGlabraData from './malpighia-glabra.json';
import ManfredaMaculosaData from './manfreda-maculosa.json';
import MaurandellaAntirrhinifloraData from './maurandella-antirrhiniflora.json';
import MentzeliaMultifloraData from './mentzelia-multiflora.json';
import MertensiaCiliataData from './mertensia-ciliata.json';
import MertensiaPaniculataData from './mertensia-paniculata.json';
import MertensiaVirginicaData from './mertensia-virginica.json';
import MimulusRingensData from './mimulus-ringens.json';
import MimulusRingensVarRingensData from './mimulus-ringens-var.-ringens.json';
import MonardaCitriodoraData from './monarda-citriodora.json';
import MonardaFistulosaData from './monarda-fistulosa.json';
import MonardellaOdoratissimaData from './monardella-odoratissima.json';
import MonardellaVillosaData from './monardella-villosa.json';
import MorellaCalifornicaData from './morella-californica.json';
import MorellaCeriferaData from './morella-cerifera.json';
import MorellaPensylvanicaData from './morella-pensylvanica.json';
import MuhlenbergiaEmersleyiData from './muhlenbergia-emersleyi.json';
import NolinaTexanaData from './nolina-texana.json';
import OenotheraCaespitosaData from './oenothera-caespitosa.json';
import OenotheraFruticosaData from './oenothera-fruticosa.json';
import OenotheraSpeciosaData from './oenothera-speciosa.json';
import OligoneuronRigidumData from './oligoneuron-rigidum.json';
import OxytropisCampestrisData from './oxytropis-campestris.json';
import PackeraAureaData from './packera-aurea.json';
import PaspalumDistichumData from './paspalum-distichum.json';
import PassifloraAffinisData from './passiflora-affinis.json';
import PenstemonData from './penstemon.json';
import PenstemonAlbidusData from './penstemon-albidus.json';
import PenstemonDigitalisData from './penstemon-digitalis.json';
import PenstemonGrandiflorusData from './penstemon-grandiflorus.json';
import PenstemonLaevigatusData from './penstemon-laevigatus.json';
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
import SassafrasAlbidumData from './sassafras-albidum.json';
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
import SphaeralceaData from './sphaeralcea.json';
import SphaeralceaMunroanaData from './sphaeralcea-munroana.json';
import SymphyotrichumEricoidesData from './symphyotrichum-ericoides.json';
import SymphyotrichumLaeveData from './symphyotrichum-laeve.json';
import SymphyotrichumNovaeAngliaeData from './symphyotrichum-novae-angliae.json';
import SymphyotrichumSubspicatumData from './symphyotrichum-subspicatum.json';
import ThelespermaMegapotamicumData from './thelesperma-megapotamicum.json';
import TradescantiaOccidentalisData from './tradescantia-occidentalis.json';
import TradescantiaOhiensisData from './tradescantia-ohiensis.json';
import TrifoliumRepensData from './trifolium-repens.json';
import UlmusAmericanaData from './ulmus-americana.json';
import VerbenaHastataData from './verbena-hastata.json';
import VerbesinaEncelioidesData from './verbesina-encelioides.json';
import VernoniaGiganteaData from './vernonia-gigantea.json';
import ViolaSororiaData from './viola-sororia.json';
import YuccaData from './yucca.json';
import YuccaGlaucaData from './yucca-glauca.json';
import ZinniaGrandifloraData from './zinnia-grandiflora.json';
import ZiziaAureaData from './zizia-aurea.json';

// Collect all plants into an array
export const plants: Plant[] = [
  AbutilonIncanumData,
  AcaciellaAngustissimaData,
  AcerCircinatumData,
  AcerNegundoData,
  AcerRubrumData,
  AcerSaccharinumData,
  AchilleaMillefoliumData,
  ActaeaRacemosaData,
  AesculusCalifornicaData,
  AgalinisPauperculaData,
  AgaveDesertiData,
  AgaveLechuguillaData,
  AgavePalmeriData,
  AgaveParryiData,
  AgaveUtahensisData,
  AlliumSchoenoprasumData,
  AllowissadulaHolosericeaData,
  AlnusIncanaData,
  AmaranthusTuberculatusData,
  AmbrosiaTrifidaData,
  AmelanchierAlnifoliaData,
  AmorphaFruticosaData,
  AmphicarpaeaBracteataData,
  AmsoniaTabernaemontanaData,
  AnaphalisMargaritaceaData,
  AndropogonGerardiiData,
  AngelicaAtropurpureaData,
  AnisacanthusQuadrifidusData,
  AnnonaGlabraData,
  AntennariaHowelliiData,
  AntennariaParvifoliaData,
  AntennariaPlantaginiifoliaData,
  ApiosAmericanaData,
  ApocynumAndrosaemifoliumData,
  ApocynumCannabinumData,
  AquilegiaBrevistylaData,
  AquilegiaCanadensisData,
  AquilegiaChrysanthaData,
  AquilegiaFormosaData,
  ArabisGlabraData,
  ArabisXdivaricarpaData,
  ArbutusMenziesiiData,
  ArctostaphylosData,
  ArctostaphylosPungensData,
  ArctostaphylosUvaUrsiData,
  AristolochiaCalifornicaData,
  AristolochiaErectaData,
  ArnicaLatifoliaData,
  ArtemisiaDouglasianaData,
  ArtemisiaTridentataData,
  AruncusDioicusData,
  AsclepiasAsperulaData,
  AsclepiasEngelmannianaData,
  AsclepiasFascicularisData,
  AsclepiasIncarnataData,
  AsclepiasOvalifoliaData,
  AsclepiasSpeciosaData,
  AsclepiasSullivantiiData,
  AsclepiasSyriacaData,
  AsclepiasTuberosaData,
  AsclepiasVerticillataData,
  AsiminaTrilobaData,
  AstragalusAlpinusData,
  AstragalusAmericanusData,
  AstragalusCrassicarpusData,
  AstragalusDrummondiiData,
  AtriplexCanescensData,
  AtriplexLentiformisData,
  BaccharisSalicinaData,
  BacopaMonnieriData,
  BalsamorhizaSagittataData,
  BaptisiaAustralisData,
  BaptisiaTinctoriaData,
  BerberisAquifoliumData,
  BetulaAlleghaniensisData,
  BetulaLentaData,
  BetulaPapyriferaData,
  BetulaPopulifoliaData,
  BidensAlbaData,
  BoehmeriaCylindricaData,
  BoutelouaCurtipendulaData,
  BoutelouaGracilisData,
  BrachyelytrumErectumData,
  BromusAnomalusData,
  BromusInermisData,
  BurseraSimarubaData,
  ByrsonimaLucidaData,
  CalamagrostisPurpurascensData,
  CallirhoeInvolucrataData,
  CamassiaQuamashData,
  CamissoniaContortaData,
  CampsisRadicansData,
  CardamineConcatenataData,
  CardamineDiphyllaData,
  CarexBigelowiiData,
  CarexLacustrisData,
  CarexStrictaData,
  CarpinusCarolinianaData,
  CassiopeMertensianaData,
  CastaneaPumilaData,
  CastillejaIntegraData,
  CeanothusAmericanusData,
  CeanothusCordulatusData,
  CeanothusCuneatusData,
  CeanothusFendleriData,
  CeanothusHerbaceusData,
  CeanothusSanguineusData,
  CelosiaNitidaData,
  CeltisLaevigataData,
  CeltisLindheimeriData,
  CeltisOccidentalisData,
  CephalanthusOccidentalisData,
  CercisCanadensisData,
  CercocarpusMontanusData,
  ChamerionAngustifoliumData,
  CheloneGlabraData,
  ChenopodiumAlbumData,
  ChilopsisLinearisData,
  ChiococcaAlbaData,
  ChionanthusVirginicusData,
  ChrysogonumVirginianumData,
  CirsiumDiscolorData,
  CirsiumHorridulumData,
  CirsiumMuticumData,
  CirsiumOchrocentrumData,
  CirsiumPitcheriData,
  CirsiumUndulatumData,
  CleomeSerrulataData,
  ComandraUmbellataData,
  ComptoniaPeregrinaData,
  CondaliaHookeriData,
  CondaliaSpathulataData,
  CondaliaViridisData,
  ConocliniumCoelestinumData,
  CoreopsisLanceolataData,
  CoreopsisTinctoriaData,
  CorethrogyneFilaginifoliaData,
  CornusAlternifoliaData,
  CornusCanadensisData,
  CornusFloridaData,
  CornusRacemosaData,
  CornusRugosaData,
  CornusSericeaData,
  CorylusCornutaData,
  CoursetiaGlandulosaData,
  CrataegusDouglasiiData,
  CrotonCapitatusData,
  CyperusEsculentusData,
  DaleaCandidaData,
  DaleaPurpureaData,
  DanthoniaSpicataData,
  DelphiniumGlaucumData,
  DeschampsiaCespitosaData,
  DesmodiumCanadenseData,
  DesmodiumGlutinosumData,
  DiapensiaLapponicaData,
  DicentraCanadensisData,
  DicentraUnifloraData,
  DiclipteraBrachiataData,
  DiospyrosTexanaData,
  DiospyrosVirginianaData,
  DistichlisSpicataData,
  DryasIntegrifoliaData,
  DryasOctopetalaData,
  EchinaceaAngustifoliaData,
  EchinaceaPurpureaData,
  EleocharisEllipticaData,
  EmpetrumNigrumData,
  EpigaeaRepensData,
  EpilobiumCanumData,
  EricameriaNauseosaData,
  ErigeronPhiladelphicusData,
  ErigeronSpeciosusData,
  EriogonumAbertianumData,
  EriogonumFasciculatumData,
  EriogonumGiganteumData,
  EriogonumNudumData,
  EriogonumUmbellatumData,
  EriogonumWrightiiData,
  EriophyllumLanatumData,
  EschscholziaCalifornicaData,
  EugeniaAxillarisData,
  EupatoriumPerfoliatumData,
  EupatoriumSerotinumData,
  EurybiaDivaricataData,
  EurybiaMacrophyllaData,
  EurybiaSibiricaData,
  EutrochiumFistulosumData,
  EutrochiumPurpureumData,
  FagusGrandifoliaData,
  FestucaIdahoensisData,
  FragariaChiloensisData,
  FragariaVirginianaData,
  FraxinusAlbicansData,
  FraxinusAmericanaData,
  FraxinusGreggiiData,
  FraxinusPennsylvanicaData,
  GaillardiaAristataData,
  GaillardiaPulchellaData,
  GaultheriaHispidulaData,
  GeraniumErianthumData,
  GeraniumMaculatumData,
  GeraniumRichardsoniiData,
  GlandulariaBipinnatifidaData,
  GleditsiaTriacanthosData,
  GlycyrrhizaLepidotaData,
  GymnocladusDioicusData,
  HameliaPatensData,
  HedysarumAlpinumData,
  HedysarumBorealeData,
  HelianthusAngustifoliusData,
  HelianthusAnnuusData,
  HelianthusArgophyllusData,
  HelianthusDecapetalusData,
  HelianthusDivaricatusData,
  HelianthusGrosseserratusData,
  HelianthusMaximilianiData,
  HelianthusPauciflorusData,
  HelianthusPetiolarisData,
  HorkeliaFuscaData,
  HumulusLupulusData,
  HumulusLupulusVarLupuloidesData,
  HybanthusVerticillatusData,
  HydrangeaArborescensData,
  HymenoxysOdorataData,
  IlexMucronataData,
  IpomopsisAggregataData,
  IrisSetosaData,
  JuglansMicrocarpaData,
  JuniperusCalifornicaData,
  KalmiaAngustifoliaData,
  KalmiaLatifoliaData,
  LaporteaCanadensisData,
  LarixLaricinaData,
  LedumGroenlandicumData,
  LeersiaOryzoidesData,
  LeersiaVirginicaData,
  LeptochloaDubiaData,
  LespedezaHirtaData,
  LeucophyllumFrutescensData,
  LiatrisAsperaData,
  LiatrisPunctataData,
  LiatrisPycnostachyaData,
  LiatrisSpicataData,
  LinderaBenzoinData,
  LinumLewisiiData,
  LippiaAlbaData,
  LiriodendronTulipiferaData,
  LobeliaCardinalisData,
  LoniceraSempervirensData,
  LotusScopariusData,
  LupinusNootkatensisData,
  LupinusPerennisData,
  LupinusTexensisData,
  MachaerantheraTanacetifoliaData,
  MagnoliaVirginianaData,
  MalpighiaGlabraData,
  ManfredaMaculosaData,
  MaurandellaAntirrhinifloraData,
  MentzeliaMultifloraData,
  MertensiaCiliataData,
  MertensiaPaniculataData,
  MertensiaVirginicaData,
  MimulusRingensData,
  MimulusRingensVarRingensData,
  MonardaCitriodoraData,
  MonardaFistulosaData,
  MonardellaOdoratissimaData,
  MonardellaVillosaData,
  MorellaCalifornicaData,
  MorellaCeriferaData,
  MorellaPensylvanicaData,
  MuhlenbergiaEmersleyiData,
  NolinaTexanaData,
  OenotheraCaespitosaData,
  OenotheraFruticosaData,
  OenotheraSpeciosaData,
  OligoneuronRigidumData,
  OxytropisCampestrisData,
  PackeraAureaData,
  PaspalumDistichumData,
  PassifloraAffinisData,
  PenstemonData,
  PenstemonAlbidusData,
  PenstemonDigitalisData,
  PenstemonGrandiflorusData,
  PenstemonLaevigatusData,
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
  SassafrasAlbidumData,
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
  SphaeralceaData,
  SphaeralceaMunroanaData,
  SymphyotrichumEricoidesData,
  SymphyotrichumLaeveData,
  SymphyotrichumNovaeAngliaeData,
  SymphyotrichumSubspicatumData,
  ThelespermaMegapotamicumData,
  TradescantiaOccidentalisData,
  TradescantiaOhiensisData,
  TrifoliumRepensData,
  UlmusAmericanaData,
  VerbenaHastataData,
  VerbesinaEncelioidesData,
  VernoniaGiganteaData,
  ViolaSororiaData,
  YuccaData,
  YuccaGlaucaData,
  ZinniaGrandifloraData,
  ZiziaAureaData,
] as Plant[];
