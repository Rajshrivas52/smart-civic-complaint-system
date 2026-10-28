"""
Complaint Text Classifier Model
Implements TF-IDF feature extraction combined with Logistic Regression
for multi-class municipal complaint category classification.
"""

import os
import re
import logging
from typing import Dict, List, Tuple, Any, Optional

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

logger = logging.getLogger("civic-ai.classifier")

# Canonical categories aligned with Civic Complaint System
CATEGORIES: List[str] = [
    "Road Damage",
    "Garbage",
    "Streetlight",
    "Water",
    "Drainage",
    "Traffic",
    "Environment",
    "Other"
]

# Comprehensive pre-built training dataset tailored for Indian municipal context (Gwalior, MP)
BUILTIN_TRAINING_DATA: List[Tuple[str, str]] = [
    # ==========================================
    # 1. Road Damage (30 examples)
    # ==========================================
    ("Large pothole near main market causing accidents and tyre damage", "Road Damage"),
    ("Deep crater in the middle of Thatipur main road causing two-wheelers to slip", "Road Damage"),
    ("Road surface completely eroded and asphalt washed away after monsoon rains", "Road Damage"),
    ("Broken divider on Railway Road near railway station is dangerous for cars", "Road Damage"),
    ("Dangerous cave-in on the flyover near Lashkar creating huge traffic hazard", "Road Damage"),
    ("Footpath paver blocks broken and missing outside Government College", "Road Damage"),
    ("Unauthorized speed breaker installed without warning signs or white paint", "Road Damage"),
    ("Tar and bitumen melting and peeling off on Morar link road", "Road Damage"),
    ("Huge pothole filled with rain water hiding depth on Hazira highway", "Road Damage"),
    ("Loose gravel and stones scattered on the street causing bike skidding", "Road Damage"),
    ("Concrete road has cracked into multiple slabs near Phool Bagh crossing", "Road Damage"),
    ("Road digging work done by telecom company left unfilled and uncovered", "Road Damage"),
    ("Large trench dug for cable line left open on colony road without barricade", "Road Damage"),
    ("Sharp edge road depression causing severe vehicle suspension damage", "Road Damage"),
    ("Entire stretch of Gola Ka Mandir road is full of severe potholes", "Road Damage"),
    ("Footpath encroachment and broken slabs making it impossible for pedestrians to walk", "Road Damage"),
    ("Sunken road section near bus stop creates massive risk of rollover", "Road Damage"),
    ("Main road divider broken and iron rebar sticking out dangerously", "Road Damage"),
    ("Sadak completely damaged, big potholes every ten meters in ward 14", "Road Damage"),
    ("Uneven road surface after poor quality patch repair work", "Road Damage"),
    ("Speed breaker damaged and concrete broken with sharp iron rod exposed", "Road Damage"),
    ("Road widening left incomplete with sharp drop on the road edge", "Road Damage"),
    ("Kerb stones broken and lying haphazardly on the carriageway", "Road Damage"),
    ("Pothole repaired last week has cracked open again due to substandard material", "Road Damage"),
    ("Subway pedestrian walkway tiles broken and ceiling plaster falling", "Road Damage"),
    ("Service road beside national highway full of craters and dust", "Road Damage"),
    ("Road collapsed into side ditch after heavy rainfall in Thatipur sector 3", "Road Damage"),
    ("Construction contractor left gravel heaps on the active driving lane", "Road Damage"),
    ("Deep trench left open across the colony street without warning tape", "Road Damage"),
    ("Asphalt road completely disintegrating into sand and rubble", "Road Damage"),

    # ==========================================
    # 2. Garbage (30 examples)
    # ==========================================
    ("Garbage piling up near residential colony for weeks without clearance", "Garbage"),
    ("Community dustbin overflowing with rotten food waste spilling onto street", "Garbage"),
    ("Nagar Nigam kachra gadi has not visited our mohalla for four consecutive days", "Garbage"),
    ("Open garbage dump yard behind market attracting stray dogs and cattle", "Garbage"),
    ("Illegal dumping of construction debris and malba on empty government plot", "Garbage"),
    ("Dead stray dog lying on roadside decomposing and spreading unbearable foul smell", "Garbage"),
    ("Plastic waste, polythene bags, and bottles littered all across public park", "Garbage"),
    ("Sanitation workers swept street dust and left heaps right outside our gate", "Garbage"),
    ("Municipal dumper container broken and trash spreading over the road", "Garbage"),
    ("Biomedical waste and used syringes dumped openly near private clinic", "Garbage"),
    ("Commercial waste from banquet hall dumped in neighborhood open space", "Garbage"),
    ("Rotten vegetable and fruit waste discarded on footpath near sabzi mandi", "Garbage"),
    ("Nagar palika garbage collection van driver skipping interior colony streets", "Garbage"),
    ("Kachra peti overflowing with toxic smell making it impossible to breathe", "Garbage"),
    ("Fish market offal and poultry slaughterhouse waste dumped by roadside", "Garbage"),
    ("Sanitary napkins and dirty diapers dumped openly near school boundary wall", "Garbage"),
    ("Litter bins installed along heritage street are overflowing and damaged", "Garbage"),
    ("Bulk waste generated by weekly haat bazaar left uncleared on ground", "Garbage"),
    ("No regular sweeping in our ward for past two weeks, dust and plastic everywhere", "Garbage"),
    ("Fly tipping of industrial plastic scraps on vacant plot near highway", "Garbage"),
    ("Municipal waste bin placed right in front of residence gate blocking entrance", "Garbage"),
    ("Green waste and tree branches dumped on sidewalk after pruning", "Garbage"),
    ("Kachra gadi siren rings but collector leaves before residents can bring bins", "Garbage"),
    ("Stinking heap of wet domestic garbage attracting swarms of flies and mosquitoes", "Garbage"),
    ("Heavy construction concrete waste dumped overnight on pedestrian footpath", "Garbage"),
    ("Littering and beverage cups thrown all around historical monument park", "Garbage"),
    ("Community dustbin missing, people throwing garbage heaps on street corner", "Garbage"),
    ("Food packaging and plastic plates dumped outside community hall after wedding", "Garbage"),
    ("Unsegregated medical waste dumped in regular municipal bin", "Garbage"),
    ("Solid waste management workers not collecting door to door dry waste", "Garbage"),

    # ==========================================
    # 3. Streetlight (30 examples)
    # ==========================================
    ("Streetlight not working on MG Road since last month causing complete darkness", "Streetlight"),
    ("High mast light at Phool Bagh intersection is completely dead", "Streetlight"),
    ("Streetlights on pole 14 to 22 in Thatipur colony are fused and dark", "Streetlight"),
    ("Sodium vapor street lamp blinking continuously causing headache and visibility issues", "Streetlight"),
    ("Electric pole leaning dangerously towards residential house after storm", "Streetlight"),
    ("Underground wiring short circuit caused all streetlights in sector B to fail", "Streetlight"),
    ("Dark street at night making the area unsafe for women and pedestrians", "Streetlight"),
    ("Street light fixture broken and dangling by wire from the top of the pole", "Streetlight"),
    ("Timer switch faulty, streetlights remain on during broad daylight and shut off at night", "Streetlight"),
    ("Streetlight pole has exposed live electrical junction box at pedestrian height", "Streetlight"),
    ("Solar powered street light battery stolen, light not illuminating", "Streetlight"),
    ("Dim yellow lamp on corner pole provides almost zero visibility at turning", "Streetlight"),
    ("All streetlights along Lashkar railway station road switched off for 3 nights", "Streetlight"),
    ("Bijli ka khamba broken by heavy truck collision and resting on overhead cables", "Streetlight"),
    ("LED streetlight flickering and sparking during drizzle, fire risk", "Streetlight"),
    ("No street light installed on newly developed colony road, pitch dark at night", "Streetlight"),
    ("High mast tower light at city center sports complex fused since one week", "Streetlight"),
    ("Decorative pole lamps in heritage square shattered and non functional", "Streetlight"),
    ("Short circuit in electric pole sparking whenever rain starts", "Streetlight"),
    ("Streetlight control panel box unlocked with dangerous open wires exposed", "Streetlight"),
    ("Street lights turn off abruptly at 9 PM when traffic is highest", "Streetlight"),
    ("Tree branches covering streetlight bulb completely blocking illumination on road", "Streetlight"),
    ("Streetlight pole rusted at base and likely to fall on parked vehicles", "Streetlight"),
    ("Entire lane streetlights dead, multiple chain snatching attempts reported in dark", "Streetlight"),
    ("Replacement bulb needed for municipal street light pole number 42", "Streetlight"),
    ("Light pole base submerged in water with risk of electric current leakage", "Streetlight"),
    ("Automatic day night sensor for street lamps broken and needs repair", "Streetlight"),
    ("Street lights on riverfront promenade completely shut down", "Streetlight"),
    ("Overhead lighting on flyover dead, driving at night is extremely dangerous", "Streetlight"),
    ("Single working light bulb in colony lane fused yesterday, now total darkness", "Streetlight"),

    # ==========================================
    # 4. Water (30 examples)
    # ==========================================
    ("Water pipeline burst flooding the entire street and wasting potable water", "Water"),
    ("Municipal tap water supply is extremely dirty, muddy and yellowish in color", "Water"),
    ("Drinking water has foul sewage smell coming from tap in Morar area", "Water"),
    ("Extremely low water pressure in colony, water does not reach first floor", "Water"),
    ("Nagar Nigam water tanker failed to arrive as per weekly scheduled time", "Water"),
    ("Drinking water supply cut off without notice for three consecutive days", "Water"),
    ("Underground main water supply pipe leakage creating water stagnation and loss", "Water"),
    ("Public drinking water tap leaking continuously, thousands of liters lost daily", "Water"),
    ("Contaminated water supply causing diarrhea and stomach infections among residents", "Water"),
    ("Community water standpost faucet valve broken and water spraying continuously", "Water"),
    ("Deep tube well motor burnt out, entire mohalla without borewell water supply", "Water"),
    ("Drinking water pipeline damaged during road digging work by contractor", "Water"),
    ("Municipal booster pump non operational leaving high elevation houses without water", "Water"),
    ("Salty brackish water coming from municipal tap instead of freshwater supply", "Water"),
    ("Water supply timing erratic, releasing water at 2 AM for only 15 minutes", "Water"),
    ("Broken pipe joint at water distribution junction leaking into storm drain", "Water"),
    ("Overhead water storage tank overflowing continuously due to broken float valve", "Water"),
    ("Mud and worms visible in municipal drinking water sample in ward 8", "Water"),
    ("Illegal motor pumps installed by neighbors sucking all water pressure from main line", "Water"),
    ("Community RO water purification plant at railway bus stand out of order", "Water"),
    ("Water meter damaged and leaking clean drinking water on property boundary", "Water"),
    ("Severe drinking water shortage in Thatipur housing board scheme", "Water"),
    ("Water distribution valve jammed, half of the colony receiving zero water", "Water"),
    ("Old rusted iron water pipes contaminating municipal water supply with rust", "Water"),
    ("Request for emergency water tanker due to marriage function in colony", "Water"),
    ("Municipal water pipe leaking underneath road causing road base erosion", "Water"),
    ("Clean water line intermixing with underground drainage line, water smells like sewage", "Water"),
    ("Public hand pump broken and handle detached in rural outskirts of Gwalior", "Water"),
    ("Main valve near reservoir damaged, water gushing out like a fountain", "Water"),
    ("No water supply for 48 hours in Lashkar commercial market zone", "Water"),

    # ==========================================
    # 5. Drainage (30 examples)
    # ==========================================
    ("Sewage overflow from open drain near school creating health hazard", "Drainage"),
    ("Open manhole cover missing on busy street, extreme fatal trap for commuters", "Drainage"),
    ("Blocked storm drainage causing severe water logging on residential road", "Drainage"),
    ("Gutter overflowing with black foul smelling sewage into house premises", "Drainage"),
    ("Nala desilting not done before monsoon, rainwater entering shops and houses", "Drainage"),
    ("Sewer line completely choked with silt and polythene in Thatipur ward 12", "Drainage"),
    ("Broken concrete slab over stormwater drain collapsed under car wheel", "Drainage"),
    ("Stagnant sewage water in open drain breeding mosquitoes causing dengue outbreak", "Drainage"),
    ("Underground sewer backflow filling ground floor bathrooms with dirty water", "Drainage"),
    ("Stormwater drain clogged with plastic garbage causing flash flood after 30 min rain", "Drainage"),
    ("Manhole lid broken and sunken three inches below road surface", "Drainage"),
    ("Sanitary sewer pipe cracked leaking raw sewage into roadside ditch", "Drainage"),
    ("Open nala wall collapsed, wastewater eroding foundation of nearby boundary walls", "Drainage"),
    ("Heavy silting in main sewage trunk line causing blockages across entire sector", "Drainage"),
    ("Foul septic odor escaping from uncovered sewer chamber on street corner", "Drainage"),
    ("Rainwater catch basin grated cover stolen, leaves large open hole in gutter", "Drainage"),
    ("Sewage suction jetting machine required urgently to clear deep sewer choke", "Drainage"),
    ("Open drainage channel filled with garbage scum and sludge in Hazira market", "Drainage"),
    ("Drainage line reverse gradient causing sewage water to stay stagnant permanently", "Drainage"),
    ("Broken culvert over village nala preventing vehicular crossing during rain", "Drainage"),
    ("Choked roadside drains causing muddy water accumulation near temple entrance", "Drainage"),
    ("Manhole cover replaced with loose plywood instead of heavy cast iron lid", "Drainage"),
    ("Industrial effluent discharged directly into open municipal storm drain", "Drainage"),
    ("Waterlogging knee deep on Lashkar main road due to non-functional drain network", "Drainage"),
    ("Sewer chamber overflowing onto pavement right outside clinic entrance", "Drainage"),
    ("Drain cleaning workers removed silt from nala and left it drying on the road", "Drainage"),
    ("Sewage pipe disconnected during building construction, spilling waste openly", "Drainage"),
    ("Drain outlet into river blocked by sandbags and weeds", "Drainage"),
    ("Submerged open manhole in waterlogged street near railway colony", "Drainage"),
    ("Overflowing drainage water entering kitchen and living room of ground floor flats", "Drainage"),

    # ==========================================
    # 6. Traffic (30 examples)
    # ==========================================
    ("Traffic signal malfunctioning at major intersection showing conflicting lights", "Traffic"),
    ("Severe traffic jam due to illegal auto rickshaw parking near bus terminal", "Traffic"),
    ("Missing zebra crossing and pedestrian crossing signals near high school", "Traffic"),
    ("Blind turn on Lashkar hillside road lacks convex safety mirror causing collisions", "Traffic"),
    ("Wrong side driving rampant on Gola Ka Mandir highway stretch without police", "Traffic"),
    ("Traffic light countdown timer countdown stuck at zero at busy junction", "Traffic"),
    ("Unauthorized taxi and cab stand blocking entire left turning lane", "Traffic"),
    ("Commercial delivery trucks parked illegally loading unloading during peak office hours", "Traffic"),
    ("No traffic police personnel deployed at congested railway station roundabout", "Traffic"),
    ("Overcrowded tempo autos stopping abruptly in middle of road for passengers", "Traffic"),
    ("Traffic diversion board missing, vehicles entering closed flyover lane", "Traffic"),
    ("Severe gridlock at Thatipur four-way crossroad during evening rush hour", "Traffic"),
    ("Lack of speed restriction boards near hospital silence zone", "Traffic"),
    ("Traffic signal red light timing too long (180s) causing kilometer long queue", "Traffic"),
    ("Illegal street parking on both sides of narrow commercial market road", "Traffic"),
    ("Buses stopping outside designated bus bays blocking main carriageway", "Traffic"),
    ("Reckless speeding and stunt driving on VIP circuit road at night", "Traffic"),
    ("School vans and buses causing massive bottleneck during morning drop off", "Traffic"),
    ("Vehicles driving on footpath to bypass traffic jam at toll plaza", "Traffic"),
    ("Traffic lights completely turned off during heavy thunderstorm causing gridlock", "Traffic"),
    ("Missing road signage for one-way street leading to head-on collision risks", "Traffic"),
    ("Auto rickshaws creating permanent chaotic bottleneck outside city court gate", "Traffic"),
    ("Traffic bottleneck due to unmanaged U-turn cut on express bypass", "Traffic"),
    ("Heavy multi-axle trucks entering city limits during no-entry peak hours", "Traffic"),
    ("Non functioning pedestrian walk button at busy signal crossing", "Traffic"),
    ("Road divider cut created illegally by shopkeepers to allow illegal two-wheeler U-turns", "Traffic"),
    ("Traffic jam extending two kilometers on Phool Bagh corridor due to broken down bus", "Traffic"),
    ("Lack of reflective safety studs (cat eyes) on unlit sharp highway bend", "Traffic"),
    ("Chaotic vehicle parking outside coaching institutes blocking colony passage", "Traffic"),
    ("Traffic lights flashing amber continuously at critical busy four-way junction", "Traffic"),

    # ==========================================
    # 7. Environment (30 examples)
    # ==========================================
    ("Illegal tree cutting in public park area by private builder", "Environment"),
    ("Open burning of dry leaves and plastic waste causing toxic smoke and breathing issues", "Environment"),
    ("High decibel loudspeakers playing loudly past midnight violating noise pollution rules", "Environment"),
    ("Chemical waste and toxic effluent dumping into local water pond killing fish", "Environment"),
    ("Public municipal park trees and lawn dying due to total lack of watering and care", "Environment"),
    ("Excessive air pollution and thick dust clouds caused by uncovered construction site", "Environment"),
    ("Illegal chopping of ancient banyan tree on roadside without municipal forest permit", "Environment"),
    ("Factory emitting thick black sulfurous smoke in residential neighborhood", "Environment"),
    ("Green belt boundary encroached by unauthorized sheds and commercial parking", "Environment"),
    ("Stone crushing and cement mixing operation running without dust suppression filters", "Environment"),
    ("Garbage burnt inside community park by municipal sweepers, heavy smoke", "Environment"),
    ("Fountain and sprinkler system in public memorial park dry and broken for months", "Environment"),
    ("Children swings and park benches broken and vandalized in ward 5 green park", "Environment"),
    ("Untreated sewage water pumped directly into riverbed destroying aquatic life", "Environment"),
    ("Heavy noise pollution from wedding band generators and loud sound systems after 11 PM", "Environment"),
    ("Felling of green neem trees along avenue for advertising hoarding visibility", "Environment"),
    ("Dense weed and congress grass overgrowth in public park attracting snakes", "Environment"),
    ("Groundwater contamination from open battery recycling workshop in colony", "Environment"),
    ("Illegal sand mining trucks kicking up heavy dust clouds along riverbank road", "Environment"),
    ("Air quality index extremely poor near industrial area due to open tire burning", "Environment"),
    ("Public garden walking track completely unmaintained and covered in thorns", "Environment"),
    ("Commercial diesel generator running without acoustic enclosure causing deafening noise", "Environment"),
    ("Dumping of hazardous chemical containers in vacant municipal land", "Environment"),
    ("Tree branches touching electric wire need scientific pruning not tree cutting", "Environment"),
    ("Illegal borewell drilling depleting neighborhood groundwater table", "Environment"),
    ("Plastic manufacturing unit releasing toxic fumes during night hours in colony", "Environment"),
    ("Open burning of domestic garbage at municipal transit ground causing smog", "Environment"),
    ("Park boundary fencing stolen, cattle grazing and ruining ornamental garden flowers", "Environment"),
    ("Toxic pesticides sprayed near residential homes without prior public notice", "Environment"),
    ("Historical water stepwell (baori) polluted with plastics and worship waste", "Environment"),

    # ==========================================
    # 8. Other (30 examples)
    # ==========================================
    ("Stray cattle and cows roaming on main highway causing accidents and traffic stoppage", "Other"),
    ("Pack of aggressive stray dogs chasing two-wheelers and biting pedestrians at night", "Other"),
    ("Public toilet complex locked and out of service, no running water inside", "Other"),
    ("Illegal giant commercial hoardings erected without municipal safety stability permit", "Other"),
    ("Hawkers and street vendor carts encroaching public sidewalk leaving zero walkway", "Other"),
    ("Municipal death and birth certificate application pending without update for 60 days", "Other"),
    ("Stray bulls fighting in crowded market injuring shoppers and damaging shop stalls", "Other"),
    ("Dilapidated abandoned building in danger of collapse endangering neighboring houses", "Other"),
    ("Beggar menace and harassment at red light signals and tourist monuments", "Other"),
    ("Public library reading room air conditioner and fans not working in peak summer", "Other"),
    ("Unauthorized weekly vegetable market setup on residential colony main street", "Other"),
    ("Monkeys attacking residents on rooftop and damaging water pipes and cables", "Other"),
    ("Commercial shop owner installed permanent iron ramp covering public footpath", "Other"),
    ("Overcharging and rude behavior by municipal pay-and-park parking attendants", "Other"),
    ("Illegal slaughterhouse operating in residential area without municipal license", "Other"),
    ("Government community hall booking canceled without refund by local ward office", "Other"),
    ("Substandard food quality and hygiene at municipal market canteen", "Other"),
    ("Graffiti and obscene wall paintings on government school boundary wall", "Other"),
    ("Property tax assessment notice showing wrong square footage and inflated amount", "Other"),
    ("Unauthorized mobile phone tower installed on residential terrace without NOC", "Other"),
    ("Public bus shelter damaged with roof sheets blown away, commuters standing in rain", "Other"),
    ("Dog menace in Thatipur park preventing elderly citizens from morning walks", "Other"),
    ("Missing street name boards and house numbering plates in newly developed sector", "Other"),
    ("Municipal cremation ground wood supply exhausted and shed roof leaking", "Other"),
    ("Encroachment of government land by building permanent boundary wall", "Other"),
    ("Citizens helpline phone number ringing continuously without response from staff", "Other"),
    ("Gym equipment installed in open municipal park broken and jammed with rust", "Other"),
    ("Unauthorized alcohol drinking and anti-social elements gathering in dark alley", "Other"),
    ("E-rickshaws charging arbitrary exorbitant fares without rate chart display", "Other"),
    ("Ward councillor office locked during public grievance redressal working hours", "Other")
]


def clean_text(text: str) -> str:
    """
    Clean and normalize complaint text for NLP processing.
    """
    if not text:
        return ""
    # Lowercase
    cleaned = text.lower().strip()
    # Normalize spaces
    cleaned = re.sub(r"\s+", " ", cleaned)
    # Remove special control characters but keep alphanumeric and basic punctuation
    cleaned = re.sub(r"[^\w\s\-\.,\']", " ", cleaned)
    return cleaned.strip()


class ComplaintClassifier:
    """
    Text classification engine for municipal complaints using TF-IDF + Logistic Regression.
    """

    def __init__(self, model_file: Optional[str] = None):
        self.model_file: Optional[str] = model_file
        self.pipeline: Optional[Pipeline] = None
        self.is_trained: bool = False
        self.classes_: List[str] = CATEGORIES
        self.training_sample_count: int = len(BUILTIN_TRAINING_DATA)

    def _build_pipeline(self) -> Pipeline:
        """
        Build scikit-learn TF-IDF + Logistic Regression pipeline.
        """
        return Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                stop_words="english",
                sublinear_tf=True,
                max_features=5000,
                min_df=1
            )),
            ("clf", LogisticRegression(
                C=1.5,
                max_iter=1000,
                class_weight="balanced",
                random_state=42
            ))
        ])

    def train(
        self,
        texts: Optional[List[str]] = None,
        labels: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Train the classifier on provided data or default built-in dataset.
        """
        if texts is None or labels is None:
            train_texts = [clean_text(item[0]) for item in BUILTIN_TRAINING_DATA]
            train_labels = [item[1] for item in BUILTIN_TRAINING_DATA]
        else:
            train_texts = [clean_text(t) for t in texts]
            train_labels = labels

        self.pipeline = self._build_pipeline()
        self.pipeline.fit(train_texts, train_labels)
        self.classes_ = list(self.pipeline.classes_)
        self.is_trained = True
        self.training_sample_count = len(train_texts)

        logger.info(
            "Trained ComplaintClassifier with %d samples across %d categories: %s",
            len(train_texts),
            len(self.classes_),
            self.classes_
        )

        return {
            "samples": len(train_texts),
            "categories": self.classes_,
            "status": "trained"
        }

    def predict(self, text: str) -> Dict[str, Any]:
        """
        Predict category, confidence score, and all class probabilities for input text.
        """
        if not self.is_trained or self.pipeline is None:
            # Auto-train if not yet trained
            self.train()

        cleaned = clean_text(text)
        if not cleaned:
            return {
                "category": "Other",
                "confidence": 0.5,
                "all_probabilities": {cat: round(1.0 / len(CATEGORIES), 4) for cat in CATEGORIES}
            }

        probs = self.pipeline.predict_proba([cleaned])[0]
        classes = self.pipeline.classes_

        # Map class name to float probability
        prob_dict = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(classes, probs)
        }

        # Ensure all official categories are represented
        for cat in CATEGORIES:
            if cat not in prob_dict:
                prob_dict[cat] = 0.0

        top_idx = int(probs.argmax())
        top_category = str(classes[top_idx])
        top_confidence = round(float(probs[top_idx]), 4)

        return {
            "category": top_category,
            "confidence": top_confidence,
            "all_probabilities": prob_dict
        }

    def save(self, path: Optional[str] = None) -> str:
        """
        Serialize model and configuration to disk.
        """
        save_path = path or self.model_file
        if not save_path:
            raise ValueError("No model path provided to save()")

        if not self.is_trained or self.pipeline is None:
            self.train()

        os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
        payload = {
            "pipeline": self.pipeline,
            "classes": self.classes_,
            "training_sample_count": self.training_sample_count,
            "version": "1.0.0"
        }
        joblib.dump(payload, save_path)
        logger.info("Saved ComplaintClassifier model to: %s", save_path)
        return save_path

    def load(self, path: Optional[str] = None) -> bool:
        """
        Load serialized model from disk. Returns True if loaded, False if file doesn't exist.
        """
        target_path = path or self.model_file
        if not target_path or not os.path.exists(target_path):
            logger.warning("Model file not found at %s. Model needs training.", target_path)
            return False

        try:
            payload = joblib.load(target_path)
            self.pipeline = payload["pipeline"]
            self.classes_ = payload.get("classes", CATEGORIES)
            self.training_sample_count = payload.get("training_sample_count", len(BUILTIN_TRAINING_DATA))
            self.is_trained = True
            logger.info("Successfully loaded ComplaintClassifier model from: %s", target_path)
            return True
        except Exception as exc:
            logger.error("Failed to load model from %s: %s", target_path, exc)
            return False
