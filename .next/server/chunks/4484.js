"use strict";exports.id=4484,exports.ids=[4484],exports.modules={84517:(e,t,a)=>{a.d(t,{S:()=>i});var T=a(9487),s=a(11671),n=a.n(s),r=a(21431);let E=!1,o=null;async function i(){if(!E)return o||(o=(async()=>{try{try{await T.default.$queryRawUnsafe("PRAGMA journal_mode = WAL;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA busy_timeout = 30000;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA synchronous = NORMAL;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA cache_size = -20000;")}catch(e){}await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "fullName" TEXT NOT NULL,
        "businessName" TEXT NOT NULL,
        "facebookPageUrl" TEXT,
        "email" TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL,
        "phone" TEXT,
        "avatarUrl" TEXT,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "plan" TEXT NOT NULL DEFAULT 'STARTER',
        "planStatus" TEXT NOT NULL DEFAULT 'INACTIVE',
        "monthlyMessageLimit" INTEGER NOT NULL DEFAULT 500,
        "messagesSentThisMonth" INTEGER NOT NULL DEFAULT 0,
        "planExpiresAt" DATETIME,
        "activePackageId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AiSetting" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "provider" TEXT NOT NULL DEFAULT 'GEMINI',
        "model" TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
        "encryptedApiKey" TEXT,
        "temperature" REAL NOT NULL DEFAULT 0.7,
        "maxTokens" INTEGER NOT NULL DEFAULT 800,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "provider")
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ActivityLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT,
        "action" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "metadata" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Package" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "price" REAL NOT NULL DEFAULT 0,
        "durationDays" INTEGER NOT NULL DEFAULT 30,
        "messageLimit" INTEGER NOT NULL DEFAULT 1000,
        "pageLimit" INTEGER NOT NULL DEFAULT 1,
        "productLimit" INTEGER NOT NULL DEFAULT 50,
        "features" TEXT NOT NULL DEFAULT '[]',
        "isPopular" BOOLEAN NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PaymentMethod" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "displayName" TEXT NOT NULL,
        "accountType" TEXT NOT NULL DEFAULT 'PERSONAL',
        "accountNumber" TEXT NOT NULL,
        "instructions" TEXT,
        "qrCodeUrl" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PackageOrder" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderNumber" TEXT NOT NULL UNIQUE,
        "userId" TEXT NOT NULL,
        "packageId" TEXT NOT NULL,
        "paymentMethodId" TEXT,
        "paymentMethodName" TEXT NOT NULL,
        "amount" REAL NOT NULL,
        "senderNumber" TEXT NOT NULL,
        "transactionId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "adminNote" TEXT,
        "paymentProofUrl" TEXT,
        "approvedAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Page" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "channel" TEXT NOT NULL DEFAULT 'FACEBOOK',
        "channelIdentifier" TEXT,
        "extraConfig" TEXT,
        "facebookPageId" TEXT NOT NULL,
        "pageName" TEXT NOT NULL,
        "pageUsername" TEXT,
        "pageProfileImage" TEXT,
        "pageAccessTokenEncrypted" TEXT NOT NULL,
        "verifyTokenEncrypted" TEXT NOT NULL,
        "webhookUrl" TEXT,
        "webhookStatus" TEXT NOT NULL DEFAULT 'PENDING',
        "connectionStatus" TEXT NOT NULL DEFAULT 'CONNECTED',
        "autoReplyEnabled" BOOLEAN NOT NULL DEFAULT 1,
        "humanHandoffEnabled" BOOLEAN NOT NULL DEFAULT 1,
        "replyLanguage" TEXT NOT NULL DEFAULT 'AUTO',
        "replyStyle" TEXT NOT NULL DEFAULT 'FRIENDLY',
        "aiInstructions" TEXT,
        "productImageReply" BOOLEAN NOT NULL DEFAULT 1,
        "maxImagesPerConversation" INTEGER NOT NULL DEFAULT 2,
        "orderDetection" BOOLEAN NOT NULL DEFAULT 1,
        "voiceProcessing" BOOLEAN NOT NULL DEFAULT 1,
        "imageUnderstanding" BOOLEAN NOT NULL DEFAULT 1,
        "replyDelaySeconds" INTEGER NOT NULL DEFAULT 3,
        "followUpEnabled" BOOLEAN NOT NULL DEFAULT 0,
        "followUpWaitMinutes" INTEGER NOT NULL DEFAULT 30,
        "followUpMessage" TEXT,
        "followUpOnlySeen" BOOLEAN NOT NULL DEFAULT 1,
        "followUpMaxCount" INTEGER NOT NULL DEFAULT 1,
        "followUpFrequency" TEXT NOT NULL DEFAULT 'ONCE',
        "followUpIntervalHours" INTEGER NOT NULL DEFAULT 24,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "facebookPageId")
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "sku" TEXT,
        "category" TEXT,
        "price" REAL NOT NULL,
        "discountPrice" REAL,
        "stockQuantity" INTEGER NOT NULL DEFAULT 0,
        "stockStatus" TEXT NOT NULL DEFAULT 'IN_STOCK',
        "imageUrl" TEXT,
        "deliveryInfo" TEXT,
        "productAiInstructions" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Conversation" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "channel" TEXT NOT NULL DEFAULT 'FACEBOOK',
        "senderPsid" TEXT NOT NULL,
        "customerName" TEXT,
        "lastMessage" TEXT,
        "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "aiEnabled" BOOLEAN NOT NULL DEFAULT 1,
        "unreadCount" INTEGER NOT NULL DEFAULT 0,
        "imagesSentCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("pageId", "senderPsid")
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Message" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "conversationId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "senderPsid" TEXT NOT NULL,
        "direction" TEXT NOT NULL,
        "messageType" TEXT NOT NULL DEFAULT 'TEXT',
        "messageText" TEXT,
        "mediaUrl" TEXT,
        "transcription" TEXT,
        "aiGenerated" BOOLEAN NOT NULL DEFAULT 0,
        "aiModel" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "conversationId" TEXT,
        "customerName" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "product" TEXT NOT NULL,
        "productId" TEXT,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "price" REAL NOT NULL DEFAULT 0,
        "totalPrice" REAL NOT NULL DEFAULT 0,
        "notes" TEXT,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "source" TEXT NOT NULL DEFAULT 'MESSENGER_AI',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SystemSetting" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "value" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LicenseKey" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "plan" TEXT NOT NULL DEFAULT 'STARTER',
        "packageId" TEXT,
        "durationDays" INTEGER NOT NULL DEFAULT 30,
        "messageLimit" INTEGER NOT NULL DEFAULT 1000,
        "pageLimit" INTEGER NOT NULL DEFAULT 1,
        "productLimit" INTEGER NOT NULL DEFAULT 50,
        "clientName" TEXT,
        "clientPhone" TEXT,
        "clientNote" TEXT,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "usedByUserId" TEXT,
        "usedAt" DATETIME,
        "expiresAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "FollowUpScheduleStep" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT,
        "pageId" TEXT,
        "stepNumber" INTEGER NOT NULL DEFAULT 1,
        "dayOffset" INTEGER NOT NULL DEFAULT 1,
        "delayMinutes" INTEGER DEFAULT 0,
        "timeOfDay" TEXT NOT NULL DEFAULT '10:00',
        "title" TEXT NOT NULL,
        "guidelinePrompt" TEXT,
        "isEnabled" BOOLEAN NOT NULL DEFAULT 1,
        "isGlobalDefault" BOOLEAN NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "FollowUpLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "conversationId" TEXT NOT NULL,
        "stepNumber" INTEGER NOT NULL DEFAULT 1,
        "dayOffset" INTEGER NOT NULL DEFAULT 1,
        "scheduledTime" TEXT,
        "messageText" TEXT NOT NULL,
        "channel" TEXT NOT NULL DEFAULT 'FACEBOOK',
        "customerName" TEXT,
        "senderPsid" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'SENT',
        "aiModel" TEXT,
        "responseReceivedAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("Page");'),t=new Set(e.map(e=>e.name));t.has("channel")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "channel" TEXT NOT NULL DEFAULT \'FACEBOOK\';'),t.has("channelIdentifier")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "channelIdentifier" TEXT;'),t.has("extraConfig")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "extraConfig" TEXT;'),t.has("replyDelaySeconds")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "replyDelaySeconds" INTEGER NOT NULL DEFAULT 3;'),t.has("aiInstructions")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "aiInstructions" TEXT;'),t.has("followUpEnabled")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpEnabled" BOOLEAN NOT NULL DEFAULT 0;'),t.has("followUpWaitMinutes")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpWaitMinutes" INTEGER NOT NULL DEFAULT 30;'),t.has("followUpMessage")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpMessage" TEXT;'),t.has("followUpOnlySeen")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpOnlySeen" BOOLEAN NOT NULL DEFAULT 1;'),t.has("followUpMaxCount")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpMaxCount" INTEGER NOT NULL DEFAULT 1;'),t.has("followUpFrequency")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpFrequency" TEXT NOT NULL DEFAULT \'ONCE\';'),t.has("followUpIntervalHours")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpIntervalHours" INTEGER NOT NULL DEFAULT 24;'),t.has("maxImagesPerConversation")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "maxImagesPerConversation" INTEGER NOT NULL DEFAULT 2;'),t.has("maxImagesPerReply")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "maxImagesPerReply" INTEGER NOT NULL DEFAULT 1;');try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("Product");');new Set(e.map(e=>e.name)).has("images")||await T.default.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "images" TEXT;')}catch(e){}let a=await T.default.$queryRawUnsafe('PRAGMA table_info("Conversation");'),s=new Set(a.map(e=>e.name));s.has("imagesSentCount")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "imagesSentCount" INTEGER NOT NULL DEFAULT 0;'),s.has("channel")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "channel" TEXT NOT NULL DEFAULT \'FACEBOOK\';'),s.has("lastSeenAt")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "lastSeenAt" DATETIME;'),s.has("lastFollowUpSentAt")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "lastFollowUpSentAt" DATETIME;'),s.has("followUpSentCount")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "followUpSentCount" INTEGER NOT NULL DEFAULT 0;'),s.has("followUpStatus")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "followUpStatus" TEXT NOT NULL DEFAULT \'IDLE\';'),s.has("currentFollowUpStep")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "currentFollowUpStep" INTEGER NOT NULL DEFAULT 0;'),s.has("nextFollowUpDueAt")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "nextFollowUpDueAt" DATETIME;');try{await T.default.$executeRawUnsafe('UPDATE "Page" SET "connectionStatus" = \'PENDING\' WHERE "connectionStatus" IS NULL;')}catch(e){}try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("FollowUpScheduleStep");');new Set(e.map(e=>e.name)).has("delayMinutes")||await T.default.$executeRawUnsafe('ALTER TABLE "FollowUpScheduleStep" ADD COLUMN "delayMinutes" INTEGER DEFAULT 0;')}catch(e){}}catch(e){console.warn("Migration pre-check warning:",e)}}catch(e){console.warn("Raw table creation note:",e)}try{if(!await T.default.user.findFirst({where:{OR:[{role:"ADMIN"},{email:"admin@replyx.ai"},{email:"admin@gmail.com"}]}})){let e=await n().hash("admin123",10);await T.default.user.create({data:{id:"usr_admin_default",fullName:"Super Admin",businessName:"ReplyX AI Platform",email:"admin@replyx.ai",passwordHash:e,role:"ADMIN",status:"ACTIVE",plan:"PRO",planStatus:"ACTIVE",monthlyMessageLimit:999999}})}let e=await T.default.package.count();0===e&&await T.default.package.createMany({data:[{id:"pkg_starter",name:"স্টার্টার প্যাকেজ",slug:"starter",description:"ছোট ব্যবসার জন্য আদর্শ AI অটোমেশন প্যাকেজ",price:990,durationDays:30,messageLimit:1e3,pageLimit:1,productLimit:50,features:JSON.stringify(["১টি ফেসবুক পেজ অটোমেশন","১,০০০ চ্যাট অটো-রিপ্লাই","বাংলা ও ইংলিশ এআই রিপ্লাই","অর্ডার নেওয়ার সুবিধা"]),isPopular:!1,isActive:!0},{id:"pkg_business",name:"বিজনেস প্যাকেজ",slug:"business",description:"মাঝারি সাইজের পেজের জন্য সবচেয়ে জনপ্রিয় প্যাকেজ",price:1990,durationDays:30,messageLimit:3e3,pageLimit:3,productLimit:200,features:JSON.stringify(["৩টি ফেসবুক পেজ সংযোগ","৩,০০০ চ্যাট অটো-রিপ্লাই","প্রোডাক্ট ছবি দেখে ছবিসহ উত্তর","মেসেঞ্জারে অটোমেটিক অর্ডার"]),isPopular:!0,isActive:!0},{id:"pkg_pro",name:"প্রো প্যাকেজ",slug:"pro",description:"বড় ই-কমার্স পেজের জন্য আনলিমিটেড স্কেলিং প্যাকেজ",price:3490,durationDays:30,messageLimit:1e4,pageLimit:10,productLimit:1e3,features:JSON.stringify(["১০টি ফেসবুক পেজ কানেকশন","১০,০০০ চ্যাট অটো-রিপ্লাই","ভয়েস ও টেক্সট দুই চ্যাটেই রিপ্লাই","প্রাইওরিটি কাস্টমার সাপোর্ট"]),isPopular:!1,isActive:!0}]}),E=!0;try{(0,r.zw)()}catch(e){}}catch(e){console.error("Error during database self-healing initialization:",e)}finally{o=null}})())}},21431:(e,t,a)=>{a.d(t,{Ks:()=>c,Xd:()=>f,iO:()=>p,u2:()=>d,zw:()=>A});var T=a(9487),s=a(67297),n=a(87714),r=a(57435),E=a(26729),o=a(84517),i=a(11258),l=a(54214);let L=globalThis;function N(e,t=30){if("number"==typeof e.delayMinutes&&e.delayMinutes>0)return e.delayMinutes;if(e.timeOfDay&&e.timeOfDay.endsWith("m")){let t=parseInt(e.timeOfDay.replace("m",""),10);if(!isNaN(t)&&t>0)return t}if(e.timeOfDay&&e.timeOfDay.endsWith("h")){let t=parseInt(e.timeOfDay.replace("h",""),10);if(!isNaN(t)&&t>0)return 60*t}return e.dayOffset>0?1440*e.dayOffset:Math.max(1,t)}let d=[{stepNumber:1,dayOffset:1,timeOfDay:"10:00",title:"১ম ফলো-আপ (১ দিন পর - সকাল ১০টা)",guidelinePrompt:"পছন্দের পণ্য নিয়ে কোনো জিজ্ঞাসা আছে কিনা বা অর্ডার কনফার্ম করতে কোনো সহায়তা প্রয়োজন কিনা তা অত্যন্ত আন্তরিক ও বিনম্রভাবে জানতে চান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:2,dayOffset:3,timeOfDay:"16:00",title:"২য় ফলো-আপ (৩ দিন পর - বিকাল ৪টা)",guidelinePrompt:"পণ্যের প্রিমিয়াম কোয়ালিটি ও ক্যাশ অন ডেলিভারি (COD) সুবিধার কথা মনে করিয়ে দিয়ে অর্ডার কনফার্ম করার সহজ প্রক্রিয়া জানান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:3,dayOffset:7,timeOfDay:"20:00",title:"৩য় ফলো-আপ (৭ দিন পর - রাত ৮টা)",guidelinePrompt:"স্টক লিমিটেড হতে পারে বা দ্রুত ডেলিভারি সার্ভিসের বন্ধুত্বপূর্ণ রিমাইন্ডার দিন। আগের মেসেজের কথা সরাসরি পুনরাবৃত্তি করবেন না।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:4,dayOffset:15,timeOfDay:"11:00",title:"৪র্থ ফলো-আপ (১৫ দিন পর - সকাল ১১টা)",guidelinePrompt:"কোনো বিশেষ ছাড় বা পছন্দের অন্য কোনো পণ্য দেখতে চান কিনা অথবা কোনো ফিডব্যাক আছে কিনা জানতে চান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:5,dayOffset:25,timeOfDay:"17:00",title:"৫ম ফলো-আপ (২৫ দিন পর - বিকাল ৫টা)",guidelinePrompt:"মাসের সমাপনী আন্তরিক সম্ভাষণ জানান এবং ভবিষ্যতে যেকোনো পণ্য বা সেবার জন্য যোগাযোগ করতে আমন্ত্রণ জানান।",isEnabled:!0,isGlobalDefault:!0}];async function u(e,t){try{if(await (0,o.S)(),t){let e=await T.default.followUpScheduleStep.findMany({where:{pageId:t,isEnabled:!0},orderBy:{stepNumber:"asc"}});if(e.length>0)return e}if(e){let t=await T.default.followUpScheduleStep.findMany({where:{userId:e,pageId:null,isEnabled:!0},orderBy:{stepNumber:"asc"}});if(t.length>0)return t}let a=await T.default.followUpScheduleStep.findMany({where:{isGlobalDefault:!0,isEnabled:!0},orderBy:{stepNumber:"asc"}});if(a.length>0)return a}catch(e){r.LI.error("Error fetching schedule steps:",e)}return d}async function U(e){let{customerName:t="গ্রাহক",step:a,conversationHistory:T,previousFollowUps:s,pageName:n,replyLanguage:o="বাংলা",businessInstructions:L=""}=e,N=t?.split(" ")[0]||"সম্মানিত গ্রাহক";try{let e=await (0,E.dG)(),t=e.provider,r=e.model,d=T.slice(-8).map(e=>`${"INCOMING"===e.direction?"Customer":"Page/Shop"}: ${e.text}`).join("\n"),u=s.length>0?s.map((e,t)=>`[Follow-Up #${t+1} Sent]: "${e}"`).join("\n"):"None (This is the 1st follow-up)",U=`You are a high-conversion, extremely polite, natural sales & customer success assistant for "${n}".
Your task is to craft an intelligent, personalized follow-up message to a customer who previously chatted with our page but has not yet placed an order or completed service.

CRITICAL NON-REPETITION & CONTEXT RULES:
1. STRICTLY DO NOT repeat the exact phrases, greetings, or sentences from previous follow-ups listed below.
2. Read the customer's previous conversation history to understand what product or inquiry they were interested in.
3. This is Step #${a.stepNumber} (${a.title}). Step guidance: "${a.guidelinePrompt||"Polite, helpful follow-up."}".
4. Tone: Warm, helpful, respectful, non-pushy, and professional (Bengali e-commerce standard).
5. Language: Use natural ${o} (e.g. Standard Bengali with emojis like 😊, 🛍️, 📦).
6. Length: Concise (1-3 sentences). Do NOT add quotation marks or metadata tags. Return ONLY the raw message to be sent directly to the customer.

[PREVIOUS FOLLOW-UPS SENT TO THIS CUSTOMER (DO NOT REPEAT THESE)]:
${u}

[BUSINESS INSTRUCTIONS / POLICIES]:
${L||"Cash on Delivery (COD) available all over Bangladesh. Fast delivery."}
`,c=`[CUSTOMER NAME]: ${N}
[PREVIOUS CHAT HISTORY]:
${d||"Customer previously greeted and asked for product information."}

Please craft the Step #${a.stepNumber} follow-up message now:`;if("GEMINI"===t){let t=e.geminiKey||process.env.GEMINI_API_KEY||"";if(t){let e=new i.$D(t).getGenerativeModel({model:r||"gemini-1.5-flash",systemInstruction:U,generationConfig:{temperature:.75,maxOutputTokens:250}}),a=(await e.generateContent(c)).response.text().trim().replace(/^["']|["']$/g,"");if(a)return{text:a,model:`GEMINI:${r||"gemini-1.5-flash"}`}}}else if("OPENAI"===t){let t=e.openaiKey||process.env.OPENAI_API_KEY||"";if(t){let e=new l.ZP({apiKey:t}),a=await e.chat.completions.create({model:r||"gpt-4o-mini",messages:[{role:"system",content:U},{role:"user",content:c}],temperature:.75,max_tokens:250}),T=a.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g,"");if(T)return{text:T,model:`OPENAI:${r||"gpt-4o-mini"}`}}}else if("DEEPSEEK"===t||"GOROUTER"===t||"OPENROUTER"===t){let a="DEEPSEEK"===t?e.deepseekKey||process.env.DEEPSEEK_API_KEY||"":e.gorouterKey||process.env.GOROUTER_API_KEY||"",T="DEEPSEEK"===t?"https://api.deepseek.com/v1":e.gorouterBaseUrl;if(a){let e=new l.ZP({apiKey:a,baseURL:T}),s=await e.chat.completions.create({model:r||("DEEPSEEK"===t?"deepseek-chat":"deepseek/deepseek-chat"),messages:[{role:"system",content:U},{role:"user",content:c}],temperature:.75,max_tokens:250}),n=s.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g,"");if(n)return{text:n,model:`${t}:${r||"chat"}`}}}}catch(e){r.LI.warn("AI follow-up generation failed, falling back to smart dynamic template:",e)}let d="";switch(a.stepNumber){case 1:d=`আসসালামু আলাইকুম ${N}! আপনার পছন্দের পণ্যটি নিয়ে কোনো প্রশ্ন ছিল কি? কোনো সহায়তা লাগলে জানাবেন, আমরা এখনই অর্ডার কনফার্ম করে দিচ্ছি! 😊🛍️`;break;case 2:d=`প্রিয় ${N}, আশা করি ভালো আছেন। আমাদের পণ্যটিতে ক্যাশ অন ডেলিভারি (COD) এবং দ্রুত ডেলিভারির সুবিধা রয়েছে। আপনার অর্ডারটি কি কনফার্ম করে দেব? 📦✨`;break;case 3:d=`হ্যালো ${N}! আপনার পছন্দের প্রোডাক্টটির স্টক কিন্তু সীমিত। আপনি চাইলে আপনার জন্য স্টক হোল্ড করে রাখতে পারি। জানাতে পারেন! 😊`;break;case 4:d=`আসসালামু আলাইকুম ${N}, কোনো বিশেষ অফার বা অন্য কোনো প্রোডাক্ট দেখতে চাইলে আমাদের জানাতে পারেন। আপনার সেবায় আমরা সর্বদা প্রস্তুত! 🌟`;break;default:d=`শ্রদ্ধেয় ${N}, আমাদের সাথে যুক্ত থাকার জন্য আন্তরিক ধন্যবাদ। যেকোনো সময় পণ্য বা সেবার জন্য আমাদের মেসেজ দিতে পারেন। শুভকামনা! 💐`}return{text:d,model:"TEMPLATE_FALLBACK"}}async function c(e){let t=[],a=0;try{await (0,o.S)();let E={followUpEnabled:!0,connectionStatus:{not:"DISCONNECTED"}};e&&(E.id=e);let i=await T.default.page.findMany({where:E});for(let e of i){let E=(0,s.pe)(e.pageAccessTokenEncrypted);if(!E)continue;let o={};if(e.extraConfig)try{o=JSON.parse(e.extraConfig)}catch(e){}let i=await u(e.userId,e.id);if(0===i.length)continue;let l=new Date(Date.now()-3024e6);for(let s of(await T.default.conversation.findMany({where:{pageId:e.id,status:"ACTIVE",aiEnabled:!0,followUpStatus:{notIn:["COMPLETED","PAUSED","ORDER_PLACED","CUSTOMER_REPLIED"]},lastMessageAt:{gte:l}},include:{messages:{orderBy:{createdAt:"desc"},take:10},orders:{where:{createdAt:{gte:l}},take:1},followUpLogs:{orderBy:{createdAt:"asc"},take:10}},take:100}))){let l=s.channel||e.channel||"FACEBOOK",L=s.customerName||s.senderPsid;if(s.orders&&s.orders.length>0){await T.default.conversation.update({where:{id:s.id},data:{followUpStatus:"ORDER_PLACED"}});continue}let d=s.messages[0];if(d&&"INCOMING"===d.direction){(s.currentFollowUpStep>0||s.followUpSentCount>0)&&await T.default.conversation.update({where:{id:s.id},data:{followUpStatus:"CUSTOMER_REPLIED"}});continue}let u=e.followUpMaxCount??5;if(u<999&&s.followUpSentCount>=u||"ONCE"===e.followUpFrequency&&s.followUpSentCount>=1){await T.default.conversation.update({where:{id:s.id},data:{followUpStatus:"COMPLETED"}});continue}let c=s.currentFollowUpStep||0;if(c>=i.length){await T.default.conversation.update({where:{id:s.id},data:{followUpStatus:"COMPLETED"}});continue}let A=i[c];if(e.followUpOnlySeen){if(!s.lastSeenAt)continue;let e=s.messages.find(e=>"OUTGOING"===e.direction);if(e&&new Date(s.lastSeenAt).getTime()<new Date(e.createdAt).getTime()-1e4)continue}let p=Date.now(),f=!1;if(0===c){let t=e.followUpOnlySeen&&s.lastSeenAt?new Date(s.lastSeenAt).getTime():s.lastMessageAt?new Date(s.lastMessageAt).getTime():new Date(s.createdAt).getTime(),a=N(A,e.followUpWaitMinutes??30),T=6e4*a;p-t>=T&&(f=!0)}else if(s.lastFollowUpSentAt){let t=new Date(s.lastFollowUpSentAt).getTime(),a=1440;if("DAILY"===e.followUpFrequency)a=1440;else if("CUSTOM_INTERVAL"===e.followUpFrequency)a=60*(e.followUpIntervalHours||24);else{let e=i[c-1],t=e?N(e,30):0,T=N(A,60);a=Math.max(1,T-t)}let T=6e4*Math.max(1,a);p-t>=T&&(f=!0)}else f=!0;if(!f)continue;let O="",I="CUSTOM_TEMPLATE";if(e.followUpMessage&&e.followUpMessage.trim().length>0){let t=s.customerName?.split(" ")[0]||"গ্রাহক";O=e.followUpMessage.replace(/{name}/gi,t).replace(/{customer_name}/gi,t).replace(/{page_name}/gi,e.pageName)}else{let t=(s.followUpLogs||[]).map(e=>e.messageText).filter(e=>"string"==typeof e&&e.trim().length>0),a=[...s.messages].reverse().map(e=>({direction:e.direction,text:e.messageText||""})),T=await U({conversationId:s.id,customerName:s.customerName,step:A,conversationHistory:a,previousFollowUps:t,pageName:e.pageName,replyLanguage:e.replyLanguage||"বাংলা",businessInstructions:e.aiInstructions||""});O=T.text,I=T.model}if(!O||0===O.trim().length)continue;let m=await (0,n.Wi)({channel:l,recipientId:s.senderPsid,text:O,accessToken:E,channelIdentifier:e.channelIdentifier||e.facebookPageId,extraConfig:o});if(m.success){a++;let n=c+1>=i.length||"ONCE"===e.followUpFrequency,E=n?"COMPLETED":"IN_PROGRESS",o=c+1,N=null;if(!n){let t="CUSTOM_INTERVAL"===e.followUpFrequency&&e.followUpIntervalHours||24;N=new Date(Date.now()+36e5*t)}await T.default.followUpLog.create({data:{userId:e.userId,pageId:e.id,conversationId:s.id,stepNumber:A.stepNumber,dayOffset:A.dayOffset,scheduledTime:A.timeOfDay,messageText:O,channel:l,customerName:s.customerName,senderPsid:s.senderPsid,status:"SENT",aiModel:I}}),await T.default.message.create({data:{conversationId:s.id,userId:e.userId,pageId:e.id,senderPsid:s.senderPsid,direction:"OUTGOING",messageType:"TEXT",messageText:O,aiGenerated:!0,aiModel:I}}),await T.default.conversation.update({where:{id:s.id},data:{currentFollowUpStep:o,followUpStatus:E,lastFollowUpSentAt:new Date,lastMessage:O,lastMessageAt:new Date,followUpSentCount:{increment:1},nextFollowUpDueAt:N}}),await (0,r.ag)({userId:e.userId,pageId:e.id,action:"FOLLOW_UP_SENT",description:`স্বয়ংক্রিয় ধাপ #${A.stepNumber} ফলো-আপ পাঠানো হয়েছে (${L}, ${l})`}),t.push({pageId:e.id,conversationId:s.id,customer:L,status:"SENT",channel:l,stepNumber:A.stepNumber}),r.LI.info(`[Follow-Up] Step #${A.stepNumber} sent to ${L} (${l})`)}else await T.default.followUpLog.create({data:{userId:e.userId,pageId:e.id,conversationId:s.id,stepNumber:A.stepNumber,dayOffset:A.dayOffset,scheduledTime:A.timeOfDay,messageText:O,channel:l,customerName:s.customerName,senderPsid:s.senderPsid,status:`FAILED: ${m.error||"API Error"}`,aiModel:I}}),t.push({pageId:e.id,conversationId:s.id,customer:L,status:`FAILED: ${m.error||"API Error"}`,channel:l,stepNumber:A.stepNumber})}}return{scannedPages:i.length,sentCount:a,results:t}}catch(e){return r.LI.error("Error running follow-up automation:",e),{scannedPages:0,sentCount:0,results:t}}}function A(e=6e4){!L.followUpWorkerInterval&&(r.LI.info(`[Follow-Up Worker] Background automation engine active (interval: ${e/1e3}s)`),L.followUpWorkerInterval=setInterval(async()=>{if(!L.isFollowUpWorkerRunning){L.isFollowUpWorkerRunning=!0;try{let e=await c();e.sentCount>0&&r.LI.info(`[Follow-Up Worker] Dispatched ${e.sentCount} follow-up message(s)`)}catch(e){r.LI.error("[Follow-Up Worker] Scheduled run error:",e)}finally{L.isFollowUpWorkerRunning=!1}}},e),L.followUpWorkerInterval&&"function"==typeof L.followUpWorkerInterval.unref&&L.followUpWorkerInterval.unref())}async function p(e){try{await (0,o.S)();let t=await T.default.conversation.findUnique({where:{id:e.conversationId},include:{page:!0,messages:{orderBy:{createdAt:"asc"},take:20},followUpLogs:{orderBy:{createdAt:"desc"},take:10}}});if(!t||!t.page)return{success:!1,error:"কথোপকথন বা পেজ পাওয়া যায়নি।"};if(e.userId&&t.userId!==e.userId)return{success:!1,error:"অনুমোদিত নয়।"};let a=(t.followUpLogs||[]).map(e=>e.messageText).filter(e=>"string"==typeof e&&e.trim().length>0),s=t.messages.map(e=>({direction:e.direction,text:e.messageText||""})),n=await u(t.page.userId,t.page.id),r=Math.min(t.currentFollowUpStep||0,Math.max(0,n.length-1)),E=n[r]||d[0],i={...E,guidelinePrompt:e.customInstruction?`${E.guidelinePrompt||""}
ব্যবহারকারীর বিশেষ নির্দেশনা: ${e.customInstruction}`.trim():E.guidelinePrompt},l=await U({conversationId:t.id,customerName:t.customerName,step:i,conversationHistory:s,previousFollowUps:a,pageName:t.page.pageName,replyLanguage:t.page.replyLanguage||"বাংলা",businessInstructions:t.page.aiInstructions||""});return{success:!0,draftText:l.text,model:l.model,customerName:t.customerName||t.senderPsid,channel:t.channel||t.page.channel,pageName:t.page.pageName}}catch(e){return r.LI.error("Error generating manual follow-up draft:",e),{success:!1,error:e?.message||"AI ড্রাফট তৈরি ব্যর্থ হয়েছে।"}}}async function f(e){try{await (0,o.S)();let t=await T.default.conversation.findUnique({where:{id:e.conversationId},include:{page:!0,messages:{orderBy:{createdAt:"asc"},take:20},followUpLogs:{orderBy:{createdAt:"desc"},take:10}}});if(!t||!t.page)return{success:!1,error:"কথোপকথন বা পেজ পাওয়া যায়নি।"};if(e.userId&&t.userId!==e.userId)return{success:!1,error:"অনুমোদিত নয়।"};let a=t.page,E=(0,s.pe)(a.pageAccessTokenEncrypted),i=t.channel||a.channel||"FACEBOOK",l=t.customerName||t.senderPsid,L=(e.messageText||"").trim(),N="MANUAL_CUSTOM";if(e.generateWithAi||!L){let a=await p({conversationId:t.id,userId:e.userId,customInstruction:e.customInstruction});if(!a.success||!a.draftText)return{success:!1,error:a.error||"AI মেসেজ তৈরি করতে সমস্যা হয়েছে।"};L=a.draftText,N=a.model||"Smart AI"}else{let e=t.customerName?.split(" ")[0]||"গ্রাহক";L=L.replace(/{name}/gi,e).replace(/{customer_name}/gi,e).replace(/{page_name}/gi,a.pageName)}if(!L)return{success:!1,error:"মেসেজের বিষয়বস্তু খালি হতে পারে না।"};let d={};if(a.extraConfig)try{d=JSON.parse(a.extraConfig)}catch(e){}if(E){let e=await (0,n.Wi)({channel:i,recipientId:t.senderPsid,text:L,accessToken:E,channelIdentifier:a.channelIdentifier||a.facebookPageId,extraConfig:d});if(!e.success)return await T.default.followUpLog.create({data:{userId:a.userId,pageId:a.id,conversationId:t.id,stepNumber:(t.currentFollowUpStep||0)+1,dayOffset:0,scheduledTime:"MANUAL",messageText:L,channel:i,customerName:t.customerName,senderPsid:t.senderPsid,status:`FAILED: ${e.error||"API Error"}`,aiModel:N}}),{success:!1,error:`${i}-এ মেসেজ পাঠানো ব্যর্থ হয়েছে: ${e.error||"চ্যানেল সংযোগ ত্রুটি"}`}}let u=(t.currentFollowUpStep||0)+1,U=!1!==e.advanceStep?u:t.currentFollowUpStep;return await T.default.followUpLog.create({data:{userId:a.userId,pageId:a.id,conversationId:t.id,stepNumber:u,dayOffset:0,scheduledTime:"MANUAL",messageText:L,channel:i,customerName:t.customerName,senderPsid:t.senderPsid,status:"SENT",aiModel:N}}),await T.default.message.create({data:{conversationId:t.id,userId:a.userId,pageId:a.id,senderPsid:t.senderPsid,direction:"OUTGOING",messageType:"TEXT",messageText:L,aiGenerated:!!e.generateWithAi,aiModel:N}}),await T.default.conversation.update({where:{id:t.id},data:{currentFollowUpStep:U,followUpStatus:"IN_PROGRESS",lastFollowUpSentAt:new Date,lastMessage:L,lastMessageAt:new Date,followUpSentCount:{increment:1}}}),await (0,r.ag)({userId:a.userId,pageId:a.id,action:"FOLLOW_UP_SENT",description:`ম্যানুয়াল ফলো-আপ পাঠানো হয়েছে (${l}, ${i})`}),{success:!0,messageText:L,channel:i,customerName:l,stepNumber:u}}catch(e){return r.LI.error("Error sending manual follow-up:",e),{success:!1,error:e?.message||"ম্যানুয়াল ফলো-আপ পাঠাতে ত্রুটি হয়েছে।"}}}}};