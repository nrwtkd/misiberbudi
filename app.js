(() => {
  'use strict';

  const CONFIG = window.MISI_BERBUDI_CONFIG || {};
  const STORAGE_KEY = 'misiberbudi:draft:v2';
  const LANG_KEY = 'misiberbudi:lang';
  const STEP_COUNT = 6;
  const SUBMIT_TIMEOUT_MS = Number(CONFIG.submitTimeoutMs || 30000);

  const copy = {
    id: {
      brandSub:'Serang Investment Journey', eyebrow:'Kota Serang · Banten · Indonesia',
      heroTitle:'Mulai dari ide. Kami bantu membaca arah investasinya.',
      heroLead:'Bangun profil minat investasi Anda dalam enam langkah ringan. Bukan formulir panjang—lebih seperti percakapan awal untuk membantu kami memahami kebutuhan proyek Anda.',
      start:'Mulai perjalanan', resume:'Lanjutkan draft', trust1:'± 5 menit', trust2:'Draft tersimpan otomatis', trust3:'Tidak perlu akun',
      yourJourney:'Perjalanan Anda', step1:'Visi', step1sub:'Bidang & ide', step2:'Arah', step2sub:'Jenis investasi', step3:'Lokasi', step3sub:'Area pilihan', step4:'Dampak', step4sub:'Nilai & tenaga kerja', step5:'Dukungan', step5sub:'Fasilitasi', step6:'Profil', step6sub:'Ringkasan & kontak', checkpoint:'Checkpoint',
      visionTitle:'Apa yang sedang Anda bayangkan untuk Kota Serang?', visionLead:'Pilih bidang yang paling dekat dengan rencana Anda. Tidak harus sempurna—kita mulai dari gambaran besarnya.', sectorLegend:'Bidang usaha',
      sectorIndustry:'Industri & Manufaktur', sectorIndustrySub:'Produksi, pengolahan, pergudangan', sectorTrade:'Perdagangan & Jasa', sectorTradeSub:'Retail, jasa profesional, layanan', sectorTourism:'Pariwisata & MICE', sectorTourismSub:'Hotel, event, kuliner, destinasi', sectorCreative:'Ekonomi Kreatif & Digital', sectorCreativeSub:'Teknologi, studio, konten, startup', sectorProperty:'Properti & Kawasan', sectorPropertySub:'Hunian, komersial, mixed-use', sectorFood:'Pangan & Agro', sectorFoodSub:'Pengolahan pangan dan rantai pasok', sectorOther:'Bidang lainnya', sectorOtherSub:'Ceritakan kebutuhan yang belum tercakup',
      ideaLabel:'Ceritakan ide proyek Anda', ideaPlaceholder:'Contoh: pusat kuliner dan ruang event yang terintegrasi dengan area komersial...', optional:'Opsional',
      directionTitle:'Ke mana arah rencana investasinya?', directionLead:'Ini membantu tim memahami konteks proyek dan jenis dukungan yang mungkin lebih relevan.', typeNew:'Investasi baru', typeNewSub:'Memulai proyek atau usaha baru', typeExpansion:'Ekspansi', typeExpansionSub:'Memperbesar kapasitas atau cabang', typeRelocation:'Relokasi', typeRelocationSub:'Memindahkan kegiatan usaha', typePartnership:'Kemitraan', typePartnershipSub:'Mencari mitra atau peluang kolaborasi', existingBusiness:'Nama usaha/proyek yang sudah berjalan',
      locationTitle:'Lokasi seperti apa yang paling masuk akal?', locationLead:'Pilih kecamatan jika sudah punya preferensi. Jika belum, kami bisa mencatat bahwa Anda membutuhkan bantuan pencarian lokasi.', needLocationHelp:'Belum tahu — bantu carikan', locationNote:'Catatan lokasi', locationPlaceholder:'Contoh: dekat akses tol, membutuhkan lahan ±2 ha, atau area komersial ramai',
      impactTitle:'Seberapa besar dampak yang sedang Anda rancang?', impactLead:'Angka awal tidak harus final. Estimasi membantu kami memahami skala proyek sejak awal.', investmentLabel:'Estimasi nilai investasi', jobsLabel:'Potensi tenaga kerja', people:'orang',
      supportTitle:'Apa yang paling membantu proyek ini bergerak?', supportLead:'Pilih lebih dari satu bila perlu. Jawaban ini tidak memengaruhi penilaian layanan—ini membantu kami menyiapkan percakapan yang lebih tepat.', supportLegend:'Dukungan yang dibutuhkan', supportPermit:'Informasi perizinan', supportLocation:'Pencarian lokasi', supportData:'Data peluang investasi', supportPartner:'Akses kemitraan', supportCoordination:'Koordinasi lintas instansi', supportConsult:'Konsultasi rencana proyek', obstacleLabel:'Kendala atau pertanyaan utama', obstaclePlaceholder:'Apa yang saat ini paling menghambat atau masih ingin Anda pastikan?',
      profileTitle:'Profil investasi Anda sudah terbentuk.', profileLead:'Periksa ringkasannya, lalu beri kami cara terbaik untuk menghubungi Anda.', nameLabel:'Nama lengkap', companyLabel:'Perusahaan/organisasi', emailLabel:'Email', phoneLabel:'WhatsApp/telepon', consentText:'Saya menyetujui data ini digunakan untuk tindak lanjut fasilitasi investasi oleh petugas yang berwenang.',
      back:'Kembali', continue:'Lanjutkan', submit:'Kirim profil', received:'Profil diterima', successTitle:'Terima kasih. Percakapan investasinya bisa dimulai dari sini.', successLead:'Profil Anda sudah tercatat. Simpan nomor referensi ini untuk memudahkan tindak lanjut.', reference:'Nomor referensi', newProfile:'Buat profil baru',
      footerTag:'Serang Investment Journey', footerNote:'Profil awal ini digunakan sebagai bahan fasilitasi dan bukan merupakan persetujuan perizinan atau komitmen investasi.',
      sendingTitle:'Mengirim profil Anda…', sendingText:'Jangan tutup halaman ini. Kami sedang menunggu konfirmasi dari sistem.', retry:'Coba konfirmasi lagi', keepDraft:'Tutup, simpan draft',
      draftSaved:'Draft tersimpan', draftAvailable:'Ada draft tersimpan',
      errSector:'Pilih bidang usaha yang paling sesuai.', errDirection:'Pilih arah rencana investasi.', errLocation:'Pilih lokasi atau opsi bantuan pencarian lokasi.', errInvestment:'Masukkan estimasi nilai investasi.', errSupport:'Pilih setidaknya satu dukungan yang dibutuhkan.', errContact:'Lengkapi nama, email, dan nomor kontak yang valid.', errConsent:'Persetujuan penggunaan data diperlukan untuk tindak lanjut.', errBackend:'Backend pengiriman belum dihubungkan. Draft Anda tetap aman.',
      timeoutTitle:'Konfirmasi membutuhkan waktu lebih lama', timeoutText:'Kami belum menerima konfirmasi dari server. Ini belum berarti pengiriman gagal. Draft tetap tersimpan dan Anda dapat mencoba lagi tanpa membuat duplikasi.',
      submitFailed:'Pengiriman belum berhasil dikonfirmasi. Draft Anda tetap tersimpan.',
      previewSector:'Bidang', previewDirection:'Arah', previewLocation:'Lokasi', previewInvestment:'Estimasi investasi', previewJobs:'Tenaga kerja', previewSupport:'Dukungan', previewIdea:'Gambaran proyek', notFilled:'Belum diisi'
    },
    en: {
      brandSub:'Serang Investment Journey', eyebrow:'Serang City · Banten · Indonesia',
      heroTitle:'Start with an idea. We help map the investment direction.',
      heroLead:'Build your investment interest profile in six light steps. Not a long conventional form—more like an opening conversation that helps us understand your project needs.',
      start:'Start the journey', resume:'Resume draft', trust1:'± 5 minutes', trust2:'Draft saves automatically', trust3:'No account required',
      yourJourney:'Your journey', step1:'Vision', step1sub:'Sector & idea', step2:'Direction', step2sub:'Investment type', step3:'Location', step3sub:'Preferred area', step4:'Impact', step4sub:'Value & jobs', step5:'Support', step5sub:'Facilitation', step6:'Profile', step6sub:'Summary & contact', checkpoint:'Checkpoint',
      visionTitle:'What are you imagining for Serang City?', visionLead:'Choose the sector closest to your plan. It does not need to be perfect—we can start with the big picture.', sectorLegend:'Business sector',
      sectorIndustry:'Industry & Manufacturing', sectorIndustrySub:'Production, processing, warehousing', sectorTrade:'Trade & Services', sectorTradeSub:'Retail, professional and business services', sectorTourism:'Tourism & MICE', sectorTourismSub:'Hotels, events, culinary, destinations', sectorCreative:'Creative & Digital Economy', sectorCreativeSub:'Technology, studios, content, startups', sectorProperty:'Property & Districts', sectorPropertySub:'Residential, commercial, mixed-use', sectorFood:'Food & Agro', sectorFoodSub:'Food processing and supply chains', sectorOther:'Other sector', sectorOtherSub:'Tell us what is not covered above',
      ideaLabel:'Tell us about your project idea', ideaPlaceholder:'Example: an integrated culinary center and event space with a commercial area...', optional:'Optional',
      directionTitle:'Where is the investment plan heading?', directionLead:'This gives the team the right project context and helps identify the most relevant support.', typeNew:'New investment', typeNewSub:'Starting a new project or business', typeExpansion:'Expansion', typeExpansionSub:'Increasing capacity or opening a branch', typeRelocation:'Relocation', typeRelocationSub:'Moving existing business activities', typePartnership:'Partnership', typePartnershipSub:'Looking for partners or collaboration opportunities', existingBusiness:'Existing business/project name',
      locationTitle:'What kind of location makes the most sense?', locationLead:'Choose a district if you already have a preference. If not, we can note that you need help identifying locations.', needLocationHelp:'Not sure yet — help me find one', locationNote:'Location notes', locationPlaceholder:'Example: near toll access, requires ±2 ha, or a high-traffic commercial area',
      impactTitle:'How much impact are you planning for?', impactLead:'Early estimates do not need to be final. They simply help us understand the project scale.', investmentLabel:'Estimated investment value', jobsLabel:'Potential employment', people:'people',
      supportTitle:'What would help this project move forward?', supportLead:'Choose more than one if needed. Your answer does not affect service assessment—it helps us prepare a more useful conversation.', supportLegend:'Support needed', supportPermit:'Licensing information', supportLocation:'Location search', supportData:'Investment opportunity data', supportPartner:'Partnership access', supportCoordination:'Cross-agency coordination', supportConsult:'Project consultation', obstacleLabel:'Main obstacle or question', obstaclePlaceholder:'What is currently holding the project back or still needs clarification?',
      profileTitle:'Your investment profile is taking shape.', profileLead:'Review the summary and tell us the best way to reach you.', nameLabel:'Full name', companyLabel:'Company/organization', emailLabel:'Email', phoneLabel:'WhatsApp/phone', consentText:'I agree that this data may be used for investment facilitation follow-up by authorized officers.',
      back:'Back', continue:'Continue', submit:'Send profile', received:'Profile received', successTitle:'Thank you. The investment conversation can start here.', successLead:'Your profile has been recorded. Keep this reference number for follow-up.', reference:'Reference number', newProfile:'Create another profile',
      footerTag:'Serang Investment Journey', footerNote:'This initial profile supports facilitation and does not constitute a licensing approval or investment commitment.',
      sendingTitle:'Sending your profile…', sendingText:'Please keep this page open while we wait for confirmation from the system.', retry:'Try confirmation again', keepDraft:'Close, keep draft',
      draftSaved:'Draft saved', draftAvailable:'Saved draft available',
      errSector:'Choose the closest business sector.', errDirection:'Choose your investment direction.', errLocation:'Choose a location or request location assistance.', errInvestment:'Enter an estimated investment value.', errSupport:'Choose at least one type of support.', errContact:'Complete your name, valid email, and contact number.', errConsent:'Data-use consent is required for follow-up.', errBackend:'The submission backend has not been connected yet. Your draft is still safe.',
      timeoutTitle:'Confirmation is taking longer than expected', timeoutText:'We have not received server confirmation yet. This does not necessarily mean the submission failed. Your draft is still saved and you can retry without creating a duplicate.',
      submitFailed:'The submission could not be confirmed. Your draft is still saved.',
      previewSector:'Sector', previewDirection:'Direction', previewLocation:'Location', previewInvestment:'Estimated investment', previewJobs:'Employment', previewSupport:'Support', previewIdea:'Project idea', notFilled:'Not provided'
    }
  };

  const sectorLabels = {
    id:{industri:'Industri & Manufaktur',perdagangan:'Perdagangan & Jasa',pariwisata:'Pariwisata & MICE',kreatif:'Ekonomi Kreatif & Digital',properti:'Properti & Kawasan',pangan:'Pangan & Agro',lainnya:'Bidang lainnya'},
    en:{industri:'Industry & Manufacturing',perdagangan:'Trade & Services',pariwisata:'Tourism & MICE',kreatif:'Creative & Digital Economy',properti:'Property & Districts',pangan:'Food & Agro',lainnya:'Other sector'}
  };
  const directionLabels={id:{baru:'Investasi baru',ekspansi:'Ekspansi',relokasi:'Relokasi',kemitraan:'Kemitraan'},en:{baru:'New investment',ekspansi:'Expansion',relokasi:'Relocation',kemitraan:'Partnership'}};

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const form = $('#investmentForm');
  const journey = $('#journey');
  const successPanel = $('#successPanel');
  const formAlert = $('#formAlert');
  const submitOverlay = $('#submitOverlay');
  const submitTarget = $('#submitTarget');
  let currentStep = 1;
  let lang = localStorage.getItem(LANG_KEY) || 'id';
  let saveTimer;
  let submitTimer;
  let clockTimer;
  let requestStartedAt = 0;
  let activeRequestId = null;
  let submitting = false;
  let currentIdempotencyToken = null;

  function t(key){ return copy[lang][key] ?? copy.id[key] ?? key; }
  function uid(prefix='req'){
    if (window.crypto?.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`;
  }
  function escapeHtml(value=''){
    return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  function setLanguage(next){
    lang = next === 'en' ? 'en' : 'id';
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => { const key=el.dataset.i18n; if(copy[lang][key]) el.textContent=copy[lang][key]; });
    $$('[data-i18n-placeholder]').forEach(el => { const key=el.dataset.i18nPlaceholder; if(copy[lang][key]) el.placeholder=copy[lang][key]; });
    $('[data-lang-label]').textContent = lang === 'id' ? 'ID' : 'EN';
    updateProfilePreview();
  }
  function showAlert(message, type='error'){
    formAlert.textContent=message;
    formAlert.className=`form-alert${type==='info'?' info':''}`;
    formAlert.hidden=false;
    formAlert.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function clearAlert(){ formAlert.hidden=true; formAlert.textContent=''; }
  function formatIDR(value){
    const n=Number(value||0);
    return n ? new Intl.NumberFormat(lang==='id'?'id-ID':'en-US',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n) : t('notFilled');
  }
  function digits(value){ return String(value||'').replace(/\D/g,''); }
  function prettyNumber(value){ const n=Number(digits(value)||0); return n ? new Intl.NumberFormat('id-ID').format(n) : ''; }

  function getData(){
    const fd=new FormData(form);
    const supports=fd.getAll('support');
    return {
      schemaVersion:2,
      language:lang,
      sector:fd.get('sector')||'',
      projectIdea:(fd.get('projectIdea')||'').trim(),
      investmentType:fd.get('investmentType')||'',
      existingBusiness:(fd.get('existingBusiness')||'').trim(),
      district:fd.get('district')||'',
      locationNote:(fd.get('locationNote')||'').trim(),
      investmentValue:Number(fd.get('investmentValue')||0),
      jobs:Number(fd.get('jobs')||0),
      support:supports,
      obstacle:(fd.get('obstacle')||'').trim(),
      fullName:(fd.get('fullName')||'').trim(),
      company:(fd.get('company')||'').trim(),
      email:(fd.get('email')||'').trim(),
      phone:(fd.get('phone')||'').trim(),
      consent:fd.get('consent')==='yes',
      website:(fd.get('website')||'').trim(),
      source:'github-pages',
      pageUrl:location.href,
      userAgent:navigator.userAgent
    };
  }
  function saveDraft(silent=false){
    const payload={step:currentStep,language:lang,idempotencyToken:currentIdempotencyToken||uid('idem'),savedAt:new Date().toISOString(),data:getData()};
    currentIdempotencyToken=payload.idempotencyToken;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(payload));
    if(!silent){
      $('#draftState').textContent=t('draftSaved');
      setTimeout(()=>{ if($('#draftState').textContent===t('draftSaved')) $('#draftState').textContent=''; },1800);
    }
    refreshResumeState();
  }
  function queueSave(){ clearTimeout(saveTimer); saveTimer=setTimeout(()=>saveDraft(),450); }
  function readDraft(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');}catch{return null;} }
  function refreshResumeState(){
    const draft=readDraft();
    $('#resumeButton').hidden=!draft;
    if(draft) $('#draftState').textContent=t('draftAvailable');
  }
  function applyDraft(draft){
    if(!draft?.data) return;
    currentIdempotencyToken=draft.idempotencyToken||uid('idem');
    const d=draft.data;
    const set=(name,value)=>{const el=form.elements[name];if(!el)return;if(el instanceof RadioNodeList){const match=$(`[name="${name}"][value="${CSS.escape(String(value))}"]`,form);if(match)match.checked=true;}else el.value=value??'';};
    set('sector',d.sector); set('projectIdea',d.projectIdea); set('investmentType',d.investmentType); set('existingBusiness',d.existingBusiness); set('district',d.district); set('locationNote',d.locationNote); set('jobs',d.jobs ?? 25); set('fullName',d.fullName); set('company',d.company); set('email',d.email); set('phone',d.phone); set('obstacle',d.obstacle);
    $('#investmentValue').value=d.investmentValue||''; $('#investmentDisplay').value=prettyNumber(d.investmentValue||'');
    $$('[name="support"]',form).forEach(el=>el.checked=(d.support||[]).includes(el.value));
    form.elements.consent.checked=Boolean(d.consent);
    if(draft.language) setLanguage(draft.language);
    currentStep=Math.max(1,Math.min(STEP_COUNT,Number(draft.step||1)));
    updateConditional(); updateDistrictMap(); updateJobs(); updateIdeaCount(); showStep(currentStep,false); updateProfilePreview();
  }

  function showJourney(resume=false){
    journey.hidden=false; successPanel.hidden=true;
    if(resume){ const draft=readDraft(); if(draft) applyDraft(draft); }
    else { currentStep=1; showStep(1,false); if(!currentIdempotencyToken) currentIdempotencyToken=uid('idem'); }
    journey.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function showStep(step,scroll=true){
    currentStep=Math.max(1,Math.min(STEP_COUNT,step));
    $$('.step',form).forEach(el=>el.classList.toggle('active',Number(el.dataset.step)===currentStep));
    $$('[data-step-nav]').forEach(el=>{const n=Number(el.dataset.stepNav);el.classList.toggle('active',n===currentStep);el.classList.toggle('complete',n<currentStep);});
    const pct=Math.round((currentStep/STEP_COUNT)*100);
    $('#progressBar').style.width=`${pct}%`; $('#progressPercent').textContent=`${pct}%`;
    $('#backButton').disabled=currentStep===1;
    $('#nextButton').hidden=currentStep===STEP_COUNT;
    $('#submitButton').hidden=currentStep!==STEP_COUNT;
    if(currentStep===STEP_COUNT) updateProfilePreview();
    clearAlert(); saveDraft(true);
    if(scroll) journey.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function validateStep(step){
    const d=getData();
    if(step===1 && !d.sector) return t('errSector');
    if(step===2 && !d.investmentType) return t('errDirection');
    if(step===3 && !d.district) return t('errLocation');
    if(step===4 && (!Number.isFinite(d.investmentValue)||d.investmentValue<=0)) return t('errInvestment');
    if(step===5 && !d.support.length) return t('errSupport');
    if(step===6){
      const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email);
      if(!d.fullName || !emailOk || d.phone.replace(/\D/g,'').length<8) return t('errContact');
      if(!d.consent) return t('errConsent');
    }
    return '';
  }
  function next(){ const err=validateStep(currentStep); if(err){showAlert(err);return;} showStep(currentStep+1); }
  function back(){ if(currentStep>1) showStep(currentStep-1); }
  function updateConditional(){ const type=form.elements.investmentType.value; $('#existingBusinessWrap').hidden=!(type==='ekspansi'||type==='relokasi'); }
  function updateDistrictMap(){
    const district=form.elements.district.value.toLowerCase();
    $$('[data-district-map]').forEach(el=>el.classList.toggle('active',district.includes(el.dataset.districtMap)));
  }
  function updateJobs(){ $('#jobsValue').textContent=Number($('#jobsRange').value)>=500?'500+':$('#jobsRange').value; }
  function updateIdeaCount(){ $('#ideaCount').textContent=form.elements.projectIdea.value.length; }
  function updateProfilePreview(){
    if(!$('#profilePreview')) return;
    const d=getData();
    const support=d.support.length?d.support.join(', '):t('notFilled');
    $('#profilePreview').innerHTML=`
      <div class="profile-item"><span>${escapeHtml(t('previewSector'))}</span><strong>${escapeHtml(sectorLabels[lang][d.sector]||t('notFilled'))}</strong></div>
      <div class="profile-item"><span>${escapeHtml(t('previewDirection'))}</span><strong>${escapeHtml(directionLabels[lang][d.investmentType]||t('notFilled'))}</strong></div>
      <div class="profile-item"><span>${escapeHtml(t('previewLocation'))}</span><strong>${escapeHtml(d.district||t('notFilled'))}</strong></div>
      <div class="profile-item"><span>${escapeHtml(t('previewInvestment'))}</span><strong>${escapeHtml(formatIDR(d.investmentValue))}</strong></div>
      <div class="profile-item"><span>${escapeHtml(t('previewJobs'))}</span><strong>${escapeHtml(String(d.jobs||0))} ${escapeHtml(t('people'))}</strong></div>
      <div class="profile-item"><span>${escapeHtml(t('previewSupport'))}</span><strong>${escapeHtml(support)}</strong></div>
      <div class="profile-item wide"><span>${escapeHtml(t('previewIdea'))}</span><strong>${escapeHtml(d.projectIdea||t('notFilled'))}</strong></div>`;
  }

  function backendConfigured(){ return /^https:\/\/script\.google\.com\/macros\/s\//.test(String(CONFIG.appsScriptUrl||'')) && /\/exec(?:\?|$)/.test(String(CONFIG.appsScriptUrl||'')); }
  function allowedMessageOrigin(origin){
    if(/^https:\/\/script\.google\.com$/.test(origin)) return true;
    if(/^https:\/\/[a-z0-9-]+\.script\.googleusercontent\.com$/.test(origin)) return true;
    if(/^https:\/\/script\.googleusercontent\.com$/.test(origin)) return true;
    return (CONFIG.allowedMessageOrigins||[]).includes(origin);
  }
  function buildSubmissionPayload(requestId){
    const data=getData();
    return {
      ...data,
      requestId,
      idempotencyToken:currentIdempotencyToken||uid('idem'),
      submittedAt:new Date().toISOString(),
      callbackOrigin:location.origin,
      appVersion:CONFIG.appVersion||'2.0.0'
    };
  }
  function startClock(){
    requestStartedAt=Date.now(); clearInterval(clockTimer);
    clockTimer=setInterval(()=>{const s=Math.floor((Date.now()-requestStartedAt)/1000);$('#submitTimer').textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;},500);
  }
  function setOverlaySending(){
    $('#submitStatusTitle').textContent=t('sendingTitle'); $('#submitStatusText').textContent=t('sendingText'); $('#timeoutActions').hidden=true; $('#submitTimer').textContent='00:00'; submitOverlay.hidden=false; startClock();
  }
  function setOverlayTimeout(){
    clearInterval(clockTimer); $('#submitStatusTitle').textContent=t('timeoutTitle'); $('#submitStatusText').textContent=t('timeoutText'); $('#timeoutActions').hidden=false; submitting=false; $('#submitButton').classList.remove('loading'); $('#submitButton').disabled=false;
  }
  function closeOverlay(){ submitOverlay.hidden=true; clearTimeout(submitTimer); clearInterval(clockTimer); submitting=false; activeRequestId=null; $('#submitButton').classList.remove('loading'); $('#submitButton').disabled=false; saveDraft(); }
  function submitProfile(){
    const err=validateStep(6); if(err){showAlert(err);return;}
    if(!backendConfigured()){showAlert(t('errBackend'));saveDraft();return;}
    if(submitting) return;
    clearAlert(); submitting=true; activeRequestId=uid('req'); if(!currentIdempotencyToken) currentIdempotencyToken=uid('idem'); saveDraft(true);
    $('#submitButton').classList.add('loading'); $('#submitButton').disabled=true; setOverlaySending();
    const payload=buildSubmissionPayload(activeRequestId);
    const relay=document.createElement('form'); relay.method='POST'; relay.action=CONFIG.appsScriptUrl; relay.target='submitTarget'; relay.style.display='none';
    const fields={payload:JSON.stringify(payload),requestId:payload.requestId,idempotencyToken:payload.idempotencyToken,callbackOrigin:location.origin,source:'misiberbudi'};
    Object.entries(fields).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;relay.appendChild(input);});
    document.body.appendChild(relay); relay.submit(); setTimeout(()=>relay.remove(),1000);
    clearTimeout(submitTimer); submitTimer=setTimeout(setOverlayTimeout,SUBMIT_TIMEOUT_MS);
  }
  function normalizeMessage(data){
    if(!data || typeof data!=='object') return null;
    const type=data.type||data.event||'';
    const ok=data.ok===true || data.success===true || data.status==='success' || type==='MISI_BERBUDI_SUBMIT_SUCCESS';
    const fail=data.ok===false || data.success===false || data.status==='error' || type==='MISI_BERBUDI_SUBMIT_ERROR';
    if(!ok && !fail && type!=='MISI_BERBUDI_SUBMIT_RESULT') return null;
    return {ok:ok&&!fail,requestId:data.requestId||data.request_id||'',reference:data.reference||data.referenceNumber||data.reference_number||data.ref||'',message:data.message||data.error||''};
  }
  function handleBackendMessage(event){
    if(!allowedMessageOrigin(event.origin)) return;
    if(event.source!==submitTarget.contentWindow) return;
    const msg=normalizeMessage(event.data); if(!msg) return;
    if(msg.requestId && activeRequestId && msg.requestId!==activeRequestId) return;
    clearTimeout(submitTimer); clearInterval(clockTimer); submitting=false; $('#submitButton').classList.remove('loading'); $('#submitButton').disabled=false;
    if(msg.ok){
      submitOverlay.hidden=true; const ref=msg.reference||`SRG-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${String(Date.now()).slice(-5)}`; $('#referenceNumber').textContent=ref; localStorage.removeItem(STORAGE_KEY); currentIdempotencyToken=null; journey.hidden=true; successPanel.hidden=false; successPanel.scrollIntoView({behavior:'smooth',block:'start'}); refreshResumeState(); activeRequestId=null;
    }else{
      submitOverlay.hidden=true; showAlert(msg.message||t('submitFailed')); saveDraft(); activeRequestId=null;
    }
  }
  function resetProfile(){
    form.reset(); localStorage.removeItem(STORAGE_KEY); currentIdempotencyToken=uid('idem'); currentStep=1; $('#investmentDisplay').value=''; $('#investmentValue').value=''; updateJobs(); updateIdeaCount(); updateConditional(); updateDistrictMap(); successPanel.hidden=true; showJourney(false); refreshResumeState();
  }

  $('#startButton').addEventListener('click',()=>showJourney(false));
  $('#resumeButton').addEventListener('click',()=>showJourney(true));
  $('#langToggle').addEventListener('click',()=>setLanguage(lang==='id'?'en':'id'));
  $('#nextButton').addEventListener('click',next); $('#backButton').addEventListener('click',back);
  $('#newProfileButton').addEventListener('click',resetProfile);
  $('#retryButton').addEventListener('click',()=>{submitOverlay.hidden=true;submitting=false;submitProfile();});
  $('#closeSubmitOverlay').addEventListener('click',closeOverlay);
  form.addEventListener('submit',e=>{e.preventDefault();submitProfile();});
  form.addEventListener('input',e=>{
    if(e.target.name==='investmentDisplay'){const raw=digits(e.target.value);$('#investmentValue').value=raw; e.target.value=prettyNumber(raw);}
    if(e.target.name==='projectIdea') updateIdeaCount();
    if(e.target.name==='jobs') updateJobs();
    updateProfilePreview(); queueSave();
  });
  form.addEventListener('change',e=>{ if(e.target.name==='investmentType')updateConditional(); if(e.target.name==='district')updateDistrictMap(); updateProfilePreview(); queueSave(); });
  $$('.quick-values button').forEach(btn=>btn.addEventListener('click',()=>{$('#investmentValue').value=btn.dataset.value;$('#investmentDisplay').value=prettyNumber(btn.dataset.value);updateProfilePreview();queueSave();}));
  window.addEventListener('message',handleBackendMessage);
  window.addEventListener('beforeunload',()=>{ if(!successPanel.hidden) return; saveDraft(true); });

  setLanguage(lang); updateJobs(); updateIdeaCount(); updateConditional(); updateDistrictMap(); refreshResumeState(); updateProfilePreview();
})();
