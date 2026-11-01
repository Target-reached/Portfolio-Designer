const userName = document.querySelector('.user-name');
const getUser_name = document.getElementById("user-name-inp");
const getUser_idnty = document.getElementById("user-role-inp");
const userRole = document.querySelector('.user-aim');
const getUSer_vision = document.getElementById("user-vision-inp");
const userVision = document.querySelector('.user-vision');
const getLinkdinLink = document.getElementById("linkdin");
const getGithubLink = document.getElementById("github");
const getInstaLink = document.getElementById("instagram");
const getMailLink = document.getElementById("mail");


const lowerKeys = [
    "a", "b", "c", "d", "e", "f", "g",
    "h", "i", "j", "k", "l", "m", "n",
    "o", "p", "q", "r", "s", "t", "u",
    "v", "w", "x", "y", "z"
];
const upperKeys = [
    "A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T", "U",
    "V", "W", "X", "Y", "Z", " "

];

let userProfiler = {}
let userLinks = {}
let userSkills = []
userSkills = getItem("userSkills");
let userExperience = [];
userExperience = getItem("userExperience");
let userProjects = [];
userProjects = getItem("userProjects") || [];
let userEducation = [];
userEducation = getItem("userEducation") || [];
let userCertification = [];
userCertification = getItem("userCertification") || [];
let userAchievments = [];
userAchievments = getItem("userAchievments") || [];



function setLocalStorage(storageName, dataset) {
    localStorage.setItem(`${storageName}`, JSON.stringify(dataset));
}
function getLocatStorage(storageName) {
    const savedData = JSON.parse(localStorage.getItem(`${storageName}`)) || {};
    return savedData;
}
let getProfileInfo = getLocatStorage("getuserIdentity");
userProfiler = getProfileInfo;
let getLinksInfo = getLocatStorage("getUserLinks");
userLinks = getLinksInfo;

document.querySelector(".sv-info").onclick = () => {
    getProfileInfo = {}
    userProfiler.userName = getUser_name.value.trim();
    userProfiler.userRole = getUser_idnty.value.trim();
    userProfiler.userVision = getUSer_vision.value.trim();

    setLocalStorage("getuserIdentity", userProfiler);
    preserveInfo();

}


function inputFieldListener(inputTag, displayAt) {
    inputTag.addEventListener('input', (e) => {
        displayAt.textContent = inputTag.value.trim();
    });
}
inputFieldListener(getUser_name, userName);
inputFieldListener(getUser_idnty, userRole);
inputFieldListener(getUSer_vision, userVision);
function preserveInfo() {
    if (Object.keys(getProfileInfo).length == 0) {
        return;
    }
    getUser_name.value = getProfileInfo.userName;
    getUser_idnty.value = getProfileInfo.userRole;
    getUSer_vision.value = getProfileInfo.userVision;

    userName.textContent = '';
    userRole.textContent = ''
    userVision.textContent = '';
    userName.textContent = getProfileInfo.userName;
    userRole.textContent = getProfileInfo.userRole;
    userVision.textContent = getProfileInfo.userVision;
}
preserveInfo();


function linkCreator(link, sourse) {
    const createLink = document.createElement('a');
    createLink.href = `${link}`;
    createLink.target = "_blank";

    const linkImg = document.createElement('img');
    linkImg.className = 'link-img';
    linkImg.src = `${sourse}`;
    createLink.append(linkImg);
    return createLink;

}


function linkGenerator(inpField, keyword, sourseImg, appendPosition) {
    let typingtimer;
    inpField.addEventListener('input', (e) => {
        document.querySelector('.prfsnal-links').style.opacity = '1';
        clearInterval(typingtimer);
        appendPosition.innerHTML = '';
        const getURL = inpField.value.trim();
        typingtimer = setTimeout(() => {
            if (getURL.includes(keyword)) {
                const generatedLink = linkCreator(getURL, `${sourseImg}`);
                if (getURL === '') {
                    appendPosition.innerHTML = '';
                    return;
                }
                appendPosition.append(generatedLink);
            } else {
                if (getURL == '') {
                    return;
                }
                inpField.value = "Invalid Link!";
                setTimeout(() => {
                    inpField.value = '';
                    return;
                }, 1000);
            }
        }, 2000);

    });
}
const linkdinImg = "assets/Logos/linkedin.png"
const githubImg = "assets/Logos/github.png"
const instagramImg = "assets/Logos/instagram.png"
const mailImg = "assets/Logos/gmail.png"

const linkdin = "linkedin";
const github = "github";
const instagram = "instagram";
const mail = "gmail.com";

function preserveLinks() {
    if (Object.keys(userLinks).length == 0) {
        return;
    }

    getLinkdinLink.value = userLinks.linkedInLink;
    getGithubLink.value = userLinks.githubLink;
    getInstaLink.value = userLinks.instagramLink;
    getMailLink.value = userLinks.mailLink;

    getLinkdinLink.dispatchEvent(new Event("input"));
    getGithubLink.dispatchEvent(new Event("input"));
    getInstaLink.dispatchEvent(new Event("input"));
    getMailLink.dispatchEvent(new Event("input"));


}
preserveLinks();

document.querySelector(".sv-lnks").onclick = () => {
    userLinks = {};
    userLinks.linkedInLink = getLinkdinLink.value.trim();
    userLinks.githubLink = getGithubLink.value.trim();
    userLinks.instagramLink = getInstaLink.value.trim();
    userLinks.mailLink = getMailLink.value.trim();

    setLocalStorage("getUserLinks", userLinks);
    userLinks = getLocatStorage("getUserLinks");
    preserveLinks();
}


linkGenerator(getLinkdinLink, linkdin, linkdinImg, document.querySelector(".lnk1"));
linkGenerator(getGithubLink, github, githubImg, document.querySelector(".lnk2"));
linkGenerator(getInstaLink, instagram, instagramImg, document.querySelector(".lnk3"));
linkGenerator(getMailLink, mail, mailImg, document.querySelector(".lnk4"));

setTimeout(() => {
    document.querySelector(".sv-lnks")?.click();
}, 2000);

const addCtgry = document.querySelector(".skl-addr");
const skillRender = document.querySelector(".sklls-info");
const saveSkills = document.querySelector(".sv-sklls");
function skillBoxCreator() {

    const ctgryBox = document.createElement("div");
    ctgryBox.className = 'ctgry-box';
    const para = document.createElement("p");
    para.textContent = "Enter category : ";
    const inputCtgry = document.createElement("input");
    inputCtgry.className = "ctgry-input"
    inputCtgry.placeholder = 'like front end category...';
    const skillAddrBtn = document.createElement("button");
    skillAddrBtn.className = 'skill-adder';
    skillAddrBtn.textContent = "add Skill";

    ctgryBox.append(para, inputCtgry, skillAddrBtn);

    skillAddrBtn.onclick = () => {

        const skillBox = document.createElement("div");
        skillBox.className = 'skill-box'
        const paraSkill = document.createElement("p");
        paraSkill.textContent = "Enter skill name : ";
        const skillName = document.createElement("input");
        skillName.placeholder = 'Example...HTML';
        skillName.className = 'skill-name';

        skillBox.append(paraSkill, skillName);
        ctgryBox.append(skillBox);

        return ctgryBox;
    }
    return ctgryBox;

}

addCtgry.onclick = () => {
    skillRender.innerHTML = '';
    const makeSkill = skillBoxCreator();
    skillRender.prepend(makeSkill);

}

function setItem(itemName, dataset) {
    localStorage.setItem(`${itemName}`, JSON.stringify(dataset));
}

function getItem(itemName) {
    const data = localStorage.getItem(`${itemName}`);

    if (data === null || data === "undefined") {
        return [];
    }
    const getItem = JSON.parse(data) || [];
    return getItem;
}

const skillsContainer = document.querySelector(".skills-container");
function createSkillBox(userSkills) {
    const skillCard = document.createElement("div");
    skillCard.className = 'skills-card';
    const skillCtgry = document.createElement("p");
    skillCtgry.className = 'skill-ctgry';
    skillCtgry.textContent = userSkills.skill_name;
    const skillsBox = document.createElement("div");
    skillsBox.className = 'skills-box';
    const listBx = document.createElement("ul");

    userSkills.skill_consists.forEach((each_skill) => {
        const skillName = document.createElement("li");
        skillName.className = 'skill-name';
        skillName.textContent = each_skill;
        listBx.append(skillName);
        skillsBox.append(listBx);

    });
    skillCard.append(skillCtgry, skillsBox);

    return skillCard;

}


saveSkills.onclick = () => {

    const getUserSkills = getItem("userSkills");
    userSkills = getUserSkills;
    const allCtgrys = document.querySelectorAll("input[class='ctgry-input']");
    if (allCtgrys.length == 0) {
        alert("add skills first!");
        return;
    }
    allCtgrys.forEach((each_ctgry) => {
        const ctgry_name = each_ctgry.value.trim();
        const ctgryBox = each_ctgry.parentElement;
        const allSkills = ctgryBox.querySelectorAll(".skill-name");
        let skills = [];
        let duplicateFound = false;
        if (ctgry_name === '') {
            alert("Skills should not be empty!")
            return;
        };
        const isCatgryExists = userSkills.find((each_ctgry) => {
            return each_ctgry.skill_name === ctgry_name
        });
        allSkills.forEach((each_skill) => {
            const each_skill_name = each_skill.value.trim();
            if (each_skill_name !== '') {
                if (isCatgryExists && isCatgryExists.skill_consists.includes(each_skill_name) || skills.includes(each_skill_name)) {
                    duplicateFound = true;
                    return;
                }

                skills.push(each_skill_name);
            }


        });

        if (duplicateFound) {
            alert("skill already exists in same category!");
            return;
        }
        if (isCatgryExists) {
            skills.forEach((each_skill) => {
                isCatgryExists.skill_consists.push(each_skill);
            });
        } else {
            const newSkillObject = {
                skill_name: ctgry_name,
                skill_consists: skills
            };
            userSkills.push(newSkillObject);
            alert("Skills Saved Succesfully!");
        }

    });

    setItem("userSkills", userSkills);
    userSkills = getItem("userSkills");

    renderSkills(userSkills);

    return;
}
function renderSkills(userSkills) {
    if (userSkills.length === 0) {
        return;
    }
    skillsContainer.innerHTML = '';
    userSkills.forEach((eachSKill) => {
        const generateSkillCard = createSkillBox(eachSKill);
        skillsContainer.append(generateSkillCard);
    });
    return;
}
renderSkills(userSkills);


function projectCardCreator(projectInfo) {
    const projectCard = document.createElement("div");
    projectCard.className = 'porject-card';
    const projectNameCard = document.createElement("div");
    projectNameCard.className = 'prjct-nm-crd';
    const projectInfocard = document.createElement("div");
    projectInfocard.className = 'prjct-inf-crd';
    const projectTitle = document.createElement("p");
    projectTitle.textContent = projectInfo.projectName;
    projectTitle.className = 'prjct-ttle';
    const projectPurpose = document.createElement("p");
    projectPurpose.className = 'prjct-prpse';
    projectPurpose.textContent = projectPurpose.projectPurpose;
    const projectLink = document.createElement("p");
    projectLink.className = 'prjct-lnk';
    projectLink.textContent = projectInfo.projectLink;
    const daysCount = document.createElement("p");
    daysCount.className = 'prjct-dyscunt';

    if (projectInfo.projectDaysCount > 1) {
        daysCount.textContent = `${projectInfo.daysCount} days`;
    } else {
        daysCount.textContent = `${projectInfo.daysCount} day`;
    }
    projectNameCard.append(projectTitle);
    projectInfocard.append(projectPurpose, projectLink);
    projectCard.append(projectNameCard, projectInfocard);

    return projectCard;


}
function projectInfoPrompter() {
    const projectPromptBox = document.createElement("div");
    projectPromptBox.className = 'prjct-prmpt-box';
    const title_para = document.createElement("p");
    title_para.textContent = 'Enter project title : ';
    const prpse_para = document.createElement("p");
    prpse_para.textContent = 'Enter purpose of this project';
    const lnk_para = document.createElement("p");
    lnk_para.textContent = 'Paste the link of the project here';
    const dyscunt_para = document.createElement("p");
    dyscunt_para.textContent = 'In how many days did you finish this project? : ';
    const project_Title = document.createElement("input");
    project_Title.placeholder = 'project title here..'
    project_Title.className = 'prjct-ttle-inp';
    const project_Purpose = document.createElement("input");
    project_Purpose.placeholder = 'project purpose here..'
    project_Purpose.className = 'prjct-prpse-inp';
    const project_Link = document.createElement("input");
    project_Link.placeholder = 'project link here..'
    project_Link.className = 'prjct-lnk-inp';
    const project_daysCount = document.createElement("input");
    project_daysCount.placeholder = 'how many days does it took to finsh the project..';
    project_daysCount.className = 'prjcts-dscnt-inp';

    projectPromptBox.append(title_para,
        project_Title, prpse_para,
        project_Purpose,
        lnk_para,
        project_Link,
        dyscunt_para,
        project_daysCount
    );


    return projectPromptBox;

}

const saveProjectBtn = document.querySelector(".sv-prjcts");
const projectsBox = document.querySelector(".prjcts-box");
const addProjectBtn = document.querySelector(".add-prjcts");

let projectAdded = false;
addProjectBtn.onclick = () => {
    projectsBox.innerHTML = '';
    const generateProjectPromptBox = projectInfoPrompter();
    projectsBox.append(generateProjectPromptBox);
    projectAdded = true;
}

function projectCardGenerator(userProjects) {
    const projectCard = document.createElement("div");
    projectCard.className = 'prjct-crd';
    const projectCardTitle = document.createElement("div");
    projectCardTitle.className = 'prjct-ttl-box';
    const projectCardInfo = document.createElement("div");
    projectCardInfo.className = 'prjct-info-box';

    const projectTitle = document.createElement("p");
    projectTitle.textContent = `Title : ${userProjects.projectTitle}`;
    const projectPurpose = document.createElement("p");
    projectPurpose.textContent = "Purpose : " + userProjects.projectPurpose;
    const projectLnk = document.createElement("a");
    projectLnk.href = `${userProjects.projectLink}`;
    projectLnk.target = '_blank';

    const projectLink = document.createElement("p");
    projectLink.textContent = "visit project ↗ ";
    const projectTime = document.createElement("p");
    projectTime.textContent = "no of days took : " + userProjects.projectCountDays;

    projectCardTitle.append(projectTitle);
    projectLnk.append(projectLink);
    projectCardInfo.append(projectPurpose, projectLnk, projectTime);
    projectCard.append(projectCardTitle, projectCardInfo);

    return projectCard;

}
saveProjectBtn.onclick = () => {
    if (!projectAdded) {
        alert("add project details first!");
        return;
    }
    const getProjectTitle = document.querySelector(".prjct-ttle-inp").value.trim().toLowerCase();
    const getPorjectPurpose = document.querySelector(".prjct-prpse-inp").value.trim().toLowerCase();;
    const getProjectLink = document.querySelector(".prjct-lnk-inp").value.trim();
    const getProjectDaysCount = Number(document.querySelector(".prjcts-dscnt-inp").value);

    if (getProjectTitle === '' || getPorjectPurpose === '' || getProjectLink === '' || getProjectDaysCount === '') {
        alert("Project details cannot be empty!");
        return;
    }
    const newProject = {
        projectTitle: getProjectTitle,
        projectPurpose: getPorjectPurpose,
        projectLink: getProjectLink,
        projectCountDays: getProjectDaysCount
    };
    console.log(newProject.projectLink);
    if (userProjects.some((project) => project.projectTitle === newProject.projectTitle)) {
        alert("project already exists!");
        return;
    }
    userProjects.push(newProject);
    alert("project saved!");
    document.querySelector(".prjct-prmpt-box").remove();


    setItem("userProjects", userProjects);
    userProjects = getItem("userProjects");
    renderPorjects(userProjects);

}

function renderPorjects(userProjects) {
    if (userProjects.length === 0) {
        return;
    }
    document.querySelector(".projects-container").innerHTML = '';
    userProjects.forEach((project) => {
        const createProjectCad = projectCardGenerator(project);
        document.querySelector(".projects-container").append(createProjectCad);
    });
}
renderPorjects(userProjects);

const addExperienceBtn = document.querySelector(".add-exprnce");
const saveExperienceBtn = document.querySelector(".sv-exprnce");

function expereincePromptBox() {
    const exprncePromptBox = document.createElement("div");
    exprncePromptBox.className = 'exprnce-prmpt-bx';
    const exprncePromptPara = document.createElement("p");
    exprncePromptPara.textContent = 'Enter company name : ';
    const cmpnyTitleInp = document.createElement("input");
    cmpnyTitleInp.className = 'cmpny-ttl-inp';
    cmpnyTitleInp.placeholder = 'ex - openai'
    const strtDtePara = document.createElement("p");
    strtDtePara.textContent = "start date : ";
    const strtDateInp = document.createElement("input");
    strtDateInp.className = 'strt-dte-inp';
    strtDateInp.placeholder = 'ex - 22-10-2025';
    const endDtePara = document.createElement("p");
    endDtePara.textContent = 'end-date :';
    const endDteInp = document.createElement("input");
    endDteInp.className = 'end-dte-inp';
    endDteInp.placeholder = 'ex - 22-10-2026';

    exprncePromptBox.append(
        exprncePromptPara,
        cmpnyTitleInp,
        strtDtePara,
        strtDateInp,
        endDtePara,
        endDteInp
    );
    return exprncePromptBox;

}
let experienceAdded = false;
addExperienceBtn.onclick = () => {
    experienceAdded = true;
    document.querySelector(".exprnce-container").innerHTML = '';
    const generateExprncePromptBox = expereincePromptBox();
    document.querySelector(".exprnce-container").append(generateExprncePromptBox);

}

function expereinceCardCreator(userExperince) {
    const exprnceCard = document.createElement("div");
    exprnceCard.className = 'exprnce-card';
    const cmpnyNamePara = document.createElement("p");
    cmpnyNamePara.textContent = `worked in : ${userExperince.cmpny_name} company`;
    cmpnyNamePara.className = 'cmpny-tle';
    const dsplayExprnce = document.createElement("div");
    dsplayExprnce.textContent = `total experience : ${userExperince.total_exprnce}`;

    exprnceCard.append(cmpnyNamePara, dsplayExprnce);

    return exprnceCard;

}

saveExperienceBtn.onclick = () => {



    const currentDate = new Date();
    const cDay = currentDate.getDate();
    const cMonth = currentDate.getMonth();
    const cYear = currentDate.getFullYear();
    const getCmpnyName = document.querySelector(".cmpny-ttl-inp").value.trim();
    const getStrtDate = String(document.querySelector(".strt-dte-inp").value.trim()).replaceAll("/", "-")
    const getEndDate = String(document.querySelector(".end-dte-inp").value.trim()).replaceAll("/", "-");

    if (getCmpnyName == '' || getStrtDate == '' || getEndDate == '') {
        alert("experience data should not be empty!");
        return;
    }
    experienceAdded = true;
    if (!experienceAdded) {
        alert("add expereince first!");
        return;
    }
    if (!(getStrtDate.includes("-") && getEndDate.includes("-"))) {
        document.querySelector(".strt-dte-inp").value = 'enter proper format!';
        document.querySelector(".end-dte-inp").value = 'enter proper format!';
        setTimeout(() => {
            document.querySelector(".strt-dte-inp").value = '';
            document.querySelector(".end-dte-inp").value = ''
        }, 1000);
        return;
    }
    const [sday, smonth, syear] = getStrtDate.split("-").map(Number);
    const [eday, emonth, eyear] = getEndDate.split("-").map(Number);

    const endDate = new Date(eyear, emonth - 1, eday).toLocaleDateString("en-GB").replaceAll("/", "-");
    const today = new Date(cYear, cMonth, cDay).toLocaleDateString("en-GB").replaceAll("/", "-");


    if (endDate > today) {
        document.querySelector(".end-dte-inp").value = 'time period not allowed!';
        setTimeout(() => {
            document.querySelector(".end-dte-inp").value = getEndDate;
        }, 1000);
    }

    let ed = eday - sday;
    let em = emonth - smonth;
    let ey = eyear - syear;

    if (ed < 0) {
        em--;
        ed += new Date(eyear, emonth - 1, 0).getDate();
    }
    if (em < 0) {
        ey--;
        em += 12;
    }
    const totalExprnce = `${ey} year (s) ${em} months ${ed} day (s)`.replaceAll("-", '');

    const newExprnceObject = {
        cmpny_name: getCmpnyName,
        start_date: getStrtDate,
        end_date: getEndDate,
        total_exprnce: totalExprnce
    }

    userExperience.push(newExprnceObject);
    setItem("userExperience", userExperience);
    userExperience = getItem("userExperience") || [];
    renderExperienceCards(userExperience);
    document.querySelector(".exprnce-container").innerHTML = '';


}

function renderExperienceCards(userExperience) {
    if (userExperience.length == 0) {
        return;
    }
    document.querySelector(".experience-container").innerHTML = '';
    userExperience.forEach((each_exprnce) => {
        const generateExprnceCard = expereinceCardCreator(each_exprnce);
        document.querySelector(".experience-container").append(generateExprnceCard);
    });

    return;
}
renderExperienceCards(userExperience);


const saveEducationBtn = document.querySelector(".sv-edcsn");


saveEducationBtn.onclick = () => {
    const getDegreeName = document.getElementById("dgre-nme-inp").value.trim();
    const getCollegeName = document.getElementById("cllge-nme-inp").value.trim();
    const getCGPA = document.getElementById("cgpa-inp").value;

    if (getDegreeName === '' || getCollegeName === '' || getCGPA === null || getCGPA > 10) {
        alert("education details are not valid!");
        return;
    }
    const newEducationObject = {
        degree_type: getDegreeName,
        college_name: getCollegeName,
        cgpa: getCGPA
    }
    let duplicateFound = false;
    userEducation.forEach((each_data) => {
        if (each_data.degree_type.toLowerCase() === getDegreeName) {
            duplicateFound = true;
        }

    });
    if (duplicateFound) {
        alert("data already added!");
        return;
    }
    userEducation.push(newEducationObject);
    setItem("userEducation", userEducation);
    userEducation = getItem("userEducation");
    renderEducationcards(userEducation);
    ["dgre-nme-inp", "cllge-nme-inp", "cgpa-inp"].forEach((each) => {
        document.getElementById(`${each}`).value = '';
    });
    alert("data has been added!");
    return;

}
renderEducationcards(userEducation);
function educationCardCreator(userEducation) {
    const educationCard = document.createElement("div");
    educationCard.className = 'edcsn-card';
    const degreeName = document.createElement("p");
    degreeName.textContent = userEducation.degree_type;
    const collegeName = document.createElement("p");
    collegeName.textContent = userEducation.college_name;
    const cgpa = document.createElement("p");
    cgpa.textContent = userEducation.cgpa;

    educationCard.append(degreeName, collegeName, cgpa);

    return educationCard;
}

function renderEducationcards(userEducation) {
    if (userEducation.length === 0) {
        return;
    }
    document.querySelector(".education-container").innerHTML = '';
    userEducation.forEach((each_data) => {
        const generateEducationCard = educationCardCreator(each_data);
        document.querySelector(".education-container").append(generateEducationCard);
    });
    return;
}

const saveCrtfcsnBtn = document.querySelector(".sv-crtfcts");


saveCrtfcsnBtn.onclick = () => {
    const c_course = document.getElementById("crse-inp").value.trim();
    const c_cmpny = document.getElementById("crtfyd-by").value.trim();
    const c_id = String(document.getElementById("crtfct-id").value.trim());
    const validate_c = /^[A-Za-z0-9]+$/.test(c_id);
    let certificate_added = false;

    if (c_course === '' || c_cmpny === '' || c_id === '') {
        alert("certification details are required!");
        return;
    }
    if (!validate_c) {
        alert("certificate is invalid!");
        return;
    }

    const newCertificationObject = {
        course_name: c_course,
        cmpny_issued: c_cmpny,
        certificate_id: c_id
    }
    userCertification.forEach((each_crtfcte) => {
        if (each_crtfcte.certificate_id === c_id) {
            certificate_added = true;
            return;
        }
    });
    if (certificate_added) {
        alert("certificate already added!");
        return;
    }
    userCertification.push(newCertificationObject);
    setItem("userCertification", userCertification);
    userCertification = getItem("userCertification");
    renderCertificatecards(userCertification);
}

function certificationCardCreator(userCertification) {
    const crtfctCard = document.createElement("div");
    crtfctCard.className = 'certificate-card';
    const courseName = document.createElement("p");
    courseName.textContent = `Certified In : ${userCertification.course_name}`;
    const cmpnyName = document.createElement("p");
    cmpnyName.textContent = `Certified By : ${userCertification.cmpny_issued}`;
    const cId = document.createElement("p");
    cId.textContent = `Certificate ID : ${userCertification.certificate_id}`;

    crtfctCard.append(courseName, cmpnyName, cId);
    return crtfctCard;

}
function renderCertificatecards(userCertification) {
    if (userCertification.length === 0) {
        return;
    }
    document.querySelector(".certification-container").innerHTML = '';

    userCertification.forEach((each_crtfcte) => {
        const generateCertificateCard = certificationCardCreator(each_crtfcte);
        document.querySelector(".certification-container").append(generateCertificateCard);
    });
    return;

}
renderCertificatecards(userCertification);
const addAchvmntBtn = document.querySelector(".add-achvment");
const saveAchvmntBtn = document.querySelector(".sv-achvmnts");

saveAchvmntBtn.onclick = () => {
    const getRole = document.getElementById("achvmnt-rle").value.trim();
    const getAchvmntRsn = document.getElementById("achvmnt-rsn").value.trim();

    if (getRole === '' || getAchvmntRsn === '') {
        alert("enter achievement data!");
        return;
    }

    const newAchvmntObject = {
        achvmnt_role: getRole,
        achvmnt_rsn: getAchvmntRsn
    }
    let duplicateFound = false;
    userAchievments.forEach((each_achvmnt) => {
        if (each_achvmnt.achvmnt_role === getRole && each_achvmnt.achvmnt_rsn === getAchvmntRsn) {
            duplicateFound = true;
        }
    });
    if (duplicateFound) {
        alert("achivement already added!");
        return;
    }
    userAchievments.push(newAchvmntObject);
    setItem("userAchievments", userAchievments);
    userAchievments = getItem("userAchievments");
    renderAchievmentCards(userAchievments);
}

function achvmntCardCreator(userAchievments) {
    const achvmntCard = document.createElement("div");
    achvmntCard.className = 'achvmnt-card';
    const achvmntName = document.createElement("p");
    achvmntName.textContent = `Achieved : ${userAchievments.achvmnt_role}`;
    const achvmntRsn = document.createElement("p");
    achvmntRsn.textContent = `Reason : ${userAchievments.achvmnt_rsn}`;
    achvmntCard.append(achvmntName, achvmntRsn);

    return achvmntCard;
}

function renderAchievmentCards(userAchievments) {
    if (userAchievments.length === 0) {
        return;
    }
    document.querySelector(".achivements-container").innerHTML = '';

    userAchievments.forEach((each_achvmnt) => {
        const generateAchvmntCard = achvmntCardCreator(each_achvmnt);
        document.querySelector(".achivements-container").append(generateAchvmntCard);
    });
    return;
}

renderAchievmentCards(userAchievments);

function removeLocalStorage() {
    ["getUserIdentity", "getUserLinks", "userSkills", "userProjects", "userExperience", "userCertification", "userAchivements"].forEach((each_item) => {
        localStorage.removeItem(`${each_item}`);
    });
    alert("done!")
    return;
}
document.getElementById("clear-data").onclick = () => {
    alertUser = confirm("Carefull,all your data will be wiped!");
    if (!alertUser) {
        return;
    }
    const allInputs = document.querySelectorAll("input");
    allInputs.forEach((each_inp) => {
        each_inp.value = '';
    });
    removeLocalStorage();
    localStorage.clear();
    window.location.reload();
}

