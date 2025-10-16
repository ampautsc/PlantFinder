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
import PassifloraFoetidaData from './passiflora-foetida.json';
import PassifloraIncarnataData from './passiflora-incarnata.json';
import PassifloraLuteaData from './passiflora-lutea.json';
import PassifloraTenuilobaData from './passiflora-tenuiloba.json';
import PanicumObtusumData from './panicum-obtusum.json';
import PanicumVirgatumData from './panicum-virgatum.json';
import ParthenocissusQuinquefoliaData from './parthenocissus-quinquefolia.json';
import PenstemonData from './penstemon.json';
import PenstemonAlbidusData from './penstemon-albidus.json';
import PenstemonDigitalisData from './penstemon-digitalis.json';
import PenstemonGrandiflorusData from './penstemon-grandiflorus.json';
import PenstemonLaevigatusData from './penstemon-laevigatus.json';
import PenstemonCobaeaData from './penstemon-cobaea.json';
import PenstemonHirsutusData from './penstemon-hirsutus.json';
import PeritomaSerrulataData from './peritoma-serrulata.json';
import PerseaBorboniaData from './persea-borbonia.json';
import PhaceliaLinearisData from './phacelia-linearis.json';
import PhalarisArundinaceaData from './phalaris-arundinacea.json';
import PhragmitesAustralisData from './phragmites-australis.json';
import PhylaNodifloraData from './phyla-nodiflora.json';
import PhiladelphusLewisiiData from './philadelphus-lewisii.json';
import PhloxPaniculataData from './phlox-paniculata.json';
import PiceaGlaucaData from './picea-glauca.json';
import PiceaMarianaData from './picea-mariana.json';
import PinusContortaData from './pinus-contorta.json';
import PinusContortaLatifoliaData from './pinus-contorta-latifolia.json';
import PinusMonophyllaData from './pinus-monophylla.json';
import PinusPonderosaData from './pinus-ponderosa.json';
import PinusResinosaData from './pinus-resinosa.json';
import PinusRigidaData from './pinus-rigida.json';
import PinusTaedaData from './pinus-taeda.json';
import PinusVirginianaData from './pinus-virginiana.json';
import PiscidiaPiscipulaData from './piscidia-piscipula.json';
import PoaGlaucaGlaucaData from './poa-glauca-glauca.json';
import PoaPratensisData from './poa-pratensis.json';
import PolemoniumAcutiflorumData from './polemonium-acutiflorum.json';
import PolygonumBistortoidesData from './polygonum-bistortoides.json';
import PolygonumViviparumData from './polygonum-viviparum.json';
import PolytaeniaTexanaData from './polytaenia-texana.json';
import PopulusBalsamiferaData from './populus-balsamifera.json';
import PopulusDeltoidesData from './populus-deltoides.json';
import PopulusDeltoidesDeltoidesData from './populus-deltoides-deltoides.json';
import PopulusGrandidentataData from './populus-grandidentata.json';
import PopulusTremuloidesData from './populus-tremuloides.json';
import PotentillaCanadensisData from './potentilla-canadensis.json';
import PrimulaPaucifloraData from './primula-pauciflora.json';
import ProsopisGlandulosaData from './prosopis-glandulosa.json';
import PrunusEmarginataData from './prunus-emarginata.json';
import PrunusHavardiiData from './prunus-havardii.json';
import PrunusPensylvanicaData from './prunus-pensylvanica.json';
import PrunusSerotinaData from './prunus-serotina.json';
import PrunusSerotinaSerotinaData from './prunus-serotina-serotina.json';
import PrunusVirginianaData from './prunus-virginiana.json';
import PrunusVirginianaVirginianaData from './prunus-virginiana-virginiana.json';
import PseudognaphaliumObtusifoliumObtusifoliumData from './pseudognaphalium-obtusifolium-obtusifolium.json';
import PseudotsugaMenziesiiData from './pseudotsuga-menziesii.json';
import PseudotsugaMenziesiiMenziesiiData from './pseudotsuga-menziesii-menziesii.json';
import PteleaTrifoliataData from './ptelea-trifoliata.json';
import PulsatillaPatensData from './pulsatilla-patens.json';
import PycnanthemumTenuifoliumData from './pycnanthemum-tenuifolium.json';
import QuercusAgrifoliaData from './quercus-agrifolia.json';
import QuercusArizonicaData from './quercus-arizonica.json';
import QuercusChrysolepisData from './quercus-chrysolepis.json';
import QuercusEmoryiData from './quercus-emoryi.json';
import QuercusFusiformisData from './quercus-fusiformis.json';
import QuercusGambeliiData from './quercus-gambelii.json';
import QuercusIlicifoliaData from './quercus-ilicifolia.json';
import QuercusMuehlenbergiiData from './quercus-muehlenbergii.json';
import QuercusPalustrisData from './quercus-palustris.json';
import QuercusRubraData from './quercus-rubra.json';
import QuercusRubraAmbiguaData from './quercus-rubra-ambigua.json';
import QuercusVirginianaData from './quercus-virginiana.json';
import RatibidaColumniferaData from './ratibida-columnifera.json';
import RatibidaPinnataData from './ratibida-pinnata.json';
import RhamnusAlnifoliaData from './rhamnus-alnifolia.json';
import RhamnusCroceaData from './rhamnus-crocea.json';
import RhizophoraMangleData from './rhizophora-mangle.json';
import RhododendronCanadenseData from './rhododendron-canadense.json';
import RhododendronOccidentaleData from './rhododendron-occidentale.json';
import RhusAromaticaData from './rhus-aromatica.json';
import RhusLanceolataData from './rhus-lanceolata.json';
import RibesCereumData from './ribes-cereum.json';
import RibesSanguineumData from './ribes-sanguineum.json';
import RobiniaNeomexicanaData from './robinia-neomexicana.json';
import RosaNutkanaData from './rosa-nutkana.json';
import RubusParviflorusData from './rubus-parviflorus.json';
import RudbeckiaFulgidaData from './rudbeckia-fulgida.json';
import RudbeckiaHirtaData from './rudbeckia-hirta.json';
import RudbeckiaHirtaPulcherrimaData from './rudbeckia-hirta-pulcherrima.json';
import RudbeckiaOccidentalisData from './rudbeckia-occidentalis.json';
import RuelliaDrummondianaData from './ruellia-drummondiana.json';
import RuelliaNudifloraData from './ruellia-nudiflora.json';
import SalixData from './salix.json';
import SalixAmygdaloidesData from './salix-amygdaloides.json';
import SalixArcticaData from './salix-arctica.json';
import SalixBebbianaData from './salix-bebbiana.json';
import SalixDiscolorData from './salix-discolor.json';
import SalixEriocephalaData from './salix-eriocephala.json';
import SalixExiguaData from './salix-exigua.json';
import SalixHumilisData from './salix-humilis.json';
import SalixLucidaData from './salix-lucida.json';
import SalixNigraData from './salix-nigra.json';
import SalixReticulataData from './salix-reticulata.json';
import SalixSericeaData from './salix-sericea.json';
import SalviaDorriiData from './salvia-dorrii.json';
import SanguinariaCanadensisData from './sanguinaria-canadensis.json';
import SapindusSaponariaData from './sapindus-saponaria.json';
import SapindusSaponariaDrummondiiData from './sapindus-saponaria-drummondii.json';
import SassafrasAlbidumData from './sassafras-albidum.json';
import SaxifragaBronchialisData from './saxifraga-bronchialis.json';
import SchizachnePurpurascensData from './schizachne-purpurascens.json';
import SchizachyriumScopariumData from './schizachyrium-scoparium.json';
import ScirpusCyperinusData from './scirpus-cyperinus.json';
import SenegaliaBerlandieriData from './senegalia-berlandieri.json';
import SenecioFlaccidusData from './senecio-flaccidus.json';
import SennaHebecarpaData from './senna-hebecarpa.json';
import SennaLindheimerianaData from './senna-lindheimeriana.json';
import SerenoaRepensData from './serenoa-repens.json';
import SidaRhombifoliaData from './sida-rhombifolia.json';
import SolidagoAltissimaData from './solidago-altissima.json';
import SolidagoCanadensisData from './solidago-canadensis.json';
import SolidagoElongataData from './solidago-elongata.json';
import SolidagoMultiradiataData from './solidago-multiradiata.json';
import SolidagoNemoralisData from './solidago-nemoralis.json';
import SolidagoOdoraData from './solidago-odora.json';
import SolidagoRigidaData from './solidago-rigida.json';
import SolidagoRugosaData from './solidago-rugosa.json';
import SolidagoSpeciosaData from './solidago-speciosa.json';
import SorghastrumNutansData from './sorghastrum-nutans.json';
import SpartinaAlternifloraData from './spartina-alterniflora.json';
import SphaeralceaData from './sphaeralcea.json';
import SphaeralceaCoccineaData from './sphaeralcea-coccinea.json';
import SphaeralceaMunroanaData from './sphaeralcea-munroana.json';
import SpiraeaAlbaData from './spiraea-alba.json';
import SpiraeaTomentosaData from './spiraea-tomentosa.json';
import StenandriumBarbatumData from './stenandrium-barbatum.json';
import StylosanthesBifloraData from './stylosanthes-biflora.json';
import SurianaMaritmaData from './suriana-maritima.json';
import SymphoricarposAlbusData from './symphoricarpos-albus.json';
import SymphyotrichumCiliolatumData from './symphyotrichum-ciliolatum.json';
import SymphyotrichumEricoidesData from './symphyotrichum-ericoides.json';
import SymphyotrichumEricoidesVarEricoidesData from './symphyotrichum-ericoides-var-ericoides.json';
import SymphyotrichumLaeveData from './symphyotrichum-laeve.json';
import SymphyotrichumLaeveVarLaeveData from './symphyotrichum-laeve-var-laeve.json';
import SymphyotrichumLanceolatumVarLanceolatumData from './symphyotrichum-lanceolatum-var-lanceolatum.json';
import SymphyotrichumLateriflorumVarLateriflorumData from './symphyotrichum-lateriflorum-var-lateriflorum.json';
import SymphyotrichumNovaeAngliaeData from './symphyotrichum-novae-angliae.json';
import SymphyotrichumNoviBelgiiVarNoviBelgiiData from './symphyotrichum-novi-belgii-var-novi-belgii.json';
import SymphyotrichumSericeumData from './symphyotrichum-sericeum.json';
import SymphyotrichumSubspicatumData from './symphyotrichum-subspicatum.json';
import SymphyotrichumUndulatumData from './symphyotrichum-undulatum.json';
import TaxodiumDistichumData from './taxodium-distichum.json';
import TecomaStansData from './tecoma-stans.json';
import ThamnosmaTexanaData from './thamnosma-texana.json';
import ThelespermaMegapotamicumData from './thelesperma-megapotamicum.json';
import TradescantiaOccidentalisData from './tradescantia-occidentalis.json';
import TradescantiaOhiensisData from './tradescantia-ohiensis.json';
import TridensFlavusData from './tridens-flavus.json';
import TrifoliumRepensData from './trifolium-repens.json';
import TripsacumDactyloidesData from './tripsacum-dactyloides.json';
import TsugaCanadensisData from './tsuga-canadensis.json';
import UlmusAmericanaData from './ulmus-americana.json';
import UlmusRubraData from './ulmus-rubra.json';
import UlmusTomasiiData from './ulmus-thomasii.json';
import UrticaDioicaData from './urtica-dioica.json';
import VacciniumCespitosumData from './vaccinium-cespitosum.json';
import VacciniumMyrtilloidesData from './vaccinium-myrtilloides.json';
import VacciniumOxycoccosData from './vaccinium-oxycoccos.json';
import VacciniumUliginosumData from './vaccinium-uliginosum.json';
import VerbenaHastataData from './verbena-hastata.json';
import VerbenaSimplexData from './verbena-simplex.json';
import VerbenaStrictaData from './verbena-stricta.json';
import VerbesinaEncelioidesData from './verbesina-encelioides.json';
import VernoniaGiganteaData from './vernonia-gigantea.json';
import ViburnumAcerifoliumData from './viburnum-acerifolium.json';
import ViburnumDentatumData from './viburnum-dentatum.json';
import ViburnumLantanoidesData from './viburnum-lantanoides.json';
import ViburnumLentagoData from './viburnum-lentago.json';
import ViburnumOpulusVarAmericanumData from './viburnum-opulus-var-americanum.json';
import ViolaAduncaData from './viola-adunca.json';
import ViolaGlabellaData from './viola-glabella.json';
import ViolaNephrophyllaData from './viola-nephrophylla.json';
import ViolaNuttalliiData from './viola-nuttallii.json';
import ViolaPedataData from './viola-pedata.json';
import ViolaPurpureaData from './viola-purpurea.json';
import ViolaRotundifoliaData from './viola-rotundifolia.json';
import ViolaSororiaData from './viola-sororia.json';
import WisteriaFrutescensData from './wisteria-frutescens.json';
import YuccaData from './yucca.json';
import YuccaFilamentosaData from './yucca-filamentosa.json';
import YuccaGlaucaData from './yucca-glauca.json';
import ZamiaData from './zamia-pumila.json';
import ZanthoxylumAmericanumData from './zanthoxylum-americanum.json';
import ZanthoxylumFagaraData from './zanthoxylum-fagara.json';
import ZinniaGrandifloraData from './zinnia-grandiflora.json';
import ZizaniaAquaticaData from './zizania-aquatica.json';
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
  PassifloraFoetidaData,
  PassifloraIncarnataData,
  PassifloraLuteaData,
  PassifloraTenuilobaData,
  PanicumObtusumData,
  PanicumVirgatumData,
  ParthenocissusQuinquefoliaData,
  PenstemonData,
  PenstemonAlbidusData,
  PenstemonDigitalisData,
  PenstemonGrandiflorusData,
  PenstemonLaevigatusData,
  PenstemonCobaeaData,
  PenstemonHirsutusData,
  PeritomaSerrulataData,
  PerseaBorboniaData,
  PhaceliaLinearisData,
  PhalarisArundinaceaData,
  PhragmitesAustralisData,
  PhylaNodifloraData,
  PhiladelphusLewisiiData,
  PhloxPaniculataData,
  PiceaGlaucaData,
  PiceaMarianaData,
  PinusContortaData,
  PinusContortaLatifoliaData,
  PinusMonophyllaData,
  PinusPonderosaData,
  PinusResinosaData,
  PinusRigidaData,
  PinusTaedaData,
  PinusVirginianaData,
  PiscidiaPiscipulaData,
  PoaGlaucaGlaucaData,
  PoaPratensisData,
  PolemoniumAcutiflorumData,
  PolygonumBistortoidesData,
  PolygonumViviparumData,
  PolytaeniaTexanaData,
  PopulusBalsamiferaData,
  PopulusDeltoidesData,
  PopulusDeltoidesDeltoidesData,
  PopulusGrandidentataData,
  PopulusTremuloidesData,
  PotentillaCanadensisData,
  PrimulaPaucifloraData,
  ProsopisGlandulosaData,
  PrunusEmarginataData,
  PrunusHavardiiData,
  PrunusPensylvanicaData,
  PrunusSerotinaData,
  PrunusSerotinaSerotinaData,
  PrunusVirginianaData,
  PrunusVirginianaVirginianaData,
  PseudognaphaliumObtusifoliumObtusifoliumData,
  PseudotsugaMenziesiiData,
  PseudotsugaMenziesiiMenziesiiData,
  PteleaTrifoliataData,
  PulsatillaPatensData,
  PycnanthemumTenuifoliumData,
  QuercusAgrifoliaData,
  QuercusArizonicaData,
  QuercusChrysolepisData,
  QuercusEmoryiData,
  QuercusFusiformisData,
  QuercusGambeliiData,
  QuercusIlicifoliaData,
  QuercusMuehlenbergiiData,
  QuercusPalustrisData,
  QuercusRubraData,
  QuercusRubraAmbiguaData,
  QuercusVirginianaData,
  RatibidaColumniferaData,
  RatibidaPinnataData,
  RhamnusAlnifoliaData,
  RhamnusCroceaData,
  RhizophoraMangleData,
  RhododendronCanadenseData,
  RhododendronOccidentaleData,
  RhusAromaticaData,
  RhusLanceolataData,
  RibesCereumData,
  RibesSanguineumData,
  RobiniaNeomexicanaData,
  RosaNutkanaData,
  RubusParviflorusData,
  RudbeckiaFulgidaData,
  RudbeckiaHirtaData,
  RudbeckiaHirtaPulcherrimaData,
  RudbeckiaOccidentalisData,
  RuelliaDrummondianaData,
  RuelliaNudifloraData,
  SalixData,
  SalixAmygdaloidesData,
  SalixArcticaData,
  SalixBebbianaData,
  SalixDiscolorData,
  SalixEriocephalaData,
  SalixExiguaData,
  SalixHumilisData,
  SalixLucidaData,
  SalixNigraData,
  SalixReticulataData,
  SalixSericeaData,
  SalviaDorriiData,
  SanguinariaCanadensisData,
  SapindusSaponariaData,
  SapindusSaponariaDrummondiiData,
  SassafrasAlbidumData,
  SaxifragaBronchialisData,
  SchizachnePurpurascensData,
  SchizachyriumScopariumData,
  ScirpusCyperinusData,
  SenegaliaBerlandieriData,
  SenecioFlaccidusData,
  SennaHebecarpaData,
  SennaLindheimerianaData,
  SerenoaRepensData,
  SidaRhombifoliaData,
  SolidagoAltissimaData,
  SolidagoCanadensisData,
  SolidagoElongataData,
  SolidagoMultiradiataData,
  SolidagoNemoralisData,
  SolidagoOdoraData,
  SolidagoRigidaData,
  SolidagoRugosaData,
  SolidagoSpeciosaData,
  SorghastrumNutansData,
  SpartinaAlternifloraData,
  SphaeralceaData,
  SphaeralceaCoccineaData,
  SphaeralceaMunroanaData,
  SpiraeaAlbaData,
  SpiraeaTomentosaData,
  StenandriumBarbatumData,
  StylosanthesBifloraData,
  SurianaMaritmaData,
  SymphoricarposAlbusData,
  SymphyotrichumCiliolatumData,
  SymphyotrichumEricoidesData,
  SymphyotrichumEricoidesVarEricoidesData,
  SymphyotrichumLaeveData,
  SymphyotrichumLaeveVarLaeveData,
  SymphyotrichumLanceolatumVarLanceolatumData,
  SymphyotrichumLateriflorumVarLateriflorumData,
  SymphyotrichumNovaeAngliaeData,
  SymphyotrichumNoviBelgiiVarNoviBelgiiData,
  SymphyotrichumSericeumData,
  SymphyotrichumSubspicatumData,
  SymphyotrichumUndulatumData,
  TaxodiumDistichumData,
  TecomaStansData,
  ThamnosmaTexanaData,
  ThelespermaMegapotamicumData,
  TradescantiaOccidentalisData,
  TradescantiaOhiensisData,
  TridensFlavusData,
  TrifoliumRepensData,
  TripsacumDactyloidesData,
  TsugaCanadensisData,
  UlmusAmericanaData,
  UlmusRubraData,
  UlmusTomasiiData,
  UrticaDioicaData,
  VacciniumCespitosumData,
  VacciniumMyrtilloidesData,
  VacciniumOxycoccosData,
  VacciniumUliginosumData,
  VerbenaHastataData,
  VerbenaSimplexData,
  VerbenaStrictaData,
  VerbesinaEncelioidesData,
  VernoniaGiganteaData,
  ViburnumAcerifoliumData,
  ViburnumDentatumData,
  ViburnumLantanoidesData,
  ViburnumLentagoData,
  ViburnumOpulusVarAmericanumData,
  ViolaAduncaData,
  ViolaGlabellaData,
  ViolaNephrophyllaData,
  ViolaNuttalliiData,
  ViolaPedataData,
  ViolaPurpureaData,
  ViolaRotundifoliaData,
  ViolaSororiaData,
  WisteriaFrutescensData,
  YuccaData,
  YuccaFilamentosaData,
  YuccaGlaucaData,
  ZamiaData,
  ZanthoxylumAmericanumData,
  ZanthoxylumFagaraData,
  ZinniaGrandifloraData,
  ZizaniaAquaticaData,
  ZiziaAureaData,
] as Plant[];
