"use strict";exports.id=4517,exports.ids=[4517],exports.modules={84517:(e,T,a)=>{a.d(T,{S:()=>s});var t=a(9487),E=a(11671),L=a.n(E),N=a(21431);let n=!1,U=null;async function s(){if(!n)return U||(U=(async()=>{try{try{await t.default.$queryRawUnsafe("PRAGMA journal_mode = WAL;")}catch(e){}try{await t.default.$queryRawUnsafe("PRAGMA busy_timeout = 30000;")}catch(e){}try{await t.default.$queryRawUnsafe("PRAGMA synchronous = NORMAL;")}catch(e){}try{await t.default.$queryRawUnsafe("PRAGMA cache_size = -20000;")}catch(e){}await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ActivityLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT,
        "action" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "metadata" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
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
    `),await t.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SystemSetting" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "value" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await t.default.$executeRawUnsafe(`
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
    `);try{let e=await t.default.$queryRawUnsafe('PRAGMA table_info("Page");'),T=new Set(e.map(e=>e.name));T.has("channel")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "channel" TEXT NOT NULL DEFAULT \'FACEBOOK\';'),T.has("channelIdentifier")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "channelIdentifier" TEXT;'),T.has("extraConfig")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "extraConfig" TEXT;'),T.has("replyDelaySeconds")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "replyDelaySeconds" INTEGER NOT NULL DEFAULT 3;'),T.has("followUpEnabled")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpEnabled" BOOLEAN NOT NULL DEFAULT 0;'),T.has("followUpWaitMinutes")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpWaitMinutes" INTEGER NOT NULL DEFAULT 30;'),T.has("followUpMessage")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpMessage" TEXT;'),T.has("followUpOnlySeen")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpOnlySeen" BOOLEAN NOT NULL DEFAULT 1;'),T.has("followUpMaxCount")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpMaxCount" INTEGER NOT NULL DEFAULT 1;'),T.has("followUpFrequency")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpFrequency" TEXT NOT NULL DEFAULT \'ONCE\';'),T.has("followUpIntervalHours")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpIntervalHours" INTEGER NOT NULL DEFAULT 24;'),T.has("maxImagesPerConversation")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "maxImagesPerConversation" INTEGER NOT NULL DEFAULT 2;'),T.has("maxImagesPerReply")||await t.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "maxImagesPerReply" INTEGER NOT NULL DEFAULT 1;');try{let e=await t.default.$queryRawUnsafe('PRAGMA table_info("Product");');new Set(e.map(e=>e.name)).has("images")||await t.default.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "images" TEXT;')}catch(e){}let a=await t.default.$queryRawUnsafe('PRAGMA table_info("Conversation");'),E=new Set(a.map(e=>e.name));E.has("imagesSentCount")||await t.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "imagesSentCount" INTEGER NOT NULL DEFAULT 0;'),E.has("channel")||await t.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "channel" TEXT NOT NULL DEFAULT \'FACEBOOK\';'),E.has("lastSeenAt")||await t.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "lastSeenAt" DATETIME;'),E.has("lastFollowUpSentAt")||await t.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "lastFollowUpSentAt" DATETIME;'),E.has("followUpSentCount")||await t.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "followUpSentCount" INTEGER NOT NULL DEFAULT 0;');try{await t.default.$executeRawUnsafe('UPDATE "Page" SET "connectionStatus" = \'PENDING\' WHERE "connectionStatus" IS NULL;')}catch(e){}}catch(e){console.warn("Migration pre-check warning:",e)}}catch(e){console.warn("Raw table creation note:",e)}try{if(!await t.default.user.findFirst({where:{OR:[{role:"ADMIN"},{email:"admin@replyx.ai"},{email:"admin@gmail.com"}]}})){let e=await L().hash("admin123",10);await t.default.user.create({data:{id:"usr_admin_default",fullName:"Super Admin",businessName:"ReplyX AI Platform",email:"admin@replyx.ai",passwordHash:e,role:"ADMIN",status:"ACTIVE",plan:"PRO",planStatus:"ACTIVE",monthlyMessageLimit:999999}})}let e=await t.default.package.count();0===e&&await t.default.package.createMany({data:[{id:"pkg_starter",name:"স্টার্টার প্যাকেজ",slug:"starter",description:"ছোট ব্যবসার জন্য আদর্শ AI অটোমেশন প্যাকেজ",price:990,durationDays:30,messageLimit:1e3,pageLimit:1,productLimit:50,features:JSON.stringify(["১টি ফেসবুক পেজ অটোমেশন","১,০০০ চ্যাট অটো-রিপ্লাই","বাংলা ও ইংলিশ এআই রিপ্লাই","অর্ডার নেওয়ার সুবিধা"]),isPopular:!1,isActive:!0},{id:"pkg_business",name:"বিজনেস প্যাকেজ",slug:"business",description:"মাঝারি সাইজের পেজের জন্য সবচেয়ে জনপ্রিয় প্যাকেজ",price:1990,durationDays:30,messageLimit:3e3,pageLimit:3,productLimit:200,features:JSON.stringify(["৩টি ফেসবুক পেজ সংযোগ","৩,০০০ চ্যাট অটো-রিপ্লাই","প্রোডাক্ট ছবি দেখে ছবিসহ উত্তর","মেসেঞ্জারে অটোমেটিক অর্ডার"]),isPopular:!0,isActive:!0},{id:"pkg_pro",name:"প্রো প্যাকেজ",slug:"pro",description:"বড় ই-কমার্স পেজের জন্য আনলিমিটেড স্কেলিং প্যাকেজ",price:3490,durationDays:30,messageLimit:1e4,pageLimit:10,productLimit:1e3,features:JSON.stringify(["১০টি ফেসবুক পেজ কানেকশন","১০,০০০ চ্যাট অটো-রিপ্লাই","ভয়েস ও টেক্সট দুই চ্যাটেই রিপ্লাই","প্রাইওরিটি কাস্টমার সাপোর্ট"]),isPopular:!1,isActive:!0}]}),n=!0;try{(0,N.z)()}catch(e){}}catch(e){console.error("Error during database self-healing initialization:",e)}finally{U=null}})())}},21431:(e,T,a)=>{a.d(T,{K:()=>U,z:()=>s});var t=a(9487),E=a(67297),L=a(87714),N=a(57435);let n=globalThis;async function U(e){let T=[],a=0;try{let n={followUpEnabled:!0,connectionStatus:{not:"DISCONNECTED"}};e&&(n.id=e);let U=await t.default.page.findMany({where:n});for(let e of U){let n=Math.max(1,e.followUpWaitMinutes||30),U=new Date(Date.now()-6e4*n),s="DAILY"===e.followUpFrequency?24:"CUSTOM_INTERVAL"===e.followUpFrequency?e.followUpIntervalHours||24:87600,A=new Date(Date.now()-36e5*s),o=e.followUpMaxCount||1,i=(0,E.pe)(e.pageAccessTokenEncrypted);if(!i)continue;let r={};if(e.extraConfig)try{r=JSON.parse(e.extraConfig)}catch(e){}for(let E of(await t.default.conversation.findMany({where:{pageId:e.id,status:"ACTIVE",aiEnabled:!0,lastMessageAt:{lte:U}},include:{messages:{orderBy:{createdAt:"desc"},take:2},orders:{where:{createdAt:{gte:new Date(Date.now()-1728e5)}},take:1}},take:50}))){let s=E.channel||e.channel||"FACEBOOK",l=E.customerName||E.senderPsid;if(E.orders&&E.orders.length>0||(E.followUpSentCount||0)>=o||E.lastFollowUpSentAt&&E.lastFollowUpSentAt>A)continue;let d=E.messages[0];if(!d||"OUTGOING"!==d.direction)continue;if(e.followUpOnlySeen){if(E.lastSeenAt){if(E.lastSeenAt>U)continue}else if("FACEBOOK"===s||"WHATSAPP"===s){let e=new Date(Date.now()-12e4*n);if(E.lastMessageAt>e)continue}else if(E.lastMessageAt>U)continue}else if((E.lastSeenAt&&E.lastSeenAt>E.lastMessageAt?E.lastSeenAt:E.lastMessageAt)>U)continue;let u=E.customerName?.split(" ")[0]||"স্যার/ম্যাম",O=e.followUpMessage?.trim();O=O?O.replace(/{name}/g,u).replace(/{customer}/g,u).replace(/{channel}/g,e.pageName):"ENGLISH"===e.replyLanguage?`Hi ${u}, just following up to see if you have any questions or need help placing your order? We're right here to assist you! 😊`:"BANGLISH"===e.replyLanguage?`Assalamu Alaikum ${u}! Apnar product ti niye kono proshno chilo kina jante chailam? Kono help lagle kindly bolben, amra order confirm kore dibo! 😊`:`আসসালামু আলাইকুম ${u}! আপনার পছন্দের পণ্যটি নিয়ে কোনো প্রশ্ন বা তথ্যের প্রয়োজন ছিল কি? কোনো জিজ্ঞাসা থাকলে জানাতে পারেন, আমরা অর্ডারটি কনফার্ম করে দিচ্ছি! 😊🛍️`;let c=await (0,L.Wi)({channel:s,recipientId:E.senderPsid,text:O,accessToken:i,channelIdentifier:e.channelIdentifier||e.facebookPageId,extraConfig:r});c.success?(a++,await t.default.message.create({data:{conversationId:E.id,userId:e.userId,pageId:e.id,senderPsid:E.senderPsid,direction:"OUTGOING",messageType:"TEXT",messageText:O,aiGenerated:!0,aiModel:"FOLLOW_UP_BOT"}}),await t.default.conversation.update({where:{id:E.id},data:{lastFollowUpSentAt:new Date,lastMessage:O,lastMessageAt:new Date,followUpSentCount:{increment:1}}}),await (0,N.ag)({userId:e.userId,pageId:e.id,action:"FOLLOW_UP_SENT",description:`স্বয়ংক্রিয় ফলো-আপ বার্তা পাঠানো হয়েছে গ্রাহক ${u} (${E.senderPsid})-কে (${s})`}),T.push({pageId:e.id,conversationId:E.id,customer:l,status:"SENT",channel:s}),N.LI.info(`Automated follow-up message sent to ${l} via ${s}`)):T.push({pageId:e.id,conversationId:E.id,customer:l,status:`FAILED: ${c.error||"API Error"}`,channel:s})}}return{scannedPages:U.length,sentCount:a,results:T}}catch(e){return N.LI.error("Error running follow-up automation:",e),{scannedPages:0,sentCount:0,results:T}}}function s(e=6e4){!n.followUpWorkerInterval&&(N.LI.info(`[Follow-Up Worker] Background automation engine active (interval: ${e/1e3}s)`),n.followUpWorkerInterval=setInterval(async()=>{if(!n.isFollowUpWorkerRunning){n.isFollowUpWorkerRunning=!0;try{let e=await U();e.sentCount>0&&N.LI.info(`[Follow-Up Worker] Dispatched ${e.sentCount} follow-up message(s)`)}catch(e){N.LI.error("[Follow-Up Worker] Scheduled run error:",e)}finally{n.isFollowUpWorkerRunning=!1}}},e),n.followUpWorkerInterval&&"function"==typeof n.followUpWorkerInterval.unref&&n.followUpWorkerInterval.unref())}}};