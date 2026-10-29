
function getPortfolioData() {
    function readData(key, fallback) {
        try {
            const saved = localStorage.getItem(key);

            if (saved === null) return fallback;

            const parsed = JSON.parse(saved);
            return parsed ?? fallback;
        } catch (error) {
            console.error(`Could not read ${key}:`, error);
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

// Only allow safe URLs in portfolio links.
function getSafeUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
        return "";
    }

    try {
        const url = new URL(value.trim());

        if (url.protocol === "https:" || url.protocol === "http:") {
            return url.href;
        }
    } catch (error) {
        return "";
    }

    return "";
}

// Render the social links using your existing HTML and assets.
function renderLinks(links) {
    const linkContainer = document.querySelector(".prfsnal-links");

    if (!linkContainer) return;

    const linkDetails = [
        {
            selector: ".lnk1",
            value: links.linkedInLink,
            image: "assets/Logos/linkedin.png",
            alt: "LinkedIn"
        },
        {
            selector: ".lnk2",
            value: links.githubLink,
            image: "assets/Logos/github.png",
            alt: "GitHub"
        },
        {
            selector: ".lnk3",
            value: links.instagramLink,
            image: "assets/Logos/instagram.png",
            alt: "Instagram"
        },
        {
            selector: ".lnk4",
            value: links.mailLink,
            image: "assets/Logos/gmail.png",
            alt: "Email"
        }
    ];

    let hasLinks = false;

    linkDetails.forEach((item) => {
        const box = linkContainer.querySelector(item.selector);

        if (!box) return;

        box.replaceChildren();

        let href;

        if (item.alt === "Email") {
            const email = String(item.value || "").trim();

            // Accept an email address, not an arbitrary URL.
            href = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? `mailto:${email}`
                : "";
        } else {
            href = getSafeUrl(item.value);
        }

        if (!href) return;

        const anchor = document.createElement("a");
        anchor.href = href;
        anchor.setAttribute("aria-label", item.alt);

        if (item.alt !== "Email") {
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
        }

        const image = document.createElement("img");
        image.className = "link-img";
        image.src = item.image;
        image.alt = item.alt;

        anchor.append(image);
        box.append(anchor);

        hasLinks = true;
    });

    linkContainer.style.opacity = hasLinks ? "1" : "0";
}

// Render skills using your existing skill data structure.
function createSkillBox(skill) {
    const skillCard = document.createElement("div");
    skillCard.className = "skills-card";

    const category = document.createElement("p");
    category.className = "skill-ctgry";
    category.textContent = skill.skill_name || "";

    const skillsBox = document.createElement("div");
    skillsBox.className = "skills-box";

    const list = document.createElement("ul");

    const skillNames = Array.isArray(skill.skill_consists)
        ? skill.skill_consists
        : [];

    skillNames.forEach((name) => {
        const item = document.createElement("li");
        item.className = "skill-name";
        item.textContent = name;
        list.append(item);
    });

    skillsBox.append(list);
    skillCard.append(category, skillsBox);

    return skillCard;
}

function renderSkills(skills) {
    const container = document.querySelector(".skills-container");
    if (!container) return;

    container.replaceChildren();

    if (!Array.isArray(skills)) return;

    skills.forEach((skill) => {
        container.append(createSkillBox(skill));
    });
}

// Reuse the project properties from your builder.
function projectCardGenerator(project) {
    const card = document.createElement("div");
    card.className = "prjct-crd";

    const titleBox = document.createElement("div");
    titleBox.className = "prjct-ttl-box";

    const infoBox = document.createElement("div");
    infoBox.className = "prjct-info-box";

    const title = document.createElement("p");
    title.textContent = project.projectTitle || "";

    const purpose = document.createElement("p");
    purpose.textContent = project.projectPurpose || "";

    titleBox.append(title);
    infoBox.append(purpose);

    const url = getSafeUrl(project.projectLink);

    if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Visit project ↗";
        infoBox.append(link);
    }

    const duration = document.createElement("p");
    const days = Number(project.projectCountDays);

    duration.textContent = Number.isFinite(days) && days > 0
        ? `${days} day${days === 1 ? "" : "s"}`
        : "";

    infoBox.append(duration);
    card.append(titleBox, infoBox);

    return card;
}

function renderPorjects(projects) {
    const container = document.querySelector(".projects-container");
    if (!container) return;

    container.replaceChildren();

    if (!Array.isArray(projects)) return;

    projects.forEach((project) => {
        container.append(projectCardGenerator(project));
    });
}

// Reuse your existing experience properties.
function expereinceCardCreator(experience) {
    const card = document.createElement("div");
    card.className = "exprnce-card";

    const company = document.createElement("p");
    company.textContent = `Worked at: ${experience.cmpny_name || ""}`;

    const duration = document.createElement("p");
    duration.textContent = experience.total_exprnce || "";

    const dates = document.createElement("p");
    dates.textContent = experience.start_date && experience.end_date
        ? `${experience.start_date} – ${experience.end_date}`
        : "";

    card.append(company, duration, dates);

    return card;
}

function renderExperienceCards(experiences) {
    const container = document.querySelector(".experience-container");
    if (!container) return;

    container.replaceChildren();

    if (!Array.isArray(experiences)) return;

    experiences.forEach((experience) => {
        container.append(expereinceCardCreator(experience));
    });
}

// Reuse your existing education properties.
function educationCardCreator(education) {
    const card = document.createElement("div");
    card.className = "edcsn-card";

    const degree = document.createElement("p");
    degree.textContent = education.degree_type || "";

    const college = document.createElement("p");
    college.textContent = education.college_name || "";

    const cgpa = document.createElement("p");
    cgpa.textContent = education.cgpa ?? "";

    card.append(degree, college, cgpa);

    return card;
}

function renderEducationcards(educationList) {
    const container = document.querySelector(".education-container");
    if (!container) return;

    container.replaceChildren();

    if (!Array.isArray(educationList)) return;

    educationList.forEach((education) => {
        container.append(educationCardCreator(education));
    });
}

// Reuse your existing certification properties.
function certificationCardCreator(certification) {
    const card = document.createElement("div");
    card.className = "certificate-card";

    const course = document.createElement("p");
    course.textContent = `Certified in: ${certification.course_name || ""}`;

    const issuer = document.createElement("p");
    issuer.textContent = `Certified by: ${certification.cmpny_issued || ""}`;

    const id = document.createElement("p");
    id.textContent = `Certificate ID: ${certification.certificate_id || ""}`;

    card.append(course, issuer, id);

    return card;
}

function renderCertificatecards(certifications) {
    const container = document.querySelector(".certification-container");
    if (!container) return;

    container.replaceChildren();

    if (!Array.isArray(certifications)) return;

    certifications.forEach((certification) => {
        container.append(certificationCardCreator(certification));
    });
}

// Reuse your existing achievement properties.
function achvmntCardCreator(achievement) {
    const card = document.createElement("div");
    card.className = "achvmnt-card";

    const role = document.createElement("p");
    role.textContent = `Achievement: ${achievement.achvmnt_role || ""}`;

    const reason = document.createElement("p");
    reason.textContent = `Reason: ${achievement.achvmnt_rsn || ""}`;

    card.append(role, reason);

    return card;
}

function renderAchievmentCards(achievements) {
    const container = document.querySelector(".achivements-container");
    if (!container) return;

    container.replaceChildren();

    if (!Array.isArray(achievements)) return;

    achievements.forEach((achievement) => {
        container.append(achvmntCardCreator(achievement));
    });
}

// Populate the complete portfolio from saved data.
function renderPortfolio() {
    const data = getPortfolioData();

    const name = document.querySelector(".user-name");
    const role = document.querySelector(".user-aim");
    const vision = document.querySelector(".user-vision");

    if (name) {
        name.textContent = data.identity.userName || "Your Name";
    }

    if (role) {
        role.textContent = data.identity.userRole || "Your Role";
    }

    if (vision) {
        vision.textContent =
            data.identity.userVision || "Your vision statement";
    }

    renderLinks(data.links);
    renderSkills(data.skills);
    renderPorjects(data.projects);
    renderExperienceCards(data.experience);
    renderEducationcards(data.education);
    renderCertificatecards(data.certifications);
    renderAchievmentCards(data.achievements);

    console.log("Portfolio rendered successfully.");
}

renderPortfolio();
