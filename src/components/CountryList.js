import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, TextField, FormControl, Select, MenuItem, InputLabel, Dialog, DialogContent, DialogTitle, Button, IconButton, Box } from '@mui/material';
import { Favorite, Search, Brightness4, Brightness7, LocationOn, Description } from '@mui/icons-material';
import { blue, red, green } from '@mui/material/colors';
import jsPDF from 'jspdf';

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [languages, setLanguages] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const [showDocumentDialog, setShowDocumentDialog] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const headerRef = useRef(null);

    // Debounce function to limit resize event handling
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Update header height
    const updateHeaderHeight = () => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    };

    // Fetch countries data from multiple endpoints of the REST Countries API
    useEffect(() => {
        // Fetch all countries
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                setCountries(response.data);
                // Collecting unique languages from all countries
                const languageSet = new Set();
                response.data.forEach(country => {
                    if (country.languages) {
                        Object.values(country.languages).forEach(language => languageSet.add(language));
                    }
                });
                setLanguages([...languageSet]);
            })
            .catch(error => console.error("There was an error fetching the countries data:", error));

        // Fetch country by name example (e.g., "USA")
        axios.get('https://restcountries.com/v3.1/name/USA')
            .then(response => {
                console.log('Country by name (USA):', response.data);
            })
            .catch(error => console.error("There was an error fetching country data by name:", error));

        // Fetch countries from a specific region (e.g., Europe)
        axios.get('https://restcountries.com/v3.1/region/europe')
            .then(response => {
                console.log('Countries in Europe:', response.data);
            })
            .catch(error => console.error("There was an error fetching countries by region:", error));

        // Fetch country by alpha code (e.g., 'US' for the United States)
        axios.get('https://restcountries.com/v3.1/alpha/US')
            .then(response => {
                console.log('Country by alpha code (US):', response.data);
            })
            .catch(error => console.error("There was an error fetching country data by alpha code:", error));

        // Retrieve login state and favorites from localStorage on component mount
        const storedLoginState = localStorage.getItem('isLoggedIn') === 'true';
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const storedTheme = localStorage.getItem('darkMode') === 'true';
        const storedDocumentList = JSON.parse(localStorage.getItem('documentList')) || [];
        
        // Retrieve filter state from sessionStorage
        const storedSearchTerm = sessionStorage.getItem('searchTerm') || '';
        const storedSelectedRegion = sessionStorage.getItem('selectedRegion') || '';
        const storedSelectedLanguage = sessionStorage.getItem('selectedLanguage') || '';
        const storedShowOnlyFavorites = sessionStorage.getItem('showOnlyFavorites') === 'true';

        setIsLoggedIn(storedLoginState);
        setFavorites(storedFavorites);
        setDarkMode(storedTheme);
        setDocumentList(storedDocumentList);
        setSearchTerm(storedSearchTerm);
        setSelectedRegion(storedSelectedRegion);
        setSelectedLanguage(storedSelectedLanguage);
        setShowOnlyFavorites(storedShowOnlyFavorites);

        // Initial header height calculation
        updateHeaderHeight();
    }, []);

    // Add resize event listener
    useEffect(() => {
        const debouncedUpdateHeaderHeight = debounce(updateHeaderHeight, 200);
        window.addEventListener('resize', debouncedUpdateHeaderHeight);
        return () => window.removeEventListener('resize', debouncedUpdateHeaderHeight);
    }, []);

    // Handle theme toggle
    const handleThemeToggle = () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        localStorage.setItem('darkMode', newTheme);
    };

    // Handle login/logout toggle
    const handleLoginToggle = () => {
        const newLoginState = !isLoggedIn;
        setIsLoggedIn(newLoginState);
        localStorage.setItem('isLoggedIn', newLoginState);
        setAlertMessage('');
    };

    // Handle favorite country addition/removal
    const handleFavoriteClick = (country) => {
        if (isLoggedIn) {
            const isAlreadyFavorite = favorites.some(fav => fav.name.common === country.name.common);

            if (isAlreadyFavorite) {
                const updatedFavorites = favorites.filter(fav => fav.name.common !== country.name.common);
                setFavorites(updatedFavorites);
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                setAlertMessage(`${country.name.common} removed from favorites`);
            } else {
                const updatedFavorites = [...favorites, country];
                setFavorites(updatedFavorites);
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                setAlertMessage(`${country.name.common} added to favorites`);
            }
        } else {
            setAlertMessage("Please log in to add to favorites.");
        }

        setTimeout(() => {
            setAlertMessage('');
        }, 3000);
    };

    // Handle document list addition/removal
    const handleDocumentClick = (country) => {
        const isInDocumentList = documentList.some(doc => doc.name.common === country.name.common);

        if (isInDocumentList) {
            const updatedDocumentList = documentList.filter(doc => doc.name.common !== country.name.common);
            setDocumentList(updatedDocumentList);
            localStorage.setItem('documentList', JSON.stringify(updatedDocumentList));
            setAlertMessage(`${country.name.common} removed from document list`);
        } else {
            const updatedDocumentList = [...documentList, country];
            setDocumentList(updatedDocumentList);
            localStorage.setItem('documentList', JSON.stringify(updatedDocumentList));
            setAlertMessage(`${country.name.common} added to document list`);
        }

        setTimeout(() => {
            setAlertMessage('');
        }, 3000);
    };

    // Handle favorites filter toggle
    const handleFavoritesFilterToggle = () => {
        const newShowOnlyFavorites = !showOnlyFavorites;
        setShowOnlyFavorites(newShowOnlyFavorites);
        sessionStorage.setItem('showOnlyFavorites', newShowOnlyFavorites);
    };

    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        sessionStorage.setItem('searchTerm', newSearchTerm);
    };

    const handleRegionChange = (event) => {
        const newSelectedRegion = event.target.value;
        setSelectedRegion(newSelectedRegion);
        sessionStorage.setItem('selectedRegion', newSelectedRegion);
    };

    const handleLanguageChange = (event) => {
        const newSelectedLanguage = event.target.value;
        setSelectedLanguage(newSelectedLanguage);
        sessionStorage.setItem('selectedLanguage', newSelectedLanguage);
    };

    const handleCountryClick = (country) => {
        setSelectedCountry(country);
        setShowMap(false);
        sessionStorage.setItem('selectedCountry', JSON.stringify(country));
    };

    const handleCloseDialog = () => {
        setSelectedCountry(null);
        setShowMap(false);
        sessionStorage.removeItem('selectedCountry');
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };

    const handleDocumentDialogOpen = () => {
        setShowDocumentDialog(true);
    };

    const handleDocumentDialogClose = () => {
        setShowDocumentDialog(false);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        let yOffset = 15;

        doc.setFontSize(18);
        doc.setTextColor(34, 139, 34);
        doc.setFont("helvetica", "bold");
        doc.text('Document List', 14, yOffset);
        yOffset += 12;

        if (documentList.length === 0) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text('No countries added to document list.', 14, yOffset);
        } else {
            documentList.forEach((country, index) => {
                doc.setFillColor(220, 248, 198);
                doc.rect(10, yOffset - 3, 190, 10, 'F');
                doc.setTextColor(0, 100, 0);
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text(country.name.common, 14, yOffset + 4);
                yOffset += 12;

                const details = [
                    { label: 'Capital', value: country.capital || 'N/A' },
                    { label: 'Region', value: country.region },
                    { label: 'Subregion', value: country.subregion || 'N/A' },
                    { label: 'Country Code', value: country.cca3 },
                    { label: 'Population', value: country.population.toLocaleString() },
                    { label: 'Languages', value: Object.values(country.languages || {}).join(', ') },
                    { label: 'Timezones', value: country.timezones?.join(', ') },
                    { label: 'Borders', value: country.borders ? country.borders.join(', ') : 'None' },
                ];

                doc.setFontSize(11);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0, 0, 0);

                details.forEach((item) => {
                    doc.text(`${item.label}:`, 14, yOffset);
                    doc.text(`${item.value}`, 60, yOffset);
                    yOffset += 8;

                    if (yOffset > 270) {
                        doc.addPage();
                        yOffset = 15;
                    }
                });

                yOffset += 6;
                if (yOffset > 270) {
                    doc.addPage();
                    yOffset = 15;
                }
            });
        }

        doc.save('document_list.pdf');
    };

    const filteredCountries = countries.filter(country =>
        (showOnlyFavorites ? favorites.some(fav => fav.name.common === country.name.common) : true) &&
        (selectedRegion ? country.region === selectedRegion : true) &&
        (selectedLanguage ? Object.values(country.languages || {}).includes(selectedLanguage) : true) &&
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            backgroundImage: `url(${darkMode ? '/images/darkBackground.png' : '/images/background.jpg'})`,
            backgroundColor: darkMode ? '#121212' : 'inherit',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            fontFamily: 'Roboto, sans-serif',
            minHeight: '100vh',
            overflow: 'hidden',
            transition: 'all 0.5s ease',
            color: darkMode ? '#ffffff' : 'inherit'
        }}>
            {/* Fixed Title and Filters */}
            <div
                ref={headerRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    padding: '20px',
                    backgroundColor: 'transparent',
                }}
            >
                <h1 style={{
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    fontFamily: 'Poppins, sans-serif',
                    background: 'linear-gradient(90deg, rgba(255, 0, 0, 1), rgba(139, 0, 0, 1))',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    margin: '0 0 15px 0',
                    fontSize: window.innerWidth < 600 ? '32px' : '48px',
                }}>
                    Explore the World
                </h1>

                {/* Search Bar and Filters */}
                <div style={{
                    display: 'flex',
                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
                    gap: '10px'
                }}>
                    <TextField
                        placeholder="Search by Country"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                        margin="normal"
                        size="medium"
                        InputProps={{
                            startAdornment: <Search style={{ color: blue[500] }} />,
                        }}
                        sx={{
                            maxWidth: window.innerWidth < 768 ? '100%' : '300px',
                            marginBottom: '10px',
                            flex: 1,
                            backgroundColor: darkMode ? 'rgba(50, 50, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderWidth: 2,
                                    borderColor: blue[500],
                                    borderRadius: '10px',
                                },
                                '&:hover fieldset': {
                                    borderColor: blue[700],
                                }
                            },
                            '& .MuiInputBase-input': {
                                color: darkMode ? '#ffffff' : 'inherit',
                            },
                        }}
                    />

                    <div style={{
                        display: 'flex',
                        flexDirection: window.innerWidth < 768 ? 'row' : 'row',
                        gap: '10px',
                        flexWrap: window.innerWidth < 768 ? 'nowrap' : 'wrap',
                        justifyContent: window.innerWidth < 768 ? 'space-between' : 'flex-end',
                        flex: window.innerWidth < 768 ? '1 1 100%' : 1,
                        width: window.innerWidth < 768 ? '100%' : 'auto'
                    }}>
                        <IconButton
                            onClick={handleFavoritesFilterToggle}
                            style={{
                                backgroundColor: showOnlyFavorites ? 'rgba(255, 0, 0, 0.2)' : darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                marginRight: window.innerWidth < 600 ? '0' : '10px',
                                width: '48px',
                                height: '48px',
                                alignSelf: 'center'
                            }}
                        >
                            <Favorite style={{
                                color: showOnlyFavorites ? red[500] : darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                            }} />
                        </IconButton>

                        <IconButton
                            onClick={handleDocumentDialogOpen}
                            style={{
                                backgroundColor: documentList.length > 0 ? 'rgba(0, 128, 0, 0.2)' : darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                marginRight: window.innerWidth < 600 ? '0' : '10px',
                                width: '48px',
                                height: '48px',
                                alignSelf: 'center'
                            }}
                        >
                            <Description style={{
                                color: documentList.length > 0 ? green[500] : darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                            }} />
                        </IconButton>

                        <FormControl
                            size="medium"
                            style={{
                                minWidth: window.innerWidth < 600 ? '100%' : '200px',
                                flex: window.innerWidth < 600 ? '1 1 100%' : 'initial'
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '15px',
                                    backgroundColor: darkMode ? 'rgba(50, 50, 50, 0.8)' : 'transparent',
                                    '& fieldset': {
                                        borderWidth: 2,
                                        borderRadius: '15px'
                                    }
                                },
                                '& .MuiInputBase-input': {
                                    color: darkMode ? '#ffffff' : 'inherit',
                                },
                                '& .MuiInputLabel-root': {
                                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
                                }
                            }}
                        >
                            <InputLabel>Filter by Region</InputLabel>
                            <Select
                                value={selectedRegion}
                                onChange={handleRegionChange}
                                label="Filter by Region"
                            >
                                <MenuItem value="">All Regions</MenuItem>
                                <MenuItem value="Africa">Africa</MenuItem>
                                <MenuItem value="Asia">Asia</MenuItem>
                                <MenuItem value="Europe">Europe</MenuItem>
                                <MenuItem value="Oceania">Oceania</MenuItem>
                                <MenuItem value="Americas">Americas</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl
                            size="medium"
                            style={{
                                minWidth: window.innerWidth < 600 ? '100%' : '200px',
                                flex: window.innerWidth < 600 ? '1 1 100%' : 'initial'
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '15px',
                                    backgroundColor: darkMode ? 'rgba(50, 50, 50, 0.8)' : 'transparent',
                                    '& fieldset': {
                                        borderWidth: 2,
                                        borderRadius: '15px'
                                    }
                                },
                                '& .MuiInputBase-input': {
                                    color: darkMode ? '#ffffff' : 'inherit',
                                },
                                '& .MuiInputLabel-root': {
                                    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit',
                                }
                            }}
                        >
                            <InputLabel>Filter by Language</InputLabel>
                            <Select
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                                label="Filter by Language"
                            >
                                <MenuItem value="">All Languages</MenuItem>
                                {languages.map(language => (
                                    <MenuItem key={language} value={language}>{language}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    {/* Login Button and Dark Mode Toggle */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '10px',
                        justifyContent: window.innerWidth < 768 ? 'flex-end' : 'flex-start'
                    }}>
                        <IconButton
                            onClick={handleThemeToggle}
                            style={{
                                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                marginRight: '10px',
                            }}
                        >
                            {darkMode ?
                                <Brightness7 style={{ color: '#FFD700' }} /> :
                                <Brightness4 style={{ color: '#FFFFFF' }} />
                            }
                        </IconButton>

                        <Button
                            onClick={handleLoginToggle}
                            variant="contained"
                            style={{
                                borderRadius: '15px',
                                backgroundColor: green[500],
                                fontSize: '16px',
                                padding: '10px 20px',
                                marginLeft: 'auto'
                            }}
                        >
                            {isLoggedIn ? 'Logout' : 'Login'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scrolling Content Section */}
            <div
                className="scroll-container"
                style={{
                    marginTop: headerHeight + 20,
                    paddingBottom: '50px',
                    height: `calc(100vh - ${headerHeight + 20}px)`,
                    overflowY: 'auto',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                }}
            >
                <Grid container spacing={2} justifyContent="center">
                    {filteredCountries.map(country => (
                        <Grid item xs={12} sm={6} md={2.4} lg={2.4} key={country.name.common}>
                            <Card
                                onClick={() => handleCountryClick(country)}
                                sx={{
                                    minHeight: '310px',
                                    borderRadius: '8px',
                                    p: 2,
                                    textAlign: 'left',
                                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                                    color: darkMode ? '#ffffff' : 'inherit',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '18px',
                                            wordWrap: 'break-word',
                                            color: darkMode ? '#ffffff' : 'inherit',
                                        }}
                                    >
                                        {country.name.common}
                                    </Typography>
                                    <Typography sx={{ textAlign: 'left', mt: 1, color: darkMode ? '#ffffff' : 'inherit' }}>
                                        Capital: {country.capital}
                                    </Typography>
                                    <Typography sx={{ textAlign: 'left', color: darkMode ? '#ffffff' : 'inherit' }}>
                                        Region: {country.region}
                                    </Typography>
                                    <Typography sx={{ textAlign: 'left', color: darkMode ? '#ffffff' : 'inherit' }}>
                                        Population: {country.population.toLocaleString()}
                                    </Typography>
                                    <Box
                                        sx={{
                                            mt: 2,
                                            mb: 2,
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <img
                                            src={country.flags.png}
                                            alt={country.name.common}
                                            width="100"
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mt: 1,
                                            gap: '10px'
                                        }}
                                    >
                                        <IconButton
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleFavoriteClick(country);
                                            }}
                                        >
                                            <Favorite
                                                sx={{
                                                    color: favorites.some(
                                                        fav => fav.name.common === country.name.common
                                                    )
                                                        ? red[500]
                                                        : darkMode ? 'rgba(255, 255, 255, 0.5)' : 'gray',
                                                }}
                                            />
                                        </IconButton>
                                        <IconButton
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleDocumentClick(country);
                                            }}
                                        >
                                            <Description
                                                sx={{
                                                    color: documentList.some(
                                                        doc => doc.name.common === country.name.common
                                                    )
                                                        ? green[500]
                                                        : darkMode ? 'rgba(255, 255, 255, 0.5)' : 'gray',
                                                }}
                                            />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>

            {/* Dialog to show Country Details with Map */}
            {selectedCountry && (
                <Dialog
                    open={Boolean(selectedCountry)}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        style: {
                            borderRadius: 15,
                            overflow: 'hidden',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                            backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                        }
                    }}
                >
                    <DialogTitle
                        style={{
                            fontWeight: 'bold',
                            fontSize: '30px',
                            textAlign: 'center',
                            background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                            color: 'black',
                            padding: '25px 0',
                            border: '2px solid #FFA500',
                            position: 'relative',
                            borderBottom: '1px solid rgba(255,255,255,0.2)',
                            textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                            fontFamily: 'Poppins, sans-serif',
                            letterSpacing: '1px',
                        }}
                    >
                        <Typography
                            sx={{
                                position: 'absolute',
                                right: '15px',
                                top: '15px',
                                cursor: 'pointer',
                                fontSize: '24px',
                                opacity: '0.8',
                                transition: 'opacity 0.2s',
                                '&:hover': { opacity: '1' }
                            }}
                            onClick={handleCloseDialog}
                        >
                            ×
                        </Typography>
                        🌍 {selectedCountry.name.common} 🌍
                    </DialogTitle>
                    <DialogContent
                        style={{
                            backgroundColor: darkMode ? '#696464' : '#fff8ef',
                            padding: '25px',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '2px solid #FFA500',
                            gap: '15px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease-in-out',
                            color: darkMode ? '#ffffff' : 'inherit',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: showMap ? 'column' : 'row',
                                width: '100%',
                            }}
                        >
                            <div style={{
                                flex: showMap ? '1' : '0.4',
                                padding: '25px',
                                display: 'flex',
                                flexDirection: showMap ? 'row' : 'column',
                                alignItems: showMap ? 'center' : 'center',
                                justifyContent: showMap ? 'flex-start' : 'center',
                                borderRight: showMap ? 'none' : `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                backgroundColor: darkMode ? '#252525' : '#f5f5f5',
                                position: 'relative',
                                gap: showMap ? '12px' : '0'
                            }}>
                                {!showMap && (
                                    <div
                                        style={{
                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                            borderRadius: '12px',
                                            padding: '10px',
                                            backgroundColor: darkMode ? '#3d3d3d' : '#ffffff',
                                            marginTop: '40px',
                                            marginBottom: '25px',
                                            width: '100%',
                                            maxWidth: '250px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <img
                                            src={selectedCountry.flags.png}
                                            alt={selectedCountry.name.common}
                                            style={{
                                                width: '100%',
                                                maxHeight: '160px',
                                                objectFit: 'contain',
                                                borderRadius: '2px',
                                            }}
                                        />
                                    </div>
                                )}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: showMap ? 'row' : 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    position: showMap ? 'absolute' : 'static',
                                    top: showMap ? '5px' : 'auto',
                                    right: showMap ? '80px' : 'auto',
                                    zIndex: 10
                                }}>
                                    <IconButton
                                        onClick={toggleMap}
                                        style={{
                                            backgroundColor: showMap
                                                ? blue[500]
                                                : darkMode
                                                    ? 'rgba(255,255,255,0.1)'
                                                    : 'rgba(0,0,0,0.1)',
                                            width: '60px',
                                            height: '60px',
                                            border: '2px solid #FF5F1F',
                                            borderRadius: '50%',
                                            transition: 'all 0.3s ease',
                                            marginTop: showMap ? '0' : '50px',
                                            marginBottom: showMap ? '0' : '15px',
                                            boxShadow: '0 0 10px #FF5F1F',
                                        }}
                                    >
                                        <LocationOn style={{
                                            color: showMap ? 'white' : darkMode ? 'rgba(255,255,255,0.7)' : blue[500],
                                            fontSize: '30px'
                                        }} />
                                    </IconButton>
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            marginTop: showMap ? '0' : '8px',
                                            opacity: 0.7,
                                            color: darkMode ? '#ffffff' : '#000000',
                                            fontWeight: 500
                                        }}
                                    >
                                        {showMap ? 'Hide Map' : 'Show Map'}
                                    </Typography>
                                </div>
                            </div>
                            <div style={{
                                flex: showMap ? '1' : '0.6',
                                padding: '25px',
                                backgroundColor: darkMode ? '#2d2d2d' : 'white'
                            }}>
                                {showMap ? (
                                    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                                        <iframe
                                            title={`Map of ${selectedCountry.name.common}`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0, borderRadius: '12px' }}
                                            loading="lazy"
                                            allowFullScreen
                                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedCountry.name.common}`}
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '15px'
                                    }}>
                                        {[
                                            { icon: '🏛️', label: 'Capital', value: selectedCountry.capital || 'N/A' },
                                            { icon: '🗺️', label: 'Region', value: selectedCountry.region },
                                            { icon: '🧭', label: 'Subregion', value: selectedCountry.subregion || 'N/A' },
                                            { icon: '🆔', label: 'Country Code', value: selectedCountry.cca3 },
                                            { icon: '👥', label: 'Population', value: selectedCountry.population.toLocaleString() },
                                            { icon: '🗣️', label: 'Languages', value: Object.values(selectedCountry.languages || {}).join(', ') },
                                            { icon: '⏰', label: 'Timezones', value: selectedCountry.timezones?.join(', ') },
                                            { icon: '🌐', label: 'Borders', value: selectedCountry.borders ? selectedCountry.borders.join(', ') : 'None' },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,165,0,0.3)',
                                                    padding: '15px',
                                                    borderRadius: '10px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'default',
                                                    border: '2px solid #FF5F1F'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                    <span style={{ marginRight: '8px', fontSize: '18px' }}>{item.icon}</span>
                                                    <Typography variant="subtitle2" style={{
                                                        fontWeight: 'bold',
                                                        color: darkMode ? '#90caf9' : '#1976d2',
                                                        fontSize: '14px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {item.label}
                                                    </Typography>
                                                </div>
                                                <Typography style={{
                                                    marginLeft: '26px',
                                                    fontSize: '16px',
                                                    fontWeight: item.value === 'N/A' ? 'normal' : '500',
                                                    opacity: item.value === 'N/A' ? 0.5 : 1
                                                }}>
                                                    {item.value}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Document List Dialog */}
            {showDocumentDialog && (
                <Dialog
                    open={showDocumentDialog}
                    onClose={handleDocumentDialogClose}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        style: {
                            borderRadius: 15,
                            overflow: 'hidden',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                            backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                        }
                    }}
                >
                    <DialogTitle
                        style={{
                            fontWeight: 'bold',
                            fontSize: '30px',
                            textAlign: 'center',
                            background: 'linear-gradient(to right, #4caf50, #81c784)',
                            color: 'black',
                            padding: '25px 0',
                            border: '2px solid #4caf50',
                            position: 'relative',
                            borderBottom: '1px solid rgba(255,255,255,0.2)',
                            textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                            fontFamily: 'Poppins, sans-serif',
                            letterSpacing: '1px',
                        }}
                    >
                        <Typography
                            sx={{
                                position: 'absolute',
                                right: '15px',
                                top: '15px',
                                cursor: 'pointer',
                                fontSize: '24px',
                                opacity: '0.8',
                                transition: 'opacity 0.2s',
                                '&:hover': { opacity: '1' }
                            }}
                            onClick={handleDocumentDialogClose}
                        >
                            ×
                        </Typography>
                        📋 Document List
                    </DialogTitle>
                    <DialogContent
                        style={{
                            backgroundColor: darkMode ? '#696464' : '#fff8ef',
                            padding: '25px',
                            border: '2px solid #4caf50',
                            gap: '15px',
                            fontSize: '16px',
                            transition: 'all 0.3s ease-in-out',
                            color: darkMode ? '#ffffff' : 'inherit',
                            maxHeight: '70vh',
                            overflowY: 'auto'
                        }}
                    >
                        {documentList.length === 0 ? (
                            <Typography>No countries added to document list.</Typography>
                        ) : (
                            <>
                                <Button
                                    onClick={handleDownloadPDF}
                                    variant="contained"
                                    style={{
                                        backgroundColor: green[500],
                                        color: 'white',
                                        borderRadius: '10px',
                                        marginBottom: '20px',
                                        padding: '10px 20px'
                                    }}
                                >
                                    Download PDF
                                </Button>
                                {documentList.map((country, index) => (
                                    <div key={index} style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    src={country.flags.png}
                                                    alt={`${country.name.common} flag`}
                                                    style={{ width: '40px', height: 'auto', marginRight: '10px', borderRadius: '4px' }}
                                                />
                                                <Typography variant="h5" style={{
                                                    fontWeight: 'bold',
                                                    color: darkMode ? '#90caf9' : '#1976d2'
                                                }}>
                                                    {country.name.common}
                                                </Typography>
                                            </div>
                                            <Button
                                                onClick={() => setDocumentList(documentList.filter((_, i) => i !== index))}
                                                variant="contained"
                                                style={{
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    borderRadius: '10px',
                                                    padding: '5px 15px'
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '15px'
                                        }}>
                                            {[
                                                { icon: '🏛️', label: 'Capital', value: country.capital || 'N/A' },
                                                { icon: '🗺️', label: 'Region', value: country.region },
                                                { icon: '🧭', label: 'Subregion', value: country.subregion || 'N/A' },
                                                { icon: '🆔', label: 'Country Code', value: country.cca3 },
                                                { icon: '👥', label: 'Population', value: country.population.toLocaleString() },
                                                { icon: '🗣️', label: 'Languages', value: Object.values(country.languages || {}).join(', ') },
                                                { icon: '⏰', label: 'Timezones', value: country.timezones?.join(', ') },
                                                { icon: '🌐', label: 'Borders', value: country.borders ? country.borders.join(', ') : 'None' },
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(76,175,80,0.3)',
                                                        padding: '15px',
                                                        borderRadius: '10px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                        transition: 'all 0.2s ease',
                                                        cursor: 'default',
                                                        border: '2px solid #4caf50'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                        <span style={{ marginRight: '8px', fontSize: '18px' }}>{item.icon}</span>
                                                        <Typography variant="subtitle2" style={{
                                                            fontWeight: 'bold',
                                                            color: darkMode ? '#90caf9' : '#1976d2',
                                                            fontSize: '14px',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            {item.label}
                                                        </Typography>
                                                    </div>
                                                    <Typography style={{
                                                        marginLeft: '26px',
                                                        fontSize: '16px',
                                                        fontWeight: item.value === 'N/A' ? 'normal' : '500',
                                                        opacity: item.value === 'N/A' ? 0.5 : 1
                                                    }}>
                                                        {item.value}
                                                    </Typography>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {/* Alert message for favorites */}
            {alertMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                    color: darkMode ? '#000000' : 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    zIndex: 1500
                }}>
                    <Typography>{alertMessage}</Typography>
                </div>
            )}
        </div>
    );
};

export default CountryList;