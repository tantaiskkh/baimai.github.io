document.addEventListener('DOMContentLoaded', function () {

    // ตัวแปรสำหรับเก็บข้อมูล
    let currentStep = 1;
    const formData = {
        personalInfo: {},
        skills: [], 
        preferences: {}
    };

    // ฟังก์ชันเริ่มต้น
    function init() {
        setupEventListeners();
        updateStepUI();
        renderSkillTags();
        addAdditionalQuestions(); // เพิ่มบรรทัดนี้
    }

    // ตั้งค่า Event Listeners
    function setupEventListeners() {
        // ปุ่มใน Hero Section
        document.getElementById('startAssessmentBtn').addEventListener('click', goToAssessment);
        document.getElementById('browseJobsBtn').addEventListener('click', browseAllJobs);

        // ปุ่ม Navigation ในฟอร์ม
        document.getElementById('step1NextBtn').addEventListener('click', nextStep);
        document.getElementById('step2BackBtn').addEventListener('click', prevStep);
        document.getElementById('step2NextBtn').addEventListener('click', nextStep);
        document.getElementById('step3BackBtn').addEventListener('click', prevStep);
        document.getElementById('step3SubmitBtn').addEventListener('click', submitAssessment);

        // การจัดการทักษะ
        document.getElementById('newSkill').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') addSkill();
        });
        document.querySelector('.add-skill-btn').addEventListener('click', addSkill);
    }

    // ฟังก์ชันสำหรับการนำทาง
    function goToAssessment() {
        document.getElementById('assessment').scrollIntoView({ behavior: 'smooth' });
    }

    function browseAllJobs() {
        alert('กำลังนำคุณไปยังหน้ารายการงานทั้งหมด');
        // ในทางปฏิบัติควรเปลี่ยนเส้นทางไปยังหน้าค้นหางาน
    }

    function nextStep() {
        if (validateStep(currentStep)) {
            saveStepData(currentStep);
            currentStep++;
            updateStepUI();
        }
    }

    function prevStep() {
        currentStep--;
        updateStepUI();
    }

    // อัพเดท UI ตามขั้นตอนปัจจุบัน
    function updateStepUI() {
        // ซ่อนทุกขั้นตอน
        document.querySelectorAll('.step-content').forEach(el => {
            el.style.display = 'none';
        });

        // แสดงขั้นตอนปัจจุบัน
        document.getElementById(`step${currentStep}Content`).style.display = 'block';

        // อัพเดทสถานะขั้นตอน
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else if (index + 1 < currentStep) {
                step.classList.add('completed');
            }
        });

        // อัพเดท Progress Bar
        const progressPercentage = ((currentStep - 1) / 2) * 100;
        document.getElementById('stepProgress').style.width = `${progressPercentage}%`;
    }

    // ตรวจสอบความถูกต้องของข้อมูลในขั้นตอนปัจจุบัน
    function validateStep(step) {
        if (step === 1) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const education = document.getElementById('education').value;

            if (!name) {
                alert('กรุณากรอกชื่อ-นามสกุล');
                return false;
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('กรุณากรอกอีเมลให้ถูกต้อง');
                return false;
            }

            if (!education) {
                alert('กรุณาเลือกระดับการศึกษา');
                return false;
            }

            return true;
        }

        if (step === 3) {
            const interest = document.getElementById('interest').value;
            const personality = document.getElementById('personality').value;

            if (!interest) {
                alert('กรุณาเลือกประเภทงานที่สนใจ');
                return false;
            }

            if (!personality) {
                alert('กรุณาเลือกลักษณะบุคลิกภาพ');
                return false;
            }

            return true;
        }

        return true;
    }

    // บันทึกข้อมูลจากขั้นตอนปัจจุบัน
    function saveStepData(step) {
        if (step === 1) {
            formData.personalInfo = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                education: document.getElementById('education').value,
                experience: document.getElementById('experience').value
            };
        } else if (step === 2) {
            formData.currentJob = document.getElementById('currentJob').value.trim();
            formData.jobDescription = document.getElementById('jobDescription').value.trim();
        } else if (step === 3) {
            formData.preferences = {
                interest: document.getElementById('interest').value,
                personality: document.getElementById('personality').value,
                salary: document.getElementById('salary').value
            };
        }
    }

    // การจัดการทักษะ
    function renderSkillTags() {
        const container = document.getElementById('skillTags');
        container.innerHTML = '';

        formData.skills.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                <span>${skill}</span>
                <i class="fas fa-times skill-tag-remove"></i>
            `;
            tag.querySelector('.skill-tag-remove').addEventListener('click', () => removeSkill(skill));
            container.appendChild(tag);
        });
    }

    function addSkill() {
        const input = document.getElementById('newSkill');
        const skill = input.value.trim();

        if (skill && !formData.skills.includes(skill)) {
            formData.skills.push(skill);
            input.value = '';
            renderSkillTags();
        }
    }

    function removeSkill(skill) {
        formData.skills = formData.skills.filter(s => s !== skill);
        renderSkillTags();
    }

    // ส่งแบบประเมิน
    function submitAssessment() {
        if (validateStep(3)) {
            saveStepData(3);

            // ตรวจสอบว่าตอบคำถามเพิ่มเติมครบหรือไม่
            const workStyle = document.querySelector('input[name="workStyle"]:checked');
            const workEnvironment = document.querySelector('input[name="workEnvironment"]:checked');
            const challenge = document.querySelector('input[name="challenge"]:checked');
            const priority = document.querySelector('input[name="priority"]:checked');

            if (!workStyle || !workEnvironment || !challenge || !priority) {
                alert('กรุณาตอบคำถามเพิ่มเติมให้ครบทุกข้อ');
                return;
            }

            // วิเคราะห์โปรไฟล์
            const { dominantProfile, scores } = analyzeProfileAndMatchJobs();

            // สร้างคำแนะนำอาชีพ
            const recommendations = generateCareerRecommendations(dominantProfile, scores);

            // แสดงผลลัพธ์
            showPersonalizedResults(recommendations, dominantProfile);
        }
    }

    // แสดงผลลัพธ์การจับคู่
    // ฟังก์ชันแสดงผลลัพธ์แบบส่วนตัว
    function showPersonalizedResults(recommendations, profile) {
        const profileNames = {
            'creative_innovator': 'ผู้สร้างสรรค์ (Creative Innovator)',
            'analytical_thinker': 'นักวิเคราะห์ (Analytical Thinker)',
            'social_connector': 'ผู้เข้าสังคม (Social Connector)',
            'strategic_leader': 'ผู้นำ (Strategic Leader)',
            'technical_expert': 'ผู้เชี่ยวชาญ (Technical Expert)'
        };

        const profileDescriptions = {
            'creative_innovator': 'คุณมีความคิดสร้างสรรค์ ชอบทำงานอิสระ และสนใจในการเรียนรู้สิ่งใหม่ๆ',
            'analytical_thinker': 'คุณมีความคิดเป็นระบบ ชอบแก้ปัญหาที่ซับซ้อน และทำงานด้วยข้อมูล',
            'social_connector': 'คุณชอบทำงานเป็นทีม มีทักษะการสื่อสารดี และสร้างความสัมพันธ์ได้ดี',
            'strategic_leader': 'คุณมีวิสัยทัศน์ ชอบความท้าทาย และสามารถนำทีมสู่ความสำเร็จ',
            'technical_expert': 'คุณมีความเชี่ยวชาญด้านเทคนิค ชอบเรียนรู้เทคโนโลยีใหม่ และแก้ปัญหาที่ซับซ้อน'
        };

        const container = document.getElementById('matchingResultsContainer');
        const header = container.querySelector('.preview-header');
        container.innerHTML = '';
        container.appendChild(header);

        // เพิ่มส่วนสรุปโปรไฟล์
        const profileSummary = document.createElement('div');
        profileSummary.className = 'profile-summary';
        profileSummary.innerHTML = `
        <div style="background: #e8f5e9; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">โปรไฟล์ของคุณ: ${profileNames[profile]}</h4>
            <p style="color: #555; margin-bottom: 1rem;">${profileDescriptions[profile]}</p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <span style="background: var(--primary-color); color: white; padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.8rem;">เหมาะกับงานสร้างสรรค์</span>
                <span style="background: var(--accent-color); color: white; padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.8rem;">ทำงานอิสระได้ดี</span>
                <span style="background: var(--success-color); color: white; padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.8rem;">เรียนรู้เร็ว</span>
            </div>
        </div>
    `;
        container.appendChild(profileSummary);

        // เพิ่มผลลัพธ์
        recommendations.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
            <div class="job-header">
                <div>
                    <h4 class="job-title">${job.title}</h4>
                    <p class="job-company">${job.company}</p>
                </div>
                <div class="match-percentage">${job.match}%</div>
            </div>
            <div class="job-meta">
                <div class="job-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <div class="job-meta-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>เงินเดือน ${job.salary}</span>
                </div>
            </div>
            <div class="job-description" style="margin: 1rem 0; color: #666;">
                <p>${job.description}</p>
            </div>
            <div class="job-actions">
                <button class="save-job">บันทึก</button>
                <button class="apply-job">สมัครงาน</button>
            </div>
        `;

            // เพิ่ม Event Listeners ให้ปุ่มในการ์ด
            jobCard.querySelector('.save-job').addEventListener('click', () => {
                alert(`บันทึกงาน "${job.title}" เรียบร้อยแล้ว`);
            });

            jobCard.querySelector('.apply-job').addEventListener('click', () => {
                alert(`กำลังนำคุณไปยังหน้าสมัครงาน "${job.title}"`);
            });

            container.appendChild(jobCard);
        });

        // เลื่อนไปยังส่วนผลลัพธ์
        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    }

    // เพิ่มคำถามในฟอร์มขั้นตอนที่ 3
    function addAdditionalQuestions() {
        const step3Content = document.getElementById('step3Content');

        const additionalQuestionsHTML = `
        <div class="form-group">
            <label class="form-label">คุณชอบทำงานแบบไหนมากที่สุด?</label>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="workStyle" value="teamwork">
                    <span class="radio-checkmark"></span>
                    ทำงานเป็นทีมและมีปฏิสัมพันธ์กับผู้อื่น
                </label>
                <label class="radio-option">
                    <input type="radio" name="workStyle" value="independent">
                    <span class="radio-checkmark"></span>
                    ทำงานคนเดียวอย่างอิสระ
                </label>
                <label class="radio-option">
                    <input type="radio" name="workStyle" value="mixed">
                    <span class="radio-checkmark"></span>
                    ผสมผสานระหว่างทีมและงานส่วนตัว
                </label>
                <label class="radio-option">
                    <input type="radio" name="workStyle" value="leadership">
                    <span class="radio-checkmark"></span>
                    เป็นผู้นำทีมและบริหารโครงการ
                </label>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">คุณชอบสภาพแวดล้อมการทำงานแบบใด?</label>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="workEnvironment" value="office">
                    <span class="radio-checkmark"></span>
                    สำนักงานแบบดั้งเดิม
                </label>
                <label class="radio-option">
                    <input type="radio" name="workEnvironment" value="remote">
                    <span class="radio-checkmark"></span>
                    ทำงานจากที่บ้าน (Remote Work)
                </label>
                <label class="radio-option">
                    <input type="radio" name="workEnvironment" value="hybrid">
                    <span class="radio-checkmark"></span>
                    ไฮบริด (ผสมระหว่างออฟฟิศและที่บ้าน)
                </label>
                <label class="radio-option">
                    <input type="radio" name="workEnvironment" value="field">
                    <span class="radio-checkmark"></span>
                    สถานที่ทำงานที่เปลี่ยนไปเรื่อยๆ
                </label>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">คุณชอบความท้าทายแบบไหน?</label>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="challenge" value="routine">
                    <span class="radio-checkmark"></span>
                    งานประจำที่คุ้นเคย
                </label>
                <label class="radio-option">
                    <input type="radio" name="challenge" value="learning">
                    <span class="radio-checkmark"></span>
                    โครงการใหม่ๆ ที่ต้องเรียนรู้สิ่งใหม่
                </label>
                <label class="radio-option">
                    <input type="radio" name="challenge" value="problem_solving">
                    <span class="radio-checkmark"></span>
                    การแก้ไขปัญหาที่ซับซ้อน
                </label>
                <label class="radio-option">
                    <input type="radio" name="challenge" value="competition">
                    <span class="radio-checkmark"></span>
                    การแข่งขันและความกดดันสูง
                </label>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">คุณให้ความสำคัญกับอะไรมากที่สุด?</label>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="priority" value="flexibility">
                    <span class="radio-checkmark"></span>
                    เวลาทำงานที่ยืดหยุ่น
                </label>
                <label class="radio-option">
                    <input type="radio" name="priority" value="career_growth">
                    <span class="radio-checkmark"></span>
                    โอกาสก้าวหน้าในอาชีพ
                </label>
                <label class="radio-option">
                    <input type="radio" name="priority" value="salary">
                    <span class="radio-checkmark"></span>
                    เงินเดือนและสวัสดิการ
                </label>
                <label class="radio-option">
                    <input type="radio" name="priority" value="stability">
                    <span class="radio-checkmark"></span>
                    ความมั่นคงในงาน
                </label>
            </div>
        </div>
    `;

        // แทรกคำถามก่อนปุ่มนำทาง
        const navigationButtons = step3Content.querySelector('.navigation-buttons');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = additionalQuestionsHTML;
        step3Content.insertBefore(tempDiv, navigationButtons);
    }


    // ฟังก์ชันวิเคราะห์โปรไฟล์และจับคู่อาชีพ (เวอร์ชันปรับปรุง)
    function analyzeProfileAndMatchJobs() {
        const personality = document.getElementById('personality').value;
        const interest = document.getElementById('interest').value;
        const workStyle = document.querySelector('input[name="workStyle"]:checked')?.value;
        const workEnvironment = document.querySelector('input[name="workEnvironment"]:checked')?.value;
        const challenge = document.querySelector('input[name="challenge"]:checked')?.value;
        const priority = document.querySelector('input[name="priority"]:checked')?.value;

        // กำหนดน้ำหนักให้แต่ละปัจจัย
        const scores = {
            'creative_innovator': 0,
            'analytical_thinker': 0,
            'social_connector': 0,
            'strategic_leader': 0,
            'technical_expert': 0
        };

        // 🔥 น้ำหนักใหม่: ให้ Interest มีความสำคัญสูงสุด (40%)
        // 🔥 Personality มีความสำคัญรองลงมา (30%)
        // 🔥 คำถามเพิ่มเติมรวมกัน (30%)

        // 1. คำนวณคะแนนตาม Interest (40% ของคะแนนทั้งหมด)
        calculateInterestScores(interest, scores);

        // 2. คำนวณคะแนนตามบุคลิกภาพ (30% ของคะแนนทั้งหมด)
        calculatePersonalityScores(personality, scores);

        // 3. คำนวณคะแนนตามคำถามเพิ่มเติม (30% ของคะแนนทั้งหมด)
        calculateAdditionalScores(workStyle, workEnvironment, challenge, priority, scores);

        // หาโปรไฟล์ที่มีคะแนนสูงสุด
        let maxScore = 0;
        let dominantProfile = '';

        for (const [profile, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                dominantProfile = profile;
            }
        }

        return { dominantProfile, scores, interest };
    }

    // ฟังก์ชันคำนวณคะแนนตาม Interest
    function calculateInterestScores(interest, scores) {
        const interestWeights = {
            'technology': { technical_expert: 40, analytical_thinker: 35, creative_innovator: 15, strategic_leader: 10 },
            'finance': { analytical_thinker: 40, strategic_leader: 30, technical_expert: 20, social_connector: 10 },
            'marketing': { creative_innovator: 35, social_connector: 30, strategic_leader: 20, analytical_thinker: 15 },
            'design': { creative_innovator: 45, technical_expert: 25, social_connector: 20, analytical_thinker: 10 },
            'education': { social_connector: 40, strategic_leader: 25, creative_innovator: 20, analytical_thinker: 15 },
            'health': { analytical_thinker: 35, social_connector: 30, technical_expert: 20, strategic_leader: 15 },
            'engineering': { technical_expert: 45, analytical_thinker: 35, strategic_leader: 15, creative_innovator: 5 }
        };

        const weights = interestWeights[interest] || interestWeights.technology;

        for (const [profile, weight] of Object.entries(weights)) {
            scores[profile] += weight;
        }
    }

    // ฟังก์ชันคำนวณคะแนนตามบุคลิกภาพ
    function calculatePersonalityScores(personality, scores) {
        const personalityWeights = {
            'creative': { creative_innovator: 30, analytical_thinker: 10, technical_expert: 5 },
            'analytical': { analytical_thinker: 30, technical_expert: 20, strategic_leader: 5 },
            'social': { social_connector: 30, strategic_leader: 15, creative_innovator: 10 },
            'leader': { strategic_leader: 30, social_connector: 20, analytical_thinker: 5 },
            'independent': { technical_expert: 25, creative_innovator: 20, analytical_thinker: 10 }
        };

        const weights = personalityWeights[personality] || {};

        for (const [profile, weight] of Object.entries(weights)) {
            scores[profile] += weight;
        }
    }

    // ฟังก์ชันคำนวณคะแนนตามคำถามเพิ่มเติม
    function calculateAdditionalScores(workStyle, workEnvironment, challenge, priority, scores) {
        // Work Style (8%)
        if (workStyle === 'independent') {
            scores.creative_innovator += 5;
            scores.analytical_thinker += 5;
            scores.technical_expert += 3;
        }
        if (workStyle === 'teamwork') {
            scores.social_connector += 8;
            scores.strategic_leader += 4;
        }
        if (workStyle === 'leadership') {
            scores.strategic_leader += 8;
            scores.social_connector += 4;
        }
        if (workStyle === 'mixed') {
            scores.technical_expert += 4;
            scores.social_connector += 4;
        }

        // Work Environment (7%)
        if (workEnvironment === 'remote') {
            scores.creative_innovator += 5;
            scores.technical_expert += 4;
        }
        if (workEnvironment === 'office') {
            scores.analytical_thinker += 4;
            scores.strategic_leader += 4;
            scores.social_connector += 3;
        }
        if (workEnvironment === 'hybrid') {
            scores.social_connector += 4;
            scores.technical_expert += 4;
        }

        // Challenge (8%)
        if (challenge === 'learning') {
            scores.creative_innovator += 5;
            scores.strategic_leader += 4;
        }
        if (challenge === 'problem_solving') {
            scores.analytical_thinker += 5;
            scores.technical_expert += 5;
        }
        if (challenge === 'competition') {
            scores.social_connector += 5;
            scores.strategic_leader += 4;
        }

        // Priority (7%)
        if (priority === 'career_growth') {
            scores.strategic_leader += 6;
            scores.technical_expert += 3;
        }
        if (priority === 'salary') {
            scores.technical_expert += 5;
            scores.analytical_thinker += 4;
        }
        if (priority === 'stability') {
            scores.analytical_thinker += 5;
            scores.social_connector += 3;
        }
        if (priority === 'flexibility') {
            scores.creative_innovator += 5;
            scores.technical_expert += 3;
        }
    }

    function debugProfileAnalysis(scores, dominantProfile) {
        console.log('=== DEBUG PROFILE ANALYSIS ===');
        console.log('Scores:', scores);
        console.log('Dominant Profile:', dominantProfile);
        console.log('Personality:', document.getElementById('personality').value);
        console.log('Interest:', document.getElementById('interest').value);
        console.log('Work Style:', document.querySelector('input[name="workStyle"]:checked')?.value);
        console.log('=============================');
    }

    function submitAssessment() {
        if (validateStep(3)) {
            saveStepData(3);

            // ตรวจสอบว่าตอบคำถามเพิ่มเติมครบหรือไม่
            const workStyle = document.querySelector('input[name="workStyle"]:checked');
            const workEnvironment = document.querySelector('input[name="workEnvironment"]:checked');
            const challenge = document.querySelector('input[name="challenge"]:checked');
            const priority = document.querySelector('input[name="priority"]:checked');

            if (!workStyle || !workEnvironment || !challenge || !priority) {
                alert('กรุณาตอบคำถามเพิ่มเติมให้ครบทุกข้อ');
                return;
            }

            // วิเคราะห์โปรไฟล์
            const interest = document.getElementById('interest').value;
            const { dominantProfile, scores } = analyzeProfileAndMatchJobs();

            // สร้างคำแนะนำอาชีพ (ส่ง interest ไปด้วย)
            const recommendations = generateCareerRecommendations(dominantProfile, scores, interest);

            // แสดงผลลัพธ์
            showPersonalizedResults(recommendations, dominantProfile, interest);
        }
    }
    // เพิ่มข้อมูลบริษัทจริง
    // เพิ่มใน companyData, locationData, salaryRanges
    const companyData = {
        technology: [
            "บริษัท เทคโนโลยีชั้นนำ จำกัด (มหาชน)",
            "สตาร์ทอัพเทคโนโลยีแห่งใหม่",
            "บริษัทพัฒนาซอฟต์แวร์ระดับโลก",
            "เอเจนซี่ดิจิทัล"
        ],
        finance: [
            "ธนาคารพาณิชย์ชั้นนำ",
            "บริษัทหลักทรัพย์",
            "บริษัทที่ปรึกษาการเงิน",
            "สถาบันการเงินระหว่างประเทศ"
        ],
        marketing: [
            "เอเจนซี่การตลาดดิจิทัล",
            "บริษัท FMCG ขนาดใหญ่",
            "บริษัทสื่อและโฆษณา",
            "สตาร์ทอัพ E-commerce"
        ],
        design: [
            "สตูดิโอออกแบบครีเอทีฟ",
            "เอเจนซี่แบรนด์ดิ้ง",
            "บริษัทออกแบบผลิตภัณฑ์",
            "สตูดิโออนิเมชั่น"
        ],
        education: [
            "สถาบันการศึกษาเอกชน",
            "บริษัทฝึกอบรมและพัฒนา",
            "ศูนย์พัฒนาทักษะ",
            "องค์กรไม่แสวงหาผลกำไร"
        ]
    };

    const locationData = {
        technology: "กรุงเทพมหานคร (Remote/Hybrid)",
        finance: "กรุงเทพมหานคร (สำนักงานสาทร)",
        marketing: "กรุงเทพมหานคร (แบบไฮบริด)",
        design: "กรุงเทพมหานคร (ทำงานจากที่บ้านได้)",
        education: "กรุงเทพมหานคร และปริมณฑล"
    };

    const salaryRanges = {
        technology: "40,000 - 70,000 บาท",
        finance: "35,000 - 60,000 บาท",
        marketing: "30,000 - 55,000 บาท",
        design: "25,000 - 50,000 บาท",
        education: "25,000 - 45,000 บาท"
    };





    // ฟังก์ชันสร้างคำแนะนำอาชีพตามโปรไฟล์ (เวอร์ชันปรับปรุง)
    function generateCareerRecommendations(profile, scores, interest) {
        // ฐานข้อมูลอาชีพทั้งหมด จัดกลุ่มตาม Interest
        const allJobsByInterest = {
            'technology': [
                { title: "Software Developer", profiles: ['technical_expert', 'analytical_thinker'], baseScore: 90 },
                { title: "Data Scientist", profiles: ['analytical_thinker', 'technical_expert'], baseScore: 88 },
                { title: "UI/UX Designer", profiles: ['creative_innovator', 'technical_expert'], baseScore: 85 },
                { title: "DevOps Engineer", profiles: ['technical_expert', 'analytical_thinker'], baseScore: 87 },
                { title: "Product Manager", profiles: ['strategic_leader', 'creative_innovator'], baseScore: 82 },
                { title: "Data Analyst", profiles: ['analytical_thinker', 'technical_expert'], baseScore: 89 },
                { title: "Cybersecurity Specialist", profiles: ['technical_expert', 'analytical_thinker'], baseScore: 86 }
            ],
            'finance': [
                { title: "Financial Analyst", profiles: ['analytical_thinker', 'strategic_leader'], baseScore: 90 },
                { title: "Investment Banker", profiles: ['strategic_leader', 'analytical_thinker'], baseScore: 85 },
                { title: "Accountant", profiles: ['analytical_thinker', 'technical_expert'], baseScore: 88 },
                { title: "Risk Manager", profiles: ['analytical_thinker', 'strategic_leader'], baseScore: 87 },
                { title: "Wealth Manager", profiles: ['social_connector', 'strategic_leader'], baseScore: 83 },
                { title: "Financial Planner", profiles: ['social_connector', 'analytical_thinker'], baseScore: 84 }
            ],
            'marketing': [
                { title: "Digital Marketer", profiles: ['creative_innovator', 'social_connector'], baseScore: 88 },
                { title: "Content Creator", profiles: ['creative_innovator', 'social_connector'], baseScore: 85 },
                { title: "Brand Manager", profiles: ['strategic_leader', 'creative_innovator'], baseScore: 84 },
                { title: "SEO Specialist", profiles: ['analytical_thinker', 'technical_expert'], baseScore: 82 },
                { title: "Social Media Manager", profiles: ['social_connector', 'creative_innovator'], baseScore: 86 },
                { title: "Market Research Analyst", profiles: ['analytical_thinker', 'social_connector'], baseScore: 83 }
            ],
            'design': [
                { title: "Graphic Designer", profiles: ['creative_innovator', 'technical_expert'], baseScore: 90 },
                { title: "UX/UI Designer", profiles: ['creative_innovator', 'analytical_thinker'], baseScore: 88 },
                { title: "Art Director", profiles: ['creative_innovator', 'strategic_leader'], baseScore: 85 },
                { title: "Motion Graphics Designer", profiles: ['creative_innovator', 'technical_expert'], baseScore: 84 },
                { title: "Product Designer", profiles: ['creative_innovator', 'analytical_thinker'], baseScore: 87 }
            ],
            'education': [
                { title: "Teacher", profiles: ['social_connector', 'creative_innovator'], baseScore: 89 },
                { title: "Corporate Trainer", profiles: ['social_connector', 'strategic_leader'], baseScore: 85 },
                { title: "Education Consultant", profiles: ['strategic_leader', 'social_connector'], baseScore: 83 },
                { title: "Curriculum Developer", profiles: ['creative_innovator', 'analytical_thinker'], baseScore: 82 },
                { title: "School Administrator", profiles: ['strategic_leader', 'social_connector'], baseScore: 84 }
            ],
            'health': [
                { title: "Data Analyst (Healthcare)", profiles: ['analytical_thinker', 'technical_expert'], baseScore: 87 },
                { title: "Medical Researcher", profiles: ['analytical_thinker', 'technical_expert'], baseScore: 89 },
                { title: "Healthcare Consultant", profiles: ['strategic_leader', 'social_connector'], baseScore: 83 },
                { title: "Patient Coordinator", profiles: ['social_connector', 'strategic_leader'], baseScore: 85 },
                { title: "Health Informatics Specialist", profiles: ['technical_expert', 'analytical_thinker'], baseScore: 86 }
            ],
            'engineering': [
                { title: "Software Engineer", profiles: ['technical_expert', 'analytical_thinker'], baseScore: 92 },
                { title: "Systems Architect", profiles: ['technical_expert', 'strategic_leader'], baseScore: 87 },
                { title: "QA Engineer", profiles: ['analytical_thinker', 'technical_expert'], baseScore: 85 },
                { title: "DevOps Engineer", profiles: ['technical_expert', 'analytical_thinker'], baseScore: 88 },
                { title: "Technical Lead", profiles: ['technical_expert', 'strategic_leader'], baseScore: 84 }
            ]
        };

        // 1. ดึงอาชีพจาก Interest ที่ผู้ใช้เลือก
        let jobsFromInterest = allJobsByInterest[interest] || [];

        // 2. คำนวณคะแนนความเหมาะสมสำหรับแต่ละอาชีพ
        let recommendations = jobsFromInterest.map(job => {
            let totalScore = job.baseScore;

            // เพิ่มคะแนนถ้าโปรไฟล์ตรง
            if (job.profiles.includes(profile)) {
                totalScore += 15; // โบนัสสำหรับโปรไฟล์ที่ตรง
            }

            // เพิ่มคะแนนจาก scores ของโปรไฟล์
            totalScore += (scores[profile] * 0.1); // แปลงคะแนนโปรไฟล์

            // จำกัดคะแนนสูงสุดที่ 99
            totalScore = Math.min(totalScore, 99);

            return {
                title: job.title,
                category: interest,
                match: Math.round(totalScore),
                description: getJobDescription(job.title, interest),
                profiles: job.profiles
            };
        });

        // 3. เรียงลำดับตามคะแนนความเหมาะสม
        recommendations.sort((a, b) => b.match - a.match);

        // 4. ส่งคืน 4 อันดับแรก
        return recommendations.slice(0, 4);
    }

    // ฟังก์ชันสร้างคำอธิบายงาน
    function getJobDescription(title, category) {
        const descriptions = {
            'technology': {
                'Software Developer': 'พัฒนาและบำรุงรักษาระบบซอฟต์แวร์โดยใช้ภาษาการเขียนโปรแกรมสมัยใหม่',
                'Data Scientist': 'วิเคราะห์ข้อมูลขนาดใหญ่และสร้างโมเดล Machine Learning เพื่อการทำนาย',
                'UI/UX Designer': 'ออกแบบประสบการณ์ผู้ใช้ที่ดึงดูดและใช้งานง่ายสำหรับแอปพลิเคชันและเว็บไซต์',
                'DevOps Engineer': 'บริหารจัดการระบบคลาวด์และกระบวนการพัฒนาแบบอัตโนมัติ',
                'Product Manager': 'กำหนดวิสัยทัศน์และโรดแมปสำหรับผลิตภัณฑ์เทคโนโลยี',
                'Data Analyst': 'วิเคราะห์ข้อมูลธุรกิจเพื่อสนับสนุนการตัดสินใจ',
                'Cybersecurity Specialist': 'ปกป้องระบบจากภัยคุกคามทางไซเบอร์และรักษาความปลอดภัยข้อมูล'
            },
            'finance': {
                'Financial Analyst': 'วิเคราะห์ข้อมูลทางการเงินและให้คำแนะนำการลงทุน',
                'Investment Banker': 'ให้คำปรึกษาด้านการเงินและการลงทุนสำหรับบริษัทขนาดใหญ่',
                'Accountant': 'จัดการบัญชีและรายงานทางการเงินตามมาตรฐานสากล',
                'Risk Manager': 'ประเมินและจัดการความเสี่ยงทางการเงินขององค์กร',
                'Wealth Manager': 'ให้คำปรึกษาการจัดการความมั่งคั่งสำหรับลูกค้าระดับสูง',
                'Financial Planner': 'วางแผนการเงินส่วนบุคคลและให้คำแนะนำการออมการลงทุน'
            }
            // ... เพิ่ม descriptions สำหรับ categories อื่นๆ ...
        };

        return descriptions[category]?.[title] || `ตำแหน่ง ${title} ในสาขา${category} ที่เหมาะกับทักษะและความสนใจของคุณ`;
    }

    // แก้ไขฟังก์ชัน showPersonalizedResults ให้ใช้ข้อมูลจาก companyData
    function showPersonalizedResults(recommendations, profile, interest) {
        const profileNames = {
            'creative_innovator': 'ผู้สร้างสรรค์',
            'analytical_thinker': 'นักวิเคราะห์',
            'social_connector': 'ผู้เข้าสังคม',
            'strategic_leader': 'ผู้นำ',
            'technical_expert': 'ผู้เชี่ยวชาญ'
        };

        const interestNames = {
            'technology': 'เทคโนโลยีและไอที',
            'finance': 'การเงินและการธนาคาร',
            'marketing': 'การตลาดและขาย',
            'design': 'ออกแบบและครีเอทีฟ',
            'education': 'การศึกษาและการฝึกอบรม',
            'health': 'สุขภาพและการแพทย์',
            'engineering': 'วิศวกรรม'
        };

        const container = document.getElementById('matchingResultsContainer');
        const header = container.querySelector('.preview-header');
        container.innerHTML = '';
        container.appendChild(header);

        // ส่วนสรุปโปรไฟล์
        const profileSummary = document.createElement('div');
        profileSummary.className = 'profile-summary';
        profileSummary.innerHTML = `
        <div style="background: #e8f5e9; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem;">
            <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">🔍 ผลการวิเคราะห์โปรไฟล์ของคุณ</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <strong>บุคลิกภาพหลัก:</strong><br>
                    <span style="color: var(--secondary-color);">${profileNames[profile]}</span>
                </div>
                <div>
                    <strong>สาขาที่สนใจ:</strong><br>
                    <span style="color: var(--secondary-color);">${interestNames[interest]}</span>
                </div>
            </div>
            <p style="color: #555; font-style: italic;">
                "เราได้คัดเลือกอาชีพที่เหมาะกับบุคลิกภาพแบบ${profileNames[profile]} 
                และสาขา${interestNames[interest]} โดยเฉพาะ"
            </p>
        </div>
    `;
        container.appendChild(profileSummary);

        // แสดงอาชีพแนะนำ
        recommendations.forEach((job, index) => {
            const company = getRandomCompany(job.category);

            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
            <div class="job-header">
                <div>
                    <h4 class="job-title">${job.title}</h4>
                    <p class="job-company">${company}</p>
                </div>
                <div class="match-percentage">${job.match}%</div>
            </div>
            <div class="job-meta">
                <div class="job-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${locationData[job.category] || "กรุงเทพมหานคร"}</span>
                </div>
                <div class="job-meta-item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>เงินเดือน ${salaryRanges[job.category] || "30,000 - 50,000 บาท"}</span>
                </div>
            </div>
            <div class="job-description" style="margin: 1rem 0; color: #666;">
                <p><strong>📝 รายละเอียด:</strong> ${job.description}</p>
                <p style="margin-top: 0.5rem; color: var(--primary-color);">
                    <strong>🎯 เหมาะกับคุณเพราะ:</strong> 
                    ${getSuitabilityReason(job, profile, interest)}
                </p>
            </div>
            <div class="job-actions">
                <button class="save-job">บันทึก</button>
                <button class="apply-job">สมัครงาน</button>
            </div>
        `;

            jobCard.querySelector('.save-job').addEventListener('click', () => {
                alert(`บันทึกงาน "${job.title}" เรียบร้อยแล้ว`);
            });

            jobCard.querySelector('.apply-job').addEventListener('click', () => {
                alert(`กำลังนำคุณไปยังหน้าสมัครงาน "${job.title}"`);
            });

            container.appendChild(jobCard);
        });

        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    }

    // ฟังก์ชันให้เหตุผลความเหมาะสม
    function getSuitabilityReason(job, profile, interest) {
        const reasons = {
            'creative_innovator': 'ใช้ความคิดสร้างสรรค์และการออกแบบนวัตกรรมใหม่ๆ',
            'analytical_thinker': 'ใช้ทักษะการวิเคราะห์ข้อมูลและการคิดอย่างเป็นระบบ',
            'social_connector': 'ใช้ทักษะการสื่อสารและการสร้างความสัมพันธ์',
            'strategic_leader': 'ใช้วิสัยทัศน์และทักษะการบริหารจัดการ',
            'technical_expert': 'ใช้ความเชี่ยวชาญด้านเทคนิคและการแก้ปัญหาที่ซับซ้อน'
        };

        const interestReasons = {
            'technology': 'ในสาขาเทคโนโลยีที่คุณสนใจ',
            'finance': 'ในวงการการเงินที่คุณให้ความสำคัญ',
            'marketing': 'ในด้านการตลาดที่ตรงกับความสนใจของคุณ',
            'design': 'ในสายงานออกแบบที่คุณชื่นชอบ',
            'education': 'ในแวดวงการศึกษาที่คุณให้ความสนใจ',
            'health': 'ในสาขาสุขภาพที่คุณสนใจ',
            'engineering': 'ในสายงานวิศวกรรมที่คุณให้ความสำคัญ'
        };

        return `งานนี้${reasons[profile]} ${interestReasons[interest]}`;
    }

    // ฟังก์ชันดึงบริษัทแบบสุ่ม
    function getRandomCompany(category) {
        const companies = companyData[category] || ["บริษัทชั้นนำ"];
        return companies[Math.floor(Math.random() * companies.length)];
    }

    function submitAssessment() {
        if (validateStep(3)) {
            saveStepData(3);

            // ตรวจสอบคำถามเพิ่มเติม
            const workStyle = document.querySelector('input[name="workStyle"]:checked');
            const workEnvironment = document.querySelector('input[name="workEnvironment"]:checked');
            const challenge = document.querySelector('input[name="challenge"]:checked');
            const priority = document.querySelector('input[name="priority"]:checked');

            if (!workStyle || !workEnvironment || !challenge || !priority) {
                alert('กรุณาตอบคำถามเพิ่มเติมให้ครบทุกข้อ');
                return;
            }

            // วิเคราะห์โปรไฟล์ (ได้ interest กลับมาด้วย)
            const { dominantProfile, scores, interest } = analyzeProfileAndMatchJobs();

            // Debug
            console.log('=== ผลการวิเคราะห์ ===');
            console.log('Interest:', interest);
            console.log('Profile:', dominantProfile);
            console.log('Scores:', scores);
            console.log('=====================');

            // สร้างคำแนะนำอาชีพ
            const recommendations = generateCareerRecommendations(dominantProfile, scores, interest);

            // แสดงผลลัพธ์
            showPersonalizedResults(recommendations, dominantProfile, interest);
        }
    }
    // เริ่มต้นแอปพลิเคชัน
    init();
});

