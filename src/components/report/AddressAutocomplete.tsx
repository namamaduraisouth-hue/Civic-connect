import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { validateMaduraiSouthLocation, ValidationResult } from '../../utils/geoValidation';
import { Search, MapPin, CheckCircle2, AlertTriangle, Loader2, X, Navigation } from 'lucide-react';

export interface AddressSuggestion {
  id: string;
  name_en: string;
  name_ta: string;
  full_address_en: string;
  full_address_ta: string;
  latitude: number;
  longitude: number;
  ward_id?: string;
  ward_name?: string;
}

// 60+ Curated Official Localities, Streets & Landmarks strictly inside/around Madurai South Assembly Constituency (192)
export const MADURAI_SOUTH_LOCALITIES: AddressSuggestion[] = [
  // Ward 49 Simmakkal & Meenakshi East
  {
    id: "loc-01",
    name_en: "Simmakkal Signal & North Veli Street",
    name_ta: "சிம்மக்கல் சிக்னல் & வடக்கு வெளி வீதி",
    full_address_en: "Simmakkal Signal, North Veli Street, Ward 49, Madurai South - 625001",
    full_address_ta: "சிம்மக்கல் சிக்னல், வடக்கு வெளி வீதி, வார்டு 49, மதுரை தெற்கு - 625001",
    latitude: 9.9280,
    longitude: 78.1170,
    ward_id: "WARD_49"
  },
  {
    id: "loc-02",
    name_en: "Yanaikkal Bridge Junction",
    name_ta: "யானைக்கல் பாலம் சந்திப்பு",
    full_address_en: "Yanaikkal Bridge Junction, North Veli Street, Ward 49, Madurai South - 625001",
    full_address_ta: "யானைக்கல் பாலம் சந்திப்பு, வடக்கு வெளி வீதி, வார்டு 49, மதுரை தெற்கு - 625001",
    latitude: 9.9275,
    longitude: 78.1210,
    ward_id: "WARD_49"
  },
  {
    id: "loc-03",
    name_en: "Meenakshi Amman Temple East Tower & Chithirai Street",
    name_ta: "மீனாட்சி அம்மன் கோவில் கிழக்கு கோபுரம் & சித்திரை வீதி",
    full_address_en: "East Chithirai Street, Meenakshi Temple East Gate, Ward 49, Madurai South - 625001",
    full_address_ta: "கிழக்கு சித்திரை வீதி, மீனாட்சி கோவில் கிழக்கு வாசல், வார்டு 49, மதுரை தெற்கு - 625001",
    latitude: 9.9198,
    longitude: 78.1205,
    ward_id: "WARD_49"
  },

  // Ward 50 Rajamahal Silks & Mahal Area
  {
    id: "loc-04",
    name_en: "Rajamahal Silks Junction, South Masi Street",
    name_ta: "இராஜமஹால் சில்க்ஸ் சந்திப்பு, தெற்கு மாசி வீதி",
    full_address_en: "Rajamahal Silks Junction, South Masi Street, Ward 50, Madurai South - 625001",
    full_address_ta: "இராஜமஹால் சில்க்ஸ் சந்திப்பு, தெற்கு மாசி வீதி, வார்டு 50, மதுரை தெற்கு - 625001",
    latitude: 9.9172,
    longitude: 78.1215,
    ward_id: "WARD_50"
  },
  {
    id: "loc-05",
    name_en: "South Avani Moola Street",
    name_ta: "தெற்கு ஆவணி மூல வீதி",
    full_address_en: "South Avani Moola Street, Mahal Area, Ward 50, Madurai South - 625001",
    full_address_ta: "தெற்கு ஆவணி மூல வீதி, மகால் பகுதி, வார்டு 50, மதுரை தெற்கு - 625001",
    latitude: 9.9168,
    longitude: 78.1228,
    ward_id: "WARD_50"
  },
  {
    id: "loc-06",
    name_en: "Palace Road & Navabathkana Street",
    name_ta: "அரண்மனை சாலை & நவாபத்கானா தெரு",
    full_address_en: "Palace Road, Near Mahal Corner, Ward 50, Madurai South - 625001",
    full_address_ta: "அரண்மனை சாலை, மகால் கார்னர் அருகில், வார்டு 50, மதுரை தெற்கு - 625001",
    latitude: 9.9160,
    longitude: 78.1232,
    ward_id: "WARD_50"
  },

  // Ward 51 Thirumalai Nayakkar Mahal
  {
    id: "loc-07",
    name_en: "Thirumalai Nayakkar Mahal Main Entrance",
    name_ta: "திருமலை நாயக்கர் மகால் பிரதான வாசல்",
    full_address_en: "Thirumalai Nayakkar Mahal, Mahal Vadambokki Street, Ward 51, Madurai South - 625001",
    full_address_ta: "திருமலை நாயக்கர் மகால், மகால் வடம் போக்கி தெரு, வார்டு 51, மதுரை தெற்கு - 625001",
    latitude: 9.9152,
    longitude: 78.1238,
    ward_id: "WARD_51"
  },
  {
    id: "loc-08",
    name_en: "East Gate (Keelavasal) Market Area",
    name_ta: "கிழக்கு வாசல் (கீழவாசல்) மார்க்கெட் பகுதி",
    full_address_en: "Keelavasal Main Market, East Veli Street, Ward 51, Madurai South - 625001",
    full_address_ta: "கீழவாசல் மெயின் மார்க்கெட், கிழக்கு வெளி வீதி, வார்டு 51, மதுரை தெற்கு - 625001",
    latitude: 9.9175,
    longitude: 78.1275,
    ward_id: "WARD_51"
  },
  {
    id: "loc-09",
    name_en: "Manjanakara Street & South Gate Veli",
    name_ta: "மஞ்சணக்கார தெரு & தெற்கு வாசல் வெளி",
    full_address_en: "Manjanakara Street, South Gate, Ward 51, Madurai South - 625001",
    full_address_ta: "மஞ்சணக்கார தெரு, தெற்கு வாசல், வார்டு 51, மதுரை தெற்கு - 625001",
    latitude: 9.9130,
    longitude: 78.1220,
    ward_id: "WARD_51"
  },

  // Ward 52 Kamarajar Salai North
  {
    id: "loc-10",
    name_en: "Kamarajar Salai Main Road & Central Bus Stop",
    name_ta: "காமராஜர் சாலை மெயின் ரோடு & மத்திய பேருந்து நிறுத்தம்",
    full_address_en: "Kamarajar Salai Main Road, Ward 52, Madurai South - 625009",
    full_address_ta: "காமராஜர் சாலை மெயின் ரோடு, வார்டு 52, மதுரை தெற்கு - 625009",
    latitude: 9.9205,
    longitude: 78.1352,
    ward_id: "WARD_52"
  },
  {
    id: "loc-11",
    name_en: "Bodi Line & Kuruvikaran Salai Junction",
    name_ta: "போடி லைன் & குருவிகாரன் சாலை சந்திப்பு",
    full_address_en: "Kuruvikaran Salai North, Ward 52, Madurai South - 625009",
    full_address_ta: "குருவிகாரன் சாலை வடக்கு, வார்டு 52, மதுரை தெற்கு - 625009",
    latitude: 9.9220,
    longitude: 78.1390,
    ward_id: "WARD_52"
  },

  // Ward 53 Kamarajar Salai South
  {
    id: "loc-12",
    name_en: "Kamarajar Salai South 4th & 5th Cross Streets",
    name_ta: "காமராஜர் சாலை தெற்கு 4வது & 5வது குறுக்கு தெரு",
    full_address_en: "Kamarajar Salai South, Ward 53, Madurai South - 625009",
    full_address_ta: "காமராஜர் சாலை தெற்கு, வார்டு 53, மதுரை தெற்கு - 625009",
    latitude: 9.9180,
    longitude: 78.1360,
    ward_id: "WARD_53"
  },
  {
    id: "loc-13",
    name_en: "Pankajam Colony & St. Mary's Higher Secondary School Road",
    name_ta: "பங்கஜம் காலனி & புனித மேரி மேல்நிலைப்பள்ளி சாலை",
    full_address_en: "Pankajam Colony 1st Street, Ward 53, Madurai South - 625009",
    full_address_ta: "பங்கஜம் காலனி 1வது தெரு, வார்டு 53, மதுரை தெற்கு - 625009",
    latitude: 9.9165,
    longitude: 78.1410,
    ward_id: "WARD_53"
  },

  // Ward 54 Anna Nagar West
  {
    id: "loc-14",
    name_en: "Anna Nagar Main Road & 80 Feet Road Junction",
    name_ta: "அண்ணா நகர் மெயின் ரோடு & 80 அடி ரோடு சந்திப்பு",
    full_address_en: "Anna Nagar Main Road, Ward 54, Madurai South - 625020",
    full_address_ta: "அண்ணா நகர் மெயின் ரோடு, வார்டு 54, மதுரை தெற்கு - 625020",
    latitude: 9.9240,
    longitude: 78.1450,
    ward_id: "WARD_54"
  },
  {
    id: "loc-15",
    name_en: "Anna Nagar 1st Cross & Kuruvikaran Salai West",
    name_ta: "அண்ணா நகர் 1வது குறுக்கு தெரு & குருவிகாரன் சாலை மேற்கு",
    full_address_en: "Anna Nagar 1st Cross, Ward 54, Madurai South - 625020",
    full_address_ta: "அண்ணா நகர் 1வது குறுக்கு தெரு, வார்டு 54, மதுரை தெற்கு - 625020",
    latitude: 9.9225,
    longitude: 78.1420,
    ward_id: "WARD_54"
  },
  {
    id: "loc-16",
    name_en: "Anna Nagar Ambika Theatre Junction",
    name_ta: "அண்ணா நகர் அம்பிகா தியேட்டர் சந்திப்பு",
    full_address_en: "Near Ambika Theatre, Anna Nagar, Ward 54, Madurai South - 625020",
    full_address_ta: "அம்பிகா தியேட்டர் அருகில், அண்ணா நகர், வார்டு 54, மதுரை தெற்கு - 625020",
    latitude: 9.9215,
    longitude: 78.1480,
    ward_id: "WARD_54"
  },

  // Ward 55 Mariamman Kovil Teppakulam
  {
    id: "loc-17",
    name_en: "Mariamman Teppakulam Roundana & North Bank",
    name_ta: "மாரியம்மன் தெப்பக்குளம் ரவுண்டானா & வடக்கு கரை",
    full_address_en: "Teppakulam North Bank Road, Ward 55, Madurai South - 625009",
    full_address_ta: "தெப்பக்குளம் வடக்கு கரை சாலை, வார்டு 55, மதுரை தெற்கு - 625009",
    latitude: 9.9142,
    longitude: 78.1538,
    ward_id: "WARD_55"
  },
  {
    id: "loc-18",
    name_en: "Sourashtra Boys College Road, Teppakulam",
    name_ta: "சௌராஷ்டிரா ஆண்கள் கல்லூரி சாலை, தெப்பக்குளம்",
    full_address_en: "Sourashtra College Road, Teppakulam, Ward 55, Madurai South - 625009",
    full_address_ta: "சௌராஷ்டிரா கல்லூரி சாலை, தெப்பக்குளம், வார்டு 55, மதுரை தெற்கு - 625009",
    latitude: 9.9125,
    longitude: 78.1560,
    ward_id: "WARD_55"
  },
  {
    id: "loc-19",
    name_en: "Muktheeswarar Temple Road, Teppakulam South",
    name_ta: "முக்தீஸ்வரர் கோவில் சாலை, தெப்பக்குளம் தெற்கு",
    full_address_en: "Muktheeswarar Temple Street, Ward 55, Madurai South - 625009",
    full_address_ta: "முக்தீஸ்வரர் கோவில் தெரு, வார்டு 55, மதுரை தெற்கு - 625009",
    latitude: 9.9110,
    longitude: 78.1520,
    ward_id: "WARD_55"
  },

  // Ward 56 Anuppanadi Central
  {
    id: "loc-20",
    name_en: "Anuppanadi Main Road & Government Primary Health Centre",
    name_ta: "அனுப்பானடி மெயின் ரோடு & அரசு ஆரம்ப சுகாதார நிலையம்",
    full_address_en: "Anuppanadi Main Road, Ward 56, Madurai South - 625009",
    full_address_ta: "அனுப்பானடி மெயின் ரோடு, வார்டு 56, மதுரை தெற்கு - 625009",
    latitude: 9.9075,
    longitude: 78.1512,
    ward_id: "WARD_56"
  },
  {
    id: "loc-21",
    name_en: "Anuppanadi Housing Board Colony Phase 1",
    name_ta: "அனுப்பானடி ஹவுசிங் போர்டு காலனி பேஸ் 1",
    full_address_en: "Housing Board Colony, Anuppanadi Central, Ward 56, Madurai South - 625009",
    full_address_ta: "ஹவுசிங் போர்டு காலனி, அனுப்பானடி மத்தி, வார்டு 56, மதுரை தெற்கு - 625009",
    latitude: 9.9060,
    longitude: 78.1490,
    ward_id: "WARD_56"
  },

  // Ward 57 Anuppanadi East
  {
    id: "loc-22",
    name_en: "Anuppanadi East Cross Streets & Ayyanar Kovil",
    name_ta: "அனுப்பானடி கிழக்கு குறுக்கு தெரு & அய்யனார் கோவில்",
    full_address_en: "Ayyanar Kovil Street, Anuppanadi East, Ward 57, Madurai South - 625009",
    full_address_ta: "அய்யனார் கோவில் தெரு, அனுப்பானடி கிழக்கு, வார்டு 57, மதுரை தெற்கு - 625009",
    latitude: 9.9050,
    longitude: 78.1565,
    ward_id: "WARD_57"
  },
  {
    id: "loc-23",
    name_en: "Chinthamani Ring Road Junction, Anuppanadi East",
    name_ta: "சிந்தாமணி ரிங் ரோடு சந்திப்பு, அனுப்பானடி கிழக்கு",
    full_address_en: "Chinthamani Ring Road Junction, Ward 57, Madurai South - 625009",
    full_address_ta: "சிந்தாமணி ரிங் ரோடு சந்திப்பு, வார்டு 57, மதுரை தெற்கு - 625009",
    latitude: 9.9020,
    longitude: 78.1580,
    ward_id: "WARD_57"
  },

  // Ward 58 Villapuram Main
  {
    id: "loc-24",
    name_en: "Villapuram Main Road & Housing Board Junction",
    name_ta: "வில்லாபுரம் மெயின் ரோடு & ஹவுசிங் போர்டு சந்திப்பு",
    full_address_en: "Villapuram Main Road, Ward 58, Madurai South - 625012",
    full_address_ta: "வில்லாபுரம் மெயின் ரோடு, வார்டு 58, மதுரை தெற்கு - 625012",
    latitude: 9.8995,
    longitude: 78.1215,
    ward_id: "WARD_58"
  },
  {
    id: "loc-25",
    name_en: "Villapuram Archana Colony & Meenakshi Nagar",
    name_ta: "வில்லாபுரம் அர்ச்சனா காலனி & மீனாட்சி நகர்",
    full_address_en: "Meenakshi Nagar 2nd Street, Villapuram, Ward 58, Madurai South - 625012",
    full_address_ta: "மீனாட்சி நகர் 2வது தெரு, வில்லாபுரம், வார்டு 58, மதுரை தெற்கு - 625012",
    latitude: 9.9015,
    longitude: 78.1245,
    ward_id: "WARD_58"
  },

  // Ward 59 Vetri Cinema & South Colony
  {
    id: "loc-26",
    name_en: "Vetri Theatre Junction, Villapuram South",
    name_ta: "வெற்றி தியேட்டர் சந்திப்பு, வில்லாபுரம் தெற்கு",
    full_address_en: "Near Vetri Cinema, Villapuram South Colony, Ward 59, Madurai South - 625012",
    full_address_ta: "வெற்றி தியேட்டர் அருகில், வில்லாபுரம் தெற்கு காலனி, வார்டு 59, மதுரை தெற்கு - 625012",
    latitude: 9.9040,
    longitude: 78.1320,
    ward_id: "WARD_59"
  },
  {
    id: "loc-27",
    name_en: "South Colony 3rd Street & Corporation School Road",
    name_ta: "தெற்கு காலனி 3வது தெரு & மாநகராட்சி பள்ளி சாலை",
    full_address_en: "South Colony 3rd Street, Ward 59, Madurai South - 625012",
    full_address_ta: "தெற்கு காலனி 3வது தெரு, வார்டு 59, மதுரை தெற்கு - 625012",
    latitude: 9.9025,
    longitude: 78.1345,
    ward_id: "WARD_59"
  },

  // Ward 60 Munichalai Road
  {
    id: "loc-28",
    name_en: "Munichalai Road & Obula Padithurai Junction",
    name_ta: "முனிச்சாலை சாலை & ஓபுளா படித்துறை சந்திப்பு",
    full_address_en: "Munichalai Road Junction, Ward 60, Madurai South - 625009",
    full_address_ta: "முனிச்சாலை சாலை சந்திப்பு, வார்டு 60, மதுரை தெற்கு - 625009",
    latitude: 9.9160,
    longitude: 78.1310,
    ward_id: "WARD_60"
  },
  {
    id: "loc-29",
    name_en: "Kamarajar Salai Munichalai Signal",
    name_ta: "காமராஜர் சாலை முனிச்சாலை சிக்னல்",
    full_address_en: "Munichalai Signal, Kamarajar Salai, Ward 60, Madurai South - 625009",
    full_address_ta: "முனிச்சாலை சிக்னல், காமராஜர் சாலை, வார்டு 60, மதுரை தெற்கு - 625009",
    latitude: 9.9170,
    longitude: 78.1335,
    ward_id: "WARD_60"
  },

  // Outside Test Locations (for negative verification)
  {
    id: "loc-outside-01",
    name_en: "Tallakulam Main Road (Outside Constituency)",
    name_ta: "தல்லாகுளம் மெயின் ரோடு (தொகுதிக்கு வெளியே)",
    full_address_en: "Tallakulam Main Road, Madurai North (Outside Madurai South)",
    full_address_ta: "தல்லாகுளம் மெயின் ரோடு, மதுரை வடக்கு (தொகுதிக்கு வெளியே)",
    latitude: 9.9900,
    longitude: 78.1200
  },
  {
    id: "loc-outside-02",
    name_en: "Mattuthavani Integrated Bus Terminus (Outside Constituency)",
    name_ta: "மாட்டுத்தாவணி பேருந்து நிலையம் (தொகுதிக்கு வெளியே)",
    full_address_en: "Mattuthavani Bus Stand, Madurai East (Outside Madurai South)",
    full_address_ta: "மாட்டுத்தாவணி பேருந்து நிலையம், மதுரை கிழக்கு (தொகுதிக்கு வெளியே)",
    latitude: 9.9480,
    longitude: 78.1650
  }
];

interface AddressAutocompleteProps {
  onSelectAddress: (selected: {
    address: string;
    latitude: number;
    longitude: number;
    ward_id: string;
    ward_name: string;
    validation: ValidationResult;
  }) => void;
  initialAddress?: string;
  initialLat?: number;
  initialLng?: number;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelectAddress,
  initialAddress = '',
  initialLat = 9.9152,
  initialLng = 78.1300
}) => {
  const { lang, t } = useLanguage();

  const [query, setQuery] = useState<string>(initialAddress);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  // Selected state
  const [selectedAddress, setSelectedAddress] = useState<string>(initialAddress);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });
  const [validationResult, setValidationResult] = useState<ValidationResult>(() => 
    validateMaduraiSouthLocation(initialLat, initialLng)
  );
  
  // Error state for random / invalid text (e.g. "nfjsjfafa")
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic combining local curated index + OSM Nominatim biased to Madurai South
  const searchMaduraiSouthLocations = useCallback(async (searchTerm: string) => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Instant local matching from curated 192-Madurai South database
    const localMatches = MADURAI_SOUTH_LOCALITIES.filter(loc => {
      const matchEn = loc.name_en.toLowerCase().includes(trimmed) || 
                      loc.full_address_en.toLowerCase().includes(trimmed);
      const matchTa = loc.name_ta.toLowerCase().includes(trimmed) || 
                      loc.full_address_ta.toLowerCase().includes(trimmed);
      return matchEn || matchTa;
    });

    let combinedResults = [...localMatches];

    // 2. Query OSM Nominatim if fewer than 4 local matches found
    if (localMatches.length < 4 && trimmed.length >= 3) {
      try {
        const bbox = '78.1000,9.9400,78.1700,9.8900'; // Madurai South bounding box
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed + ' Madurai')}&format=json&addressdetails=1&limit=5&viewbox=${bbox}&bounded=0`;
        
        const response = await fetch(url, {
          headers: { 'Accept-Language': lang === 'ta' ? 'ta,en' : 'en' }
        });

        if (response.ok) {
          const data = await response.json();
          const osmResults: AddressSuggestion[] = (data || []).map((item: any, idx: number) => ({
            id: `osm-${item.place_id || idx}`,
            name_en: item.display_name.split(',')[0],
            name_ta: item.display_name.split(',')[0],
            full_address_en: item.display_name,
            full_address_ta: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon)
          }));

          // Deduplicate
          osmResults.forEach(osm => {
            if (!combinedResults.some(r => Math.abs(r.latitude - osm.latitude) < 0.001 && Math.abs(r.longitude - osm.longitude) < 0.001)) {
              combinedResults.push(osm);
            }
          });
        }
      } catch (err) {
        // Fallback to local
      }
    }

    setSuggestions(combinedResults);
    setLoading(false);
    setIsOpen(true);
  }, [lang]);

  // Handle Input typing with Debounce (350ms)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsTyping(true);
    setErrorMessage(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      searchMaduraiSouthLocations(val);
    }, 350);
  };

  // Handle selecting an address suggestion
  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    const addr = lang === 'ta' ? suggestion.full_address_ta : suggestion.full_address_en;
    setQuery(addr);
    setSelectedAddress(addr);
    setSelectedCoords({ lat: suggestion.latitude, lng: suggestion.longitude });
    setIsOpen(false);
    setIsTyping(false);
    setErrorMessage(null);

    // Validate coordinates against Madurai South official boundary
    const val = validateMaduraiSouthLocation(suggestion.latitude, suggestion.longitude);
    setValidationResult(val);

    const wardName = lang === 'ta' ? val.detectedWard.name_ta : val.detectedWard.name_en;

    onSelectAddress({
      address: addr,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      ward_id: val.detectedWard.ward_id,
      ward_name: wardName,
      validation: val
    });
  };

  // Handle GPS location click
  const handleUseGps = () => {
    setLoading(true);
    setErrorMessage(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const val = validateMaduraiSouthLocation(lat, lng);
          const addr = `${val.detectedWard.name_en}, Kamarajar Salai Area, Madurai South`;
          
          setQuery(addr);
          setSelectedAddress(addr);
          setSelectedCoords({ lat, lng });
          setValidationResult(val);
          setLoading(false);
          setIsTyping(false);

          onSelectAddress({
            address: addr,
            latitude: lat,
            longitude: lng,
            ward_id: val.detectedWard.ward_id,
            ward_name: lang === 'ta' ? val.detectedWard.name_ta : val.detectedWard.name_en,
            validation: val
          });
        },
        () => {
          // Fallback to central Madurai South
          const fallback = MADURAI_SOUTH_LOCALITIES[0];
          handleSelectSuggestion(fallback);
          setLoading(false);
        }
      );
    } else {
      const fallback = MADURAI_SOUTH_LOCALITIES[0];
      handleSelectSuggestion(fallback);
      setLoading(false);
    }
  };

  // Validate on blur or form submit if user typed random non-selected text
  const handleBlurOrSubmit = () => {
    // If the typed query does not match the chosen validated address
    if (isTyping && query !== selectedAddress) {
      const matched = MADURAI_SOUTH_LOCALITIES.find(
        l => l.name_en.toLowerCase() === query.toLowerCase() || 
             l.full_address_en.toLowerCase() === query.toLowerCase() ||
             l.name_ta.toLowerCase() === query.toLowerCase() ||
             l.full_address_ta.toLowerCase() === query.toLowerCase()
      );

      if (matched) {
        handleSelectSuggestion(matched);
      } else {
        // Show strict invalid address error for random gibberish (e.g. "nfjsjfafa")
        setErrorMessage(
          lang === 'ta' 
            ? 'சரியான முகவரியை தேர்வு செய்யவும்.' 
            : 'Please select a valid address from the suggestions.'
        );
      }
    }
  };

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-blue-700" />
          {lang === 'ta' ? 'முகவரியை தேடவும் (192-மதுரை தெற்கு)' : 'Search Address / Street (Madurai South)'} *
        </label>
        <button
          type="button"
          onClick={handleUseGps}
          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
        >
          <Navigation className="w-3 h-3 text-blue-600" />
          {t('btnUseGps')}
        </button>
      </div>

      {/* Main Search Autocomplete Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onBlur={() => {
              setTimeout(handleBlurOrSubmit, 200);
            }}
            placeholder={lang === 'ta' ? '🔍 முகவரியை தேடவும்... (எ.கா: அண்ணா நகர், சிம்மக்கல், காமராஜர் சாலை)' : '🔍 Search address... (e.g. Anna Nagar, Simmakkal, Kamarajar Salai)'}
            className={`w-full pl-10 pr-10 py-3 bg-white text-slate-900 font-medium text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 shadow-sm transition-all ${
              errorMessage 
                ? 'border-red-400 ring-2 ring-red-300' 
                : 'border-slate-300 focus:border-blue-600 focus:ring-blue-500/30'
            }`}
          />

          {loading && (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute right-3.5" />
          )}

          {!loading && query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
                setErrorMessage(null);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 absolute right-3"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-2xl border border-blue-200 shadow-2xl max-h-64 overflow-y-auto overflow-x-hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-4 text-center text-xs text-blue-800 font-semibold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>{lang === 'ta' ? 'முகவரிகளை தேடுகிறது...' : 'Searching address suggestions...'}</span>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 font-medium">
                {lang === 'ta' ? 'முகவரி கிடைக்கவில்லை. சரியான பகுதியை உள்ளிடவும்.' : 'No matching locations found in Madurai South.'}
              </div>
            ) : (
              suggestions.map((item) => (
                <div
                  key={item.id}
                  onMouseDown={() => handleSelectSuggestion(item)}
                  className="p-3.5 hover:bg-blue-50/80 cursor-pointer transition-colors flex items-start gap-3 group"
                >
                  <div className="p-2 bg-blue-100/80 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-950 truncate">
                      {lang === 'ta' ? item.name_ta : item.name_en}
                    </h5>
                    <p className="text-[11px] text-slate-500 group-hover:text-slate-700 truncate mt-0.5">
                      {lang === 'ta' ? item.full_address_ta : item.full_address_en}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Strict Rejection Error Alert (For random gibberish like 'nfjsjfafa') */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-300 p-3 rounded-xl flex items-center gap-2 text-xs text-red-900 font-bold shadow-sm animate-pulse">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Select Pill Buttons for Popular Madurai South Areas */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-500 font-bold text-[11px] mr-1">
            {lang === 'ta' ? 'விரைவு தேர்வு:' : 'Quick Select:'}
          </span>
          {MADURAI_SOUTH_LOCALITIES.slice(0, 6).map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => handleSelectSuggestion(loc)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-900 hover:border-blue-400 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 shadow-sm transition-all"
            >
              {lang === 'ta' ? loc.name_ta.split('&')[0] : loc.name_en.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Boundary & Ward Verification Badge (White + Blue UI) */}
      {selectedAddress && !errorMessage && (
        <div className={`p-4 rounded-2xl border transition-all ${
          validationResult.isValid 
            ? 'bg-blue-50/60 border-blue-200 text-blue-950' 
            : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <div className="flex items-start gap-3">
            {validationResult.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-xs sm:text-sm">
                  {validationResult.isValid 
                    ? (lang === 'ta' ? '✓ இடம் சரிபார்க்கப்பட்டது' : '✓ Location verified')
                    : (lang === 'ta' ? '✕ தொகுதிக்கு வெளியே உள்ள இடம்' : '✕ Location outside constituency')}
                </span>
                {validationResult.isValid && (
                  <span className="text-[10px] font-mono bg-blue-200/80 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                    {validationResult.detectedWard.ward_id}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600">
                {validationResult.isValid 
                  ? (lang === 'ta' 
                      ? `இந்த முகவரி 192-மதுரை தெற்கு தொகுதிக்குள் (${validationResult.detectedWard.name_ta}) உள்ளது.` 
                      : `This location is within Madurai South constituency (${validationResult.detectedWard.name_en}).`)
                  : (lang === 'ta' 
                      ? 'இந்த முகவரி மதுரை தெற்கு தொகுதிக்கு வெளியே உள்ளது. தயவுசெய்து சரியான முகவரியை தேர்வு செய்யவும்.' 
                      : 'Please select an address within Madurai South constituency.')}
              </p>

              {validationResult.isValid && (
                <div className="pt-1 text-[11px] text-blue-900 font-mono flex items-center gap-3">
                  <span>GPS: {selectedCoords.lat.toFixed(4)}°N, {selectedCoords.lng.toFixed(4)}°E</span>
                  <span>Councillor: {validationResult.detectedWard.councillor_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
