
document.addEventListener("DOMContentLoaded", () => {
    const downloadButton = document.querySelector("#download-portfolio");

    if (!downloadButton) {
        console.error("Download button not found.");
        return;
    }
    let byPass = false;
    document.getElementById("publish-site").onclick = () => {
        byPass = true;
        document.getElementById("download-portfolio").click();
        const getNetlifyId = prompt("Enter your netlify account-id : ");
        if (getNetlifyId === '') {
            window.open("https://www.netlify.com/", "_blank");
            return;
        }
        window.open(`https://app.netlify.com/teams/${getNetlifyId}/projects`, "_blank");

        byPass = false;
    }
    downloadButton.addEventListener("click", downloadPortfolio);

    async function downloadPortfolio() {
        if (!byPass) {
            const confirDownload = confirm("are you sure to download your portfolio ?");
            if (!confirDownload) {
                return;
            }
        }

        downloadButton.disabled = true;
        const originalText = downloadButton.textContent;
        downloadButton.textContent = "Preparing portfolio...";

        try {
            const data = getPortfolioDataForExport();

            // Load the existing portfolio HTML and CSS.
            const [htmlResponse, cssResponse] = await Promise.all([
                fetch("portfolio.html"),
                fetch("portfolio.css")
            ]);

            if (!htmlResponse.ok || !cssResponse.ok) {
                throw new Error(
                    "Could not load portfolio.html or portfolio.css. " +
                    "Check your Live Server project paths."
                );
            }

            const htmlText = await htmlResponse.text();
            let cssText = await cssResponse.text();

            const parser = new DOMParser();
            const portfolioDocument = parser.parseFromString(
                htmlText,
                "text/html"
            );

            // Remove the external stylesheet and script references.
            portfolioDocument
                .querySelectorAll('link[rel="stylesheet"], script[src]')
                .forEach((element) => element.remove());

            // Populate the existing portfolio structure.
            const setText = (selector, value, fallback) => {
                const element = portfolioDocument.querySelector(selector);
                if (element) {
                    element.textContent = value || fallback;
                }
            };

            setText(".user-name", data.identity.userName, "Your Name");
            setText(".user-aim", data.identity.userRole, "Your Role");
            setText(
                ".user-vision",
                data.identity.userVision,
                "Your vision statement"
            );

            // Render all sections using the same data structures.
            renderExportSkills(portfolioDocument, data.skills);
            renderExportProjects(portfolioDocument, data.projects);
            renderExportExperience(portfolioDocument, data.experience);
            renderExportEducation(portfolioDocument, data.education);
            renderExportCertifications(
                portfolioDocument,
                data.certifications
            );
            renderExportAchievements(
                portfolioDocument,
                data.achievements
            );

            await renderExportLinks(portfolioDocument, data.links);

            // Embed the profile image.
            const profileImage = portfolioDocument.querySelector(".vision-img");

            if (profileImage) {
                profileImage.src = await assetToDataUrl(
                    "assets/Images/vision-img.png"
                );
            }

            // Embed the social logos in the CSS-generated portfolio.
            const assetPaths = [
                "assets/Images/vision-img.png",
                "assets/Logos/linkedin.png",
                "assets/Logos/github.png",
                "assets/Logos/instagram.png",
                "assets/Logos/gmail.png"
            ];

            const assetMap = {};

            await Promise.all(assetPaths.map(async (path) => {
                assetMap[path] = await assetToDataUrl(path);
            }));

            // Convert CSS url(...) references to embedded data URLs.
            for (const [path, dataUrl] of Object.entries(assetMap)) {
                const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

                cssText = cssText.replace(
                    new RegExp(`(["'])?${escapedPath}\\1?`, "g"),
                    dataUrl
                );
            }

            // Make the exported page use its own full viewport.
            cssText += `
                html, body {
                    min-height: 100%;
                    margin: 0;
                }

                .portfolio-box {
                    min-height: 100vh;
                    height: auto;
                    overflow: visible;
                }

                .prfsnal-links {
                    opacity: 1;
                }
            `;

            const styleElement = portfolioDocument.createElement("style");
            styleElement.textContent = cssText;
            portfolioDocument.head.append(styleElement);

            // No builder script or localStorage dependency in the export.
            portfolioDocument.title =
                `${data.identity.userName || "My"} - Portfolio`;

            const finalHtml =
                "<!DOCTYPE html>\n" +
                portfolioDocument.documentElement.outerHTML;

            const blob = new Blob(
                [finalHtml],
                { type: "text/html;charset=utf-8" }
            );

            const blobUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");

            downloadLink.href = blobUrl;
            downloadLink.download = "my-portfolio.html";

            document.body.append(downloadLink);
            downloadLink.click();
            downloadLink.remove();

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        } catch (error) {
            console.error("Portfolio export failed:", error);
            alert(
                "Could not export the portfolio. Check the browser console " +
                "for details and make sure Live Server is running."
            );
        } finally {
            downloadButton.disabled = false;
            downloadButton.textContent = originalText;
        }
    }

    function getPortfolioDataForExport() {
        function readData(key, fallback) {
            try {
                const value = localStorage.getItem(key);
                if (value === null) return fallback;

                const parsed = JSON.parse(value);
                return parsed ?? fallback;
            } catch (error) {
                console.warn(`Could not read ${key}:`, error);
                return fallback;
            }
        }

        return {
            identity: readData("getuserIdentity", {}),
            links: readData("getUserLinks", {}),
            skills: readData("userSkills", []),
            projects: readData("userProjects", []),
            experience: readData("userExperience", []),
            education: readData("userEducation", []),
            certifications: readData("userCertification", []),
            achievements: readData("userAchievments", [])
        };
    }

    async function assetToDataUrl(path) {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Could not load asset: ${path}`);
        }

        const blob = await response.blob();

        return await new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);

            reader.readAsDataURL(blob);
        });
    }

    function safeExternalUrl(value) {
        try {
            const url = new URL(value);

            return ["https:", "http:"].includes(url.protocol)
                ? url.href
                : "";
        } catch {
            return "";
        }
    }

    function appendTextElement(parent, tag, className, text) {
        const element = parent.ownerDocument.createElement(tag);
        element.className = className;
        element.textContent = text ?? "";
        parent.append(element);

        return element;
    }

    function renderExportSkills(doc, skills) {
        const container = doc.querySelector(".skills-container");
        if (!container) return;

        container.replaceChildren();

        (Array.isArray(skills) ? skills : []).forEach((skill) => {
            const card = doc.createElement("div");
            card.className = "skills-card";

            appendTextElement(
                card, "p", "skill-ctgry", skill.skill_name
            );

            const box = doc.createElement("div");
            box.className = "skills-box";

            const list = doc.createElement("ul");

            (Array.isArray(skill.skill_consists)
                ? skill.skill_consists
                : []
            ).forEach((name) => {
                appendTextElement(list, "li", "skill-name", name);
            });

            box.append(list);
            card.append(box);
            container.append(card);
        });
    }

    function renderExportProjects(doc, projects) {
        const container = doc.querySelector(".projects-container");
        if (!container) return;

        container.replaceChildren();

        (Array.isArray(projects) ? projects : []).forEach((project) => {
            const card = doc.createElement("div");
            card.className = "prjct-crd";

            const titleBox = doc.createElement("div");
            titleBox.className = "prjct-ttl-box";
            appendTextElement(
                titleBox, "p", "", "Title : " + project.projectTitle
            );

            const info = doc.createElement("div");
            info.className = "prjct-info-box";

            appendTextElement(
                info, "p", "", "Purpose : " + project.projectPurpose
            );

            const url = safeExternalUrl(project.projectLink);

            if (url) {
                const link = doc.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = "Visit project ↗";
                info.append(link);
            }

            if (project.projectCountDays != null) {
                appendTextElement(
                    info,
                    "p",
                    "",
                    `No of days took : ${project.projectCountDays} days`
                );
            }

            card.append(titleBox, info);
            container.append(card);
        });
    }

    function renderExportExperience(doc, experiences) {
        const container = doc.querySelector(".experience-container");
        if (!container) return;

        container.replaceChildren();

        (Array.isArray(experiences) ? experiences : []).forEach((item) => {
            const card = doc.createElement("div");
            card.className = "exprnce-card";

            appendTextElement(
                card, "p", "",
                `Worked at: ${item.cmpny_name || ""}`
            );

            appendTextElement(
                card, "p", "", "total experience : " + item.total_exprnce || ""
            );

            appendTextElement(
                card, "p", "",
                [item.start_date, item.end_date].filter(Boolean).join(" – ")
            );

            container.append(card);
        });
    }

    function renderExportEducation(doc, educationList) {
        const container = doc.querySelector(".education-container");
        if (!container) return;

        container.replaceChildren();

        (Array.isArray(educationList) ? educationList : []).forEach((item) => {
            const card = doc.createElement("div");
            card.className = "edcsn-card";

            appendTextElement(card, "p", "", item.degree_type);
            appendTextElement(card, "p", "", item.college_name);
            appendTextElement(card, "p", "", item.cgpa);

            container.append(card);
        });
    }

    function renderExportCertifications(doc, certifications) {
        const container = doc.querySelector(".certification-container");
        if (!container) return;

        container.replaceChildren();

        (Array.isArray(certifications) ? certifications : []).forEach((item) => {
            const card = doc.createElement("div");
            card.className = "certificate-card";

            appendTextElement(
                card, "p", "", `Certified in: ${item.course_name || ""}`
            );

            appendTextElement(
                card, "p", "", `Certified by: ${item.cmpny_issued || ""}`
            );

            appendTextElement(
                card, "p", "", `Certificate ID: ${item.certificate_id || ""}`
            );

            container.append(card);
        });
    }

    function renderExportAchievements(doc, achievements) {
        const container = doc.querySelector(".achivements-container");
        if (!container) return;

        container.replaceChildren();

        (Array.isArray(achievements) ? achievements : []).forEach((item) => {
            const card = doc.createElement("div");
            card.className = "achvmnt-card";

            appendTextElement(
                card, "p", "", `Achievement: ${item.achvmnt_role || ""}`
            );

            appendTextElement(
                card, "p", "", `Reason: ${item.achvmnt_rsn || ""}`
            );

            container.append(card);
        });
    }

    async function renderExportLinks(doc, links) {
        const container = doc.querySelector(".prfsnal-links");
        if (!container) return;

        const details = [
            ["lnk1", links.linkedInLink, "assets/Logos/linkedin.png", "LinkedIn"],
            ["lnk2", links.githubLink, "assets/Logos/github.png", "GitHub"],
            ["lnk3", links.instagramLink, "assets/Logos/instagram.png", "Instagram"],
            ["lnk4", links.mailLink, "assets/Logos/gmail.png", "Email"]
        ];

        let hasLinks = false;

        for (const [className, value, imagePath, label] of details) {
            const box = container.querySelector(`.${className}`);
            if (!box) continue;

            box.replaceChildren();

            let href;

            if (label === "Email") {
                const email = String(value || "").trim();

                href = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? `mailto:${email}`
                    : "";
            } else {
                href = safeExternalUrl(value);
            }

            if (!href) continue;

            const anchor = doc.createElement("a");
            anchor.href = href;
            anchor.setAttribute("aria-label", label);

            if (label !== "Email") {
                anchor.target = "_blank";
                anchor.rel = "noopener noreferrer";
            }

            const img = doc.createElement("img");
            img.className = "link-img";
            img.src = await assetToDataUrl(imagePath);
            img.alt = label;

            anchor.append(img);
            box.append(anchor);

            hasLinks = true;
        }

        container.style.opacity = hasLinks ? "1" : "0";
    }
});
