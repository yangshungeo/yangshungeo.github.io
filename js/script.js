const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const languageToggle = document.querySelector("[data-lang-toggle]");
const primaryNavigation = document.querySelector(".nav");
const visitorCounter = document.querySelector(".visitor-counter");
const originalDocumentTitle = document.title;

function isChineseInterface() {
  return document.documentElement.lang === "zh-CN";
}

function setNavigationState(isOpen) {
  if (!navToggle || !navLinks) return;
  navLinks.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute(
    "aria-label",
    isChineseInterface()
      ? (isOpen ? "关闭导航" : "打开导航")
      : (isOpen ? "Close navigation" : "Open navigation")
  );
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    setNavigationState(!navLinks.classList.contains("open"));
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks && navLinks.classList.contains("open")) {
      setNavigationState(false);
    }
  });
});

document.addEventListener("click", (event) => {
  if (navLinks?.classList.contains("open") && !event.target.closest(".nav")) {
    setNavigationState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks?.classList.contains("open")) {
    setNavigationState(false);
    navToggle?.focus();
  }
});

window.matchMedia("(min-width: 1041px)").addEventListener("change", (event) => {
  if (event.matches) setNavigationState(false);
});

document.querySelectorAll("details.bibtex").forEach((details) => {
  const target = details.querySelector("pre");
  if (!target) return;

  const button = document.createElement("button");
  button.className = "copy-bibtex";
  button.type = "button";
  button.textContent = "Copy BibTeX";
  details.append(button);

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      button.textContent = isChineseInterface() ? "已复制" : "Copied";
      window.setTimeout(() => {
        button.textContent = isChineseInterface() ? "复制 BibTeX" : "Copy BibTeX";
      }, 1400);
    } catch {
      target.focus();
    }
  });
});

const publicationSearch = document.getElementById("publication-search");
const publicationType = document.getElementById("publication-type");
const publicationYear = document.getElementById("publication-year");
const publicationResults = document.querySelector("[data-publication-results]");
const publicationEmpty = document.querySelector("[data-publication-empty]");
const publicationItems = Array.from(document.querySelectorAll(".publication"));
const publicationGroups = Array.from(document.querySelectorAll("[data-publication-group]"));

publicationItems.forEach((item) => {
  const title = item.querySelector("h3")?.textContent || "";
  const authors = item.querySelector(".authors")?.textContent || "";
  const citation = item.querySelector(".journal")?.textContent || "";
  const years = citation.match(/\b(?:19|20)\d{2}\b/g) || [];
  item.dataset.publicationYear = years.at(-1) || "";
  item.dataset.publicationType = item.closest("[data-publication-type]")?.dataset.publicationType || "";
  item.dataset.publicationSearch = [title, authors, citation, item.dataset.publicationYear]
    .join(" ")
    .toLocaleLowerCase();
});

if (publicationYear) {
  const years = [...new Set(publicationItems.map((item) => item.dataset.publicationYear).filter(Boolean))]
    .sort((a, b) => Number(b) - Number(a));
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    publicationYear.append(option);
  });
}

function updatePublicationFilters() {
  if (!publicationSearch || !publicationType || !publicationYear) return;

  const query = publicationSearch.value.trim().toLocaleLowerCase();
  const type = publicationType.value;
  const year = publicationYear.value;
  const queryIsYear = /^(?:19|20)\d{2}$/.test(query);
  let visibleCount = 0;

  publicationItems.forEach((item) => {
    const matchesQuery = !query || (queryIsYear
      ? item.dataset.publicationYear === query
      : item.dataset.publicationSearch.includes(query));
    const matchesType = type === "all" || item.dataset.publicationType === type;
    const matchesYear = year === "all" || item.dataset.publicationYear === year;
    const isVisible = matchesQuery && matchesType && matchesYear;
    item.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  publicationGroups.forEach((group) => {
    const items = Array.from(group.querySelectorAll(".publication"));
    group.hidden = !items.some((item) => !item.hidden);
  });

  publicationEmpty?.classList.toggle("visible", visibleCount === 0);
  if (publicationResults) {
    publicationResults.textContent = isChineseInterface()
      ? `显示 ${visibleCount} / ${publicationItems.length} 项成果`
      : `${visibleCount} of ${publicationItems.length} publications shown`;
  }
}

[publicationSearch, publicationType, publicationYear].forEach((control) => {
  control?.addEventListener(control === publicationSearch ? "input" : "change", updatePublicationFilters);
});

const zhTranslations = {
  "Shun Yang | Seismic Oceanography & Marine Geophysics": "杨顺 | 地震海洋学与海洋地球物理",
  "Shun Yang": "杨顺",
  "Research | Shun Yang": "研究方向 | 杨顺",
  "Publications | Shun Yang": "论文成果 | 杨顺",
  "Awards | Shun Yang": "获奖荣誉 | 杨顺",
  "Projects | Shun Yang": "研究项目 | 杨顺",
  "Gallery | Shun Yang": "科研图集 | 杨顺",
  "Contact | Shun Yang": "联系方式 | 杨顺",
  "Guestbook | Shun Yang": "留言板 | 杨顺",
  "Page Not Found | Shun Yang": "页面未找到 | 杨顺",
  "Seismic Oceanography": "地震海洋学",
  "Home": "首页",
  "Research": "研究",
  "Publications": "论文",
  "Awards": "获奖",
  "Projects": "项目",
  "Gallery": "图集",
  "Contact": "联系",
  "Guestbook": "留言",
  "Page not found. The requested address may have changed or no longer exists.": "页面未找到，请求的地址可能已更改或不再存在。",
  "Return Home": "返回首页",
  "Skip to content": "跳到主要内容",
  "Personal Academic Homepage": "个人学术主页",
  "Engineer | Marine Geophysics | Seismic Oceanography": "工程师 | 海洋地球物理 | 地震海洋学",
  "Ph.D. | Engineer": "博士 | 工程师",
  "Marine Geophysics | Seismic Oceanography": "海洋地球物理 | 地震海洋学",
  "Marine Geophysics": "海洋地球物理",
  "Physical Oceanography": "物理海洋学",
  "Mesoscale Eddies": "中尺度涡",
  "Thermohaline Fine Structure": "温盐细结构",
  "Ocean Mixing": "海洋混合",
  "Published journal articles": "已发表期刊论文",
  "First-author journal papers": "第一作者期刊论文",
  "Awards and honors": "获奖与荣誉",
  "Main research regions": "主要研究区域",
  "I study oceanic fine structures and dynamical processes using multichannel seismic reflection data, hydrographic observations, satellite altimetry, and ocean reanalysis products.": "我利用多道地震反射资料、水文观测、卫星高度计资料和海洋再分析产品研究海洋细结构及其动力过程。",
  "View Publications": "查看论文",
  "Research Projects": "研究项目",
  "Download CV": "下载简历",
  "Education": "教育经历",
  "Ph.D. in Geophysics": "地球物理学博士",
  "Bachelor of Engineering in Exploration Geophysics": "勘查地球物理工学学士",
  "Tongji University": "同济大学",
  "China University of Geosciences": "中国地质大学",
  "Shanghai, China": "中国上海",
  "Wuhan, China": "中国武汉",
  "Field of study: Marine Geophysics.": "研究方向：海洋地球物理。",
  "Field of study: Exploration Geophysics.": "研究方向：勘查地球物理。",
  "Sep 2019 - May 2025": "2019年9月 - 2025年5月",
  "Sep 2015 - Jun 2019": "2015年9月 - 2019年6月",
  "Research Focus": "研究方向",
  "My work connects seismic imaging with physical oceanography to resolve fine-scale ocean structures and their role in mixing and energy transfer.": "我的研究将地震成像与物理海洋学相结合，用于刻画海洋细尺度结构及其在混合和能量传递中的作用。",
  "Using multichannel seismic reflection data to image thermohaline structures and dynamical processes with high lateral resolution.": "利用多道地震反射资料以高横向分辨率成像温盐结构和海洋动力过程。",
  "Investigating the structure, evolution, and mixing signatures of mesoscale and subsurface eddies in the ocean interior.": "研究海洋内部中尺度和次表层涡旋的结构、演化及其混合特征。",
  "Studying staircases, intrusions, fronts, and layered water-mass boundaries revealed by seismic and hydrographic observations.": "研究地震和水文观测揭示的温盐阶梯、温盐侵入、锋面和层状水团边界。",
  "Estimating diapycnal mixing and energy transfer using seismic slope spectra, hydrographic constraints, and turbulence parameterizations.": "利用地震斜率谱、水文约束和湍流参数化方法估算跨密度面混合和能量传递。",
  "Selected Publications": "代表性论文",
  "Representative first-author studies on thermohaline staircases, Arctic mesoscale eddies, submesoscale structures, and seismic oceanography.": "代表性一作论文涵盖温盐阶梯、北极中尺度涡、亚中尺度结构和地震海洋学等主题。",
  "Thermohaline staircases and subsurface eddies": "温盐阶梯与次表层涡旋",
  "Enhanced mixing near Arctic eddy edges": "北极涡旋边缘增强混合",
  "Mesoscale eddy with spiral bands": "具有螺旋带结构的中尺度涡",
  "Communications Earth & Environment, 2024.": "Communications Earth & Environment, 2024.",
  "Journal of Geophysical Research: Oceans, 2023.": "Journal of Geophysical Research: Oceans, 2023.",
  "Journal of Geophysical Research: Oceans, 2022.": "Journal of Geophysical Research: Oceans, 2022.",
  "Imaging ocean fine structure with seismic and hydrographic observations": "利用地震和水文观测成像海洋细结构",
  "Imaging ocean fine structure with seismic and hydrographic observations to investigate mesoscale eddies, thermohaline staircases, internal waves, and turbulent mixing.": "利用地震与水文观测成像海洋细结构，研究中尺度涡、温盐阶梯、内波与湍流混合。",
  "Research Interests": "研究兴趣",
  "My research focuses on seismic oceanography and its applications to physical oceanography. I use high-resolution seismic reflection data to study oceanic fine structures, mesoscale eddies, thermohaline staircases, internal waves, and turbulent mixing.": "我的研究聚焦于地震海洋学及其在物理海洋学中的应用，利用高分辨率地震反射资料研究海洋细结构、中尺度涡、温盐阶梯、内波和湍流混合。",
  "Seismic imaging": "地震成像",
  "Eddy dynamics": "涡旋动力学",
  "Fine structure": "细结构",
  "Mixing": "混合",
  "Mesoscale and Subsurface Eddies": "中尺度与次表层涡旋",
  "Ocean Mixing and Energy Cascade": "海洋混合与能量级联",
  "My research uses multichannel seismic reflection data to image fine-scale thermohaline structures in the ocean interior. Seismic oceanography provides high-resolution views of internal waves, fronts, eddies, thermohaline staircases, and water-mass boundaries.": "我的研究利用多道地震反射资料成像海洋内部精细温盐结构。地震海洋学能够高分辨率揭示内波、锋面、涡旋、温盐阶梯和水团边界。",
  "I investigate the structure, evolution, and mixing effects of mesoscale and subsurface mesoscale eddies. These eddies play important roles in heat, salt, energy, and material transport in the ocean interior.": "我研究中尺度和次表层中尺度涡旋的结构、演化及其混合效应。这些涡旋在海洋内部热量、盐分、能量和物质输运中具有重要作用。",
  "My work focuses on thermohaline staircases, thermohaline intrusions, water-mass boundaries, and layered structures. These fine-scale features are important for understanding stratification, mixing, and ocean circulation.": "我的工作关注温盐阶梯、温盐侵入、水团边界和层状结构。这些细尺度特征对于理解层结、混合和海洋环流十分重要。",
  "I estimate ocean mixing using seismic slope spectra, hydrographic observations, and turbulence parameterization methods. A major goal is to understand how mesoscale and submesoscale processes contribute to energy transfer and diapycnal mixing.": "我利用地震斜率谱、水文观测和湍流参数化方法估算海洋混合，目标之一是理解中尺度和亚中尺度过程如何影响能量传递与跨密度面混合。",
  "Methods and Data": "方法与数据",
  "The research combines geophysical and oceanographic observations to connect structure, dynamics, and mixing.": "研究结合地球物理和海洋观测，将结构、动力过程和混合联系起来。",
  "Data": "数据",
  "Analysis": "分析",
  "Outputs": "结果",
  "Multichannel seismic reflection data, CTD/XBT profiles, satellite altimetry, and ocean reanalysis products.": "多道地震反射资料、CTD/XBT 剖面、卫星高度计资料和海洋再分析产品。",
  "Seismic interpretation, hydrographic constraint, parameter inversion, geostrophic flow analysis, and spectral methods.": "地震解释、水文约束、参数反演、地转流分析和谱分析方法。",
  "Fine-structure images, eddy morphology, mixing estimates, and links between mesoscale dynamics and diapycnal transport.": "细结构图像、涡旋形态、混合估算，以及中尺度动力过程与跨密度面输运之间的联系。",
  "Journal articles, preprints, posters, and conference contributions": "期刊论文、预印本、海报和会议成果",
  "Journal articles, preprints, posters, and conference contributions on seismic oceanography, mesoscale eddies, thermohaline staircases, internal waves, and ocean mixing.": "地震海洋学、中尺度涡、温盐阶梯、内波与海洋混合相关的期刊论文、预印本、海报与会议成果。",
  "Search publications": "检索论文",
  "Publication type": "成果类型",
  "All types": "全部类型",
  "First-author papers": "第一作者论文",
  "Other journal articles": "其他期刊论文",
  "Preprints and conference": "预印本与会议成果",
  "Year": "年份",
  "All years": "全部年份",
  "No publications match the selected filters.": "没有符合当前筛选条件的成果。",
  "Copy BibTeX": "复制 BibTeX",
  "Copied": "已复制",
  "Selected publications are listed in reverse chronological order. Main topics include seismic oceanography, mesoscale eddies, enhanced mixing, thermohaline staircases, and internal waves.": "论文成果按时间倒序列出，主要主题包括地震海洋学、中尺度涡、增强混合、温盐阶梯和内波。",
  "Selected First-Author Publications": "代表性一作论文",
  "PDF files are available for the five first-author journal papers included in the local materials folder.": "本地材料中的五篇一作期刊论文提供 PDF 下载。",
  "Published Journal Articles": "已发表期刊论文",
  "Preprints, Posters, and Conference Contributions": "预印本、海报与会议成果",
  "Recognition for doctoral research and academic performance": "博士研究与学术表现相关荣誉",
  "Recognition for doctoral research and academic performance, including dissertation honors, student awards, scholarships, and conference paper awards.": "博士研究与学术表现相关荣誉，包括学位论文荣誉、学生荣誉、奖学金和会议优秀论文奖。",
  "Awards and Honors": "获奖与荣誉",
  "This page lists selected awards and honors received during doctoral study and academic training, including dissertation recognition, student honors, scholarships, and conference paper awards.": "本页列出博士学习和学术训练期间获得的代表性荣誉，包括学位论文荣誉、学生荣誉、奖学金和会议优秀论文奖。",
  "Dec 2025": "2025年12月",
  "May 2025": "2025年5月",
  "Dec 2024": "2024年12月",
  "Dec 2022": "2022年12月",
  "Outstanding Doctoral Dissertation of Tongji University": "同济大学优秀博士学位论文",
  "Outstanding Graduate of Shanghai": "上海市优秀毕业生",
  "Outstanding Student of Tongji University": "同济大学优秀学生",
  "National Scholarship for Doctoral Students": "博士研究生国家奖学金",
  "Outstanding Doctoral Student Scholarship of Tongji University": "同济大学优秀博士生奖学金",
  "Student Excellent Paper Award, Annual Meeting of Chinese Geoscience Union": "中国地球科学联合学术年会学生优秀论文奖",
  "Regional studies of ocean fine structure, eddies, and mixing": "海洋细结构、涡旋与混合的区域研究",
  "Regional studies of ocean fine structure, eddies, and mixing across the Philippine Sea, Arctic Ocean, Caribbean Sea, and other regions.": "菲律宾海、北极海、加勒比海及其他区域的海洋细结构、涡旋与混合研究。",
  "Research Projects": "研究项目",
  "Current and previous projects focus on subsurface mesoscale eddies in the Philippine Sea and Arctic Ocean, thermohaline staircases in the Caribbean Sea, and submesoscale structures revealed by seismic oceanography.": "当前和既往项目聚焦菲律宾海与北极海域次表层中尺度涡、加勒比海温盐阶梯，以及地震海洋学揭示的亚中尺度结构。",
  "Philippine Sea Subsurface Mesoscale Eddies": "菲律宾海次表层中尺度涡",
  "Arctic Mesoscale Eddies and Enhanced Mixing": "北极中尺度涡与增强混合",
  "Thermohaline Staircases in the Eastern Caribbean Sea": "东加勒比海温盐阶梯",
  "Submesoscale Structures and Internal Waves": "亚中尺度结构与内波",
  "Region": "区域",
  "Regions": "区域",
  "Methods": "方法",
  "Keywords": "关键词",
  "This project investigates subsurface mesoscale eddies in the Philippine Sea using multichannel seismic reflection data, hydrographic observations, satellite altimetry, and ocean reanalysis products. The project aims to image fine thermohaline structures, estimate diapycnal mixing, and examine the influence of regional circulation systems.": "该项目利用多道地震反射资料、水文观测、卫星高度计和海洋再分析产品研究菲律宾海次表层中尺度涡，旨在成像精细温盐结构、估算跨密度面混合，并分析区域环流系统的影响。",
  "This project focuses on mesoscale eddies in the western Arctic Ocean and investigates enhanced mixing near eddy edges using high-resolution seismic reflection data and oceanographic observations.": "该项目聚焦西北极海域中尺度涡，利用高分辨率地震反射资料和海洋观测研究涡旋边缘附近的增强混合。",
  "This project studies thermohaline staircases and their disruption by subsurface mesoscale eddies in the eastern Caribbean Sea. The work combines seismic oceanography and hydrographic observations to reveal fine-scale ocean structures.": "该项目研究东加勒比海温盐阶梯及其受次表层中尺度涡扰动的过程，结合地震海洋学和水文观测揭示细尺度海洋结构。",
  "These studies use marine seismic survey data to investigate submesoscale eddies, fronts, and mode-2 internal solitary waves near Central America, the Antarctic Peninsula, and adjacent regions.": "这些研究利用海洋地震调查资料分析中美洲、南极半岛及邻近海域的亚中尺度涡、锋面和二阶模态内孤立波。",
  "Research publications and visual materials": "科研论文与可视化材料",
  "Research figures and visual materials from selected first-author publications in seismic oceanography.": "地震海洋学代表性一作论文中的科研图件与可视化材料。",
  "Research Figure Gallery": "科研图件集",
  "This gallery highlights representative research figures from selected first-author publications, with first-page paper screenshots where dedicated figure artwork is not yet available.": "本图集展示代表性一作论文中的主要科研图件；暂未提供专门图件的论文则使用论文首页截图。",
  "Thermohaline staircases in the Caribbean Sea": "加勒比海温盐阶梯",
  "First-author article on disruptions in thermohaline staircases caused by subsurface mesoscale eddies.": "关于次表层中尺度涡导致温盐阶梯扰动的一作论文。",
  "Enhanced mixing at Arctic eddy edges": "北极涡旋边缘增强混合",
  "High-resolution seismic observations of mixing near mesoscale eddy edges in the western Arctic Ocean.": "西北极海域中尺度涡边缘混合的高分辨率地震观测。",
  "Submesoscale spiral bands": "亚中尺度螺旋带",
  "Seismic reflection sections reveal a mesoscale eddy with submesoscale spiral bands in the Northwind Basin.": "地震反射剖面揭示北风海盆中具有亚中尺度螺旋带的中尺度涡。",
  "South Shetland Islands eddy and front": "南设得兰群岛涡旋与锋面",
  "Seismic oceanography study of submesoscale eddy and front structures near the Antarctic Peninsula.": "南极半岛附近亚中尺度涡和锋面结构的地震海洋学研究。",
  "Gulf of Papagayo cyclonic eddy": "帕帕加约湾气旋涡",
  "Study of submesoscale structures associated with a cyclonic eddy near Central America.": "中美洲附近气旋涡相关亚中尺度结构研究。",
  "Engineer at Guangzhou Marine Geological Survey, working on seismic oceanography and marine geophysics.": "广州海洋地质调查局工程师，研究方向为地震海洋学和海洋地球物理。",
  "Academic communication and collaboration": "学术交流与合作",
  "Academic communication and collaboration in seismic oceanography, marine geophysics, physical oceanography, and ocean mixing.": "欢迎围绕地震海洋学、海洋地球物理、物理海洋学和海洋混合开展学术交流与合作。",
  "I welcome academic communication and potential collaboration in seismic oceanography, marine geophysics, physical oceanography, and ocean mixing.": "欢迎围绕地震海洋学、海洋地球物理、物理海洋学和海洋混合开展学术交流与合作。",
  "Contact Information": "联系方式",
  "Institution": "单位",
  "Documents": "文档",
  "Download the current CV and selected first-author journal articles.": "下载当前简历和代表性一作期刊论文。",
  "Publication List": "论文列表",
  "Guangzhou Marine Geological Survey, Guangzhou, China": "广州海洋地质调查局，中国广州",
  "Messages and academic comments": "留言与学术评论",
  "Messages, questions, and collaboration notes on seismic oceanography, marine geophysics, physical oceanography, and ocean mixing.": "欢迎留下与地震海洋学、海洋地球物理、物理海洋学和海洋混合相关的留言、问题与合作交流信息。",
  "Questions, comments, and collaboration notes related to seismic oceanography, marine geophysics, physical oceanography, and ocean mixing are welcome.": "欢迎围绕地震海洋学、海洋地球物理、物理海洋学和海洋混合留下问题、评论和合作交流信息。",
  "Leave a Message": "留下留言",
  "Comments are connected to the public GitHub repository for this website, so replies can be followed and preserved with the project.": "留言连接到本网站的公开 GitHub 仓库，便于后续回复和保存。",
  "Visits": "访问量",
  "Visitors": "访客数",
  "© 2026 Shun Yang. Seismic Oceanography & Marine Geophysics.": "© 2026 杨顺。地震海洋学与海洋地球物理。"
};

const originalTextNodes = new WeakMap();
const skipTags = new Set(["SCRIPT", "STYLE", "PRE", "CODE", "TEXTAREA", "NOSCRIPT"]);

function shouldTranslateTextNode(node) {
  const parent = node.parentElement;
  if (!parent || skipTags.has(parent.tagName)) return false;
  if (parent.closest("[data-no-translate]")) return false;
  if (parent.closest("[data-lang-toggle]")) return false;
  return node.nodeValue.trim().length > 0;
}

function applyLanguage(language) {
  const useChinese = language === "zh";
  document.documentElement.lang = useChinese ? "zh-CN" : "en";
  document.title = useChinese && zhTranslations[originalDocumentTitle]
    ? zhTranslations[originalDocumentTitle]
    : originalDocumentTitle;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => shouldTranslateTextNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    if (!originalTextNodes.has(node)) {
      originalTextNodes.set(node, node.nodeValue);
    }

    const original = originalTextNodes.get(node);
    if (!useChinese) {
      node.nodeValue = original;
      return;
    }

    const trimmed = original.trim();
    const translated = zhTranslations[trimmed];
    if (!translated) return;

    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${translated}${trailing}`;
  });

  if (languageToggle) {
    languageToggle.textContent = useChinese ? "English" : "中文";
    languageToggle.setAttribute("aria-label", useChinese ? "Switch to English" : "切换为简体中文");
  }

  primaryNavigation?.setAttribute("aria-label", useChinese ? "主导航" : "Primary navigation");
  visitorCounter?.setAttribute("aria-label", useChinese ? "网站访问统计" : "Website visitor statistics");
  if (publicationSearch) {
    publicationSearch.placeholder = useChinese ? "标题、作者、期刊或年份" : "Title, author, journal, or year";
  }
  document.querySelectorAll(".figure-link").forEach((link) => {
    if (useChinese) {
      link.dataset.originalAriaLabel ||= link.getAttribute("aria-label") || "";
      link.setAttribute("aria-label", "查看论文详情");
    } else if (link.dataset.originalAriaLabel) {
      link.setAttribute("aria-label", link.dataset.originalAriaLabel);
    }
  });
  setNavigationState(navLinks?.classList.contains("open") || false);
  updatePublicationFilters();
}

const savedLanguage = localStorage.getItem("site-language") || "en";
applyLanguage(savedLanguage);

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    const nextLanguage = document.documentElement.lang === "zh-CN" ? "en" : "zh";
    localStorage.setItem("site-language", nextLanguage);
    applyLanguage(nextLanguage);
  });
}
