class ConfigManager {
    constructor() {
        this.config = null;
    }

    async loadConfig() {
        try {
            const response = await fetch('content/config.json');
            if (!response.ok) {
                throw new Error('Kon configuratie niet laden');
            }
            this.config = await response.json();
            this.applyConfig();
        } catch (error) {
            console.error('Fout bij laden configuratie:', error);
            // Fallback naar standaard configuratie
            this.config = {
                titel: "Zorgtechnologie in de Fysiotherapie: Een Introductie",
                leerdoelen: [],
                organisatie: "iXperium Health",
                logo: "images/logo-health-transparant1.png",
                metadata: {
                    versie: "1.0.0",
                    laatsteUpdate: "2024-03-20",
                    auteur: "iXperium Health",
                    taal: "nl"
                },
                stijl: {
                    primairKleur: "#007bff",
                    secundairKleur: "#6c757d",
                    lettertype: "Arial, sans-serif"
                }
            };
        }
    }

    applyConfig() {
        // Update titel
        document.title = this.config.titel;
        const headerTitle = document.querySelector('.header-title');
        if (headerTitle) {
            headerTitle.textContent = this.config.titel;
        }

        // Update logo
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.src = this.config.logo;
            logo.alt = `${this.config.organisatie} - Centre of Expertise`;
        }

        // Update leerdoelen
        const leerdoelenSectie = document.querySelector('.leerdoelen-sectie ul');
        if (leerdoelenSectie) {
            leerdoelenSectie.innerHTML = this.config.leerdoelen
                .map(doel => `<li>${doel}</li>`)
                .join('');
        }

        // Apply styling
        const root = document.documentElement;
        root.style.setProperty('--primary-color', this.config.stijl.primairKleur);
        root.style.setProperty('--secondary-color', this.config.stijl.secundairKleur);
        root.style.setProperty('--font-family', this.config.stijl.lettertype);
    }

    getConfig() {
        return this.config;
    }
}

// Export de ConfigManager
window.ConfigManager = ConfigManager; 