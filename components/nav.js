(function () {
    const style = document.createElement('style');
    style.textContent = `
        /* ── Site Nav: Slim Sticky ──────────────────────────────────────── */

        /* Reset/override main.css nav rules */
        .nav-container::before {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            opacity: 0.07;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            background-repeat: repeat;
            background-size: 200px 200px;
        }
        .nav-container {
            background: linear-gradient(to bottom, #f7edd8 0%, #e8d8b4 100%);
            border-bottom: 2px solid #c8a870;
            width: 100%;
            height: auto !important;
            display: flex;
            align-items: stretch;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: none;
            transition: box-shadow 0.3s ease;
        }
        .nav-container.scrolled {
            box-shadow: 0 2px 10px rgba(80, 50, 20, 0.15);
        }
        .nav-container header {
            display: flex;
            align-items: center;
            width: 100%;
            font-size: 1rem;
            color: #3d2b1a;
            position: relative;
        }

        /* Logo */
        .logo {
            display: flex;
            align-items: center;
            height: auto;
            width: auto;
            padding: 0.5rem;
            flex-shrink: 0;
        }
        .logo img {
            width: 2.25rem;
            height: 2.25rem;
            display: block;
        }

        /* Nav wrapper */
        .nav-container nav {
            flex: 1;
            display: flex;
            align-items: center;
        }
        .nav-container nav ul {
            display: flex;
            align-items: center;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .nav-container nav li {
            float: none;
            padding: 0;
        }

        /* Tagline words — decorative, hidden on small phones */
        #nav-left {
            display: none;
            gap: 0.15rem;
            padding: 0 0.4rem;
        }
        #nav-left li {
            font-size: 0.6rem;
            letter-spacing: 0.15em;
            color: #b8956a;
            padding: 0 0.25rem;
            user-select: none;
        }

        /* Page links */
        #nav-right {
            position: static !important;
            margin-left: auto;
            margin-right: 0.6rem;
            gap: 0.1rem;
        }
        #nav-right li a {
            display: block;
            color: #3d2b1a;
            text-decoration: none;
            font-size: 0.78rem;
            letter-spacing: 0.08em;
            padding: 0.4em 0.55em;
            border-bottom: 2px solid transparent;
            transition: border-color 0.2s ease;
        }
        #nav-right li a:hover,
        .nav-container nav a:hover {
            color: #3d2b1a !important;
            background: none !important;
            border-bottom-color: #8b6a3a;
        }
        #nav-right li a.active {
            border-bottom-color: #8b6a3a;
            font-weight: 600;
        }

        /* Site title — centered absolutely so it's unaffected by left/right widths */
        #nav-title {
            display: none;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Oleo Script', Arial;
            font-size: 1rem;
            color: #3d2b1a;
            text-decoration: none;
            white-space: nowrap;
            letter-spacing: 0.03em;
            pointer-events: auto;
        }
        #nav-title:hover {
            color: #3d2b1a !important;
            background: none !important;
            opacity: 0.7;
        }

        /* Show tagline on larger phones and up */
        @media (min-width: 480px) {
            #nav-left { display: flex; }
        }

        /* Desktop */
        @media (min-width: 1024px) {
            .logo { padding: 0.75rem; }
            .logo img { width: 3rem; height: 3rem; }
            #nav-left { gap: 0.25rem; padding: 0 0.6rem; }
            #nav-left li {
                font-size: 0.95rem;
                letter-spacing: 0.2em;
                padding: 0 0.4rem;
            }
            #nav-right { margin-right: 1.25rem; gap: 0.35rem; }
            #nav-right li a {
                font-size: 1.1rem;
                letter-spacing: 0.1em;
                padding: 0.45em 0.7em;
            }
            #nav-title {
                display: block;
                font-size: 1.7rem;
            }
        }
    `;
    document.head.appendChild(style);

    class SiteNav extends HTMLElement {
        connectedCallback() {
            this.innerHTML = `
            <div class="nav-container">
                <header>
                    <a href="/index.html" class="logo">
                        <img src="/Media/airplane-logo.jpg" alt="Logo">
                    </a>
                    <a id="nav-title" href="/index.html">Adin's Adventure Log</a>
                    <nav>
                        <ul id="nav-left">
                            <li>EXPLORE</li>
                            <li>EMBRACE</li>
                            <li>ENJOY</li>
                        </ul>
                        <ul id="nav-right">
                            <li><a href="/MyTravels/destinations.html">MY TRAVELS</a></li>
                            <li><a href="/AboutMe/bio.html">ABOUT ME</a></li>
                        </ul>
                    </nav>
                </header>
            </div>`;

            // Highlight the active section's link
            const path = window.location.pathname;
            this.querySelectorAll('#nav-right a').forEach(a => {
                const section = a.getAttribute('href').split('/')[1];
                if (section && path.includes('/' + section + '/')) {
                    a.classList.add('active');
                }
            });

            // Add scroll shadow when page is not at top
            const navEl = this.querySelector('.nav-container');
            const onScroll = () => navEl.classList.toggle('scrolled', window.scrollY > 10);
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    }

    customElements.define('site-nav', SiteNav);
})();
