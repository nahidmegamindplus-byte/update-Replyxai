"use strict";exports.id=4484,exports.ids=[4484],exports.modules={84517:(e,a,t)=>{t.d(a,{S:()=>o});var T=t(9487),E=t(11671),L=t.n(E),s=t(21431);let n=!1,N=null;async function o(){if(!n)return N||(N=(async()=>{try{try{await T.default.$queryRawUnsafe("PRAGMA journal_mode = WAL;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA busy_timeout = 30000;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA synchronous = NORMAL;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA cache_size = -20000;")}catch(e){}await T.default.$executeRawUnsafe(`
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
    `);try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("Page");'),a=new Set(e.map(e=>e.name));a.has("channel")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "channel" TEXT NOT NULL DEFAULT \'FACEBOOK\';'),a.has("channelIdentifier")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "channelIdentifier" TEXT;'),a.has("extraConfig")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "extraConfig" TEXT;'),a.has("replyDelaySeconds")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "replyDelaySeconds" INTEGER NOT NULL DEFAULT 3;'),a.has("aiInstructions")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "aiInstructions" TEXT;'),a.has("followUpEnabled")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpEnabled" BOOLEAN NOT NULL DEFAULT 0;'),a.has("followUpWaitMinutes")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpWaitMinutes" INTEGER NOT NULL DEFAULT 30;'),a.has("followUpMessage")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpMessage" TEXT;'),a.has("followUpOnlySeen")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpOnlySeen" BOOLEAN NOT NULL DEFAULT 1;'),a.has("followUpMaxCount")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpMaxCount" INTEGER NOT NULL DEFAULT 1;'),a.has("followUpFrequency")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpFrequency" TEXT NOT NULL DEFAULT \'ONCE\';'),a.has("followUpIntervalHours")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpIntervalHours" INTEGER NOT NULL DEFAULT 24;'),a.has("maxImagesPerConversation")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "maxImagesPerConversation" INTEGER NOT NULL DEFAULT 2;'),a.has("maxImagesPerReply")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "maxImagesPerReply" INTEGER NOT NULL DEFAULT 1;');try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("Product");');new Set(e.map(e=>e.name)).has("images")||await T.default.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "images" TEXT;')}catch(e){}let t=await T.default.$queryRawUnsafe('PRAGMA table_info("Conversation");'),E=new Set(t.map(e=>e.name));E.has("imagesSentCount")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "imagesSentCount" INTEGER NOT NULL DEFAULT 0;'),E.has("channel")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "channel" TEXT NOT NULL DEFAULT \'FACEBOOK\';'),E.has("lastSeenAt")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "lastSeenAt" DATETIME;'),E.has("lastFollowUpSentAt")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "lastFollowUpSentAt" DATETIME;'),E.has("followUpSentCount")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "followUpSentCount" INTEGER NOT NULL DEFAULT 0;'),E.has("followUpStatus")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "followUpStatus" TEXT NOT NULL DEFAULT \'IDLE\';'),E.has("currentFollowUpStep")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "currentFollowUpStep" INTEGER NOT NULL DEFAULT 0;'),E.has("nextFollowUpDueAt")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "nextFollowUpDueAt" DATETIME;');try{await T.default.$executeRawUnsafe('UPDATE "Page" SET "connectionStatus" = \'PENDING\' WHERE "connectionStatus" IS NULL;')}catch(e){}}catch(e){console.warn("Migration pre-check warning:",e)}}catch(e){console.warn("Raw table creation note:",e)}try{if(!await T.default.user.findFirst({where:{OR:[{role:"ADMIN"},{email:"admin@replyx.ai"},{email:"admin@gmail.com"}]}})){let e=await L().hash("admin123",10);await T.default.user.create({data:{id:"usr_admin_default",fullName:"Super Admin",businessName:"ReplyX AI Platform",email:"admin@replyx.ai",passwordHash:e,role:"ADMIN",status:"ACTIVE",plan:"PRO",planStatus:"ACTIVE",monthlyMessageLimit:999999}})}let e=await T.default.package.count();0===e&&await T.default.package.createMany({data:[{id:"pkg_starter",name:"স্টার্টার প্যাকেজ",slug:"starter",description:"ছোট ব্যবসার জন্য আদর্শ AI অটোমেশন প্যাকেজ",price:990,durationDays:30,messageLimit:1e3,pageLimit:1,productLimit:50,features:JSON.stringify(["১টি ফেসবুক পেজ অটোমেশন","১,০০০ চ্যাট অটো-রিপ্লাই","বাংলা ও ইংলিশ এআই রিপ্লাই","অর্ডার নেওয়ার সুবিধা"]),isPopular:!1,isActive:!0},{id:"pkg_business",name:"বিজনেস প্যাকেজ",slug:"business",description:"মাঝারি সাইজের পেজের জন্য সবচেয়ে জনপ্রিয় প্যাকেজ",price:1990,durationDays:30,messageLimit:3e3,pageLimit:3,productLimit:200,features:JSON.stringify(["৩টি ফেসবুক পেজ সংযোগ","৩,০০০ চ্যাট অটো-রিপ্লাই","প্রোডাক্ট ছবি দেখে ছবিসহ উত্তর","মেসেঞ্জারে অটোমেটিক অর্ডার"]),isPopular:!0,isActive:!0},{id:"pkg_pro",name:"প্রো প্যাকেজ",slug:"pro",description:"বড় ই-কমার্স পেজের জন্য আনলিমিটেড স্কেলিং প্যাকেজ",price:3490,durationDays:30,messageLimit:1e4,pageLimit:10,productLimit:1e3,features:JSON.stringify(["১০টি ফেসবুক পেজ কানেকশন","১০,০০০ চ্যাট অটো-রিপ্লাই","ভয়েস ও টেক্সট দুই চ্যাটেই রিপ্লাই","প্রাইওরিটি কাস্টমার সাপোর্ট"]),isPopular:!1,isActive:!0}]}),n=!0;try{(0,s.zw)()}catch(e){}}catch(e){console.error("Error during database self-healing initialization:",e)}finally{N=null}})())}},21431:(e,a,t)=>{t.d(a,{Ks:()=>A,u2:()=>l,zw:()=>u});var T=t(9487),E=t(67297),L=t(87714),s=t(57435),n=t(26729),N=t(84517),o=t(11258),i=t(54214);let r=globalThis,l=[{stepNumber:1,dayOffset:1,timeOfDay:"10:00",title:"১ম ফলো-আপ (১ দিন পর - সকাল ১০টা)",guidelinePrompt:"পছন্দের পণ্য নিয়ে কোনো জিজ্ঞাসা আছে কিনা বা অর্ডার কনফার্ম করতে কোনো সহায়তা প্রয়োজন কিনা তা অত্যন্ত আন্তরিক ও বিনম্রভাবে জানতে চান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:2,dayOffset:3,timeOfDay:"16:00",title:"২য় ফলো-আপ (৩ দিন পর - বিকাল ৪টা)",guidelinePrompt:"পণ্যের প্রিমিয়াম কোয়ালিটি ও ক্যাশ অন ডেলিভারি (COD) সুবিধার কথা মনে করিয়ে দিয়ে অর্ডার কনফার্ম করার সহজ প্রক্রিয়া জানান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:3,dayOffset:7,timeOfDay:"20:00",title:"৩য় ফলো-আপ (৭ দিন পর - রাত ৮টা)",guidelinePrompt:"স্টক লিমিটেড হতে পারে বা দ্রুত ডেলিভারি সার্ভিসের বন্ধুত্বপূর্ণ রিমাইন্ডার দিন। আগের মেসেজের কথা সরাসরি পুনরাবৃত্তি করবেন না।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:4,dayOffset:15,timeOfDay:"11:00",title:"৪র্থ ফলো-আপ (১৫ দিন পর - সকাল ১১টা)",guidelinePrompt:"কোনো বিশেষ ছাড় বা পছন্দের অন্য কোনো পণ্য দেখতে চান কিনা অথবা কোনো ফিডব্যাক আছে কিনা জানতে চান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:5,dayOffset:25,timeOfDay:"17:00",title:"৫ম ফলো-আপ (২৫ দিন পর - বিকাল ৫টা)",guidelinePrompt:"মাসের সমাপনী আন্তরিক সম্ভাষণ জানান এবং ভবিষ্যতে যেকোনো পণ্য বা সেবার জন্য যোগাযোগ করতে আমন্ত্রণ জানান।",isEnabled:!0,isGlobalDefault:!0}];async function U(e,a){try{if(await (0,N.S)(),a){let e=await T.default.followUpScheduleStep.findMany({where:{pageId:a,isEnabled:!0},orderBy:{stepNumber:"asc"}});if(e.length>0)return e}if(e){let a=await T.default.followUpScheduleStep.findMany({where:{userId:e,pageId:null,isEnabled:!0},orderBy:{stepNumber:"asc"}});if(a.length>0)return a}let t=await T.default.followUpScheduleStep.findMany({where:{isGlobalDefault:!0,isEnabled:!0},orderBy:{stepNumber:"asc"}});if(t.length>0)return t}catch(e){s.LI.error("Error fetching schedule steps:",e)}return l}async function d(e){let{customerName:a="গ্রাহক",step:t,conversationHistory:T,previousFollowUps:E,pageName:L,replyLanguage:N="বাংলা",businessInstructions:r=""}=e,l=a?.split(" ")[0]||"সম্মানিত গ্রাহক";try{let e=await (0,n.dG)(),a=e.provider,s=e.model,U=T.slice(-8).map(e=>`${"INCOMING"===e.direction?"Customer":"Page/Shop"}: ${e.text}`).join("\n"),d=E.length>0?E.map((e,a)=>`[Follow-Up #${a+1} Sent]: "${e}"`).join("\n"):"None (This is the 1st follow-up)",A=`You are a high-conversion, extremely polite, natural sales & customer success assistant for "${L}".
Your task is to craft an intelligent, personalized follow-up message to a customer who previously chatted with our page but has not yet placed an order or completed service.

CRITICAL NON-REPETITION & CONTEXT RULES:
1. STRICTLY DO NOT repeat the exact phrases, greetings, or sentences from previous follow-ups listed below.
2. Read the customer's previous conversation history to understand what product or inquiry they were interested in.
3. This is Step #${t.stepNumber} (${t.title}). Step guidance: "${t.guidelinePrompt||"Polite, helpful follow-up."}".
4. Tone: Warm, helpful, respectful, non-pushy, and professional (Bengali e-commerce standard).
5. Language: Use natural ${N} (e.g. Standard Bengali with emojis like 😊, 🛍️, 📦).
6. Length: Concise (1-3 sentences). Do NOT add quotation marks or metadata tags. Return ONLY the raw message to be sent directly to the customer.

[PREVIOUS FOLLOW-UPS SENT TO THIS CUSTOMER (DO NOT REPEAT THESE)]:
${d}

[BUSINESS INSTRUCTIONS / POLICIES]:
${r||"Cash on Delivery (COD) available all over Bangladesh. Fast delivery."}
`,u=`[CUSTOMER NAME]: ${l}
[PREVIOUS CHAT HISTORY]:
${U||"Customer previously greeted and asked for product information."}

Please craft the Step #${t.stepNumber} follow-up message now:`;if("GEMINI"===a){let a=e.geminiKey||process.env.GEMINI_API_KEY||"";if(a){let e=new o.$D(a).getGenerativeModel({model:s||"gemini-1.5-flash",systemInstruction:A,generationConfig:{temperature:.75,maxOutputTokens:250}}),t=(await e.generateContent(u)).response.text().trim().replace(/^["']|["']$/g,"");if(t)return{text:t,model:`GEMINI:${s||"gemini-1.5-flash"}`}}}else if("OPENAI"===a){let a=e.openaiKey||process.env.OPENAI_API_KEY||"";if(a){let e=new i.ZP({apiKey:a}),t=await e.chat.completions.create({model:s||"gpt-4o-mini",messages:[{role:"system",content:A},{role:"user",content:u}],temperature:.75,max_tokens:250}),T=t.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g,"");if(T)return{text:T,model:`OPENAI:${s||"gpt-4o-mini"}`}}}else if("DEEPSEEK"===a||"GOROUTER"===a||"OPENROUTER"===a){let t="DEEPSEEK"===a?e.deepseekKey||process.env.DEEPSEEK_API_KEY||"":e.gorouterKey||process.env.GOROUTER_API_KEY||"",T="DEEPSEEK"===a?"https://api.deepseek.com/v1":e.gorouterBaseUrl;if(t){let e=new i.ZP({apiKey:t,baseURL:T}),E=await e.chat.completions.create({model:s||("DEEPSEEK"===a?"deepseek-chat":"deepseek/deepseek-chat"),messages:[{role:"system",content:A},{role:"user",content:u}],temperature:.75,max_tokens:250}),L=E.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g,"");if(L)return{text:L,model:`${a}:${s||"chat"}`}}}}catch(e){s.LI.warn("AI follow-up generation failed, falling back to smart dynamic template:",e)}let U="";switch(t.stepNumber){case 1:U=`আসসালামু আলাইকুম ${l}! আপনার পছন্দের পণ্যটি নিয়ে কোনো প্রশ্ন ছিল কি? কোনো সহায়তা লাগলে জানাবেন, আমরা এখনই অর্ডার কনফার্ম করে দিচ্ছি! 😊🛍️`;break;case 2:U=`প্রিয় ${l}, আশা করি ভালো আছেন। আমাদের পণ্যটিতে ক্যাশ অন ডেলিভারি (COD) এবং দ্রুত ডেলিভারির সুবিধা রয়েছে। আপনার অর্ডারটি কি কনফার্ম করে দেব? 📦✨`;break;case 3:U=`হ্যালো ${l}! আপনার পছন্দের প্রোডাক্টটির স্টক কিন্তু সীমিত। আপনি চাইলে আপনার জন্য স্টক হোল্ড করে রাখতে পারি। জানাতে পারেন! 😊`;break;case 4:U=`আসসালামু আলাইকুম ${l}, কোনো বিশেষ অফার বা অন্য কোনো প্রোডাক্ট দেখতে চাইলে আমাদের জানাতে পারেন। আপনার সেবায় আমরা সর্বদা প্রস্তুত! 🌟`;break;default:U=`শ্রদ্ধেয় ${l}, আমাদের সাথে যুক্ত থাকার জন্য আন্তরিক ধন্যবাদ। যেকোনো সময় পণ্য বা সেবার জন্য আমাদের মেসেজ দিতে পারেন। শুভকামনা! 💐`}return{text:U,model:"TEMPLATE_FALLBACK"}}async function A(e){let a=[],t=0;try{await (0,N.S)();let n={followUpEnabled:!0,connectionStatus:{not:"DISCONNECTED"}};e&&(n.id=e);let o=await T.default.page.findMany({where:n});for(let e of o){let n=(0,E.pe)(e.pageAccessTokenEncrypted);if(!n)continue;let N={};if(e.extraConfig)try{N=JSON.parse(e.extraConfig)}catch(e){}let o=await U(e.userId,e.id);if(0===o.length)continue;let i=new Date(Date.now()-3024e6);for(let E of(await T.default.conversation.findMany({where:{pageId:e.id,status:"ACTIVE",aiEnabled:!0,followUpStatus:{notIn:["COMPLETED","PAUSED","ORDER_PLACED","CUSTOMER_REPLIED"]},lastMessageAt:{gte:i}},include:{messages:{orderBy:{createdAt:"desc"},take:10},orders:{where:{createdAt:{gte:i}},take:1},followUpLogs:{orderBy:{createdAt:"asc"},take:10}},take:100}))){let i=E.channel||e.channel||"FACEBOOK",r=E.customerName||E.senderPsid;if(E.orders&&E.orders.length>0){await T.default.conversation.update({where:{id:E.id},data:{followUpStatus:"ORDER_PLACED"}});continue}let l=E.messages[0];if(l&&"INCOMING"===l.direction){(E.currentFollowUpStep>0||E.followUpSentCount>0)&&await T.default.conversation.update({where:{id:E.id},data:{followUpStatus:"CUSTOMER_REPLIED"}});continue}let U=E.currentFollowUpStep||0;if(U>=o.length){await T.default.conversation.update({where:{id:E.id},data:{followUpStatus:"COMPLETED"}});continue}let A=o[U],u=A.dayOffset,c=E.createdAt?new Date(E.createdAt).getTime():Date.now(),O=864e5*u,p=c+O;if(Date.now()<p)continue;if(E.lastFollowUpSentAt){let e=new Date(E.lastFollowUpSentAt).getTime();if(Date.now()-e<648e5)continue}let f=(E.followUpLogs||[]).map(e=>e.messageText).filter(e=>"string"==typeof e&&e.trim().length>0),I=[...E.messages].reverse().map(e=>({direction:e.direction,text:e.messageText||""})),{text:D,model:R}=await d({conversationId:E.id,customerName:E.customerName,step:A,conversationHistory:I,previousFollowUps:f,pageName:e.pageName,replyLanguage:e.replyLanguage||"বাংলা",businessInstructions:e.aiInstructions||""}),w=await (0,L.Wi)({channel:i,recipientId:E.senderPsid,text:D,accessToken:n,channelIdentifier:e.channelIdentifier||e.facebookPageId,extraConfig:N});if(w.success){t++;let L=U+1>=o.length,n=L?"COMPLETED":"IN_PROGRESS",N=U+1,l=null;if(!L&&o[N]){let e=o[N];l=new Date(c+864e5*e.dayOffset)}await T.default.followUpLog.create({data:{userId:e.userId,pageId:e.id,conversationId:E.id,stepNumber:A.stepNumber,dayOffset:A.dayOffset,scheduledTime:A.timeOfDay,messageText:D,channel:i,customerName:E.customerName,senderPsid:E.senderPsid,status:"SENT",aiModel:R}}),await T.default.message.create({data:{conversationId:E.id,userId:e.userId,pageId:e.id,senderPsid:E.senderPsid,direction:"OUTGOING",messageType:"TEXT",messageText:D,aiGenerated:!0,aiModel:R}}),await T.default.conversation.update({where:{id:E.id},data:{currentFollowUpStep:N,followUpStatus:n,lastFollowUpSentAt:new Date,lastMessage:D,lastMessageAt:new Date,followUpSentCount:{increment:1},nextFollowUpDueAt:l}}),await (0,s.ag)({userId:e.userId,pageId:e.id,action:"FOLLOW_UP_SENT",description:`স্বয়ংক্রিয় ধাপ #${A.stepNumber} ফলো-আপ পাঠানো হয়েছে (${r}, ${i})`}),a.push({pageId:e.id,conversationId:E.id,customer:r,status:"SENT",channel:i,stepNumber:A.stepNumber}),s.LI.info(`[Follow-Up] Step #${A.stepNumber} sent to ${r} (${i})`)}else await T.default.followUpLog.create({data:{userId:e.userId,pageId:e.id,conversationId:E.id,stepNumber:A.stepNumber,dayOffset:A.dayOffset,scheduledTime:A.timeOfDay,messageText:D,channel:i,customerName:E.customerName,senderPsid:E.senderPsid,status:`FAILED: ${w.error||"API Error"}`,aiModel:R}}),a.push({pageId:e.id,conversationId:E.id,customer:r,status:`FAILED: ${w.error||"API Error"}`,channel:i,stepNumber:A.stepNumber})}}return{scannedPages:o.length,sentCount:t,results:a}}catch(e){return s.LI.error("Error running follow-up automation:",e),{scannedPages:0,sentCount:0,results:a}}}function u(e=6e4){!r.followUpWorkerInterval&&(s.LI.info(`[Follow-Up Worker] Background automation engine active (interval: ${e/1e3}s)`),r.followUpWorkerInterval=setInterval(async()=>{if(!r.isFollowUpWorkerRunning){r.isFollowUpWorkerRunning=!0;try{let e=await A();e.sentCount>0&&s.LI.info(`[Follow-Up Worker] Dispatched ${e.sentCount} follow-up message(s)`)}catch(e){s.LI.error("[Follow-Up Worker] Scheduled run error:",e)}finally{r.isFollowUpWorkerRunning=!1}}},e),r.followUpWorkerInterval&&"function"==typeof r.followUpWorkerInterval.unref&&r.followUpWorkerInterval.unref())}}};