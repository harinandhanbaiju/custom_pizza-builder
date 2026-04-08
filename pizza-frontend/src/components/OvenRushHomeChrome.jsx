import React, { useEffect, useMemo, useState } from "react";

const filters = ["FAST DELIVERY", "NEW ARRIVALS", "PURE VEG", "OFFERS"];
const categories = ["CUSTOM PIZZAS", "SIDES", "DRINKS", "DESSERTS", "FAMILY COMBOS"];
const locations = ["HOME · 2ND MAIN ROAD", "OFFICE · TIDEL PARK", "HOSTEL · BLOCK C"];
const quickMetrics = [
    { id: "m1", label: "TODAY'S ORDERS", value: "24", trend: "^8 vs yesterday", trendType: "up" },
    { id: "m2", label: "ACTIVE COMBOS", value: "3", trend: "Ends Sunday", trendType: "up" },
    { id: "m3", label: "AVG DELIVERY", value: "29m", trend: "^3m slower", trendType: "neutral" },
    { id: "m4", label: "CART VALUE", value: "₹648", trend: "v₹40 vs avg", trendType: "down" },
];

const popularPicks = [
    { id: "p1", name: "The Classic", ingredients: "Pepperoni · Mozzarella", price: "₹349" },
    { id: "p2", name: "Garden Fresh", ingredients: "Spinach · Olives · Feta", price: "₹299" },
    { id: "p3", name: "Spicy Inferno", ingredients: "Chorizo · Jalapeno · BBQ", price: "₹399" },
];
const banners = [
    {
        id: "b1",
        tag: "MATCHDAY SPECIAL",
        title: "Family feast specials",
        description: "Bigger pies and sides for your watch-party orders.",
        eta: "24 MIN",
        offer: "SAVE ₹180 ON FAMILY BOX",
        highlights: ["CHEESE BURST", "PARTY WINGS", "FAST RIDER"],
        cta: "ORDER FEAST",
    },
    {
        id: "b2",
        tag: "WEEKEND SPECIAL",
        title: "Weekend combo specials",
        description: "Add sides and drinks to save on every order.",
        eta: "32 MIN",
        offer: "FLAT ₹120 OFF ON COMBO CART",
        highlights: ["GARLIC KNOTS", "2 CHILLERS", "LATE-NIGHT SLOT"],
        cta: "CLAIM COMBO",
    },
    {
        id: "b3",
        tag: "NIGHT SPECIAL",
        title: "Late-night cravings sorted",
        description: "Hot pizzas and drinks delivered till midnight.",
        eta: "28 MIN",
        offer: "BUY 1 GET 1 ON MEDIUM PIZZAS",
        highlights: ["AFTER 9PM MENU", "EXTRA DIP", "MIDNIGHT SLOT"],
        cta: "UNLOCK BOGO",
    },
];

const PinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M12 13.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
            stroke="currentColor"
            strokeWidth="1.8"
        />
        <path
            d="M18.4 10.3c0 5.5-6.4 10.8-6.4 10.8s-6.4-5.3-6.4-10.8a6.4 6.4 0 1 1 12.8 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
    </svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const OvenRushHomeChrome = ({ user, onLogout }) => {
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [activeFilters, setActiveFilters] = useState([filters[0]]);
    const [activeBannerIndex, setActiveBannerIndex] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(locations[0]);
    const [showLocations, setShowLocations] = useState(false);
    const [infoMessage, setInfoMessage] = useState("Showing popular FC Barcelona matchday picks");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveBannerIndex((prev) => (prev + 1) % banners.length);
        }, 3500);

        return () => clearInterval(intervalId);
    }, []);

    const activeBanner = useMemo(() => banners[activeBannerIndex], [activeBannerIndex]);

    const toggleFilter = (filter) => {
        setActiveFilters((prev) => {
            const exists = prev.includes(filter);
            const next = exists ? prev.filter((item) => item !== filter) : [...prev, filter];
            return next.length ? next : [filters[0]];
        });
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setInfoMessage(`Browsing ${category.toLowerCase()} options`);
    };

    const handleProfileClick = () => {
        setInfoMessage("Profile panel opens from account hub");
    };

    const handleOffersClick = () => {
        setInfoMessage("Offers panel will open here");
    };

    return (
        <section className="or-home-shell">
            <header className="or-command-bar">
                <div className="or-brand-block">
                    <p className="or-brand-title">PIZZA BUILDER</p>
                    <button
                        type="button"
                        className="or-inline-location"
                        onClick={() => setShowLocations((prev) => !prev)}
                        aria-expanded={showLocations}
                    >
                        <span className="or-location-icon"><PinIcon /></span>
                        <span>{selectedLocation}</span>
                    </button>
                </div>
                <div className="or-command-right">
                    <button type="button" className="or-user-chip" onClick={handleProfileClick} aria-label="Profile">
                        <span className="or-user-avatar">{(user?.name || user?.email || "HB").slice(0, 2).toUpperCase()}</span>
                        <span>{(user?.name || user?.email || "Guest").split("@")[0]}</span>
                    </button>
                    <button type="button" className="or-logout-btn" onClick={onLogout}>Logout</button>
                </div>
            </header>

            {showLocations && (
                <div className="or-location-sheet">
                    {locations.map((location) => (
                        <button
                            type="button"
                            key={location}
                            className={`or-location-option ${selectedLocation === location ? "is-active" : ""}`}
                            onClick={() => {
                                setSelectedLocation(location);
                                setInfoMessage(`Location switched to ${location}`);
                                setShowLocations(false);
                            }}
                        >
                            {location}
                        </button>
                    ))}
                </div>
            )}

            <div className="or-search-strip">
                <div className="or-search-wrap">
                    <div className="or-search-box">
                        <span className="or-search-icon"><SearchIcon /></span>
                        <input
                            className="or-search"
                            type="text"
                            placeholder="Search for pizzas, toppings, sides..."
                            value={searchText}
                            onChange={(event) => {
                                setSearchText(event.target.value);
                                setInfoMessage(event.target.value ? `Searching for '${event.target.value}'` : "Search cleared");
                            }}
                        />
                    </div>
                </div>
                <button type="button" className="or-chip-pill" onClick={() => setInfoMessage(`Current ${activeBanner.eta} delivery window`)}>
                    ETA {activeBanner.eta}
                </button>
                <button type="button" className="or-chip-pill is-success" onClick={handleOffersClick}>FREE DELIVERY</button>
            </div>

            <section className="or-metrics" aria-label="Quick metrics">
                {quickMetrics.map((metric) => (
                    <article className="or-metric-card" key={metric.id}>
                        <p>{metric.label}</p>
                        <strong>{metric.value}</strong>
                        <span className={`or-metric-trend ${metric.trendType}`}>{metric.trend}</span>
                    </article>
                ))}
            </section>

            <div className="or-categories" role="tablist" aria-label="Categories">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={`or-category-pill ${activeCategory === category ? "is-active" : ""}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="or-filters" role="tablist" aria-label="Quick filters">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        className={`or-filter-chip ${activeFilters.includes(filter) ? "is-active" : ""}`}
                        onClick={() => toggleFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <section className="or-popular-picks" aria-label="Popular picks">
                <p className="or-section-label">Popular Picks</p>
                <div className="or-picks-grid">
                    {popularPicks.map((pick) => (
                        <article className="or-pick-card" key={pick.id}>
                            <span className="or-pick-emoji" aria-hidden="true">🍕</span>
                            <h4>{pick.name}</h4>
                            <p>{pick.ingredients}</p>
                            <div className="or-pick-footer">
                                <strong>{pick.price}</strong>
                                <button type="button" onClick={() => setInfoMessage(`${pick.name} added to cart preview`)}>+</button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <p className="or-helper-message">{infoMessage}</p>
        </section>
    );
};

export default OvenRushHomeChrome;
